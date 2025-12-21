/** @format */

// app/dashboard/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { adminService, orderService } from '@/lib/api/services';
import { DashboardStats } from '@/components/dashboard/stats';
import { RecentOrders } from '@/components/dashboard/recent-orders';
import { TopProducts } from '@/components/dashboard/top-products';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';

export default function DashboardPage() {
	const { data: stats } = useQuery({
		queryKey: ['dashboard-stats'],
		queryFn: () => adminService.getDashboardStats(),
	});

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
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between pb-2'>
						<CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
						<DollarSign className='w-4 h-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							${stats?.data?.todayRevenue?.toFixed(2) || '0.00'}
						</div>
						<p className='text-xs text-muted-foreground'>+20% from yesterday</p>
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
							{stats?.data?.todayOrders || 0}
						</div>
						<p className='text-xs text-muted-foreground'>+10% from yesterday</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between pb-2'>
						<CardTitle className='text-sm font-medium'>Active Staff</CardTitle>
						<Users className='w-4 h-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{stats?.data?.activeUsers || 0}
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
							{stats?.data?.lowStockItems || 0}
						</div>
						<p className='text-xs text-muted-foreground'>Needs attention</p>
					</CardContent>
				</Card>
			</div>

			{/* Charts & Tables */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<SalesChart />
				<TopProducts />
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<RecentOrders orders={recentOrders?.data} />

				<Card className='lg:col-span-2'>
					<CardHeader>
						<CardTitle>Daily Sales Overview</CardTitle>
					</CardHeader>
					<CardContent>
						<DashboardStats />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
