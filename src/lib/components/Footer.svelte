<script lang="ts">
	interface FooterProps {
		companyName: string;
		address: string;
		instagram?: string;
	}

	let { companyName, address, instagram = '' }: FooterProps = $props();
</script>

<footer class="site-footer">
	<div class="footer-content">
		<div>
			<p class="footer-brand display">{companyName}</p>
			<p>Entrega e Retirada • {address}</p>
		</div>
		<div class="footer-side">
			<p>Pedidos enviados pelo WhatsApp.</p>
			{#if instagram}
				<a href={instagram} target="_blank" rel="external noopener noreferrer">Instagram</a>
			{/if}
		</div>
	</div>
</footer>

<style>
	.site-footer {
		margin-top: auto;
		border-top: 1px solid var(--border);
		background: var(--surface);
		color: var(--text-light);
		font-size: 0.9rem;
	}

	.footer-content {
		max-width: var(--max-w);
		margin: 0 auto;
		padding: 28px 20px;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		flex-wrap: wrap;
		gap: 16px;
	}

	.footer-brand {
		margin-bottom: 4px;
		color: var(--text);
		font-size: 1.1rem;
	}

	.footer-side {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.footer-side a {
		align-self: flex-start;
		padding: 4px 0;
		color: var(--accent-text);
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	@media (min-width: 640px) {
		.footer-side {
			align-items: flex-end;
			text-align: right;
		}

		.footer-side a {
			align-self: flex-end;
		}
	}
</style>
