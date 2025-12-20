/** @format */

// app/(dashboard)/orders/page.tsx
'use client';

import { useState } from 'react';
import { Search, Filter, Download, Eye, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useOrders } from '@/hooks/useOrders';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function OrdersPage() {
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState<string[]>([]);
	const { data: ordersResponse, isLoading } = useOrders();

	const orders = ordersResponse?.data || [];

	const filteredOrders = orders.filter((order: any) => {
		const matchesSearch =
			order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
			order.tableNumber.toLowerCase().includes(search.toLowerCase()) ||
			order.customerName?.toLowerCase().includes(search.toLowerCase());

		const matchesStatus =
			statusFilter.length === 0 || statusFilter.includes(order.status);

		return matchesSearch && matchesStatus;
	});

	const statuses = [
		'pending',
		'confirmed',
		'preparing',
		'ready',
		'served',
		'paid',
		'cancelled',
	];

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>Orders</h1>
					<p className='text-muted-foreground'>
						Manage and track all restaurant orders
					</p>
				</div>

				<div className='flex items-center gap-2'>
					<Button
						variant='outline'
						size='sm'>
						<Download className='h-4 w-4 mr-2' />
						Export
					</Button>
					<Button
						variant='café'
						size='sm'>
						+ New Order
					</Button>
				</div>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className='p-4'>
					<div className='flex flex-col md:flex-row gap-4'>
						{/* Search */}
						<div className='flex-1'>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
								<Input
									placeholder='Search by order #, table, or customer...'
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className='pl-10'
								/>
							</div>
						</div>

						{/* Status Filter */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='outline'>
									<Filter className='h-4 w-4 mr-2' />
									Status {statusFilter.length > 0 && `(${statusFilter.length})`}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className='w-56'>
								{statuses.map((status) => (
									<DropdownMenuCheckboxItem
										key={status}
										checked={statusFilter.includes(status)}
										onCheckedChange={(checked) => {
											if (checked) {
												setStatusFilter([...statusFilter, status]);
											} else {
												setStatusFilter(
													statusFilter.filter((s) => s !== status)
												);
											}
										}}>
										{status.charAt(0).toUpperCase() + status.slice(1)}
									</DropdownMenuCheckboxItem>
								))}
								<DropdownMenuCheckboxItem
									checked={statusFilter.length === 0}
									onCheckedChange={() => setStatusFilter([])}>
									All Statuses
								</DropdownMenuCheckboxItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</CardContent>
			</Card>

			{/* Orders Table */}
			<Card>
				<CardContent className='p-0'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Order #</TableHead>
								<TableHead>Table</TableHead>
								<TableHead>Customer</TableHead>
								<TableHead>Items</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Total</TableHead>
								<TableHead>Time</TableHead>
								<TableHead className='text-right'>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell
										colSpan={8}
										className='text-center py-8'>
										Loading orders...
									</TableCell>
								</TableRow>
							) : filteredOrders.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={8}
										className='text-center py-8'>
										No orders found
									</TableCell>
								</TableRow>
							) : (
								filteredOrders.map((order: any) => (
									<TableRow
										key={order._id}
										className='hover:bg-muted/50'>
										<TableCell className='font-medium'>
											{order.orderNumber}
										</TableCell>
										<TableCell>{order.tableNumber}</TableCell>
										<TableCell>{order.customerName || 'Guest'}</TableCell>
										<TableCell>{order.items.length} items</TableCell>
										<TableCell>
											<StatusBadge status={order.status} />
										</TableCell>
										<TableCell className='font-medium'>
											{formatCurrency(order.total)}
										</TableCell>
										<TableCell className='text-sm text-muted-foreground'>
											{formatDate(order.createdAt)}
										</TableCell>
										<TableCell className='text-right'>
											<div className='flex justify-end gap-2'>
												<Button
													variant='ghost'
													size='icon'>
													<Eye className='h-4 w-4' />
												</Button>
												<Button
													variant='ghost'
													size='icon'>
													<Printer className='h-4 w-4' />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
