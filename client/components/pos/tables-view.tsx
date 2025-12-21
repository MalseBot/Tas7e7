/** @format */

// components/pos/tables-view.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface TablesViewProps {
	tables?: any[];
	selectedTable: string;
	onSelectTable: (tableNumber: string) => void;
}

export function TablesView({
	tables,
	selectedTable,
	onSelectTable,
}: TablesViewProps) {
	// Sample tables if none from API
	const sampleTables = [
		{
			tableNumber: 'T1',
			capacity: 2,
			status: 'available',
			location: 'indoors',
		},
		{ tableNumber: 'T2', capacity: 2, status: 'occupied', location: 'indoors' },
		{
			tableNumber: 'T3',
			capacity: 4,
			status: 'available',
			location: 'indoors',
		},
		{ tableNumber: 'T4', capacity: 4, status: 'reserved', location: 'indoors' },
		{
			tableNumber: 'T5',
			capacity: 6,
			status: 'available',
			location: 'indoors',
		},
		{
			tableNumber: 'T6',
			capacity: 4,
			status: 'cleaning',
			location: 'outdoors',
		},
		{
			tableNumber: 'T7',
			capacity: 4,
			status: 'available',
			location: 'outdoors',
		},
		{ tableNumber: 'Bar1', capacity: 1, status: 'available', location: 'bar' },
		{ tableNumber: 'Bar2', capacity: 1, status: 'occupied', location: 'bar' },
	];

	const displayTables = tables || sampleTables;

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'available':
				return 'bg-green-500';
			case 'occupied':
				return 'bg-red-500';
			case 'reserved':
				return 'bg-yellow-500';
			case 'cleaning':
				return 'bg-blue-500';
			default:
				return 'bg-gray-500';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'available':
				return 'Available';
			case 'occupied':
				return 'Occupied';
			case 'reserved':
				return 'Reserved';
			case 'cleaning':
				return 'Cleaning';
			default:
				return status;
		}
	};

	return (
		<Card>
			<CardContent className='p-6'>
				<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
					{displayTables.map((table) => {
						const isSelected = selectedTable === table.tableNumber;
						const isAvailable = table.status === 'available';

						return (
							<button
								key={table.tableNumber}
								onClick={() => isAvailable && onSelectTable(table.tableNumber)}
								className={`
                  relative aspect-square rounded-xl p-4 flex flex-col items-center justify-center
                  border-2 transition-all
                  ${
										isSelected ?
											'border-primary bg-primary/10'
										:	'border-border hover:border-primary/50'
									}
                  ${!isAvailable ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                `}>
								{/* Status indicator */}
								<div className='absolute top-2 right-2'>
									<div
										className={`w-3 h-3 rounded-full ${getStatusColor(table.status)}`}
									/>
								</div>

								{/* Table number */}
								<div className='text-2xl font-bold mb-2'>
									{table.tableNumber}
								</div>

								{/* Capacity */}
								<div className='text-sm text-muted-foreground mb-1'>
									{table.capacity} seats
								</div>

								{/* Status */}
								<Badge
									variant={isAvailable ? 'outline' : 'secondary'}
									className='text-xs'>
									{getStatusText(table.status)}
								</Badge>

								{/* Location */}
								<div className='absolute bottom-2 text-xs text-muted-foreground'>
									{table.location}
								</div>

								{/* Selected checkmark */}
								{isSelected && (
									<div className='absolute top-2 left-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center'>
										<Check className='w-4 h-4' />
									</div>
								)}
							</button>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
