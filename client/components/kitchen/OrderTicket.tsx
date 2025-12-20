/** @format */

// components/kitchen/OrderTicket.tsx
'use client';

import { Clock, Utensils, User, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatDate, getStatusColor } from '@/lib/utils';

interface OrderTicketProps {
	order: any;
	onStartPreparation?: () => void;
	onMarkAsReady?: () => void;
	isPreparing?: boolean;
}

export default function OrderTicket({
	order,
	onStartPreparation,
	onMarkAsReady,
	isPreparing = false,
}: OrderTicketProps) {
	const preparationTime =
		order.items?.reduce((total: number, item: any) => {
			return total + (item.menuItem?.preparationTime || 10) * item.quantity;
		}, 0) || 15;

	const estimatedTime = new Date(order.createdAt);
	estimatedTime.setMinutes(estimatedTime.getMinutes() + preparationTime);

	const isUrgent = new Date(estimatedTime) < new Date(Date.now() + 5 * 60000); // Less than 5 minutes

	return (
		<div
			className={cn(
				'kitchen-ticket relative overflow-hidden',
				isUrgent && 'border-l-4 border-destructive'
			)}>
			{isUrgent && (
				<div className='absolute top-2 right-2'>
					<AlertCircle className='h-5 w-5 text-destructive animate-pulse' />
				</div>
			)}

			{/* Ticket Header */}
			<div className='flex items-start justify-between mb-4'>
				<div>
					<div className='flex items-center gap-2 mb-1'>
						<Badge
							variant='outline'
							className={getStatusColor(order.status)}>
							{order.status.toUpperCase()}
						</Badge>
						<span className='text-sm text-muted-foreground'>
							#{order.orderNumber}
						</span>
					</div>
					<h3 className='text-lg font-semibold text-foreground'>
						Table {order.tableNumber}
					</h3>
				</div>

				<div className='text-right'>
					<div className='text-xs text-muted-foreground'>
						{formatDate(order.createdAt)}
					</div>
					<div className='flex items-center gap-1 text-sm text-muted-foreground mt-1'>
						<Clock className='h-3 w-3' />
						<span>{preparationTime} min</span>
					</div>
				</div>
			</div>

			{/* Customer Info */}
			{(order.customerName || order.orderType !== 'dine-in') && (
				<div className='flex items-center gap-4 text-sm mb-4'>
					{order.customerName && (
						<div className='flex items-center gap-1'>
							<User className='h-3 w-3' />
							<span>{order.customerName}</span>
						</div>
					)}
					<div className='flex items-center gap-1'>
						<MapPin className='h-3 w-3' />
						<span className='capitalize'>{order.orderType}</span>
					</div>
				</div>
			)}

			{/* Order Items */}
			<div className='space-y-2 mb-4'>
				<h4 className='font-medium text-sm text-muted-foreground flex items-center gap-2'>
					<Utensils className='h-3 w-3' />
					Items
				</h4>
				<div className='space-y-1'>
					{order.items?.slice(0, 3).map((item: any, index: number) => (
						<div
							key={index}
							className='flex justify-between text-sm'>
							<div className='flex items-center gap-2'>
								<span className='font-medium'>{item.quantity}x</span>
								<span>{item.name}</span>
							</div>
							{item.specialInstructions && (
								<span className='text-xs text-muted-foreground italic'>
									Note
								</span>
							)}
						</div>
					))}
					{order.items && order.items.length > 3 && (
						<div className='text-xs text-muted-foreground'>
							+{order.items.length - 3} more items
						</div>
					)}
				</div>
			</div>

			{/* Kitchen Notes */}
			{order.kitchenNotes && (
				<div className='mb-4 p-2 bg-muted rounded text-sm'>
					<div className='font-medium text-muted-foreground mb-1'>Notes:</div>
					<div className='text-foreground'>{order.kitchenNotes}</div>
				</div>
			)}

			{/* Timer & Actions */}
			<div className='flex items-center justify-between pt-4 border-t'>
				<div className='text-sm'>
					<div className='text-muted-foreground'>Est. Ready</div>
					<div className='font-medium'>
						{estimatedTime.toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit',
						})}
					</div>
				</div>

				<div className='flex gap-2'>
					{!isPreparing ? (
						<Button
							size='sm'
							onClick={onStartPreparation}
							className='bg-gradient-café hover:opacity-90'>
							Start Prep
						</Button>
					) : (
						<Button
							size='sm'
							variant='destructive'
							onClick={onMarkAsReady}>
							Mark Ready
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
