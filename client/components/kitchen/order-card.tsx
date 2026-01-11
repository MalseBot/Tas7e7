/** @format */

// components/kitchen/order-card.tsx
'use client';

import {
	Clock,
	CheckCircle,
	AlertCircle,
	ChefHat,
	Printer,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface KitchenOrderCardProps {
	order: any;
	onStartPrep: () => void;
	onMarkReady: () => void;
	onPrint?: () => void;
	isLoading: boolean;
	isPrinting?: boolean;
}

export function KitchenOrderCard({
	order,
	onStartPrep,
	onMarkReady,
	onPrint,
	isLoading,
	isPrinting,
}: KitchenOrderCardProps) {
	const { t } = useTranslation();
	const preparationTime = order.items.reduce((total: number, item: any) => {
		return total + (item.menuItem?.preparationTime || 10) * item.quantity;
	}, 0);

	const isPreparing = order.status === 'preparing';
	const isPending = order.status === 'pending';
	const isTakeaway =
		order.tableNumber === 'pos.takeaway' || order.tableNumber === 'Takeaway';

	const getStatusText = (status: string) => {
		switch (status) {
			case 'pending':
				return t('kitchen.pending');
			case 'preparing':
				return t('kitchen.preparing');
			case 'ready':
				return t('kitchen.ready');
			default:
				return status;
		}
	};

	return (
		<Card>
			<CardHeader className='pb-3'>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle className='text-lg'>
							{t('common.order')} #{order.orderNumber}
						</CardTitle>
						<p className='text-sm text-muted-foreground'>
							{t('orders.table')}: {isTakeaway ? t('pos.takeaway') : order.tableNumber}
						</p>
					</div>
					<Badge
						variant={
							order.status === 'pending' ? 'destructive'
							: order.status === 'preparing' ?
								'secondary'
							:	'default'
						}>
						{getStatusText(order.status)}
					</Badge>
				</div>
			</CardHeader>

			<CardContent>
				{/* Order Items */}
				<div className='space-y-2 mb-4'>
					{order.items.map((item: any, index: number) => (
						<div
							key={index}
							className='flex items-center justify-between py-2 border-b last:border-0'>
							<div>
								<p className='font-medium'>{item.name}</p>
								<p className='text-sm text-muted-foreground'>
									{t('common.quantity')}: {item.quantity}
								</p>
							</div>
							<div className='flex items-center gap-2'>
								<Clock className='w-4 h-4 text-muted-foreground' />
								<span className='text-sm'>
									{item.menuItem?.preparationTime || 10} {t('common.min')}
								</span>
							</div>
						</div>
					))}
				</div>

				{/* Special Instructions */}
				{order.kitchenNotes && (
					<div className='mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
						<p className='text-sm text-yellow-800'>
							<AlertCircle className='w-4 h-4 inline mr-1' />
							{order.kitchenNotes}
						</p>
					</div>
				)}

				{/* Time Information */}
				<div className='flex items-center justify-between text-sm mb-4'>
					<div className='flex items-center gap-1'>
						<Clock className='w-4 h-4 text-muted-foreground' />
						<span>
							{t('common.estimated')}: {preparationTime} {t('common.min')}
						</span>
					</div>
					<div>
						{t('common.ordered')}:{' '}
						{new Date(order.createdAt).toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit',
						})}
					</div>
				</div>

				{/* Actions */}
				<div className='flex gap-2'>
					{onPrint && (
						<Button
							onClick={onPrint}
							disabled={isPrinting}
							variant='outline'
							size='sm'>
							<Printer className='w-4 h-4 mr-2' />
							{isPrinting ? t('common.printing') : t('common.printReceipt')}
						</Button>
					)}

					{isPending && (
						<Button
							onClick={onStartPrep}
							disabled={isLoading || isPrinting}
							className='flex-1'>
							<ChefHat className='w-4 h-4 mr-2' />
							{t('kitchen.startPreparation')}
						</Button>
					)}

					{isPreparing && (
						<Button
							onClick={onMarkReady}
							disabled={isLoading || isPrinting}
							className='flex-1'>
							<CheckCircle className='w-4 h-4 mr-2' />
							{t('kitchen.markReady')}
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
