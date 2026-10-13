import type { CartItem, Config, CustomerData } from '../types/index';
import { calcItemSubtotal, formatMoney } from './pricing';

export interface BuildWhatsAppMessageParams {
	config: Config;
	customer: CustomerData;
	cart: readonly CartItem[];
	isDelivery: boolean;
	subtotal: number;
	deliveryFee: number;
	total: number;
}

/**
 * Monta o texto formatado para envio do pedido pelo WhatsApp.
 */
export function buildWhatsAppMessage(params: BuildWhatsAppMessageParams): string {
	const { config, customer, cart, isDelivery, subtotal, deliveryFee, total } = params;

	let msg = `Olá *${config.companyName}*!\nGostaria de fazer um pedido.\n\n`;
	msg += `👤 *Cliente:* ${customer.name} (${customer.phone})\n`;
	msg += `🛍️ *Modalidade:* ${isDelivery ? 'Entrega' : 'Retirada'}\n`;
	msg += `\n*📦 PEDIDO:*\n`;

	cart.forEach((item, index) => {
		const itemSub = calcItemSubtotal(item);
		msg += `${index + 1}. ${item.quantity}x ${item.name} (${formatMoney(itemSub, config.locale, config.currency)})\n`;
		if (item.selectedOptions.length > 0) {
			msg += `   ↳ ${item.selectedOptions.map((o) => o.optionName).join(', ')}\n`;
		}
		if (item.observation) {
			msg += `   ↳ Obs: ${item.observation}\n`;
		}
	});

	msg += `\n*💰 RESUMO:*\n`;
	msg += `Subtotal: ${formatMoney(subtotal, config.locale, config.currency)}\n`;
	if (isDelivery) {
		msg += `Taxa de Entrega: ${formatMoney(deliveryFee, config.locale, config.currency)}\n`;
	}
	msg += `*Total: ${formatMoney(total, config.locale, config.currency)}*\n\n`;

	if (isDelivery) {
		msg += `*📍 ENDEREÇO DE ENTREGA:*\n`;
		msg += `${customer.street}, ${customer.number}\n`;
		msg += `Bairro: ${customer.neighborhood}\n`;
		if (customer.complement) msg += `Comp: ${customer.complement}\n`;
		if (customer.reference) msg += `Ref: ${customer.reference}\n\n`;
	}

	msg += `*💳 PAGAMENTO:*\n`;
	msg += `Forma: ${customer.paymentMethod}\n`;
	if (customer.paymentMethod === 'Dinheiro' && customer.changeFor) {
		msg += `Troco para: R$ ${customer.changeFor}\n`;
	}

	if (customer.generalObservation) {
		msg += `\n*📝 OBSERVAÇÃO GERAL:*\n${customer.generalObservation}\n`;
	}

	msg += `\nAguardo a confirmação do pedido!`;
	return msg;
}

/**
 * Gera a URL wa.me com a mensagem codificada pronta para envio.
 */
export function getWhatsAppLink(whatsappNumber: string, message: string): string {
	return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
