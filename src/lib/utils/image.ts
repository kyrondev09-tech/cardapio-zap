// Placeholder neutro (prato estilizado) no tom dos cards, usado quando a foto não carrega
export const FALLBACK_IMAGE =
	'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2323211F"/><g fill="none" stroke="%235C574F" stroke-width="2"><circle cx="50" cy="50" r="13"/><circle cx="50" cy="50" r="7"/></g></svg>';

export function onImageError(e: Event): void {
	const target = e.currentTarget as HTMLImageElement | null;
	if (target && target.src !== FALLBACK_IMAGE) {
		target.src = FALLBACK_IMAGE;
	}
}
