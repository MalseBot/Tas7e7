/** @format */

// app/dashboard/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { adminService, orderService } from '@/lib/api/services';
import { RecentOrders } from '@/components/dashboard/recent-orders';
import { TopProducts, topSales } from '@/components/dashboard/top-products';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { getDate } from 'date-fns';

export default function DashboardPage() {
const dayOfMonth = getDate(new Date()); // Returns 26 (if today is the 26th)
	const { data: stats,isSuccess } = useQuery({
		queryKey: ['dashboard-stats'],
		queryFn: () => adminService.getDashboardStats(),
	});
	console.log(stats);
	
	
	const { data: recentOrders } = useQuery({
		queryKey: ['recent-orders'],
		queryFn: () => orderService.getOrders({ limit: 5 }),
	});
	
	
	return (
		<div className='space-y-6'>
			{/* Header */}
			<div>
				<h1 className='text-3xl font-bold text-foreground'>Dashboard</h1>
				<p className='text-muted-foreground'>
					Welcome back! Here's what's happening today.
				</p>
			</div>

			{/* Stats Grid */}
			{isSuccess && (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between pb-2'>
							<CardTitle className='text-sm font-medium'>
								Total Revenue
							</CardTitle>
							<DollarSign className='w-4 h-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								${stats.data.data.totalRevenue}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='flex flex-row items-center justify-between pb-2'>
							<CardTitle className='text-sm font-medium'>
								Today's Orders
							</CardTitle>
							<ShoppingCart className='w-4 h-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								{stats.data.data.todayOrders || 0}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='flex flex-row items-center justify-between pb-2'>
							<CardTitle className='text-sm font-medium'>
								Active Staff
							</CardTitle>
							<Users className='w-4 h-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								{stats.data.data.activeUsers || 0}
							</div>
							<p className='text-xs text-muted-foreground'>Currently working</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='flex flex-row items-center justify-between pb-2'>
							<CardTitle className='text-sm font-medium'>
								Low Stock Items
							</CardTitle>
							<Package className='w-4 h-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								{stats.data.data.lowStockItems || 0}
							</div>
							<p className='text-xs text-muted-foreground'>Needs attention</p>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Charts & Tables */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<SalesChart />
				<TopProducts />
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<RecentOrders orders={recentOrders?.data.data} />

				<Card className='lg:col-span-2'>
					<CardHeader>
						<CardTitle>Daily Sales Overview</CardTitle>
					</CardHeader>
				</Card>
			</div>
		</div>
	);
}
