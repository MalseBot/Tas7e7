/** @format */

// components/dashboard/top-products.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TopProducts() {
	const topProducts = [
		{ name: 'Espresso', sales: 124, revenue: 434.0 },
		{ name: 'Cappuccino', sales: 98, revenue: 465.5 },
		{ name: 'Croissant', sales: 76, revenue: 323.0 },
		{ name: 'Club Sandwich', sales: 65, revenue: 942.5 },
		{ name: 'Green Tea', sales: 54, revenue: 162.0 },
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Top Selling Products</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{topProducts.map((product, index) => (
						<div
							key={product.name}
							className='flex items-center'>
							<div className='w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg mr-3'>
								<span className='font-bold text-primary'>{index + 1}</span>
							</div>
							<div className='flex-1'>
								<p className='font-medium'>{product.name}</p>
								<p className='text-sm text-muted-foreground'>
									{product.sales} sold
								</p>
							</div>
							<div className='text-right'>
								<p className='font-semibold'>${product.revenue.toFixed(2)}</p>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
