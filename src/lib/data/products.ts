import type { OptionGroup, Product } from '../types/index';
import smashBurger from '../assets/The Perfect Smash Burger on a Gas Griddle.jpg';

// Fotos demonstrativas HTTPS usando Unsplash (temática aproximada para food)
export const imgPastel = smashBurger;
export const imgCoxinha =
	'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop';
export const imgAcai =
	'https://images.unsplash.com/photo-1596649281350-137cb5b5465e?q=80&w=800&auto=format&fit=crop';
export const imgSuco =
	'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop';
export const imgRefri =
	'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop';
export const imgFritas =
	'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=800&auto=format&fit=crop';

export const addOnsPastel: OptionGroup = {
	id: 'add-pastel',
	name: 'Adicionais',
	min: 0,
	max: 3,
	options: [
		{ id: 'p1', name: 'Catupiry', priceAddition: 200 },
		{ id: 'p2', name: 'Cheddar', priceAddition: 200 },
		{ id: 'p3', name: 'Bacon', priceAddition: 350 }
	]
};

export const products: Product[] = [
	// Pastéis
	{
		id: '1',
		categoryId: 'Pastéis',
		name: 'Pastel de Carne',
		description: 'Carne moída temperada.',
		imageUrl: imgPastel,
		basePrice: 800,
		available: true,
		optionGroups: [addOnsPastel]
	},
	{
		id: '2',
		categoryId: 'Pastéis',
		name: 'Pastel de Queijo',
		description: 'Queijo mussarela derretido.',
		imageUrl: imgPastel,
		basePrice: 800,
		available: true,
		optionGroups: [addOnsPastel]
	},
	{
		id: '3',
		categoryId: 'Pastéis',
		name: 'Pastel de Frango com Catupiry',
		description: 'Frango desfiado com catupiry original.',
		imageUrl: imgPastel,
		basePrice: 900,
		available: true,
		optionGroups: [addOnsPastel]
	},
	{
		id: '4',
		categoryId: 'Pastéis',
		name: 'Pastel de Pizza',
		description: 'Mussarela, presunto, tomate e orégano.',
		imageUrl: imgPastel,
		basePrice: 900,
		available: true,
		optionGroups: [addOnsPastel]
	},
	{
		id: '5',
		categoryId: 'Pastéis',
		name: 'Pastel de Calabresa',
		description: 'Calabresa fatiada com cebola.',
		imageUrl: imgPastel,
		basePrice: 850,
		available: false,
		optionGroups: [addOnsPastel]
	},

	// Coxinhas
	{
		id: '6',
		categoryId: 'Coxinhas',
		name: 'Coxinha de Frango',
		description: 'Massa crocante com recheio de frango.',
		imageUrl: imgCoxinha,
		basePrice: 700,
		available: true
	},
	{
		id: '7',
		categoryId: 'Coxinhas',
		name: 'Coxinha Frango com Catupiry',
		description: 'O clássico frango com catupiry.',
		imageUrl: imgCoxinha,
		basePrice: 850,
		available: true
	},
	{
		id: '8',
		categoryId: 'Coxinhas',
		name: 'Coxinha de Charque',
		description: 'Recheio farto de charque desfiado.',
		imageUrl: imgCoxinha,
		basePrice: 950,
		available: true
	},

	// Açaí
	{
		id: '9',
		categoryId: 'Açaí',
		name: 'Copo de Açaí',
		description: 'Açaí cremoso. Monte do seu jeito.',
		imageUrl: imgAcai,
		basePrice: 1200,
		available: true,
		optionGroups: [
			{
				id: 'ac1',
				name: 'Tamanho (Obrigatório)',
				min: 1,
				max: 1,
				options: [
					{ id: 't300', name: '300ml', priceAddition: 0 },
					{ id: 't500', name: '500ml', priceAddition: 600 },
					{ id: 't700', name: '700ml', priceAddition: 1000 }
				]
			},
			{
				id: 'ac2',
				name: 'Acompanhamentos Grátis',
				min: 0,
				max: 3,
				options: [
					{ id: 'a1', name: 'Leite em pó', priceAddition: 0 },
					{ id: 'a2', name: 'Leite condensado', priceAddition: 0 },
					{ id: 'a3', name: 'Granola', priceAddition: 0 },
					{ id: 'a4', name: 'Banana', priceAddition: 0 }
				]
			},
			{
				id: 'ac3',
				name: 'Adicionais Extras',
				min: 0,
				max: 5,
				options: [
					{ id: 'e1', name: 'Nutella', priceAddition: 400 },
					{ id: 'e2', name: 'Morango', priceAddition: 300 },
					{ id: 'e3', name: 'Ouro Branco', priceAddition: 250 }
				]
			}
		]
	},
	{
		id: '10',
		categoryId: 'Açaí',
		name: 'Barca de Açaí',
		description: 'Ideal para dividir. Inclui 4 complementos.',
		imageUrl: imgAcai,
		basePrice: 3500,
		available: true
	},

	// Sucos
	{
		id: '11',
		categoryId: 'Sucos',
		name: 'Suco Natural',
		description: 'Sucos feitos da fruta na hora.',
		imageUrl: imgSuco,
		basePrice: 700,
		available: true,
		optionGroups: [
			{
				id: 's1',
				name: 'Sabor',
				min: 1,
				max: 1,
				options: [
					{ id: 'sb1', name: 'Laranja', priceAddition: 0 },
					{ id: 'sb2', name: 'Limão', priceAddition: 0 },
					{ id: 'sb3', name: 'Maracujá', priceAddition: 100 }
				]
			}
		]
	},
	{
		id: '12',
		categoryId: 'Sucos',
		name: 'Suco com Leite',
		description: 'Vitamina cremosa.',
		imageUrl: imgSuco,
		basePrice: 900,
		available: true,
		optionGroups: [
			{
				id: 's2',
				name: 'Sabor',
				min: 1,
				max: 1,
				options: [
					{ id: 'sb4', name: 'Morango', priceAddition: 0 },
					{ id: 'sb5', name: 'Banana', priceAddition: 0 }
				]
			}
		]
	},

	// Refrigerantes
	{
		id: '13',
		categoryId: 'Refrigerantes',
		name: 'Coca-Cola Lata 350ml',
		description: 'Gelada.',
		imageUrl:
			'https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=800&auto=format&fit=crop',
		basePrice: 600,
		available: true
	},
	{
		id: '14',
		categoryId: 'Refrigerantes',
		name: 'Guaraná Antarctica 350ml',
		description: 'Gelado.',
		imageUrl:
			'https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=800&auto=format&fit=crop',
		basePrice: 600,
		available: true
	},
	{
		id: '15',
		categoryId: 'Refrigerantes',
		name: 'Coca-Cola 2 Litros',
		description: 'Para a família.',
		imageUrl:
			'https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=800&auto=format&fit=crop',
		basePrice: 1400,
		available: true
	},
	{
		id: '16',
		categoryId: 'Refrigerantes',
		name: 'Guaraná 2 Litros',
		description: 'Para a família.',
		imageUrl:
			'https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=800&auto=format&fit=crop',
		basePrice: 1200,
		available: true
	},

	// Batata Frita
	{
		id: '17',
		categoryId: 'Batata Frita',
		name: 'Porção Simples',
		description: 'Batata palito frita na hora.',
		imageUrl: imgFritas,
		basePrice: 1500,
		available: true
	},
	{
		id: '18',
		categoryId: 'Batata Frita',
		name: 'Batata com Cheddar e Bacon',
		description: 'Porção caprichada.',
		imageUrl: imgFritas,
		basePrice: 2200,
		available: true
	}
];
