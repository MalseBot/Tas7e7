/** @format */

// components/pos/tables-view.tsx
'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tableService } from '@/lib/api/services';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface Table {
	_id: string;
	tableNumber: string;
	capacity: number;
	status: 'available' | 'occupied' | 'reserved' | 'cleaning';
	location: string;
	currentOrder?: string;
}

interface TablesViewProps {
	selectedTable: string;
	onSelectTable: (tableNumber: string) => void;
}

export function TablesView({ selectedTable, onSelectTable }: TablesViewProps) {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [showAddDialog, setShowAddDialog] = useState(false);
	const [newTableData, setNewTableData] = useState({
		tableNumber: '',
		capacity: 4,
		location: 'main',
		status: 'available' as const,
	});

	// Fetch tables from API
	const {
		data: tablesData,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['tables'],
		queryFn: () => tableService.getTables(),
		select: (data) => data.data.data,
	});

	// Create table mutation
	const createTableMutation = useMutation({
		mutationFn: (data: any) => tableService.createTable(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tables'] });
			setShowAddDialog(false);
			setNewTableData({
				tableNumber: '',
				capacity: 4,
				location: 'main',
				status: 'available',
			});
		},
	});

	// Update table status mutation
	const updateTableStatusMutation = useMutation({
		mutationFn: ({ id, status }: { id: string; status: string }) =>
			tableService.updateTableStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tables'] });
		},
	});

	const tables = tablesData || [];

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
				return t('tables.available');
			case 'occupied':
				return t('tables.occupied');
			case 'reserved':
				return t('tables.reserved');
			case 'cleaning':
				return t('tables.cleaning');
			default:
				return status;
		}
	};



	const handleTableClick = (table: Table) => {
		if (table.status === 'available') {
			onSelectTable(table.tableNumber);
		}
	};

	const handleStatusChange = (tableId: string, currentStatus: string) => {
		const newStatus = currentStatus === 'occupied' ? 'available' : 'occupied';
		updateTableStatusMutation.mutate({ id: tableId, status: newStatus });
	};

	const handleAddTable = () => {
		if (!newTableData.tableNumber.trim()) return;
		createTableMutation.mutate(newTableData);
	};

	// Group tables by location for better organization
	const tablesByLocation = tables.reduce(
		(acc: Record<string, Table[]>, table: any) => {
			if (!acc[table.location]) {
				acc[table.location] = [];
			}
			acc[table.location].push(table);
			return acc;
		},
		{}
	);

	// Sort tables by number
	const sortedTables = Object.keys(tablesByLocation).reduce(
		(acc: Record<string, Table[]>, location) => {
			acc[location] = tablesByLocation[location].sort((a: any, b: any) => {
				// Extract numbers from table numbers for proper sorting
				const numA = parseInt(a.tableNumber.replace(/\D/g, '')) || 0;
				const numB = parseInt(b.tableNumber.replace(/\D/g, '')) || 0;
				return numA - numB;
			});
			return acc;
		},
		{}
	);

	if (isLoading) {
		return (
			<Card>
				<CardContent className='p-6'>
					<div className='flex items-center justify-center h-48'>
						<RefreshCw className='w-6 h-6 animate-spin' />
						<span className='ml-2'>{t('tables.loading')}</span>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card>
				<CardContent className='p-6'>
					<div className='text-center py-8'>
						<div className='text-red-500 mb-4'>{t('tables.loadFailed')}</div>
						<Button
							onClick={() => refetch()}
							variant='outline'>
							<RefreshCw className='w-4 h-4 mr-2' />
							{t('common.retry')}
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<Card className=''>
				<CardContent className='p-6 '>
					<div className='flex items-center justify-between mb-4'>
						<div>
							<h3 className='text-lg font-semibold'>{t('pos.tables')}</h3>
						</div>
						<div className='flex gap-2'>
							<Button
								variant='outline'
								size='sm'
								onClick={() => refetch()}
								disabled={isLoading}>
								<RefreshCw
									className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
								/>
							</Button>
							<Dialog
								open={showAddDialog}
								onOpenChange={setShowAddDialog}>
								<DialogTrigger asChild>
									<Button size='sm'>
										<Plus className='w-4 h-4 mr-1' />
										{t('tables.addTable')}
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>{t('tables.addNewTable')}</DialogTitle>
										<DialogDescription>
											{t('tables.createNewTable')}
										</DialogDescription>
									</DialogHeader>
									<div className='space-y-4 py-4'>
										<div className='space-y-2'>
											<Label htmlFor='tableNumber'>
												{t('tables.tableNumber')} *
											</Label>
											<Input
												id='tableNumber'
												value={newTableData.tableNumber}
												onChange={(e) =>
													setNewTableData({
														...newTableData,
														tableNumber: e.target.value,
													})
												}
												placeholder={t('tables.tableNumberPlaceholder')}
											/>
										</div>
										<div className='grid grid-cols-2 gap-4'>
											<div className='space-y-2'>
												<Label htmlFor='capacity'>{t('tables.capacity')}</Label>
												<Select
													value={newTableData.capacity.toString()}
													onValueChange={(value) =>
														setNewTableData({
															...newTableData,
															capacity: parseInt(value),
														})
													}>
													<SelectTrigger>
														<SelectValue
															placeholder={t('tables.selectCapacity')}
														/>
													</SelectTrigger>
													<SelectContent>
														{[2, 4, 6, 8, 10].map((num) => (
															<SelectItem
																key={num}
																value={num.toString()}>
																{num} {t('tables.seats')}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
											<div className='space-y-2'>
												<Label htmlFor='location'>{t('tables.location')}</Label>
												<Select
													value={newTableData.location}
													onValueChange={(value) =>
														setNewTableData({
															...newTableData,
															location: value,
														})
													}>
													<SelectTrigger>
														<SelectValue
															placeholder={t('tables.selectLocation')}
														/>
													</SelectTrigger>
													<SelectContent>
														<SelectItem value='main'>
															{t('tables.mainHall')}
														</SelectItem>
														<SelectItem value='terrace'>
															{t('tables.terrace')}
														</SelectItem>
														<SelectItem value='private'>
															{t('tables.privateRoom')}
														</SelectItem>
														<SelectItem value='bar'>
															{t('tables.barArea')}
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='status'>
												{t('tables.initialStatus')}
											</Label>
											<Select
												value={newTableData.status}
												onValueChange={(value: any) =>
													setNewTableData({ ...newTableData, status: value })
												}>
												<SelectTrigger>
													<SelectValue placeholder={t('tables.selectStatus')} />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='available'>
														{t('tables.available')}
													</SelectItem>
													<SelectItem value='cleaning'>
														{t('tables.cleaning')}
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>
									<DialogFooter>
										<Button
											variant='outline'
											onClick={() => setShowAddDialog(false)}>
											{t('common.cancel')}
										</Button>
										<Button
											onClick={handleAddTable}
											disabled={
												!newTableData.tableNumber.trim() ||
												createTableMutation.isPending
											}>
											{createTableMutation.isPending ?
												t('tables.creating')
											:	t('tables.createTable')}
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					</div>

					{Object.keys(sortedTables).map((location) => (
						<div
							key={location}
							className='mb-6 last:mb-0 '>
							<div className='flex items-center mb-3'>
								<div className='ml-2 flex gap-1'>
									<Badge
										variant='outline'
										className='text-xs'>
										{sortedTables[location].length} {t('tables.title')}
									</Badge>
									<Badge
										variant='secondary'
										className='text-xs'>
										{
											sortedTables[location].filter(
												(t) => t.status === 'available'
											).length
										}{' '}
										{t('tables.available')}
									</Badge>
								</div>
							</div>

							<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
								{sortedTables[location].map((table: Table) => {
									const isSelected = selectedTable === table.tableNumber;
									const isAvailable = table.status === 'available';

									return (
										<div
											key={table._id}
											className={`
                        relative aspect-square rounded-xl p-3 flex flex-col items-center justify-center
                        border-2 transition-all group
                        ${isSelected ? 'border-primary bg-primary/10' : 'border-border'}
                        ${!isAvailable ? 'opacity-80' : ''}
                      `}>
											{/* Status indicator */}
											<div className='absolute top-2 right-2'>
												<div
													className={`w-3 h-3 rounded-full ${getStatusColor(table.status)}`}
													title={getStatusText(table.status)}
												/>
											</div>

											{/* Table number */}
											<div className='text-xl font-bold mb-1'>
												{table.tableNumber}
											</div>

											{/* Capacity */}
											<div className='text-xs text-muted-foreground mb-1'>
												{table.capacity} {t('tables.seats')}
											</div>

											{/* Status badge */}
											<Badge
												variant={isAvailable ? 'outline' : 'secondary'}
												className='text-xs mb-2'>
												{getStatusText(table.status)}
											</Badge>

											{/* Action buttons */}
											<div className='absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-1'>
												<Button
													size='sm'
													variant={isAvailable ? 'default' : 'outline'}
													className='h-6 text-xs'
													onClick={() => handleTableClick(table)}
													disabled={!isAvailable}>
													{isSelected ?
														t('tables.selected')
													:	t('tables.select')}
												</Button>
												<Button
													size='sm'
													variant='outline'
													className='h-6 text-xs'
													onClick={() =>
														handleStatusChange(table._id, table.status)
													}
													disabled={updateTableStatusMutation.isPending}>
													{table.status === 'occupied' ?
														t('tables.free')
													:	t('tables.occupy')}
												</Button>
											</div>

											{/* Selected checkmark */}
											{isSelected && (
												<div className='absolute top-2 left-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center'>
													<Check className='w-3 h-3' />
												</div>
											)}
										</div>
									);
								})}
							</div>
						</div>
					))}

					{tables.length === 0 && (
						<div className='text-center py-12'>
							<div className='mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4'>
								<Plus className='w-6 h-6 text-muted-foreground' />
							</div>
							<h4 className='font-medium mb-2'>{t('tables.noTablesFound')}</h4>
							<p className='text-sm text-muted-foreground mb-4'>
								{t('tables.createFirstTable')}
							</p>
							<Button onClick={() => setShowAddDialog(true)}>
								<Plus className='w-4 h-4 mr-2' />
								{t('tables.addFirstTable')}
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</>
	);
}
