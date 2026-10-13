<script lang="ts">
	interface ToastProps {
		message: string;
		/** Muda a cada aviso para reiniciar a animação mesmo com o mesmo texto */
		token: number;
		/** Sobe o aviso para não ficar atrás da barra do carrinho no celular */
		raised?: boolean;
		/** Esconde no desktop, onde o carrinho lateral já mostra a mudança */
		mobileOnly?: boolean;
	}

	let { message, token, raised = false, mobileOnly = false }: ToastProps = $props();
</script>

<div class="toast-region" class:raised class:mobile-only={mobileOnly} role="status">
	{#if message}
		{#key token}
			<div class="toast">
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
					<polyline points="20 6 9 17 4 12"></polyline>
				</svg>
				<span>{message}</span>
			</div>
		{/key}
	{/if}
</div>

<style>
	.toast-region {
		position: fixed;
		left: 16px;
		right: 16px;
		bottom: calc(20px + env(safe-area-inset-bottom));
		z-index: 95;
		display: flex;
		justify-content: center;
		pointer-events: none;
	}

	@media (max-width: 991px) {
		.toast-region.raised {
			bottom: calc(88px + env(safe-area-inset-bottom));
		}
	}

	.toast {
		display: flex;
		align-items: center;
		gap: 8px;
		max-width: 100%;
		padding: 10px 16px;
		background: var(--surface-3);
		border: 1px solid var(--accent-line);
		border-radius: 999px;
		box-shadow: var(--shadow);
		color: var(--text);
		font-size: 0.9rem;
		font-weight: 600;
		animation: rise 0.25s var(--ease) both;
	}

	.toast svg {
		flex: none;
		color: var(--accent);
	}

	.toast span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
