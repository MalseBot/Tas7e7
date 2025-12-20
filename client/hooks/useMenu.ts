/** @format */

// hooks/useMenu.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useMenu = (category?: string) => {
	return useQuery({
		queryKey: ['menu', category],
		queryFn: () =>
			api.get('/menu', { params: { category } }).then((res) => res.data),
	});
};

export const useMenuItem = (itemId?: string) => {
	return useQuery({
		queryKey: ['menu-item', itemId],
		queryFn: () => api.get(`/menu/${itemId}`).then((res) => res.data.data),
		enabled: !!itemId,
	});
};

export const useCreateMenuItem = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (itemData: any) => api.post('/menu', itemData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['menu'] });
		},
	});
};

export const useUpdateMenuItem = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: any }) =>
			api.put(`/menu/${id}`, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['menu'] });
		},
	});
};

export const useToggleMenuItemAvailability = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => api.put(`/menu/${id}/availability`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['menu'] });
		},
	});
};
