/** @format */

// app/(dashboard)/admin/page.tsx
'use client';

import { useState } from 'react';
import {
	BarChart3,
	Users,
	DollarSign,
	TrendingUp,
	Clock,
	ChefHat,
	Coffee,
	ShoppingBag,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import SalesChart from '@/components/admin/SalesChart';
import TopItems from '@/components/admin/TopItems';
import StaffTable from '@/components/admin/StaffTable';

export default function AdminPage() {
	const { user } = useAuth();
	const [activeTab, setActiveTab] = useState('overview');

	// Only admin/manager can access
	if (!user || !['admin', 'manager'].includes(user.role)) {
		return (
			<div className='text-center py-12'>
				<h2 className='text-2xl font-bold text-foreground mb-4'>
					Access Denied
				</h2>
				<p className='text-muted-foreground'>
					You don't have permission to view this page.
				</p>
			</div>
		);
	}

	const stats = [
		{
			title: 'Total Revenue',
			value: '$12,845.60',
			change: '+18.2%',
			icon: DollarSign,
			color: 'text-green-600',
			bgColor: 'bg-green-100',
		},
		{
			title: 'Average Order',
			value: '$42.80',
			change: '+3.5%',
			icon: TrendingUp,
			color: 'text-blue-600',
			bgColor: 'bg-blue-100',
		},
		{
			title: 'Orders Today',
			value: '142',
			change: '+12.5%',
			icon: ShoppingBag,
			color: 'text-purple-600',
			bgColor: 'bg-purple-100',
		},
		{
			title: 'Active Staff',
			value: '8',
			change: '+2',
			icon: Users,
			color: 'text-amber-600',
			bgColor: 'bg-amber-100',
		},
		{
			title: 'Avg. Prep Time',
			value: '12.4 min',
			change: '-1.2 min',
			icon: Clock,
			color: 'text-indigo-600',
			bgColor: 'bg-indigo-100',
		},
		{
			title: 'Peak Hour',
			value: '12 PM',
			change: 'Most orders',
			icon: BarChart3,
			color: 'text-pink-600',
			bgColor: 'bg-pink-100',
		},
	];

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div>
				<h1 className='text-3xl font-bold text-foreground'>Admin Dashboard</h1>
				<p className='text-muted-foreground'>
					Complete overview and management of your restaurant
				</p>
			</div>

			{/* Stats Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'>
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
								<span
									className={
										stat.change.startsWith('+')
											? 'text-green-600'
											: 'text-red-600'
									}>
									{stat.change}
								</span>{' '}
								from last week
							</p>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Main Content Tabs */}
			<Tabs
				defaultValue='overview'
				onValueChange={setActiveTab}>
				<TabsList className='grid w-full md:w-auto grid-cols-4'>
					<TabsTrigger value='overview'>Overview</TabsTrigger>
					<TabsTrigger value='analytics'>Analytics</TabsTrigger>
					<TabsTrigger value='staff'>Staff</TabsTrigger>
					<TabsTrigger value='settings'>Settings</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent
					value='overview'
					className='space-y-6'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
						<Card>
							<CardHeader>
								<CardTitle>Revenue Trend</CardTitle>
							</CardHeader>
							<CardContent>
								<SalesChart />
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Top Selling Items</CardTitle>
							</CardHeader>
							<CardContent>
								<TopItems limit={8} />
							</CardContent>
						</Card>
					</div>

					{/* Quick Stats */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						<Card>
							<CardHeader>
								<CardTitle className='text-sm'>Busiest Time</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<span className='text-sm'>12:00 PM</span>
										<span className='font-bold'>42 orders</span>
									</div>
									<div className='w-full bg-muted rounded-full h-2'>
										<div
											className='bg-primary h-2 rounded-full'
											style={{ width: '100%' }}></div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className='text-sm'>Best Day</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<span className='text-sm'>Saturday</span>
										<span className='font-bold'>$2,845</span>
									</div>
									<div className='w-full bg-muted rounded-full h-2'>
										<div
											className='bg-secondary h-2 rounded-full'
											style={{ width: '85%' }}></div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className='text-sm'>Most Popular</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<Coffee className='h-4 w-4' />
											<span className='text-sm'>Espresso</span>
										</div>
										<span className='font-bold'>142 sold</span>
									</div>
									<div className='w-full bg-muted rounded-full h-2'>
										<div
											className='bg-amber-500 h-2 rounded-full'
											style={{ width: '75%' }}></div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Analytics Tab */}
				<TabsContent value='analytics'>
					<Card>
						<CardHeader>
							<CardTitle>Detailed Analytics</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='text-center py-12 text-muted-foreground'>
								<BarChart3 className='h-16 w-16 mx-auto mb-4 opacity-20' />
								<h3 className='text-lg font-medium mb-2'>Advanced Analytics</h3>
								<p>Detailed reports and analytics coming soon</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Staff Tab */}
				<TabsContent value='staff'>
					<Card>
						<CardHeader>
							<div className='flex items-center justify-between'>
								<CardTitle>Staff Management</CardTitle>
								<Button
									variant='café'
									size='sm'>
									+ Add Staff
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<StaffTable />
						</CardContent>
					</Card>
				</TabsContent>

				{/* Settings Tab */}
				<TabsContent value='settings'>
					<Card>
						<CardHeader>
							<CardTitle>Restaurant Settings</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-6'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<div>
										<h4 className='font-medium mb-4'>General Settings</h4>
										<div className='space-y-4'>
											<div>
												<label className='text-sm font-medium mb-2 block'>
													Restaurant Name
												</label>
												<input
													type='text'
													className='café-input'
													defaultValue='Café Delight'
												/>
											</div>
											<div>
												<label className='text-sm font-medium mb-2 block'>
													Tax Rate (%)
												</label>
												<input
													type='number'
													className='café-input'
													defaultValue='13'
												/>
											</div>
										</div>
									</div>

									<div>
										<h4 className='font-medium mb-4'>Business Hours</h4>
										<div className='space-y-3'>
											{['Monday - Friday', 'Saturday', 'Sunday'].map((day) => (
												<div
													key={day}
													className='flex items-center justify-between'>
													<span className='text-sm'>{day}</span>
													<span className='text-sm font-medium'>
														8:00 AM - 10:00 PM
													</span>
												</div>
											))}
										</div>
									</div>
								</div>

								<div className='border-t pt-6'>
									<div className='flex justify-end gap-3'>
										<Button variant='outline'>Cancel</Button>
										<Button variant='café'>Save Changes</Button>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
