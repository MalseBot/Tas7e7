/** @format */

// app/dashboard/orders/page.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/lib/api/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
	Search,
	Calendar,
	Filter,
	Eye,
	Receipt,
	MoreHorizontal,
} from 'lucide-react';

export default function OrdersPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [dateFilter, setDateFilter] = useState('today');
	const [statusFilter, setStatusFilter] = useState('all');

	const { data: orders, isLoading } = useQuery({
		queryKey: ['orders', { dateFilter, statusFilter }],
		queryFn: () =>
			orderService.getOrders({
				status: statusFilter !== 'all' ? statusFilter : undefined,
			}),
	});

	const getStatusBadge = (status: string) => {
		const variants: Record<string, any> = {
			pending: { variant: 'destructive' as const, label: 'Pending' },
			preparing: { variant: 'secondary' as const, label: 'Preparing' },
			ready: { variant: 'default' as const, label: 'Ready' },
			served: { variant: 'default' as const, label: 'Served' },
			paid: { variant: 'outline' as const, label: 'Paid' },
			cancelled: { variant: 'destructive' as const, label: 'Cancelled' },
		};
		return variants[status] || { variant: 'outline' as const, label: status };
	};

	console.log(orders);
	

	const filteredOrders = orders?.data.data?.filter(
		(order: any) =>
			order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			order.tableNumber?.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div>
				<h1 className='text-3xl font-bold text-foreground'>Order History</h1>
				<p className='text-muted-foreground'>View and manage all orders</p>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className='p-6'>
					<div className='flex flex-col md:flex-row gap-4'>
						<div className='flex-1'>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground' />
								<Input
									placeholder='Search by order #, customer, or table...'
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className='pl-10'
								/>
							</div>
						</div>

						<div className='flex gap-2'>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant='outline'
										className='gap-2'>
										<Calendar className='w-4 h-4' />
										Date
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem onClick={() => setDateFilter('today')}>
										Today
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setDateFilter('week')}>
										This Week
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setDateFilter('month')}>
										This Month
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setDateFilter('all')}>
										All Time
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant='outline'
										className='gap-2'>
										<Filter className='w-4 h-4' />
										Status
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem onClick={() => setStatusFilter('all')}>
										All Status
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setStatusFilter('pending')}>
										Pending
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => setStatusFilter('preparing')}>
										Preparing
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setStatusFilter('ready')}>
										Ready
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setStatusFilter('paid')}>
										Paid
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Orders Table */}
			<Card>
				<CardHeader>
					<CardTitle>Orders ({filteredOrders?.length || 0})</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Order #</TableHead>
								<TableHead>Date & Time</TableHead>
								<TableHead>Customer</TableHead>
								<TableHead>Table</TableHead>
								<TableHead>Items</TableHead>
								<TableHead>Total</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className='text-right'>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredOrders?.map((order: any) => {
								const statusBadge = getStatusBadge(order.status);
								return (
									<TableRow key={order._id}>
										<TableCell className='font-medium'>
											{order.orderNumber}
										</TableCell>
										<TableCell>
											<div className='text-sm'>
												<div>
													{new Date(order.createdAt).toLocaleDateString()}
												</div>
												<div className='text-muted-foreground'>
													{new Date(order.createdAt).toLocaleTimeString()}
												</div>
											</div>
										</TableCell>
										<TableCell>{order.customerName || 'Walk-in'}</TableCell>
										<TableCell>
											{order.tableNumber === 'Takeaway' ?
												<Badge variant='outline'>Takeaway</Badge>
											:	order.tableNumber}
										</TableCell>
										<TableCell>
											{order.items.reduce(
												(sum: number, item: any) => sum + item.quantity,
												0
											)}{' '}
											items
										</TableCell>
										<TableCell className='font-semibold'>
											${order.total?.toFixed(2) || '0.00'}
										</TableCell>
										<TableCell>
											<Badge variant={statusBadge.variant}>
												{statusBadge.label}
											</Badge>
										</TableCell>
										<TableCell className='text-right'>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant='ghost'
														size='icon'>
														<MoreHorizontal className='w-4 h-4' />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end'>
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuSeparator />
													<DropdownMenuItem>
														<Eye className='w-4 h-4 mr-2' />
														View Details
													</DropdownMenuItem>
													<DropdownMenuItem>
														<Receipt className='w-4 h-4 mr-2' />
														Print Receipt
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>

					{(!filteredOrders || filteredOrders.length === 0) && (
						<div className='text-center py-12 text-muted-foreground'>
							<Receipt className='w-12 h-12 mx-auto mb-4 opacity-50' />
							<p>No orders found</p>
							<p className='text-sm mt-2'>
								{searchQuery ?
									'Try a different search term'
								:	'Start taking orders at the POS'}
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
