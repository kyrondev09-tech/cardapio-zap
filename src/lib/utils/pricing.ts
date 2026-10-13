import type { CartItem, Product, SelectedOption } from '../types/index';
import { config } from '../config/index';

/**
 * Formata um valor em centavos para a moeda configurada (padrão BRL: R$ 0,00).
 */
export function formatMoney(
	cents: number,
	locale: string = config.locale,
	currency: string = config.currency
): string {
	return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(cents / 100);
}

/**
 * Calcula o acréscimo total das opções selecionadas em um item.
 */
export function calcItemOptionsTotal(options: readonly SelectedOption[]): number {
	return options.reduce((sum, opt) => sum + opt.priceAddition, 0);
}

/**
 * Calcula o preço unitário de um item do carrinho incluindo adicionais.
 */
export function calcItemUnitPrice(basePrice: number, options: readonly SelectedOption[]): number {
	return basePrice + calcItemOptionsTotal(options);
}

/**
 * Calcula o subtotal de uma linha do carrinho (preço unitário * quantidade).
 */
export function calcItemSubtotal(
	item: Pick<CartItem, 'basePrice' | 'selectedOptions' | 'quantity'>
): number {
	return calcItemUnitPrice(item.basePrice, item.selectedOptions) * item.quantity;
}

/**
 * Calcula o subtotal de todos os itens do carrinho.
 */
export function calcCartSubtotal(cart: readonly CartItem[]): number {
	return cart.reduce((acc, item) => acc + calcItemSubtotal(item), 0);
}

/**
 * Retorna o valor da taxa de entrega considerando a modalidade.
 */
export function calcDeliveryFee(isDelivery: boolean, fee: number = config.deliveryFee): number {
	return isDelivery ? fee : 0;
}

/**
 * Calcula o total final do pedido (subtotal + taxa de entrega).
 */
export function calcOrderTotal(subtotal: number, deliveryFee: number): number {
	return subtotal + deliveryFee;
}

/**
 * Verifica se o valor mínimo para entrega foi atingido.
 */
export function isMinimumDeliveryMet(
	subtotal: number,
	isDelivery: boolean,
	minValue: number = config.minDeliveryValue
): boolean {
	return !isDelivery || subtotal >= minValue;
}

/**
 * Retorna a quantidade total de itens (soma das quantidades) no carrinho.
 */
export function calcCartItemCount(cart: readonly CartItem[]): number {
	return cart.reduce((acc, item) => acc + item.quantity, 0);
}

/**
 * Calcula o preço em tempo real no modal de personalização.
 */
export function calcModalPrice(
	product: Product | null,
	modalSelections: Record<string, string[]>,
	quantity: number
): number {
	if (!product) return 0;
	let additions = 0;
	if (product.optionGroups) {
		for (const [groupId, optionIds] of Object.entries(modalSelections)) {
			const group = product.optionGroups.find((g) => g.id === groupId);
			if (group) {
				for (const optId of optionIds) {
					const opt = group.options.find((o) => o.id === optId);
					if (opt) additions += opt.priceAddition;
				}
			}
		}
	}
	return (product.basePrice + additions) * quantity;
}
