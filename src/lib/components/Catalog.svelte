<script lang="ts">
	import type { Product } from '../types';
	import { reveal } from '../actions/reveal';
	import ProductCard from './ProductCard.svelte';

	interface CatalogProps {
		products: Product[];
		categories: readonly string[];
		searchQuery?: string;
		selectedCategory?: string;
		onAddProduct: (product: Product) => void;
	}

	let {
		products,
		categories,
		searchQuery = $bindable(''),
		selectedCategory = $bindable('Tudo'),
		onAddProduct
	}: CatalogProps = $props();

	let filteredProducts = $derived.by(() => {
		let list = products;
		if (selectedCategory !== 'Tudo') {
			list = list.filter((p) => p.categoryId === selectedCategory);
		}
		if (searchQuery.trim()) {
			const lowerQ = searchQuery.toLowerCase();
			list = list.filter(
				(p) => p.name.toLowerCase().includes(lowerQ) || p.description.toLowerCase().includes(lowerQ)
			);
		}
		return list;
	});

	let barEl = $state<HTMLElement | null>(null);
	let scrollEl = $state<HTMLElement | null>(null);
	let contentEl = $state<HTMLElement | null>(null);

	// Indica com um esmaecido nas bordas que há mais categorias para os lados
	let moreLeft = $state(false);
	let moreRight = $state(false);

	function updateScrollHints() {
		if (!scrollEl) return;
		const { scrollLeft, clientWidth, scrollWidth } = scrollEl;
		moreLeft = scrollLeft > 4;
		moreRight = scrollLeft + clientWidth < scrollWidth - 4;
	}

	$effect(() => {
		const el = scrollEl;
		if (!el) return;

		updateScrollHints();
		const observer = new ResizeObserver(updateScrollHints);
		observer.observe(el);

		// Com mouse (sem toque), a roda rola as categorias para os lados enquanto houver o que rolar
		function onWheel(event: WheelEvent) {
			if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
			const max = el!.scrollWidth - el!.clientWidth;
			const next = Math.min(max, Math.max(0, el!.scrollLeft + event.deltaY));
			if (next === el!.scrollLeft) return;
			event.preventDefault();
			el!.scrollLeft = next;
		}
		el.addEventListener('wheel', onWheel, { passive: false });

		return () => {
			observer.disconnect();
			el.removeEventListener('wheel', onWheel);
		};
	});

	function selectCategory(category: string, chip?: HTMLElement) {
		selectedCategory = category;
		// Traz a categoria escolhida para o centro da barra
		if (scrollEl && chip) {
			const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			scrollEl.scrollTo({
				left: chip.offsetLeft - scrollEl.offsetLeft - (scrollEl.clientWidth - chip.offsetWidth) / 2,
				behavior: reduceMotion ? 'auto' : 'smooth'
			});
		}
		// Se a lista já rolou para trás da barra de categorias, volta ao início dela
		if (
			barEl &&
			contentEl &&
			contentEl.getBoundingClientRect().top < barEl.getBoundingClientRect().bottom
		) {
			contentEl.scrollIntoView({ block: 'start' });
		}
	}

	function clearFilter() {
		searchQuery = '';
		selectedCategory = 'Tudo';
	}
</script>

