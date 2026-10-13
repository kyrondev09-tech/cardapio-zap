<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { Product } from '../types';
	import { formatMoney } from '../utils/pricing';
	import { onImageError } from '../utils/image';

	interface ProductCardProps {
		product: Product;
		onAdd: (product: Product) => void;
	}

	let { product, onAdd }: ProductCardProps = $props();

	let hasOptions = $derived(!!product.optionGroups && product.optionGroups.length > 0);

	// Confirmação visual rápida para itens que vão direto ao carrinho
	let justAdded = $state(false);
	let feedbackTimer: ReturnType<typeof setTimeout> | undefined;

	function handleAdd() {
		onAdd(product);
		if (hasOptions) return;

		justAdded = true;
		clearTimeout(feedbackTimer);
		feedbackTimer = setTimeout(() => (justAdded = false), 1400);
	}

	onDestroy(() => clearTimeout(feedbackTimer));
</script>

<div class="product-card {product.available ? '' : 'unavailable'}">
	<div class="product-img-wrapper">
		<img src={product.imageUrl} alt={product.name} loading="lazy" onerror={onImageError} />
		{#if !product.available}
			<div class="unavailable-overlay"><span>Esgotado</span></div>
		{/if}
	</div>
	<div class="product-info">
		<h4>{product.name}</h4>
		<p>{product.description}</p>
		<div class="product-bottom">
			<span class="price">
				{#if hasOptions}<small>A partir de</small>{/if}
				{formatMoney(product.basePrice)}
			</span>
			<button
				type="button"
				class="btn-add {justAdded ? 'added' : ''}"
				disabled={!product.available}
				onclick={handleAdd}
				aria-label="Adicionar {product.name}"
			>
				{#if justAdded}
					<svg
						class="check"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
					Adicionado
				{:else}
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<line x1="12" y1="5" x2="12" y2="19"></line>
						<line x1="5" y1="12" x2="19" y2="12"></line>
					</svg>
					Adicionar
				{/if}
			</button>
		</div>
	</div>
</div>

<style>
	.product-card {
		background: var(--surface);
		border-radius: var(--radius);
		border: 1px solid var(--border);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transition:
			transform 0.25s var(--ease),
			border-color 0.25s,
			box-shadow 0.25s;
	}

	.product-card.unavailable .btn-add {
		display: none;
	}

	.product-card.unavailable .product-info {
		opacity: 0.6;
	}

	.product-img-wrapper {
		position: relative;
		aspect-ratio: 4 / 3;
		background: var(--surface-2);
		overflow: hidden;
	}

	.product-img-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.4s var(--ease);
	}

	.unavailable-overlay {
		position: absolute;
		inset: 0;
		background: rgba(12, 11, 10, 0.68);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.unavailable-overlay span {
		padding: 4px 12px;
		border: 1px solid var(--border-strong);
		border-radius: 999px;
		background: var(--surface);
		color: var(--text);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.product-info {
		padding: 16px;
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
	}

	.product-info h4 {
		font-size: 1.05rem;
		font-weight: 700;
		line-height: 1.3;
		margin-bottom: 6px;
	}

	.product-info p {
		font-size: 0.9rem;
		color: var(--text-light);
		margin-bottom: 16px;
		flex: 1;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.product-bottom {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: auto;
	}

	.price {
		display: flex;
		flex-direction: column;
		font-size: 1.1rem;
		font-weight: 700;
		line-height: 1.2;
		color: var(--accent-text);
		font-variant-numeric: tabular-nums;
	}

	.price small {
		font-size: 0.72rem;
		font-weight: 500;
		color: var(--text-muted);
	}

	.btn-add {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		min-height: 44px;
		padding: 8px 14px;
		border: 1px solid var(--accent-line);
		border-radius: 999px;
		color: var(--accent-text);
		font-size: 0.9rem;
		font-weight: 700;
		transition:
			background-color 0.2s,
			border-color 0.2s,
			color 0.2s,
			transform 0.2s var(--ease);
	}

	.btn-add:active {
		transform: scale(0.96);
	}

	/* Mais compacto para "Adicionado" caber ao lado do preço sem quebrar a linha */
	.btn-add.added {
		gap: 2px;
		padding-inline: 10px;
		font-size: 0.85rem;
		background: var(--accent);
		border-color: var(--accent);
		color: var(--accent-ink);
	}

	.btn-add .check {
		animation: pop 0.35s var(--ease);
	}

	@media (hover: hover) {
		.product-card:not(.unavailable):hover {
			transform: translateY(-3px);
			border-color: var(--border-strong);
			box-shadow: var(--shadow);
		}

		.product-card:not(.unavailable):hover .product-img-wrapper img {
			transform: scale(1.04);
		}

		.btn-add:hover {
			background: var(--accent-hover);
			border-color: var(--accent-hover);
			color: var(--accent-hover-ink);
		}
	}

	/* No celular o card vira uma linha: foto à esquerda, informações à direita */
	@media (max-width: 560px) {
		.product-card {
			flex-direction: row;
		}

		.product-img-wrapper {
			flex: none;
			width: 116px;
			aspect-ratio: auto;
			min-height: 124px;
		}

		.product-info {
			padding: 12px;
		}

		.product-info h4 {
			font-size: 1rem;
		}

		.product-info p {
			margin-bottom: 10px;
		}
	}
</style>
