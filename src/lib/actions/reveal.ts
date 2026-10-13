import type { Action } from 'svelte/action';

/**
 * Faz o elemento aparecer suavemente ao entrar na tela.
 * O conteúdo só é escondido aqui, no cliente: sem JS (ou com movimento reduzido)
 * ele permanece visível como veio do servidor.
 */
export const reveal: Action<HTMLElement> = (node) => {
	if (
		typeof IntersectionObserver === 'undefined' ||
		window.matchMedia('(prefers-reduced-motion: reduce)').matches
	) {
		return;
	}

	// O que já está na tela (ou acima dela) não é escondido para evitar piscar.
	if (node.getBoundingClientRect().top < window.innerHeight) return;

	node.dataset.reveal = 'pending';

	const observer = new IntersectionObserver(
		(entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				node.dataset.reveal = 'in';
				observer.disconnect();
			}
		},
		{ rootMargin: '0px 0px -40px 0px' }
	);
	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
};
