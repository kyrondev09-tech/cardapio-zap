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

	// No celular cabe só a primeira frase da descrição
	let shortDescription = $derived(description.split(/(?<=[.!?])\s+/)[0]);
</script>

<section
	class="mx-auto mt-3 mb-8 w-full max-w-(--max-w) overflow-x-hidden px-4 sm:mt-6 sm:mb-12 sm:px-5"
	aria-labelledby="hero-title"
>
	<div
		class="relative isolate flex flex-col overflow-hidden rounded-3xl border border-(--border) bg-(--hero-bg)"
	>
		<div class="relative flex min-h-[288px] items-center sm:min-h-[340px] lg:min-h-[480px]">
			<!-- Foto à direita, escurecida, atrás do texto -->
			<div class="hero-photo absolute inset-y-0 right-0 -z-10 w-[62%] bg-black lg:w-[44%]">
				<img
					class="h-full w-full object-cover object-right opacity-80 sm:object-contain sm:opacity-90 lg:object-cover lg:object-center"
					src={heroImage}
					alt="Cheeseburger com queijo derretido, tomate, cebola roxa e alface"
					fetchpriority="high"
					onerror={onImageError}
				/>
			</div>
			<!-- Gradientes que fundem a foto com o fundo do banner, sem borda dura -->
			<div
				class="pointer-events-none absolute inset-0 -z-10 bg-linear-to-r from-(--hero-bg) from-44% via-(--hero-bg)/80 via-64% to-transparent sm:from-40% sm:via-(--hero-bg)/75 sm:via-60% lg:from-52% lg:via-66%"
				aria-hidden="true"
			></div>
			<div
				class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/4 bg-linear-to-t from-(--hero-bg) to-transparent"
				aria-hidden="true"
			></div>

			<div
				class="hero-copy flex max-w-[70%] flex-col items-start gap-3 p-5 sm:max-w-[60%] sm:gap-4 sm:p-8 lg:max-w-[54%] lg:p-12"
			>
				<p
					class="rounded-full border border-(--accent-line) px-2.5 py-0.5 text-[0.68rem] font-bold tracking-[0.08em] text-(--accent-text) uppercase sm:px-3 sm:py-1 sm:text-xs"
				>
					Feito na hora
				</p>
				<h2
					id="hero-title"
					class="font-(family-name:--font-display) text-[clamp(1.7rem,8.6vw,2.1rem)] leading-[1.08] font-bold tracking-[0.01em] uppercase sm:text-4xl sm:leading-[1.08] lg:text-[3.4rem] lg:leading-[1.08]"
				>
					Seu pedido <br class="sm:hidden" /><span class="text-(--accent)">quentinho</span>.<br />Do
					seu jeito.
				</h2>
				<p class="max-w-[85%] text-[0.9rem] leading-snug text-(--text-light) sm:hidden">
					{shortDescription}
				</p>
				<p class="hidden max-w-[42ch] text-base text-(--text-light) sm:block lg:text-[1.05rem]">
					{description}
				</p>
				<button
					type="button"
					class="mt-1 inline-flex min-h-11 items-center justify-center rounded-full bg-(--accent) px-5 text-[0.95rem] font-bold text-(--accent-ink) transition-[background-color,color,scale] duration-200 hover:bg-(--accent-hover) hover:text-(--accent-hover-ink) active:scale-[0.98] sm:mt-2 sm:min-h-12 sm:px-6 sm:text-base"
					onclick={onScrollToCatalog}
				>
					Ver cardápio
				</button>
			</div>
		</div>

		{#if facts.length > 0}
			<dl
				class="m-0 grid grid-cols-3 divide-x divide-(--border) border-t border-(--border) bg-black/30"
			>
				{#each facts as fact (fact.label)}
					<div
						class="flex min-w-0 flex-col items-center gap-0.5 px-1.5 py-2.5 text-center sm:flex-row sm:justify-center sm:gap-2 sm:py-3.5"
					>
						<dt
							class="text-[0.62rem] tracking-[0.06em] whitespace-nowrap text-(--text-muted) uppercase sm:text-xs"
						>
							{fact.label}
						</dt>
						<dd
							class="m-0 text-[0.82rem] font-bold whitespace-nowrap text-(--text) tabular-nums sm:text-sm"
						>
							{fact.value}
						</dd>
					</div>
				{/each}
			</dl>
		{/if}
	</div>
</section>

<style>
	/* Entrada: fade com pequeno deslocamento, em sequência (estado final sempre visível) */
	.hero-copy > * {
		animation: rise 0.6s var(--ease) both;
	}

	.hero-copy > :nth-child(2) {
		animation-delay: 0.06s;
	}

	.hero-copy > :nth-child(3),
	.hero-copy > :nth-child(4) {
		animation-delay: 0.12s;
	}

	.hero-copy > :nth-child(5) {
		animation-delay: 0.18s;
	}

	.hero-photo {
		animation: fade-in 0.8s ease both;
	}
</style>
