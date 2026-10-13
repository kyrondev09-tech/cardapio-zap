<script lang="ts">
	import { onImageError } from '../utils/image';
	import heroBurger from '../assets/hero-cheeseburger.jpg';

	interface HeroFact {
		label: string;
		value: string;
	}

	interface HeroProps {
		description: string;
		facts?: HeroFact[];
		heroImage?: string;
		onScrollToCatalog: () => void;
	}

	let { description, facts = [], heroImage = heroBurger, onScrollToCatalog }: HeroProps = $props();
</script>

<section class="hero" aria-labelledby="hero-title">
	<div class="hero-inner">
		<div class="hero-content">
			<p class="eyebrow">Feito na hora</p>
			<h2 id="hero-title" class="display">
				Seu pedido <span class="highlight">quentinho</span>.<br />Do seu jeito.
			</h2>
			<p class="lead">{description}</p>
			<div class="hero-actions">
				<button type="button" class="btn btn-primary" onclick={onScrollToCatalog}>
					Ver cardápio
				</button>
			</div>
			{#if facts.length > 0}
				<dl class="facts">
					{#each facts as fact (fact.label)}
						<div>
							<dt>{fact.label}</dt>
							<dd>{fact.value}</dd>
						</div>
					{/each}
				</dl>
			{/if}
		</div>
		<div class="hero-image">
			<img
				src={heroImage}
				alt="Cheeseburger com queijo derretido, tomate, cebola roxa e alface"
				fetchpriority="high"
				onerror={onImageError}
			/>
		</div>
	</div>
</section>

<style>
	.hero {
		width: 100%;
		max-width: var(--max-w);
		margin: 24px auto 48px;
		padding: 0 20px;
	}

	.hero-inner {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
		min-height: 500px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.hero-content {
		padding: 56px 48px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}

	.hero-content > * {
		animation: rise 0.6s var(--ease) both;
	}

	.hero-content > :nth-child(2) {
		animation-delay: 0.06s;
	}

	.hero-content > :nth-child(3) {
		animation-delay: 0.12s;
	}

	.hero-content > :nth-child(4) {
		animation-delay: 0.18s;
	}

	.hero-content > :nth-child(5) {
		animation-delay: 0.24s;
	}

	.eyebrow {
		margin-bottom: 16px;
		padding: 4px 12px;
		border: 1px solid var(--accent-line);
		border-radius: 999px;
		color: var(--accent-text);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.hero h2 {
		font-size: clamp(2.1rem, 4.6vw, 3.4rem);
		font-weight: 700;
		line-height: 1.08;
		margin-bottom: 16px;
	}

	.hero .highlight {
		color: var(--accent);
	}

	.lead {
		font-size: 1.05rem;
		color: var(--text-light);
		margin-bottom: 28px;
		max-width: 42ch;
	}

	.hero-actions {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.facts {
		display: flex;
		flex-wrap: wrap;
		gap: 12px 28px;
		margin: 32px 0 0;
		padding-top: 20px;
		border-top: 1px solid var(--border);
		align-self: stretch;
	}

	.facts dt {
		font-size: 0.75rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.facts dd {
		margin: 2px 0 0;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	.hero-image {
		position: relative;
		min-height: 260px;
		background: var(--surface-2);
		animation: fade-in 0.8s ease both;
	}

	.hero-image img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Funde a foto com o card para não haver um corte seco */
	.hero-image::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, var(--surface) 0%, rgba(27, 26, 24, 0) 28%);
		pointer-events: none;
	}

	@media (max-width: 860px) {
		.hero {
			margin: 16px auto 32px;
			padding: 0 16px;
		}

		.hero-inner {
			grid-template-columns: minmax(0, 1fr);
			min-height: 0;
		}

		.hero-content {
			padding: 28px 20px 24px;
		}

		/* A foto é vertical: um quadro quadrado mostra o lanche inteiro */
		.hero-image {
			min-height: 0;
			aspect-ratio: 1;
		}

		.hero-image::after {
			background: linear-gradient(180deg, var(--surface) 0%, rgba(27, 26, 24, 0) 30%);
		}

		.facts {
			margin-top: 24px;
			gap: 12px 20px;
		}
	}

	@media (max-width: 480px) {
		.hero-actions {
			align-self: stretch;
		}

		.hero-actions .btn {
			flex: 1 1 auto;
		}
	}
</style>
