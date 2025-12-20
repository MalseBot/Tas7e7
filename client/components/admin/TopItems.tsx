/** @format */

// components/admin/TopItems.tsx
'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { useMenu } from '@/hooks/useMenu';
import { cn } from '@/lib/utils';

interface TopItemsProps {
	limit?: number;
}

export default function TopItems({ limit = 10 }: TopItemsProps) {
	const { data: menuResponse } = useMenu();
	const menuItems = menuResponse?.data?.flat || [];

	// Mock sales data (in a real app, this would come from your API)
	const topItems = [
		{ id: 1, name: 'Espresso', sales: 142, change: +12, revenue: 497 },
		{ id: 2, name: 'Cappuccino', sales: 118, change: +8, revenue: 560.5 },
		{ id: 3, name: 'Avocado Toast', sales: 89, change: +24, revenue: 1156.11 },
		{ id: 4, name: 'Croissant', sales: 76, change: -3, revenue: 323 },
		{ id: 5, name: 'Club Sandwich', sales: 64, change: +15, revenue: 928 },
	].slice(0, limit);

	return (
		<div className='space-y-3'>
			{topItems.map((item, index) => (
				<div
					key={item.id}
					className='flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors'>
					<div className='flex items-center gap-3'>
						<div
							className={cn(
								'w-8 h-8 rounded-full flex items-center justify-center text-white font-medium',
								index === 0 && 'bg-gradient-café',
								index === 1 && 'bg-secondary',
								index === 2 && 'bg-primary',
								index > 2 && 'bg-muted-foreground/20'
							)}>
							{index + 1}
						</div>
						<div>
							<div className='font-medium'>{item.name}</div>
							<div className='text-xs text-muted-foreground'>
								${item.revenue} revenue
							</div>
						</div>
					</div>

					<div className='text-right'>
						<div className='font-medium'>{item.sales} sold</div>
						<div
							className={cn(
								'text-xs flex items-center justify-end gap-1',
								item.change >= 0 ? 'text-green-600' : 'text-red-600'
							)}>
							{item.change >= 0 ? (
								<TrendingUp className='h-3 w-3' />
							) : (
								<TrendingDown className='h-3 w-3' />
							)}
							{Math.abs(item.change)}%
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
