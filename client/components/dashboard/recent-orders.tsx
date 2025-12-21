/** @format */

// components/dashboard/recent-orders.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';

interface RecentOrdersProps {
	orders?: any[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
	// Sample data if no orders from API
	const sampleOrders = [
		{
			orderNumber: 'ORD-123456',
			customer: 'John Doe',
			total: 32.5,
			status: 'paid',
			time: '10:30 AM',
		},
		{
			orderNumber: 'ORD-123455',
			customer: 'Jane Smith',
			total: 45.75,
			status: 'preparing',
			time: '10:15 AM',
		},
		{
			orderNumber: 'ORD-123454',
			customer: 'Bob Johnson',
			total: 18.25,
			status: 'pending',
			time: '10:00 AM',
		},
		{
			orderNumber: 'ORD-123453',
			customer: 'Alice Brown',
			total: 67.8,
			status: 'ready',
			time: '9:45 AM',
		},
		{
			orderNumber: 'ORD-123452',
			customer: 'Charlie Wilson',
			total: 28.95,
			status: 'paid',
			time: '9:30 AM',
		},
	];

	const displayOrders = orders || sampleOrders;

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'paid':
				return 'default';
			case 'preparing':
				return 'secondary';
			case 'pending':
				return 'destructive';
			case 'ready':
				return 'outline';
			default:
				return 'default';
		}
	};

	return (
		<Card>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<CardTitle>Recent Orders</CardTitle>
					<ArrowUpRight className='w-5 h-5 text-muted-foreground' />
				</div>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{displayOrders.slice(0, 5).map((order) => (
						<div
							key={order.orderNumber}
							className='flex items-center justify-between py-2'>
							<div>
								<p className='font-medium'>{order.orderNumber}</p>
								<p className='text-sm text-muted-foreground'>
									{order.customer}
								</p>
							</div>
							<div className='text-right'>
								<p className='font-semibold'>${order.total?.toFixed(2)}</p>
								<Badge
									variant={getStatusColor(order.status)}
									className='mt-1'>
									{order.status}
								</Badge>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
