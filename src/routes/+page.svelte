<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { CartItem, Product, ProductModalConfirmData, SelectedOption } from '#lib/types';
	import { config, categories } from '#lib/config';
	import { products } from '#lib/data/products';
	import {
		calcCartItemCount,
		calcCartSubtotal,
		formatMoney,
		isMinimumDeliveryMet
	} from '#lib/utils/pricing';
	import { getCompanyDate, isCompanyOpen } from '#lib/utils/scheduling';
	import { loadStoredCart, saveCartToStorage } from '#lib/utils/storage';

	import Header from '#lib/components/Header.svelte';
	import Hero from '#lib/components/Hero.svelte';
	import Catalog from '#lib/components/Catalog.svelte';
	import Cart from '#lib/components/Cart.svelte';
	import ProductModal from '#lib/components/ProductModal.svelte';
	import Checkout from '#lib/components/Checkout.svelte';
	import Toast from '#lib/components/Toast.svelte';
	import Footer from '#lib/components/Footer.svelte';

	const heroFacts = [
		{ label: 'Preparo', value: `~${config.prepTime} min` },
		{ label: 'Entrega', value: formatMoney(config.deliveryFee) },
		{ label: 'Pedido mínimo', value: formatMoney(config.minDeliveryValue) }
	];

	// ==========================================
	// ESTADO REATIVO
	// ==========================================
	let cart = $state<CartItem[]>([]);
	let isDelivery = $state(true);

	let searchQuery = $state('');
	let selectedCategory = $state('Tudo');

	let isCartOpen = $state(false); // Mobile drawer
	let isCheckoutOpen = $state(false);

	let activeProduct = $state<Product | null>(null);
	let activeEditCartId = $state<string | null>(null);

	let loaded = $state(false);

	// Aviso rápido (ex.: item adicionado)
	let toast = $state({ message: '', token: 0, mobileOnly: false });
	let toastTimer: ReturnType<typeof setTimeout> | undefined;

	function notify(message: string, mobileOnly = false) {
		toast = { message, token: toast.token + 1, mobileOnly };
		clearTimeout(toastTimer);
		toastTimer = setTimeout(() => (toast.message = ''), 2600);
	}

	onDestroy(() => clearTimeout(toastTimer));

	// ==========================================
	// LIFECYCLE E PERSISTÊNCIA
	// ==========================================
	onMount(() => {
		const stored = loadStoredCart(products);
		if (stored) {
			cart = stored.cart;
			isDelivery = stored.isDelivery;
		}
		loaded = true;
	});

	$effect(() => {
		if (loaded) {
			saveCartToStorage(cart, isDelivery);
		}
	});

	// ==========================================
	// DERIVADOS GLOBAIS
	// ==========================================
	let isCurrentlyOpen = $derived(
		isCompanyOpen(getCompanyDate(config.timezone), config.openingHours)
	);
	let cartItemCount = $derived(calcCartItemCount(cart));
	let subtotal = $derived(calcCartSubtotal(cart));

	// Dados para pré-preenchimento caso esteja editando um item do carrinho
	let activeEditData = $derived.by(() => {
		if (!activeEditCartId) return undefined;
		const item = cart.find((i) => i.id === activeEditCartId);
		if (!item) return undefined;

		const selections: Record<string, string[]> = {};
		for (const opt of item.selectedOptions) {
			if (!selections[opt.groupId]) {
				selections[opt.groupId] = [];
			}
			selections[opt.groupId].push(opt.optionId);
		}

		return {
			initialSelections: selections,
			initialObservation: item.observation,
			initialQty: item.quantity
		};
	});

	// ==========================================
	// AÇÕES E FLUXOS
	// ==========================================
	function handleScrollToCatalog() {
		if (typeof document !== 'undefined') {
			const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			document
				.getElementById('catalog-start')
				?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
		}
	}

	// A busca fica no cabeçalho: ao digitar, traz o cardápio para a tela se ele não estiver à vista
	function handleSearchInput() {
		const catalog = document.getElementById('catalog-start');
		if (!catalog) return;
		const top = catalog.getBoundingClientRect().top;
		if (top > window.innerHeight * 0.6 || top < 0) handleScrollToCatalog();
	}

	function handleOpenProductModal(product: Product, editCartItemId: string | null = null) {
		if (!product.available) return;
		activeProduct = product;
		activeEditCartId = editCartItemId;
	}

	function handleCloseProductModal() {
		activeProduct = null;
		activeEditCartId = null;
	}

	function handleAddSimpleProduct(product: Product) {
		if (!product.available) return;

		// Se o produto tiver adicionais/opções, abre o modal
		if (product.optionGroups && product.optionGroups.length > 0) {
			handleOpenProductModal(product);
			return;
		}

		const cartItemId = product.id + '||';
		const existingIndex = cart.findIndex((i) => i.id === cartItemId);

		if (existingIndex > -1) {
			const updated = [...cart];
			updated[existingIndex].quantity = Math.min(
				updated[existingIndex].quantity + 1,
				config.maxItemQty
			);
			cart = updated;
		} else {
			cart = [
				...cart,
				{
					id: cartItemId,
					productId: product.id,
					name: product.name,
					basePrice: product.basePrice,
					quantity: 1,
					selectedOptions: [],
					observation: ''
				}
			];
		}

		notify(`${product.name} adicionado ao pedido`, true);
	}

	function handleConfirmProduct(data: ProductModalConfirmData) {
		if (!activeProduct) return;

		const cartItemId =
			activeProduct.id +
			'|' +
			data.selections.map((o: SelectedOption) => o.optionId).join(',') +
			'|' +
			data.observation.toLowerCase();

		if (activeEditCartId) {
			// Edição de item existente
			const existingIndex = cart.findIndex((i) => i.id === activeEditCartId);
			if (existingIndex > -1) {
				const newItem: CartItem = {
					id: cartItemId,
					productId: activeProduct.id,
					name: activeProduct.name,
					basePrice: activeProduct.basePrice,
					quantity: data.quantity,
					selectedOptions: data.selections,
					observation: data.observation
				};

				const newCart = [...cart];
				newCart.splice(existingIndex, 1);

				// Se o ID gerado já existir em outro item, mescla
				const mergeIndex = newCart.findIndex((i) => i.id === cartItemId);
				if (mergeIndex > -1) {
					newCart[mergeIndex].quantity = Math.min(
						newCart[mergeIndex].quantity + data.quantity,
						config.maxItemQty
					);
				} else {
					newCart.push(newItem);
				}
				cart = newCart;
			}
		} else {
			// Novo item adicionado
			const existingIndex = cart.findIndex((i) => i.id === cartItemId);
			if (existingIndex > -1) {
				const updated = [...cart];
				updated[existingIndex].quantity = Math.min(
					updated[existingIndex].quantity + data.quantity,
					config.maxItemQty
				);
				cart = updated;
			} else {
				cart = [
					...cart,
					{
						id: cartItemId,
						productId: activeProduct.id,
						name: activeProduct.name,
						basePrice: activeProduct.basePrice,
						quantity: data.quantity,
						selectedOptions: data.selections,
						observation: data.observation
					}
				];
			}
		}

		notify(
			activeEditCartId ? 'Item atualizado' : `${activeProduct.name} adicionado ao pedido`,
			true
		);
		handleCloseProductModal();
	}

	function handleUpdateCartQty(id: string, delta: number) {
		const index = cart.findIndex((i) => i.id === id);
		if (index === -1) return;

		const newQty = cart[index].quantity + delta;
		if (newQty <= 0) {
			const updated = [...cart];
			updated.splice(index, 1);
			cart = updated;
			if (cart.length === 0) {
				isCartOpen = false;
				isCheckoutOpen = false;
			}
		} else if (newQty <= config.maxItemQty) {
			const updated = [...cart];
			updated[index].quantity = newQty;
			cart = updated;
		}
	}

	function handleEditCartItem(item: CartItem) {
		const prod = products.find((p: Product) => p.id === item.productId);
		if (prod) {
			handleOpenProductModal(prod, item.id);
			isCartOpen = false;
		}
	}

	function handleClearCart() {
		cart = [];
		isCartOpen = false;
		isCheckoutOpen = false;
	}

	function handleStartCheckout() {
		if (cart.length === 0) return;
		if (isDelivery && !isMinimumDeliveryMet(subtotal, isDelivery, config.minDeliveryValue)) {
			return;
		}

		isCheckoutOpen = true;
		isCartOpen = false;
	}
