/** @format */

// components/pos/TableGrid.tsx
'use client';

import { Users, Coffee, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTables, useUpdateTableStatus } from '@/hooks/useTables';
import { cn } from '@/lib/utils';

export default function TableGrid() {
	const { data: tables, isLoading } = useTables();
	const updateTableStatus = useUpdateTableStatus();

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'available':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'occupied':
				return 'bg-red-100 text-red-800 border-red-200';
			case 'reserved':
				return 'bg-blue-100 text-blue-800 border-blue-200';
			case 'cleaning':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'available':
				return <Check className='h-4 w-4' />;
			case 'occupied':
				return <Coffee className='h-4 w-4' />;
			case 'reserved':
				return <Clock className='h-4 w-4' />;
			case 'cleaning':
				return <Clock className='h-4 w-4' />;
			default:
				return null;
		}
	};

	const handleTableClick = async (tableId: string, currentStatus: string) => {
		const newStatus = currentStatus === 'available' ? 'occupied' : 'available';
		try {
			await updateTableStatus.mutateAsync({
				id: tableId,
				status: newStatus,
			});
		} catch (error) {
			console.error('Failed to update table status:', error);
		}
	};

	if (isLoading) {
		return (
			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'>
				{[...Array(12)].map((_, i) => (
					<div
						key={i}
						className='café-card p-4 animate-pulse'>
						<div className='h-32 bg-muted rounded-lg'></div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Status Legend */}
			<div className='flex flex-wrap gap-3'>
				{['available', 'occupied', 'reserved', 'cleaning'].map((status) => (
					<div
						key={status}
						className='flex items-center gap-2'>
						<div
							className={cn(
								'w-3 h-3 rounded-full',
								status === 'available' && 'bg-green-500',
								status === 'occupied' && 'bg-red-500',
								status === 'reserved' && 'bg-blue-500',
								status === 'cleaning' && 'bg-yellow-500'
							)}
						/>
						<span className='text-sm capitalize'>{status}</span>
					</div>
				))}
			</div>

			{/* Table Grid */}
			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'>
				{tables?.map((table: any) => (
					<Button
						key={table._id}
						variant='ghost'
						className={cn(
							'h-auto p-0 flex flex-col items-center justify-center café-card hover:shadow-md transition-all duration-200',
							table.status === 'occupied' && 'ring-2 ring-primary/20'
						)}
						onClick={() => handleTableClick(table._id, table.status)}>
						{/* Table Top */}
						<div
							className={cn(
								'w-full h-24 rounded-t-lg flex flex-col items-center justify-center',
								getStatusColor(table.status)
							)}>
							{getStatusIcon(table.status)}
							<div className='text-2xl font-bold mt-2'>
								T{table.tableNumber}
							</div>
							<div className='text-xs mt-1 capitalize'>{table.status}</div>
						</div>

						{/* Table Info */}
						<div className='w-full p-3'>
							<div className='flex items-center justify-between text-sm'>
								<div className='flex items-center gap-1'>
									<Users className='h-3 w-3' />
									<span>{table.capacity} seats</span>
								</div>
								<div className='capitalize text-xs text-muted-foreground'>
									{table.location}
								</div>
							</div>

							{table.currentOrder && (
								<div className='mt-2 text-xs text-primary font-medium'>
									Order Active
								</div>
							)}

							{table.notes && (
								<div className='mt-1 text-xs text-muted-foreground truncate'>
									{table.notes}
								</div>
							)}
						</div>
					</Button>
				))}
			</div>

			{/* Quick Actions */}
			<div className='flex flex-wrap gap-3'>
				<Button
					variant='outline'
					size='sm'>
					Mark All Clean
				</Button>
				<Button
					variant='outline'
					size='sm'>
					Clear Reservations
				</Button>
				<Button
					variant='café'
					size='sm'>
					+ Add New Table
				</Button>
			</div>
		</div>
	);
}
