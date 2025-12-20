/** @format */

// hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useOrder = (orderId?: string) => {
	return useQuery({
		queryKey: ['order', orderId],
		queryFn: () => api.get(`/orders/${orderId}`).then((res) => res.data.data),
		enabled: !!orderId,
	});
};

export const useOrders = (params?: {
	status?: string;
	startDate?: string;
	endDate?: string;
	page?: number;
	limit?: number;
}) => {
	return useQuery({
		queryKey: ['orders', params],
		queryFn: () => api.get('/orders', { params }).then((res) => res.data),
	});
};

export const useCreateOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (orderData: any) => api.post('/orders', orderData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
	});
};

export const useUpdateOrderStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
			api.put(`/orders/${orderId}/status`, { status }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
	});
};
