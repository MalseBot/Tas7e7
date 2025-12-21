/** @format */

// components/dashboard/sales-chart.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SalesChart() {
	// This is a simple placeholder chart
	const salesData = [
		{ day: 'Mon', sales: 420 },
		{ day: 'Tue', sales: 580 },
		{ day: 'Wed', sales: 510 },
		{ day: 'Thu', sales: 690 },
		{ day: 'Fri', sales: 920 },
		{ day: 'Sat', sales: 1050 },
		{ day: 'Sun', sales: 870 },
	];

	const maxSales = Math.max(...salesData.map((d) => d.sales));

	return (
		<Card>
			<CardHeader>
				<CardTitle>Weekly Sales</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='h-64 flex items-end justify-between gap-2'>
					{salesData.map((data) => {
						const height = (data.sales / maxSales) * 100;
						return (
							<div
								key={data.day}
								className='flex flex-col items-center flex-1'>
								<div
									className='w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/30'
									style={{ height: `${height}%` }}>
									<div
										className='bg-primary rounded-t-lg'
										style={{ height: '70%' }}
									/>
								</div>
								<span className='mt-2 text-sm font-medium'>{data.day}</span>
								<span className='text-xs text-muted-foreground'>
									${data.sales}
								</span>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
