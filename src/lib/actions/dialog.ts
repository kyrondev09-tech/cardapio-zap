import type { Action } from 'svelte/action';

const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface DialogParams {
	onClose: () => void;
}

/**
 * Comportamento de diálogo modal: leva o foco para dentro ao abrir, mantém o Tab
 * preso no conteúdo, fecha com Esc e devolve o foco ao elemento anterior ao fechar.
 */
export const dialog: Action<HTMLElement, DialogParams> = (node, params) => {
	let onClose = params.onClose;
	const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;

	if (!node.hasAttribute('tabindex')) node.tabIndex = -1;
	node.focus({ preventScroll: true });

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.stopPropagation();
			onClose();
			return;
		}
		if (event.key !== 'Tab') return;

		const items = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
			(el) => el.getClientRects().length > 0
		);
		if (items.length === 0) {
			event.preventDefault();
			return;
		}

		const first = items[0];
		const last = items[items.length - 1];
		const active = document.activeElement;

		if (event.shiftKey && (active === first || active === node)) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && active === last) {
			event.preventDefault();
			first.focus();
		}
	}

	node.addEventListener('keydown', onKeydown);

	return {
		update(next) {
			onClose = next.onClose;
		},
		destroy() {
			node.removeEventListener('keydown', onKeydown);
			if (previous?.isConnected) previous.focus({ preventScroll: true });
		}
	};
};
