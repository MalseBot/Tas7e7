/** @format */

// app/(dashboard)/pos/page.tsx
'use client';

import { useState } from 'react';
import { Coffee, ChefHat, Users, BarChart3 } from 'lucide-react';
import OrderPad from '@/components/pos/OrderPad';
import TableGrid from '@/components/pos/TableGrid';
import QuickActions from '@/components/pos/QuickActions';
import { useAuth } from '@/hooks/useAuth';

export default function POSPage() {
	const { user } = useAuth();
	const [activeTab, setActiveTab] = useState<'order' | 'tables'>('order');

	const stats = [
		{ icon: Coffee, label: 'Today Orders', value: '42', change: '+12%' },
		{ icon: ChefHat, label: 'Kitchen Active', value: '8', change: '+2' },
		{ icon: Users, label: 'Occupied Tables', value: '14', change: '-3' },
		{
			icon: BarChart3,
			label: 'Today Revenue',
			value: '$1,284',
			change: '+18%',
		},
	];

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>Point of Sale</h1>
					<p className='text-muted-foreground'>
						Welcome back, {user?.name}. Ready to take some orders?
					</p>
				</div>
				<QuickActions />
			</div>

			{/* Stats */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				{stats.map((stat, index) => (
					<div
						key={index}
						className='café-card p-5'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm text-muted-foreground'>{stat.label}</p>
								<p className='text-2xl font-bold text-foreground mt-1'>
									{stat.value}
								</p>
							</div>
							<div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center'>
								<stat.icon
									className='text-primary'
									size={24}
								/>
							</div>
						</div>
						<div className='mt-3'>
							<span
								className={`text-sm ${
									stat.change.startsWith('+')
										? 'text-primary'
										: 'text-destructive'
								}`}>
								{stat.change}
							</span>
							<span className='text-xs text-muted-foreground ml-2'>
								from yesterday
							</span>
						</div>
					</div>
				))}
			</div>

			{/* Tabs */}
			<div className='flex border-b border-border'>
				<button
					onClick={() => setActiveTab('order')}
					className={`px-6 py-3 font-medium transition-colors ${
						activeTab === 'order'
							? 'text-primary border-b-2 border-primary'
							: 'text-muted-foreground hover:text-foreground'
					}`}>
					New Order
				</button>
				<button
					onClick={() => setActiveTab('tables')}
					className={`px-6 py-3 font-medium transition-colors ${
						activeTab === 'tables'
							? 'text-primary border-b-2 border-primary'
							: 'text-muted-foreground hover:text-foreground'
					}`}>
					Table Management
				</button>
			</div>

			{/* Content */}
			<div className='min-h-[600px]'>
				{activeTab === 'order' ? <OrderPad /> : <TableGrid />}
			</div>
		</div>
	);
}
