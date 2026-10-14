import type { CartItem, Product, StoredCartData } from '../types/index';

export const CART_STORAGE_KEY = 'branquinho_cart_v2';

/**
 * Carrega e higieniza os dados do carrinho salvos no localStorage.
 * Garante compatibilidade com SSR checando se o ambiente é navegador.
 */
export function loadStoredCart(
	catalogProducts: readonly Product[],
	storageKey: string = CART_STORAGE_KEY
): { cart: CartItem[]; isDelivery: boolean } | null {
	if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
		return null;
	}

	try {
		const saved = localStorage.getItem(storageKey);
		if (!saved) return null;

		const parsed = JSON.parse(saved) as StoredCartData;
		let loadedCart: CartItem[] = [];
		let isDelivery = true;

		if (Array.isArray(parsed.cart)) {
			// Filtra apenas itens que ainda existem no catálogo
			const validItems = parsed.cart.filter((item) =>
				catalogProducts.some((p) => p.id === item.productId)
			);

			// Recalcula o preço base a partir do catálogo atual
			loadedCart = validItems.map((item) => {
				const prod = catalogProducts.find((p) => p.id === item.productId);
				if (prod) {
					item.basePrice = prod.basePrice;
				}
				return item;
			});
		}

		if (typeof parsed.isDelivery === 'boolean') {
			isDelivery = parsed.isDelivery;
		}

		return { cart: loadedCart, isDelivery };
	} catch (e) {
		console.error('Falha ao restaurar dados do carrinho do localStorage:', e);
		return null;
	}
}

/**
 * Salva os dados do carrinho no localStorage.
 */
export function saveCartToStorage(
	cart: readonly CartItem[],
	isDelivery: boolean,
	storageKey: string = CART_STORAGE_KEY
): void {
	if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
		return;
	}

	try {
		localStorage.setItem(storageKey, JSON.stringify({ cart, isDelivery }));
	} catch (e) {
		console.error('Falha ao salvar carrinho no localStorage:', e);
	}
}
