/** @format */

// app/(dashboard)/page.tsx
'use client';

import { Coffee, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SalesChart from '@/components/admin/SalesChart';
import TopItems from '@/components/admin/TopItems';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
	const { user } = useAuth();

	const stats = [
		{
			title: 'Today Revenue',
			value: '$1,284.50',
			change: '+12.5%',
			icon: DollarSign,
			color: 'text-green-600',
			bgColor: 'bg-green-100',
		},
		{
			title: 'Total Orders',
			value: '142',
			change: '+8.2%',
			icon: Coffee,
			color: 'text-blue-600',
			bgColor: 'bg-blue-100',
		},
		{
			title: 'Active Tables',
			value: '18/24',
			change: '+3',
			icon: Users,
			color: 'text-purple-600',
			bgColor: 'bg-purple-100',
		},
		{
			title: 'Customer Growth',
			value: '+24.7%',
			change: '+5.3%',
			icon: TrendingUp,
			color: 'text-amber-600',
			bgColor: 'bg-amber-100',
		},
	];

	return (
		<div className='space-y-6'>
			{/* Welcome Header */}
			<div>
				<h1 className='text-3xl font-bold text-foreground'>
					Welcome back, {user?.name}!
				</h1>
				<p className='text-muted-foreground mt-2'>
					Here's what's happening with your restaurant today.
				</p>
			</div>

			{/* Stats Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				{stats.map((stat, index) => (
					<Card key={index}>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium text-muted-foreground'>
								{stat.title}
							</CardTitle>
							<div className={`p-2 rounded-full ${stat.bgColor}`}>
								<stat.icon className={`h-4 w-4 ${stat.color}`} />
							</div>
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{stat.value}</div>
							<p className='text-xs text-muted-foreground mt-1'>
								<span className='text-green-600'>{stat.change}</span> from last
								week
							</p>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Charts & Analytics */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Sales Chart */}
				<Card className='lg:col-span-2'>
					<CardHeader>
						<CardTitle>Sales Overview</CardTitle>
					</CardHeader>
					<CardContent>
						<SalesChart />
					</CardContent>
				</Card>

				{/* Top Items */}
				<Card>
					<CardHeader>
						<CardTitle>Top Selling Items</CardTitle>
					</CardHeader>
					<CardContent>
						<TopItems limit={5} />
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='flex flex-wrap gap-3'>
						<Button
							variant='café'
							className='flex-1 min-w-[150px]'>
							<Coffee className='mr-2 h-4 w-4' />
							New Order
						</Button>
						<Button
							variant='outline'
							className='flex-1 min-w-[150px]'>
							📋 View Orders
						</Button>
						<Button
							variant='outline'
							className='flex-1 min-w-[150px]'>
							👨‍🍳 Kitchen View
						</Button>
						<Button
							variant='outline'
							className='flex-1 min-w-[150px]'>
							📊 Reports
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
