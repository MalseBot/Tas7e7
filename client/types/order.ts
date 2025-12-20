/** @format */

// types/order.ts
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
	cashier: string;
	kitchenNotes?: string;
	estimatedReadyTime?: string;
	actualReadyTime?: string;
	servedTime?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateOrderDto {
	items: Array<{
		menuItem: string;
		quantity: number;
		specialInstructions?: string;
		modifiers?: any[];
		variant?: string;
	}>;
	tableNumber: string;
	customerName?: string;
	orderType?: 'dine-in' | 'takeaway' | 'delivery';
	kitchenNotes?: string;
}

export interface UpdateOrderStatusDto {
	status: Order['status'];
}

export interface ProcessPaymentDto {
	paymentMethod: 'cash' | 'card' | 'mobile';
	tip?: number;
	discountCode?: string;
}
