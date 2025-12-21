/** @format */

// components/dashboard/stats.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function DashboardStats() {
	// This is a placeholder. In real app, fetch data from API
	const stats = [
		{
			label: 'Average Order Value',
			value: '$24.50',
			change: '+12%',
			trend: 'up',
		},
		{ label: 'Table Turnover', value: '2.4/hr', change: '-3%', trend: 'down' },
		{
			label: 'Customer Satisfaction',
			value: '4.8/5',
			change: '+5%',
			trend: 'up',
		},
	];

	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
			{stats.map((stat) => (
				<Card key={stat.label}>
					<CardHeader className='pb-2'>
						<CardTitle className='text-sm font-medium'>{stat.label}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stat.value}</div>
						<div
							className={`flex items-center text-sm mt-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
							{stat.trend === 'up' ?
								<TrendingUp className='w-4 h-4 mr-1' />
							:	<TrendingDown className='w-4 h-4 mr-1' />}
							{stat.change}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
