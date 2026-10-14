import type { OptionGroup, Product } from '../types/index';
import smashBurger from '../assets/The Perfect Smash Burger on a Gas Griddle.jpg';

// Fotos demonstrativas HTTPS usando Unsplash (temática aproximada para food)
export const imgBurger = smashBurger;
export const imgCombo =
	'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=800&auto=format&fit=crop';
export const imgSuco =
	'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop';
export const imgRefri =
	'https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=800&auto=format&fit=crop';
export const imgFritas =
	'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=800&auto=format&fit=crop';
export const imgBrownie =
	'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop';
export const imgMilkshake =
	'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800&auto=format&fit=crop';

export const addOnsBurger: OptionGroup = {
	id: 'add-burger',
	name: 'Adicionais',
	min: 0,
	max: 3,
	options: [
		{ id: 'b1', name: 'Cheddar extra', priceAddition: 300 },
		{ id: 'b2', name: 'Bacon', priceAddition: 400 },
		{ id: 'b3', name: 'Blend extra 120g', priceAddition: 800 }
	]
};

export const comboDrink: OptionGroup = {
	id: 'combo-drink',
	name: 'Bebida (Obrigatório)',
	min: 1,
	max: 1,
	options: [
		{ id: 'cd1', name: 'Coca-Cola Lata 350ml', priceAddition: 0 },
		{ id: 'cd2', name: 'Guaraná Antarctica 350ml', priceAddition: 0 },
		{ id: 'cd3', name: 'Suco Natural', priceAddition: 100 }
	]
};

export const products: Product[] = [
	// Burgers
	{
		id: '1',
		categoryId: 'Burgers',
		name: 'Burger Clássico',
		description: 'Blend artesanal de 150g, queijo prato derretido e molho especial no pão brioche.',
		imageUrl: imgBurger,
		basePrice: 2800,
		available: true,
		optionGroups: [addOnsBurger]
	},
	{
		id: '2',
		categoryId: 'Burgers',
		name: 'Double Cheese',
		description: 'Dois blends de 120g, muito queijo cheddar derretido e maionese da casa.',
		imageUrl: imgBurger,
		basePrice: 3400,
		available: true,
		optionGroups: [addOnsBurger]
	},
	{
		id: '3',
		categoryId: 'Burgers',
		name: 'Smash Bacon',
		description: 'Dois smash de 90g, cheddar, bacon crocante e cebola caramelizada.',
		imageUrl: imgBurger,
		basePrice: 3200,
		available: true,
		optionGroups: [addOnsBurger]
	},
	{
		id: '4',
		categoryId: 'Burgers',
		name: 'Chicken Crispy',
		description: 'Filé de frango empanado, alface, tomate e maionese de ervas.',
		imageUrl: imgBurger,
		basePrice: 2700,
		available: false,
		optionGroups: [addOnsBurger]
	},

	// Combos
	{
		id: '5',
		categoryId: 'Combos',
		name: 'Combo Clássico',
		description: 'Burger Clássico, batata frita individual e bebida.',
		imageUrl: imgCombo,
		basePrice: 3900,
		available: true,
		optionGroups: [comboDrink]
	},
	{
		id: '6',
		categoryId: 'Combos',
		name: 'Combo Double Cheese',
		description: 'Double Cheese, batata frita individual e bebida.',
		imageUrl: imgCombo,
		basePrice: 4500,
		available: true,
		optionGroups: [comboDrink]
	},

	// Porções
	{
		id: '7',
		categoryId: 'Porções',
		name: 'Batata Frita Simples',
		description: 'Batata palito frita na hora.',
		imageUrl: imgFritas,
		basePrice: 1500,
		available: true
	},
	{
		id: '8',
		categoryId: 'Porções',
		name: 'Batata com Cheddar e Bacon',
		description: 'Porção caprichada.',
		imageUrl: imgFritas,
		basePrice: 2200,
		available: true
	},

	// Bebidas
	{
		id: '9',
		categoryId: 'Bebidas',
		name: 'Coca-Cola Lata 350ml',
		description: 'Gelada.',
		imageUrl: imgRefri,
		basePrice: 600,
		available: true
	},
	{
		id: '10',
		categoryId: 'Bebidas',
		name: 'Guaraná Antarctica 350ml',
		description: 'Gelado.',
		imageUrl: imgRefri,
		basePrice: 600,
		available: true
	},
	{
		id: '11',
		categoryId: 'Bebidas',
		name: 'Coca-Cola 2 Litros',
		description: 'Para a família.',
		imageUrl: imgRefri,
		basePrice: 1400,
		available: true
	},
	{
		id: '12',
		categoryId: 'Bebidas',
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

	// Sobremesas
	{
		id: '13',
		categoryId: 'Sobremesas',
		name: 'Brownie com Calda',
		description: 'Brownie de chocolate meio amargo com calda quente.',
		imageUrl: imgBrownie,
		basePrice: 1200,
		available: true
	},
	{
		id: '14',
		categoryId: 'Sobremesas',
		name: 'Milkshake',
		description: 'Cremoso, feito com sorvete de verdade.',
		imageUrl: imgMilkshake,
		basePrice: 1600,
		available: true,
		optionGroups: [
			{
				id: 'm1',
				name: 'Sabor',
				min: 1,
				max: 1,
				options: [
					{ id: 'ms1', name: 'Chocolate', priceAddition: 0 },
					{ id: 'ms2', name: 'Morango', priceAddition: 0 },
					{ id: 'ms3', name: 'Oreo', priceAddition: 200 }
				]
			}
		]
	}
];
