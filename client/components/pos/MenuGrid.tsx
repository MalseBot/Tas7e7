/** @format */

// components/pos/MenuGrid.tsx
'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useMenu } from '@/hooks/useMenu';

interface MenuGridProps {
	selectedCategory: string;
	onItemClick: (item: any) => void;
}

export default function MenuGrid({
	selectedCategory,
	onItemClick,
}: MenuGridProps) {
	const { data: menuResponse, isLoading } = useMenu();

	if (isLoading) {
		return (
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
				{[...Array(8)].map((_, i) => (
					<div
						key={i}
						className='café-card p-4 animate-pulse'>
						<div className='h-40 bg-muted rounded-lg mb-3'></div>
						<div className='h-4 bg-muted rounded w-3/4 mb-2'></div>
						<div className='h-4 bg-muted rounded w-1/2'></div>
					</div>
				))}
			</div>
		);
	}

	const menuData = menuResponse?.data?.flat || [];
	const filteredItems =
		selectedCategory === 'all'
			? menuData
			: menuData.filter((item: any) => item.category === selectedCategory);

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
			{filteredItems.map((item: any) => (
				<button
					key={item._id}
					onClick={() => onItemClick(item)}
					disabled={!item.isAvailable}
					className={cn(
						'pos-grid-item group',
						!item.isAvailable && 'opacity-50 cursor-not-allowed'
					)}>
					{/* Item Image/Placeholder */}
					<div className='w-full h-40 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-3 flex items-center justify-center'>
						<span className='text-4xl'>
							{item.category === 'drinks'
								? '☕'
								: item.category === 'food'
								? '🍽️'
								: item.category === 'desserts'
								? '🍰'
								: '🥐'}
						</span>
					</div>

					{/* Item Info */}
					<div className='w-full text-left'>
						<div className='flex items-start justify-between mb-1'>
							<h3 className='font-medium text-foreground text-lg truncate'>
								{item.name}
							</h3>
							<Badge
								variant={item.isAvailable ? 'default' : 'destructive'}
								className='ml-2'>
								{item.isAvailable ? 'In Stock' : 'Out of Stock'}
							</Badge>
						</div>

						{item.description && (
							<p className='text-sm text-muted-foreground mb-2 line-clamp-2'>
								{item.description}
							</p>
						)}

						<div className='flex items-center justify-between'>
							<span className='text-xl font-bold text-primary'>
								${item.price.toFixed(2)}
							</span>
							<div className='flex items-center gap-2'>
								{item.preparationTime && (
									<span className='text-xs text-muted-foreground'>
										⏱️ {item.preparationTime}min
									</span>
								)}
								{item.stock > 0 && item.stock < 10 && (
									<span className='text-xs text-amber-600'>
										{item.stock} left
									</span>
								)}
							</div>
						</div>

						{/* Quick add button */}
						<div className='mt-3 opacity-0 group-hover:opacity-100 transition-opacity'>
							<div className='café-button-primary w-full py-2'>
								Add to Order
							</div>
						</div>
					</div>
				</button>
			))}
		</div>
	);
}
