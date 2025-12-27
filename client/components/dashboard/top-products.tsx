/** @format */

// components/dashboard/top-products.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminService } from '@/lib/api/services';
import { useQuery } from '@tanstack/react-query';
export interface topSales{
itemName:string,
totalQuantity:number,
totalRevenue:number,
_id:{
	category:string,
	name:string,
	_id:string
}
}
export function TopProducts() {
	const { data: stats } = useQuery({
		queryKey: ['top-items'],
		queryFn: () => adminService.getTopItems(),
	});	


	return (
		<Card>
			<CardHeader>
				<CardTitle>Top Selling Products</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{stats?.data.data.map((product:topSales, index:number) => (
						<div
							key={product.itemName}
							className='flex items-center'>
							<div className='w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg mr-3'>
								<span className='font-bold text-primary'>{index + 1}</span>
							</div>
							<div className='flex-1'>
								<p className='font-medium'>{product.itemName}</p>
								<p className='text-sm text-muted-foreground'>
									{product.totalQuantity} sold
								</p>
							</div>
							<div className='text-right'>
								<p className='font-semibold'>${product.totalRevenue}</p>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
