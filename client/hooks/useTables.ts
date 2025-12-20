/** @format */

// hooks/useTables.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useTables = () => {
	return useQuery({
		queryKey: ['tables'],
		queryFn: () => api.get('/tables').then((res) => res.data.data),
		refetchInterval: 5000, // Refetch every 5 seconds
	});
};

export const useTable = (tableId?: string) => {
	return useQuery({
		queryKey: ['table', tableId],
		queryFn: () => api.get(`/tables/${tableId}`).then((res) => res.data.data),
		enabled: !!tableId,
	});
};

export const useUpdateTableStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: string }) =>
			api.put(`/tables/${id}/status`, { status }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tables'] });
		},
	});
};

export const useCreateTable = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tableData: any) => api.post('/tables', tableData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tables'] });
		},
	});
};
