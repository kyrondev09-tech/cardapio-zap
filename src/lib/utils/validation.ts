import type { CustomerData, Product } from '../types/index';

/**
 * Valida se as opções selecionadas no modal atendem às regras mínimas e máximas de cada grupo.
 */
export function isProductModalValid(
	product: Product | null,
	modalSelections: Record<string, string[]>
): boolean {
	if (!product?.optionGroups) return true;
	for (const group of product.optionGroups) {
		const selectedCount = (modalSelections[group.id] || []).length;
		if (selectedCount < group.min || selectedCount > group.max) {
			return false;
		}
	}
	return true;
}

/**
 * Valida o valor de troco informado para pagamento em dinheiro.
 */
export function parseAndValidateChange(
	changeForStr: string,
	orderTotalCents: number
): { valid: boolean; changeValue?: number } {
	const clean = changeForStr.replace(/[R$\s]/g, '').replace(',', '.');
	const changeVal = parseFloat(clean);
	if (isNaN(changeVal) || changeVal * 100 < orderTotalCents) {
		return { valid: false };
	}
	return { valid: true, changeValue: changeVal };
}

/**
 * Valida a etapa de dados do cliente e endereço no checkout.
 */
export function validateCustomerStep(params: {
	customer: CustomerData;
	isDelivery: boolean;
	orderTotalCents: number;
}): { valid: boolean; error: string } {
	const { customer, isDelivery, orderTotalCents } = params;

	if (!customer.name.trim() || !customer.phone.trim()) {
		return { valid: false, error: 'Nome e celular são obrigatórios.' };
	}

	if (isDelivery) {
		if (!customer.street.trim() || !customer.number.trim() || !customer.neighborhood.trim()) {
			return { valid: false, error: 'Endereço completo é obrigatório para entrega.' };
		}
	}

	if (customer.paymentMethod === 'Dinheiro' && customer.changeFor.trim()) {
		const changeResult = parseAndValidateChange(customer.changeFor, orderTotalCents);
		if (!changeResult.valid) {
			return {
				valid: false,
				error: 'O valor do troco deve ser maior que o total do pedido.'
			};
		}
	}

	return { valid: true, error: '' };
}

/**
 * Valida se o número de WhatsApp configurado é válido para envio.
 */
export function isConfiguredWhatsAppValid(whatsappNumber: string): boolean {
	return (
		Boolean(whatsappNumber) && whatsappNumber !== '5500000000000' && /^\d+$/.test(whatsappNumber)
	);
}