<section class="catalog-section" aria-labelledby="catalog-title">
	<div class="catalog-header">
		<h2 id="catalog-title" class="display">Nosso cardápio</h2>
	</div>

	<div class="categories-bar" bind:this={barEl}>
		<div
			class="flex touch-pan-x [scrollbar-width:none] items-center gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain px-1 pt-3 pb-2 whitespace-nowrap select-none [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
			role="group"
			aria-label="Categorias do cardápio"
			bind:this={scrollEl}
			onscroll={updateScrollHints}
		>
			<button
				type="button"
				class="chip shrink-0 transition-[background-color,border-color,color,scale] duration-200 active:scale-95"
				aria-pressed={selectedCategory === 'Tudo'}
				onclick={(event) => selectCategory('Tudo', event.currentTarget)}
			>
				Tudo
			</button>
			{#each categories as cat (cat)}
				<button
					type="button"
					class="chip shrink-0 transition-[background-color,border-color,color,scale] duration-200 active:scale-95"
					aria-pressed={selectedCategory === cat}
					onclick={(event) => selectCategory(cat, event.currentTarget)}
				>
					{cat}
				</button>
			{/each}
		</div>
		<div
			class="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-(--bg) to-transparent transition-opacity duration-200 {moreLeft
				? 'opacity-100'
				: 'opacity-0'}"
			aria-hidden="true"
		></div>
		<div
			class="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-(--bg) to-transparent transition-opacity duration-200 {moreRight
				? 'opacity-100'
				: 'opacity-0'}"
			aria-hidden="true"
		></div>
	</div>

	<div class="catalog-content" aria-live="polite" bind:this={contentEl}>
		{#if filteredProducts.length === 0}
			<div class="empty-state">
				<svg
					width="40"
					height="40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<circle cx="11" cy="11" r="8"></circle>
					<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
				</svg>
				<p>Nenhum produto encontrado para sua busca.</p>
				<button type="button" class="btn btn-outline" onclick={clearFilter}>Limpar busca</button>
			</div>
		{:else}
			<p class="results-count">
				{filteredProducts.length}
				{filteredProducts.length === 1 ? 'opção' : 'opções'}
			</p>

			{#if selectedCategory === 'Tudo' && !searchQuery}
				{#each categories as cat (cat)}
					{@const catProducts = filteredProducts.filter((p) => p.categoryId === cat)}
					{#if catProducts.length > 0}
						<div class="category-block" use:reveal>
							<h3 class="category-title display">
								{cat}
								<span class="category-count">{catProducts.length}</span>
							</h3>
							<div class="grid">
								{#each catProducts as product (product.id)}
									<ProductCard {product} onAdd={onAddProduct} />
								{/each}
							</div>
						</div>
					{/if}
				{/each}
			{:else}
				<div class="grid">
					{#each filteredProducts as product (product.id)}
						<ProductCard {product} onAdd={onAddProduct} />
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</section>

<style>
	.catalog-section {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.catalog-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
		flex-wrap: wrap;
		gap: 16px;
	}

	.catalog-header h2 {
		font-size: 1.9rem;
	}

	/* A barra de categorias acompanha a rolagem, logo abaixo do cabeçalho */
	.categories-bar {
		position: sticky;
		top: var(--header-h);
		z-index: 20;
		margin: 0 -4px 12px;
		background: var(--bg);
		border-bottom: 1px solid var(--border);
	}

	.chip {
		min-height: 40px;
		padding: 8px 16px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 999px;
		white-space: nowrap;
		font-weight: 600;
		color: var(--text-light);
	}

	.chip[aria-pressed='true'] {
		background: var(--accent);
		color: var(--accent-ink);
		border-color: var(--accent);
	}

	@media (hover: hover) {
		.chip[aria-pressed='false']:hover {
			border-color: var(--border-strong);
			color: var(--text);
		}
	}

	.catalog-content {
		scroll-margin-top: calc(var(--header-h) + 76px);
	}

	.results-count {
		font-size: 0.85rem;
		color: var(--text-muted);
		margin-bottom: 16px;
	}

	.category-block + .category-block {
		margin-top: 40px;
	}

	.category-title {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 1.35rem;
		margin-bottom: 16px;
	}

	.category-title::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--border);
	}

	.category-count {
		padding: 2px 8px;
		border-radius: 999px;
		background: var(--accent-soft);
		color: var(--accent-text);
		font-family: var(--font-body);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
		gap: 16px;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 48px 20px;
		text-align: center;
		gap: 16px;
		color: var(--text-light);
		background: var(--surface);
		border: 1px dashed var(--border-strong);
		border-radius: var(--radius);
	}

	.empty-state svg {
		color: var(--text-muted);
	}

	@media (max-width: 560px) {
		.catalog-header h2 {
			font-size: 1.6rem;
		}

		.grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 12px;
		}

		.category-block + .category-block {
			margin-top: 32px;
		}
	}
</style>
