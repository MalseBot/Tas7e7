/** @format */

// components/dashboard/sales-chart.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminService } from '@/lib/api/services';
import { useQuery } from '@tanstack/react-query';
import { parse, format } from 'date-fns';

interface salesData {
	averageOrderValue: number;
	totalOrders: number;
	totalRevenue: number;
	_id: { day: number; month: number; year: number };
}
export function SalesChart() {
	const {
		data: stats,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['sales-report'],
		queryFn: () => adminService.getSalesReport(),
	});
	// This is a simple placeholder chart
 console.log(stats);
 
	if (isLoading) {
		return <div>Loading sales data...</div>;
	}
	if (error) {
		return <div>Error loading sales data: {error.message}</div>;
	}
	const salesData = stats?.data.data;
	const maxSales = Math.max(...salesData.map((e:salesData) => e.totalRevenue));
	console.log(maxSales);
	return (
		<Card>
			<CardHeader>
				<CardTitle>Weekly Sales</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='h-64 flex items-end justify-between gap-2'>
					 {salesData.map((data:salesData) => {
						const height = (data.totalOrders / maxSales)  * 100;						
						const dateString = `${data._id.day}/${data._id.month}/${data._id.year}`;
						const date = parse(dateString, 'dd/MM/yyyy', new Date());
						const dayName = format(date, 'EEEE');
						return (
							<div
								key={dayName}
								className='flex flex-col items-center flex-1'>
								<div className='relative w-full bg-primary/20 rounded-t-lg transition-all h-40 hover:bg-primary/30'>
									<div
										className='absolute bottom-0 w-full bg-primary rounded-t-lg transition-all group-hover:bg-primary/90'
										style={{
											height: `${height}%`,
											minHeight: '1px', 
										}}
									/>
								</div>
								<span className='mt-2 text-sm font-medium'>{dayName}</span>
								<span className='text-xs text-muted-foreground'>
									${data.totalRevenue}
								</span>
								<span className='text-xs text-gray-500 mt-1'>
									{data.totalOrders} orders
								</span>
							</div>
						);
					})} 
				</div>
			</CardContent>
		</Card>
	);
}
