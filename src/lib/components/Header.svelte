<script lang="ts">
	interface HeaderProps {
		companyName: string;
		address: string;
		instagram?: string;
		isCurrentlyOpen: boolean;
		cartItemCount: number;
		searchQuery?: string;
		onSearchInput?: () => void;
		onOpenCart: () => void;
	}

	let {
		companyName,
		address,
		instagram = '',
		isCurrentlyOpen,
		cartItemCount,
		searchQuery = $bindable(''),
		onSearchInput,
		onOpenCart
	}: HeaderProps = $props();
</script>

<div class="info-strip">
	<span>Entrega e Retirada</span>
	<span aria-hidden="true">•</span>
	<span>{address}</span>
</div>

<header class="top-header">
	<div class="header-content">
		<div class="brand">
			<span class="brand-mark" aria-hidden="true">{companyName.charAt(0)}</span>
			<div class="brand-text">
				<h1 class="display">{companyName}</h1>
				<p class="status-badge {isCurrentlyOpen ? 'open' : 'closed'}">
					<span class="dot" aria-hidden="true"></span>
					{isCurrentlyOpen ? 'Aberto Agora' : 'Fechado'}
				</p>
			</div>
		</div>

		<div class="search-box" role="search">
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
				<circle cx="11" cy="11" r="8"></circle>
				<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
			</svg>
			<input
				type="text"
				inputmode="search"
				enterkeyhint="search"
				autocomplete="off"
				placeholder="Busque pastel, suco, etc..."
				bind:value={searchQuery}
				oninput={onSearchInput}
				aria-label="Buscar produtos no cardápio"
			/>
			{#if searchQuery}
				<button
					type="button"
					class="search-clear"
					onclick={() => (searchQuery = '')}
					aria-label="Limpar busca"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			{/if}
		</div>

		<div class="header-actions">
			{#if instagram}
				<a
					href={instagram}
					target="_blank"
					rel="external noopener noreferrer"
					class="icon-btn"
					aria-label="Instagram"
				>
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
						<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
						<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
						<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
					</svg>
				</a>
			{/if}
			<button
				type="button"
				class="cart-toggle-btn mobile-only"
				onclick={onOpenCart}
				aria-label="Abrir carrinho"
			>
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
					<circle cx="9" cy="21" r="1"></circle>
					<circle cx="20" cy="21" r="1"></circle>
					<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
				</svg>
				{#if cartItemCount > 0}
					{#key cartItemCount}
						<span class="badge">{cartItemCount}</span>
					{/key}
				{/if}
			</button>
		</div>
	</div>
</header>

<style>
	.info-strip {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 4px 8px;
		padding: 8px 16px;
		background: var(--surface);
		border-bottom: 1px solid var(--border);
		color: var(--text-light);
		font-size: 0.8rem;
		text-align: center;
	}

	.top-header {
		position: sticky;
		top: 0;
		z-index: 100;
		background: rgba(18, 17, 16, 0.9);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--border);
	}

	.header-content {
		max-width: var(--max-w);
		min-height: var(--header-h);
		margin: 0 auto;
		padding: 10px 20px;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 420px) minmax(0, 1fr);
		grid-template-areas: 'brand search actions';
		align-items: center;
		gap: 10px 16px;
	}

	.brand {
		grid-area: brand;
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 0;
	}

	.brand-mark {
		width: 44px;
		height: 44px;
		flex: none;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
		background: var(--accent);
		color: var(--accent-ink);
		font-family: var(--font-display);
		font-size: 1.6rem;
		font-weight: 700;
		line-height: 1;
	}

	.brand-text {
		min-width: 0;
	}

	.brand h1 {
		font-size: 1.2rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.status-badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-top: 3px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.status-badge .dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: currentColor;
	}

	.status-badge.open {
		color: var(--success);
	}

	.status-badge.closed {
		color: var(--error);
	}

	.header-actions {
		grid-area: actions;
		justify-self: end;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.cart-toggle-btn {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-radius: 50%;
		color: var(--accent);
		transition: background-color 0.2s;
	}

	.cart-toggle-btn .badge {
		position: absolute;
		top: -5px;
		right: -5px;
		min-width: 22px;
		height: 22px;
		padding: 0 5px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: var(--accent);
		color: var(--accent-ink);
		font-size: 0.75rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		animation: pop 0.3s var(--ease);
	}

	.search-box {
		display: flex;
		align-items: center;
		gap: 8px;
		grid-area: search;
		width: 100%;
		min-height: 44px;
		padding: 0 6px 0 16px;
		background: var(--surface-2);
		border: 1px solid var(--border-strong);
		border-radius: 999px;
		color: var(--text-light);
		transition: border-color 0.2s;
	}

	.search-box:focus-within {
		border-color: var(--accent);
		outline: 2px solid var(--accent);
		outline-offset: 0;
	}

	.search-box svg {
		flex: none;
	}

	.search-box input {
		flex: 1;
		min-width: 0;
		height: 44px;
		border: none;
		background: none;
		outline: none;
		color: var(--text);
		font-size: 1rem;
	}

	.search-box input::placeholder {
		color: var(--text-muted);
		opacity: 1;
	}

	.search-clear {
		width: 36px;
		height: 36px;
		flex: none;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		color: var(--text-light);
	}

	@media (hover: hover) {
		.search-clear:hover {
			background: var(--surface-3);
			color: var(--text);
		}
	}

	/* No celular a busca desce para uma segunda linha do cabeçalho */
	@media (max-width: 720px) {
		.header-content {
			grid-template-columns: minmax(0, 1fr) auto;
			grid-template-areas:
				'brand actions'
				'search search';
		}

		.search-box {
			min-height: 44px;
		}

		.search-box input {
			height: 42px;
		}
	}

	@media (max-width: 480px) {
		.header-content {
			padding: 10px 16px;
		}

		.brand h1 {
			font-size: 1.05rem;
		}
	}
</style>
