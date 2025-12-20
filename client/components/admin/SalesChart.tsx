/** @format */

// components/admin/SalesChart.tsx
'use client';

import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';

const data = [
	{ time: '6 AM', sales: 120 },
	{ time: '8 AM', sales: 450 },
	{ time: '10 AM', sales: 820 },
	{ time: '12 PM', sales: 1560 },
	{ time: '2 PM', sales: 1340 },
	{ time: '4 PM', sales: 980 },
	{ time: '6 PM', sales: 1840 },
	{ time: '8 PM', sales: 1420 },
	{ time: '10 PM', sales: 680 },
];

export default function SalesChart() {
	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className='café-card p-3'>
					<p className='font-medium'>{label}</p>
					<p className='text-primary font-bold'>
						${payload[0].value.toLocaleString()}
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div className='h-[300px]'>
			<ResponsiveContainer
				width='100%'
				height='100%'>
				<LineChart data={data}>
					<CartesianGrid
						strokeDasharray='3 3'
						stroke='var(--border)'
					/>
					<XAxis
						dataKey='time'
						stroke='var(--muted-foreground)'
						fontSize={12}
					/>
					<YAxis
						stroke='var(--muted-foreground)'
						fontSize={12}
						tickFormatter={(value) => `$${value}`}
					/>
					<Tooltip content={<CustomTooltip />} />
					<Line
						type='monotone'
						dataKey='sales'
						stroke='var(--primary)'
						strokeWidth={3}
						dot={{ r: 4 }}
						activeDot={{ r: 6, fill: 'var(--primary)' }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
