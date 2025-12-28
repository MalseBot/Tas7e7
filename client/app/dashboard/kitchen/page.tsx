/** @format */

// app/dashboard/kitchen/page.tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kitchenService } from '@/lib/api/services';
import { KitchenOrderCard } from '@/components/kitchen/order-card';
import { Clock, ChefHat, CheckCircle, AlertCircle } from 'lucide-react';

export default function KitchenPage() {
	const queryClient = useQueryClient();

	const { data: orders, isLoading } = useQuery({
		queryKey: ['kitchen-orders'],
		queryFn: () => kitchenService.getKitchenOrders(),
		refetchInterval: 5000, // Auto-refresh every 5 seconds
	});

	console.log(orders);
	

	const startPrepMutation = useMutation({
		mutationFn: (orderId: string) => kitchenService.startPreparation(orderId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
		},
	});

	const markReadyMutation = useMutation({
		mutationFn: (orderId:string) => kitchenService.markAsReady(orderId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
		},
	});

	const pendingOrders = orders?.data?.data?.pending
	const preparingOrders = orders?.data?.data?.preparing

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='bg-card rounded-xl border border-border p-6'>
				<div className='flex items-center justify-between'>
					<div>
						<h1 className='text-2xl font-bold text-foreground flex items-center gap-2'>
							<ChefHat className='w-6 h-6' />
							Kitchen Display
						</h1>
						<p className='text-muted-foreground'>Real-time order tracking</p>
					</div>
					<div className='flex items-center gap-4'>
						<div className='flex items-center gap-2'>
							<Clock className='w-5 h-5 text-muted-foreground' />
							<span className='text-foreground font-medium'>
								{new Date().toLocaleTimeString()}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Stats */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
					<div className='flex items-center gap-2 mb-2'>
						<AlertCircle className='w-5 h-5 text-yellow-600' />
						<h3 className='font-medium text-yellow-900'>Pending</h3>
					</div>
					<p className='text-2xl font-bold text-yellow-900'>
						{pendingOrders?.length || 0}
					</p>
				</div>
				<div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
					<div className='flex items-center gap-2 mb-2'>
						<Clock className='w-5 h-5 text-blue-600' />
						<h3 className='font-medium text-blue-900'>Preparing</h3>
					</div>
					<p className='text-2xl font-bold text-blue-900'>
						{preparingOrders?.length || 0}
					</p>
				</div>
				<div className='bg-green-50 border border-green-200 rounded-lg p-4'>
					<div className='flex items-center gap-2 mb-2'>
						<CheckCircle className='w-5 h-5 text-green-600' />
						<h3 className='font-medium text-green-900'>Ready</h3>
					</div>
					<p className='text-2xl font-bold text-green-900'>
						{orders?.data?.data?.ready.length || 0}
					</p>
				</div>
			</div>

			{/* Orders Grid */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Pending Orders */}
				<div>
					<h2 className='text-lg font-semibold text-foreground mb-4 flex items-center gap-2'>
						<AlertCircle className='w-5 h-5 text-yellow-600' />
						New Orders
					</h2>
					<div className='space-y-4'>
						{pendingOrders?.map((order: any) => (
							<KitchenOrderCard
								key={order._id}
								order={order}
								onStartPrep={() => startPrepMutation.mutate(order._id)}
								onMarkReady={()=>{}}
								isLoading={
									startPrepMutation.variables === order._id &&
									startPrepMutation.isPending
								}
							/>
						))}
						{pendingOrders?.length === 0 && (
							<div className='text-center py-8 text-muted-foreground'>
								No pending orders
							</div>
						)}
					</div>
				</div>

				{/* Preparing Orders */}
				<div>
					<h2 className='text-lg font-semibold text-foreground mb-4 flex items-center gap-2'>
						<Clock className='w-5 h-5 text-blue-600' />
						In Progress
					</h2>
					<div className='space-y-4'>
						{preparingOrders?.map((order: any) => (
							<KitchenOrderCard
								key={order._id}
								order={order}
								onMarkReady={() => markReadyMutation.mutate(order._id)}
								onStartPrep={()=>{}}
								isLoading={
									markReadyMutation.variables === order._id &&
									markReadyMutation.isPending
								}
							/>
						))}
						{preparingOrders?.length === 0 && (
							<div className='text-center py-8 text-muted-foreground'>
								No orders in progress
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
