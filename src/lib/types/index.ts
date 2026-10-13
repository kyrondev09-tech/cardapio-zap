export interface OpeningHours {
	open: string;
	close: string;
}

export interface Config {
	companyName: string;
	slogan: string;
	description: string;
	whatsapp: string; // Apenas números, com DDI
	address: string;
	instagram: string;
	currency: string;
	locale: string;
	timezone: string;
	deliveryFee: number; // Em centavos
	minDeliveryValue: number; // Em centavos
	prepTime: number; // Em minutos
	openingHours: Record<number, OpeningHours>; // 0 = Domingo
	paymentMethods: string[];
	maxItemQty: number;
}

export interface Option {
	id: string;
	name: string;
	priceAddition: number; // Em centavos
}

export interface OptionGroup {
	id: string;
	name: string;
	min: number;
	max: number;
	options: Option[];
}

export interface Product {
	id: string;
	categoryId: string;
	name: string;
	description: string;
	imageUrl: string;
	basePrice: number; // Em centavos
	available: boolean;
	optionGroups?: OptionGroup[];
}

export interface SelectedOption {
	groupId: string;
	groupName: string;
	optionId: string;
	optionName: string;
	priceAddition: number;
}

export interface CartItem {
	id: string; // ID único no carrinho (produto + opções + observação)
	productId: string;
	name: string;
	basePrice: number;
	quantity: number;
	selectedOptions: SelectedOption[];
	observation: string;
}

export interface CustomerData {
	name: string;
	phone: string;
	street: string;
	number: string;
	neighborhood: string;
	complement: string;
	reference: string;
	paymentMethod: string;
	changeFor: string;
	generalObservation: string;
}

export interface StoredCartData {
	cart: CartItem[];
	isDelivery?: boolean;
}

export interface ProductModalConfirmData {
	selections: SelectedOption[];
	observation: string;
	quantity: number;
}
