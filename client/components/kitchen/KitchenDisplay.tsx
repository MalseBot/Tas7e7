/** @format */

// components/kitchen/KitchenDisplay.tsx
'use client';

import { useState } from 'react';
import { ChefHat, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { formatDate, cn } from '@/lib/utils';
import OrderTicket from './OrderTicket';
import KitchenStats from './KitchenStats';

export default function KitchenDisplay() {
	const [activeTab, setActiveTab] = useState('pending');
	const { data: ordersResponse, isLoading } = useOrders();
	const updateOrderStatus = useUpdateOrderStatus();

	const orders = ordersResponse?.data || [];

	const pendingOrders = orders.filter(
		(order: any) => order.status === 'pending' || order.status === 'confirmed'
	);

	const preparingOrders = orders.filter(
		(order: any) => order.status === 'preparing'
	);

	const handleStartPreparation = async (orderId: string) => {
		try {
			await updateOrderStatus.mutateAsync({
				orderId,
				status: 'preparing',
			});
		} catch (error) {
			console.error('Failed to start preparation:', error);
		}
	};

	const handleMarkAsReady = async (orderId: string) => {
		try {
			await updateOrderStatus.mutateAsync({
				orderId,
				status: 'ready',
			});
		} catch (error) {
			console.error('Failed to mark as ready:', error);
		}
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-foreground flex items-center gap-2'>
						<ChefHat className='text-primary' />
						Kitchen Display
					</h1>
					<p className='text-muted-foreground'>
						Real-time order tracking and preparation management
					</p>
				</div>
				<KitchenStats />
			</div>

			{/* Tabs */}
			<Tabs
				defaultValue='pending'
				onValueChange={setActiveTab}>
				<TabsList className='grid w-full md:w-auto grid-cols-3'>
					<TabsTrigger value='pending'>
						<Clock className='h-4 w-4 mr-2' />
						Pending ({pendingOrders.length})
					</TabsTrigger>
					<TabsTrigger value='preparing'>
						<ChefHat className='h-4 w-4 mr-2' />
						Preparing ({preparingOrders.length})
					</TabsTrigger>
					<TabsTrigger value='ready'>
						<CheckCircle className='h-4 w-4 mr-2' />
						Ready to Serve
					</TabsTrigger>
				</TabsList>

				<TabsContent
					value='pending'
					className='space-y-4'>
					{pendingOrders.length === 0 ? (
						<div className='text-center py-12 text-muted-foreground'>
							<Clock className='h-16 w-16 mx-auto mb-4 opacity-20' />
							<h3 className='text-lg font-medium mb-2'>No pending orders</h3>
							<p>New orders will appear here automatically</p>
						</div>
					) : (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
							{pendingOrders.map((order: any) => (
								<OrderTicket
									key={order._id}
									order={order}
									onStartPreparation={() => handleStartPreparation(order._id)}
								/>
							))}
						</div>
					)}
				</TabsContent>

				<TabsContent
					value='preparing'
					className='space-y-4'>
					{preparingOrders.length === 0 ? (
						<div className='text-center py-12 text-muted-foreground'>
							<ChefHat className='h-16 w-16 mx-auto mb-4 opacity-20' />
							<h3 className='text-lg font-medium mb-2'>
								No orders in preparation
							</h3>
							<p>Start preparing orders from the pending tab</p>
						</div>
					) : (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
							{preparingOrders.map((order: any) => (
								<OrderTicket
									key={order._id}
									order={order}
									onMarkAsReady={() => handleMarkAsReady(order._id)}
									isPreparing
								/>
							))}
						</div>
					)}
				</TabsContent>

				<TabsContent value='ready'>
					<div className='text-center py-12 text-muted-foreground'>
						<CheckCircle className='h-16 w-16 mx-auto mb-4 opacity-20' />
						<h3 className='text-lg font-medium mb-2'>
							Ready orders appear here
						</h3>
						<p>Mark orders as ready from the preparing tab</p>
					</div>
				</TabsContent>
			</Tabs>

			{/* Auto-refresh indicator */}
			<div className='text-center text-xs text-muted-foreground mt-8'>
				<div className='inline-flex items-center gap-2'>
					<div className='h-2 w-2 rounded-full bg-green-500 animate-pulse'></div>
					<span>Live updates enabled • Auto-refreshes every 10 seconds</span>
				</div>
			</div>
		</div>
	);
}
