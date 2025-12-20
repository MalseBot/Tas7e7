/** @format */

// components/admin/SalesHistory.tsx
import { useState } from 'react';
import { Sale } from '@/types';
import { Search, Eye, Calendar } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { SaleDetailsModal } from './SalesDetailsModal';

interface SalesHistoryProps {
	sales: Sale[];
}

export function SalesHistory({ sales }: SalesHistoryProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
	const [dateFilter, setDateFilter] = useState<string>('all');

	const getFilteredSales = () => {
		let filtered = sales;

		// Date filter
		if (dateFilter !== 'all') {
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			filtered = filtered.filter((sale) => {
				const saleDate = new Date(sale.timestamp);
				saleDate.setHours(0, 0, 0, 0);

				switch (dateFilter) {
					case 'today':
						return saleDate.getTime() === today.getTime();
					case 'week':
						const weekAgo = new Date(today);
						weekAgo.setDate(weekAgo.getDate() - 7);
						return saleDate >= weekAgo;
					case 'month':
						const monthAgo = new Date(today);
						monthAgo.setMonth(monthAgo.getMonth() - 1);
						return saleDate >= monthAgo;
					default:
						return true;
				}
			});
		}

		// Search filter
		if (searchQuery) {
			filtered = filtered.filter(
				(sale) =>
					sale.id.includes(searchQuery) ||
					sale.cashier.toLowerCase().includes(searchQuery.toLowerCase()) ||
					sale.items.some((item) =>
						item.name.toLowerCase().includes(searchQuery.toLowerCase())
					)
			);
		}

		return filtered;
	};

	const filteredSales = getFilteredSales();

	return (
		<div className='space-y-6'>
			<Card>
				<CardHeader>
					<CardTitle>Sales History</CardTitle>
					<CardDescription>
						View and manage all sales transactions
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						<div className='flex flex-col sm:flex-row gap-4'>
							<div className='flex-1 relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5' />
								<Input
									placeholder='Search by transaction ID, cashier, or product...'
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className='pl-10'
								/>
							</div>
							<div className='flex items-center gap-2'>
								<Calendar className='w-5 h-5 text-muted-foreground' />
								<select
									value={dateFilter}
									onChange={(e) => setDateFilter(e.target.value)}
									className='flex h-10 w-full rounded-lg border border-input bg-input-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
									<option value='all'>All Time</option>
									<option value='today'>Today</option>
									<option value='week'>Last 7 Days</option>
									<option value='month'>Last 30 Days</option>
								</select>
							</div>
						</div>

						{/* Sales Table */}
						<div className='overflow-x-auto'>
							<table className='w-full'>
								<thead className='border-b'>
									<tr>
										<th className='text-left py-3 px-4'>Transaction ID</th>
										<th className='text-left py-3 px-4'>Date & Time</th>
										<th className='text-left py-3 px-4'>Items</th>
										<th className='text-left py-3 px-4'>Total</th>
										<th className='text-left py-3 px-4'>Payment</th>
										<th className='text-left py-3 px-4'>Cashier</th>
										<th className='text-left py-3 px-4'>Actions</th>
									</tr>
								</thead>
								<tbody className='divide-y'>
									{filteredSales.map((sale) => (
										<tr
											key={sale.id}
											className='hover:bg-accent/10'>
											<td className='py-3 px-4'>#{sale.id}</td>
											<td className='py-3 px-4'>
												<div className='text-sm'>
													<div>
														{new Date(sale.timestamp).toLocaleDateString()}
													</div>
													<div className='text-muted-foreground'>
														{new Date(sale.timestamp).toLocaleTimeString()}
													</div>
												</div>
											</td>
											<td className='py-3 px-4'>
												{sale.items.reduce(
													(sum, item) => sum + item.quantity,
													0
												)}{' '}
												items
											</td>
											<td className='py-3 px-4 font-medium'>
												${sale.total.toFixed(2)}
											</td>
											<td className='py-3 px-4'>
												<span className='px-2 py-1 bg-primary/10 text-primary rounded text-sm capitalize'>
													{sale.paymentMethod}
												</span>
											</td>
											<td className='py-3 px-4 text-primary'>{sale.cashier}</td>
											<td className='py-3 px-4'>
												<Button
													variant='ghost'
													size='icon'
													onClick={() => setSelectedSale(sale)}>
													<Eye className='w-4 h-4' />
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* Empty State */}
						{filteredSales.length === 0 && (
							<div className='text-center py-12 text-muted-foreground'>
								<p>No sales found</p>
							</div>
						)}

						{/* Summary */}
						{filteredSales.length > 0 && (
							<div className='pt-4 border-t'>
								<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
									<div>
										<p className='text-sm text-muted-foreground mb-1'>
											Total Sales
										</p>
										<p className='font-medium'>{filteredSales.length}</p>
									</div>
									<div>
										<p className='text-sm text-muted-foreground mb-1'>
											Total Items Sold
										</p>
										<p className='font-medium'>
											{filteredSales.reduce(
												(sum, sale) =>
													sum +
													sale.items.reduce((s, item) => s + item.quantity, 0),
												0
											)}
										</p>
									</div>
									<div>
										<p className='text-sm text-muted-foreground mb-1'>
											Total Revenue
										</p>
										<p className='font-medium'>
											$
											{filteredSales
												.reduce((sum, sale) => sum + sale.total, 0)
												.toFixed(2)}
										</p>
									</div>
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Sale Details Modal */}
			{selectedSale && (
				<SaleDetailsModal
					sale={selectedSale}
					onClose={() => setSelectedSale(null)}
				/>
			)}
		</div>
	);
}
