<script lang="ts">
	import type { CartItem } from '../types';
	import {
		formatMoney,
		calcItemSubtotal,
		calcCartSubtotal,
		calcDeliveryFee,
		calcOrderTotal,
		isMinimumDeliveryMet,
		calcCartItemCount
	} from '../utils/pricing';
	import { config } from '../config';
	import { dialog } from '../actions/dialog';

	interface CartProps {
		cart: CartItem[];
		isDelivery: boolean;
		isDrawerOpen: boolean;
		isProductModalOpen?: boolean;
		isCheckoutOpen?: boolean;
		deliveryFee?: number;
		minDeliveryValue?: number;
		onToggleDelivery: (isDelivery: boolean) => void;
		onUpdateQty: (id: string, delta: number) => void;
		onEditItem: (item: CartItem) => void;
		onClearCart: () => void;
		onStartCheckout: () => void;
		onOpenDrawer: () => void;
		onCloseDrawer: () => void;
	}

	let {
		cart,
		isDelivery,
		isDrawerOpen,
		isProductModalOpen = false,
		isCheckoutOpen = false,
		deliveryFee = config.deliveryFee,
		minDeliveryValue = config.minDeliveryValue,
		onToggleDelivery,
		onUpdateQty,
		onEditItem,
		onClearCart,
		onStartCheckout,
		onOpenDrawer,
		onCloseDrawer
	}: CartProps = $props();

	let subtotal = $derived(calcCartSubtotal(cart));
	let finalDeliveryFee = $derived(calcDeliveryFee(isDelivery, deliveryFee));
	let total = $derived(calcOrderTotal(subtotal, finalDeliveryFee));
	let isMinDeliveryMet = $derived(isMinimumDeliveryMet(subtotal, isDelivery, minDeliveryValue));
	let cartItemCount = $derived(calcCartItemCount(cart));
</script>

