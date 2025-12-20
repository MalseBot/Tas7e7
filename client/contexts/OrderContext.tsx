/** @format */

// contexts/OrderContext.tsx
'use client';

import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from 'react';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

interface OrderItem {
	menuItem: string;
	name: string;
	price: number;
	quantity: number;
	specialInstructions?: string;
}

interface Order {
	_id: string;
	orderNumber: string;
	items: OrderItem[];
	tableNumber: string;
	customerName: string;
	status:
		| 'pending'
		| 'confirmed'
		| 'preparing'
		| 'ready'
		| 'served'
		| 'paid'
		| 'cancelled';
	total: number;
	createdAt: string;
}

interface OrderContextType {
	orders: Order[];
	activeOrders: Order[];
	completedOrders: Order[];
	isLoading: boolean;
	createOrder: (orderData: any) => Promise<Order>;
	updateOrderStatus: (
		orderId: string,
		status: Order['status']
	) => Promise<void>;
	getOrder: (orderId: string) => Promise<Order>;
	refetchOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
	const [orders, setOrders] = useState<Order[]>([]);

	const { data, isLoading, refetch } = useQuery({
		queryKey: ['orders'],
		queryFn: () => api.get('/orders').then((res) => res.data.data),
		refetchInterval: 10000, // Refetch every 10 seconds
	});

	useEffect(() => {
		if (data) {
			setOrders(data);
		}
	}, [data]);

	const activeOrders = orders.filter((order) =>
		['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
	);

	const completedOrders = orders.filter((order) =>
		['served', 'paid', 'cancelled'].includes(order.status)
	);

	const createOrder = async (orderData: any): Promise<Order> => {
		const response = await api.post('/orders', orderData);
		return response.data.data;
	};

	const updateOrderStatus = async (
		orderId: string,
		status: Order['status']
	) => {
		await api.put(`/orders/${orderId}/status`, { status });
		refetch();
	};

	const getOrder = async (orderId: string): Promise<Order> => {
		const response = await api.get(`/orders/${orderId}`);
		return response.data.data;
	};

	return (
		<OrderContext.Provider
			value={{
				orders,
				activeOrders,
				completedOrders,
				isLoading,
				createOrder,
				updateOrderStatus,
				getOrder,
				refetchOrders: refetch,
			}}>
			{children}
		</OrderContext.Provider>
	);
}

export const useOrders = () => {
	const context = useContext(OrderContext);
	if (!context) {
		throw new Error('useOrders must be used within OrderProvider');
	}
	return context;
};
