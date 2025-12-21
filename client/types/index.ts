/** @format */

// types/index.ts
export interface User {
	_id: string;
	name: string;
	email: string;
	role: 'admin' | 'manager' | 'cashier' | 'cook';
	isActive: boolean;
	lastLogin?: Date;
}

export interface MenuItem {
	_id: string;
	name: string;
	description: string;
	price: number;
	cost: number;
	category: string;
	subCategory?: string;
	isAvailable: boolean;
	preparationTime: number;
	stock: number;
	tags: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface OrderItem {
	menuItem: string;
	name: string;
	price: number;
	quantity: number;
	specialInstructions?: string;
	modifiers?: Array<{
		name: string;
		option: string;
		price: number;
	}>;
	variant?: {
		name: string;
		price: number;
	};
}

export interface Order {
	_id: string;
	orderNumber: string;
	items: OrderItem[];
	tableNumber: string;
	customerName: string;
	orderType: 'dine-in' | 'takeaway' | 'delivery';
	status:
		| 'pending'
		| 'confirmed'
		| 'preparing'
		| 'ready'
		| 'served'
		| 'paid'
		| 'cancelled';
	subTotal: number;
	tax: number;
	tip: number;
	discount: number;
	total: number;
	paymentMethod: 'cash' | 'card' | 'mobile' | 'none';
	paymentStatus: 'pending' | 'paid' | 'refunded';
	cashier: User;
	kitchenNotes?: string;
	estimatedReadyTime?: Date;
	actualReadyTime?: Date;
	servedTime?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface Table {
	_id: string;
	tableNumber: string;
	capacity: number;
	status: 'available' | 'occupied' | 'reserved' | 'cleaning';
	currentOrder?: string;
	location: 'indoors' | 'outdoors' | 'bar' | 'private';
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
}
