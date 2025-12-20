/** @format */

// types/index.ts
export interface Product {
	id: string;
	name: string;
	price: number;
	category: string;
	stock: number;
	barcode: string;
}

export interface CartItem extends Product {
	quantity: number;
}

export interface Sale {
	id: string;
	items: CartItem[];
	subtotal: number;
	tax: number;
	discount: number;
	total: number;
	paymentMethod: 'cash' | 'card' | 'mobile';
	cashier: string;
	timestamp: Date;
}

export interface AppState {
	products: Product[];
	sales: Sale[];
}
