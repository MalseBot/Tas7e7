/** @format */

// components/kitchen/KitchenStats.tsx
'use client';

import { Clock, ChefHat, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useOrders } from '@/hooks/useOrders';

export default function KitchenStats() {
	const { data: ordersResponse } = useOrders();
	const orders = ordersResponse?.data || [];

	const stats = {
		pending: orders.filter((o: any) => o.status === 'pending').length,
		preparing: orders.filter((o: any) => o.status === 'preparing').length,
		ready: orders.filter((o: any) => o.status === 'ready').length,
		late: orders.filter((o: any) => {
			const created = new Date(o.createdAt);
			const now = new Date();
			const diffMinutes = (now.getTime() - created.getTime()) / (1000 * 60);
			return (
				diffMinutes > 20 &&
				['pending', 'confirmed', 'preparing'].includes(o.status)
			);
		}).length,
	};

	const statItems = [
		{
			label: 'Pending',
			value: stats.pending,
			icon: Clock,
			color: 'text-yellow-600',
			bgColor: 'bg-yellow-100',
		},
		{
			label: 'Preparing',
			value: stats.preparing,
			icon: ChefHat,
			color: 'text-orange-600',
			bgColor: 'bg-orange-100',
		},
		{
			label: 'Ready',
			value: stats.ready,
			icon: CheckCircle,
			color: 'text-green-600',
			bgColor: 'bg-green-100',
		},
		{
			label: 'Late',
			value: stats.late,
			icon: AlertTriangle,
			color: 'text-red-600',
			bgColor: 'bg-red-100',
		},
	];

	return (
		<div className='flex items-center gap-4'>
			{statItems.map((stat, index) => (
				<Card
					key={index}
					className='min-w-[100px]'>
					<CardContent className='p-4'>
						<div className='flex items-center gap-3'>
							<div className={`p-2 rounded-full ${stat.bgColor}`}>
								<stat.icon className={`h-4 w-4 ${stat.color}`} />
							</div>
							<div>
								<div className='text-2xl font-bold'>{stat.value}</div>
								<div className='text-xs text-muted-foreground'>
									{stat.label}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
