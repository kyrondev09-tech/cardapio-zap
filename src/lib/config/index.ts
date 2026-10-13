import type { Config } from '../types/index';

export const config: Config = {
	companyName: 'A pimenta',
	slogan: 'Seu pastel quentinho. Seu açaí do seu jeito.',
	description: 'Pastéis, lanches, açaí, sucos e muito mais. Monte seu pedido com facilidade.',
	whatsapp: '5500000000000', // Inválido por padrão para segurança (não abrir número real)
	address: 'Av. 25 de Maio, Centro',
	instagram: 'https://instagram.com/branquinholanches',
	currency: 'BRL',
	locale: 'pt-BR',
	timezone: 'America/Sao_Paulo',
	deliveryFee: 500, // R$ 5,00
	minDeliveryValue: 2000, // R$ 20,00
	prepTime: 40,
	openingHours: {
		0: { open: '18:00', close: '23:30' },
		1: { open: '00:00', close: '00:00' }, // Fechado
		2: { open: '18:00', close: '23:30' },
		3: { open: '18:00', close: '23:30' },
		4: { open: '18:00', close: '23:30' },
		5: { open: '18:00', close: '23:59' },
		6: { open: '18:00', close: '23:59' }
	},
	paymentMethods: ['Pix', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro'],
	maxItemQty: 20
};

export const categories: readonly string[] = [
	'Pastéis',
	'Coxinhas',
	'Açaí',
	'Sucos',
	'Refrigerantes',
	'Batata Frita'
];

export const DEFAULT_CATEGORY = 'Tudo';