{#snippet cartIcon(size: number)}
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<circle cx="9" cy="21" r="1"></circle>
		<circle cx="20" cy="21" r="1"></circle>
		<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
	</svg>
{/snippet}

{#snippet deliveryToggle()}
	<div class="segmented delivery-toggle" role="group" aria-label="Forma de recebimento">
		<button type="button" aria-pressed={isDelivery} onclick={() => onToggleDelivery(true)}>
			Entrega
		</button>
		<button type="button" aria-pressed={!isDelivery} onclick={() => onToggleDelivery(false)}>
			Retirada
		</button>
	</div>
{/snippet}

{#snippet itemList()}
	{#each cart as item (item.id)}
		{@const itemTotal = calcItemSubtotal(item)}
		<div class="cart-item">
			<div class="item-main">
				<div class="item-details">
					<span class="item-name">{item.name}</span>
					{#if item.selectedOptions.length > 0}
						<span class="item-opts">
							{item.selectedOptions.map((o) => o.optionName).join(', ')}
						</span>
					{/if}
					{#if item.observation}
						<span class="item-obs">Obs: {item.observation}</span>
					{/if}
				</div>
				<button
					type="button"
					class="icon-btn btn-edit"
					onclick={() => onEditItem(item)}
					aria-label="Editar {item.name}"
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M12 20h9"></path>
						<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
					</svg>
				</button>
			</div>
			<div class="item-controls">
				<div class="qty-control">
					<button
						type="button"
						onclick={() => onUpdateQty(item.id, -1)}
						aria-label="Diminuir quantidade de {item.name}"
					>
						−
					</button>
					<span>{item.quantity}</span>
					<button
						type="button"
						onclick={() => onUpdateQty(item.id, 1)}
						aria-label="Aumentar quantidade de {item.name}"
					>
						+
					</button>
				</div>
				<span class="item-price">{formatMoney(itemTotal)}</span>
			</div>
		</div>
	{/each}
{/snippet}

{#snippet summary(warning: string, clearLabel: string, checkoutLabel: string)}
	<div class="summary-row">
		<span>Subtotal</span>
		<span>{formatMoney(subtotal)}</span>
	</div>
	{#if isDelivery}
		<div class="summary-row">
			<span>Taxa de entrega</span>
			<span>{formatMoney(finalDeliveryFee)}</span>
		</div>
		{#if !isMinDeliveryMet}
			<div class="delivery-warning">{warning}</div>
		{/if}
	{/if}
	<div class="summary-row total">
		<span>Total</span>
		<span>{formatMoney(total)}</span>
	</div>

	<div class="cart-actions">
		<button
			type="button"
			class="btn btn-primary btn-block"
			onclick={onStartCheckout}
			disabled={isDelivery && !isMinDeliveryMet}
		>
			{checkoutLabel}
		</button>
		<button type="button" class="btn btn-text" onclick={onClearCart}>{clearLabel}</button>
	</div>
{/snippet}

<!-- Carrinho Desktop Lateral -->
<aside class="cart-sidebar desktop-only" aria-label="Seu pedido">
	<div class="cart-inner">
		<div class="cart-header">
			<h3 class="display">Seu pedido</h3>
			{#key cartItemCount}
				<span class="badge" aria-label="{cartItemCount} itens">{cartItemCount}</span>
			{/key}
		</div>

		<!-- Delivery / Retirada Toggle -->
		{@render deliveryToggle()}

		<div class="cart-items" aria-live="polite">
			{#if cart.length === 0}
				<div class="empty-cart">
					{@render cartIcon(40)}
					<p>Seu carrinho está vazio.</p>
					<p class="empty-hint">Escolha algo no cardápio para começar.</p>
				</div>
			{:else}
				{@render itemList()}
			{/if}
		</div>

		{#if cart.length > 0}
			<div class="cart-summary">
				{@render summary(
					`O valor mínimo para entrega é ${formatMoney(minDeliveryValue)}.`,
					'Limpar pedido',
					'Finalizar pedido'
				)}
			</div>
		{/if}
	</div>
</aside>

<!-- Carrinho Mobile Bar (Fixed bottom) -->
{#if cart.length > 0 && !isDrawerOpen && !isProductModalOpen && !isCheckoutOpen}
	<div class="mobile-cart-bar mobile-only">
		<div class="mobile-cart-info">
			{#key cartItemCount}
				<span class="qty" aria-label="{cartItemCount} itens">{cartItemCount}</span>
			{/key}
			<span class="total">{formatMoney(total)}</span>
		</div>
		<button type="button" class="btn btn-primary" onclick={onOpenDrawer}>Ver pedido</button>
	</div>
{/if}

<!-- Carrinho Mobile Drawer -->
{#if isDrawerOpen}
	<div class="drawer-backdrop mobile-only" onclick={onCloseDrawer} role="presentation"></div>
	<div
		class="cart-drawer mobile-only"
		role="dialog"
		aria-modal="true"
		aria-labelledby="drawer-title"
		use:dialog={{ onClose: onCloseDrawer }}
	>
		<div class="drawer-header">
			<h3 id="drawer-title" class="display">Seu pedido</h3>
			<button type="button" class="icon-btn" onclick={onCloseDrawer} aria-label="Fechar carrinho">
				<svg
					width="22"
					height="22"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
		</div>
		<div class="drawer-content">
			{@render deliveryToggle()}
			<div class="cart-items">
				{#if cart.length === 0}
					<div class="empty-cart">
						{@render cartIcon(40)}
						<p>Seu carrinho está vazio.</p>
						<p class="empty-hint">Escolha algo no cardápio para começar.</p>
						<button type="button" class="btn btn-outline" onclick={onCloseDrawer}>
							Ver cardápio
						</button>
					</div>
				{:else}
					{@render itemList()}
				{/if}
			</div>
		</div>
		{#if cart.length > 0}
			<div class="drawer-footer">
				{@render summary(
					`Valor mínimo para entrega: ${formatMoney(minDeliveryValue)}`,
					'Limpar',
					'Continuar'
				)}
			</div>
		{/if}
	</div>
{/if}

<style>
	/* Cart Sidebar Desktop */
	.cart-sidebar {
		position: sticky;
		top: calc(var(--header-h) + 16px);
		align-self: start;
	}

	.cart-inner {
		display: flex;
		flex-direction: column;
		max-height: calc(100vh - var(--header-h) - 32px);
		max-height: calc(100dvh - var(--header-h) - 32px);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
	}

	.cart-header {
		padding: 18px 20px;
		border-bottom: 1px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.cart-header h3,
	.drawer-header h3 {
		font-size: 1.25rem;
	}

	.cart-header .badge {
		min-width: 28px;
		padding: 2px 8px;
		border-radius: 999px;
		background: var(--accent);
		color: var(--accent-ink);
		font-weight: 700;
		text-align: center;
		font-variant-numeric: tabular-nums;
		animation: pop 0.3s var(--ease);
	}

	.delivery-toggle {
		margin: 16px 20px;
	}

	.cart-items {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 0 20px;
	}

	.empty-cart {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 40px 12px 48px;
		color: var(--text-light);
		text-align: center;
	}

	.empty-cart :global(svg) {
		margin-bottom: 8px;
		color: var(--text-muted);
	}

	.empty-cart p {
		font-weight: 600;
	}

	.empty-cart .empty-hint {
		font-size: 0.9rem;
		font-weight: 400;
		color: var(--text-muted);
	}

	.empty-cart .btn {
		margin-top: 12px;
	}

	.cart-item {
		padding: 14px 0;
		border-bottom: 1px solid var(--border);
		animation: fade-in 0.3s ease both;
	}

	.cart-item:last-child {
		border-bottom: none;
	}

	.item-main {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 8px;
		margin-bottom: 8px;
	}

	.item-details {
		display: flex;
		flex-direction: column;
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.item-name {
		font-weight: 700;
	}

	.item-opts,
	.item-obs {
		font-size: 0.82rem;
		color: var(--text-light);
		margin-top: 2px;
	}

	.btn-edit {
		margin: -8px -10px 0 0;
	}

	.item-controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.item-price {
		font-weight: 700;
		color: var(--accent-text);
		font-variant-numeric: tabular-nums;
	}

	.cart-summary {
		padding: 18px 20px 12px;
		border-top: 1px solid var(--border);
		background: var(--surface-2);
		border-radius: 0 0 var(--radius) var(--radius);
	}

	.summary-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8px;
		font-size: 0.95rem;
		color: var(--text-light);
		font-variant-numeric: tabular-nums;
	}

	.summary-row.total {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text);
		margin-top: 12px;
		border-top: 1px dashed var(--border-strong);
		padding-top: 14px;
	}

	.summary-row.total span:last-child {
		color: var(--accent-text);
	}

	.delivery-warning {
		font-size: 0.85rem;
		color: var(--error);
		background: var(--error-bg);
		padding: 8px 12px;
		border-radius: var(--radius-sm);
		margin-bottom: 8px;
	}

	.cart-actions {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-top: 16px;
	}

	/* Mobile Cart Bar */
	.mobile-cart-bar {
		position: fixed;
		left: 12px;
		right: 12px;
		bottom: calc(12px + env(safe-area-inset-bottom));
		z-index: 90;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		padding: 8px 8px 8px 16px;
		background: var(--surface-3);
		border: 1px solid var(--border-strong);
		border-radius: 999px;
		box-shadow: var(--shadow);
		animation: rise 0.3s var(--ease) both;
	}

	.mobile-cart-info {
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 0;
	}

	.mobile-cart-info .qty {
		min-width: 30px;
		height: 30px;
		padding: 0 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: var(--accent-soft);
		color: var(--accent-text);
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		animation: pop 0.3s var(--ease);
	}

	.mobile-cart-info .total {
		font-size: 1.15rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	/* Drawer (Mobile Cart) */
	.drawer-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(8, 7, 6, 0.72);
		z-index: 101;
		animation: fade-in 0.2s ease both;
	}

	.cart-drawer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 102;
		max-height: calc(100vh - 40px);
		max-height: calc(100dvh - 40px);
		display: flex;
		flex-direction: column;
		background: var(--surface);
		border-top: 1px solid var(--border-strong);
		border-radius: var(--radius-lg) var(--radius-lg) 0 0;
		box-shadow: var(--shadow-modal);
		animation: sheet-in 0.3s var(--ease) both;
	}

	.cart-drawer:focus {
		outline: none;
	}

	.drawer-header {
		padding: 12px 12px 12px 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--border);
	}

	.drawer-content {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.drawer-content .cart-items {
		overflow: visible;
	}

	.drawer-footer {
		padding: 16px 20px 8px;
		background: var(--surface-2);
		border-top: 1px solid var(--border);
		padding-bottom: calc(8px + env(safe-area-inset-bottom));
	}
</style>
