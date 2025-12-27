/** @format */

// components/dashboard/recent-orders.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';
import { Order } from '@/types';

interface RecentOrdersProps {
	orders?: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
	

	const displayOrders = orders ;
	

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
					{displayOrders?.map((order) => (
						<div
							key={order.orderNumber}
							className='flex items-center justify-between py-2'>
							<div>
								<p className='font-medium'>{order.orderNumber}</p>
								<p className='text-sm text-muted-foreground'>
									{order?.customerName}
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