</script>

<svelte:head>
	<title>{config.companyName} | Cardápio Digital</title>
	<meta name="description" content={config.description} />
	<meta name="theme-color" content="#121110" />
</svelte:head>

<div class="app-container" class:has-cart-bar={cart.length > 0}>
	<Header
		companyName={config.companyName}
		address={config.address}
		instagram={config.instagram}
		{isCurrentlyOpen}
		{cartItemCount}
		bind:searchQuery
		onSearchInput={handleSearchInput}
		onOpenCart={() => (isCartOpen = true)}
	/>

	<main>
		<Hero
			description={config.description}
			facts={heroFacts}
			onScrollToCatalog={handleScrollToCatalog}
		/>

		<div class="layout" id="catalog-start">
			<Catalog
				{products}
				{categories}
				bind:searchQuery
				bind:selectedCategory
				onAddProduct={handleAddSimpleProduct}
			/>

			<Cart
				{cart}
				{isDelivery}
				isDrawerOpen={isCartOpen}
				isProductModalOpen={activeProduct !== null}
				{isCheckoutOpen}
				onToggleDelivery={(val: boolean) => (isDelivery = val)}
				onUpdateQty={handleUpdateCartQty}
				onEditItem={handleEditCartItem}
				onClearCart={handleClearCart}
				onStartCheckout={handleStartCheckout}
				onOpenDrawer={() => (isCartOpen = true)}
				onCloseDrawer={() => (isCartOpen = false)}
			/>
		</div>
	</main>

	<Footer companyName={config.companyName} address={config.address} instagram={config.instagram} />

	<Toast
		message={toast.message}
		token={toast.token}
		mobileOnly={toast.mobileOnly}
		raised={cart.length > 0}
	/>

	{#if activeProduct}
		<ProductModal
			product={activeProduct}
			initialSelections={activeEditData?.initialSelections}
			initialObservation={activeEditData?.initialObservation}
			initialQty={activeEditData?.initialQty}
			maxItemQty={config.maxItemQty}
			onClose={handleCloseProductModal}
			onConfirm={handleConfirmProduct}
		/>
	{/if}

	{#if isCheckoutOpen}
		<Checkout
			{cart}
			{isDelivery}
			{config}
			{isCurrentlyOpen}
			onClose={() => (isCheckoutOpen = false)}
			onToggleDelivery={(val: boolean) => (isDelivery = val)}
		/>
	{/if}
</div>

<style>
	.layout {
		max-width: var(--max-w);
		margin: 0 auto;
		padding: 0 20px 56px;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 32px;
		scroll-margin-top: calc(var(--header-h) + 16px);
	}

	@media (min-width: 992px) {
		.layout {
			grid-template-columns: minmax(0, 1fr) 360px;
		}
	}

	@media (max-width: 991px) {
		/* Reserva espaço para a barra fixa do carrinho não cobrir o fim da página */
		.app-container.has-cart-bar {
			padding-bottom: calc(84px + env(safe-area-inset-bottom));
		}
	}

	@media (max-width: 480px) {
		.layout {
			padding: 0 16px 40px;
		}
	}
</style>
