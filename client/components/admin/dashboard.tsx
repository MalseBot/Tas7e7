/** @format */

// components/admin/Dashboard.tsx
import { Sale, Product } from '@/types';
import { DollarSign, ShoppingCart, Package, TrendingUp } from 'lucide-react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend,
} from 'recharts';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

interface DashboardProps {
	sales: Sale[];
	products: Product[];
}

export function Dashboard({ sales, products }: DashboardProps) {
	// Calculate stats
	const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
	const totalSales = sales.length;
	const totalItemsSold = sales.reduce(
		(sum, sale) => sum + sale.items.reduce((s, item) => s + item.quantity, 0),
		0
	);
	const lowStockProducts = products.filter((p) => p.stock < 10).length;

	// Get sales for the last 7 days
	const last7Days = Array.from({ length: 7 }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - (6 - i));
		return date;
	});

	const dailySales = last7Days.map((date) => {
		const dayStart = new Date(date);
		dayStart.setHours(0, 0, 0, 0);
		const dayEnd = new Date(date);
		dayEnd.setHours(23, 59, 59, 999);

		const daySales = sales.filter((sale) => {
			const saleDate = new Date(sale.timestamp);
			return saleDate >= dayStart && saleDate <= dayEnd;
		});

		return {
			date: date.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
			}),
			revenue: daySales.reduce((sum, sale) => sum + sale.total, 0),
			sales: daySales.length,
		};
	});

	// Top selling products
	const productSales = new Map<
		string,
		{ name: string; quantity: number; revenue: number }
	>();
	sales.forEach((sale) => {
		sale.items.forEach((item) => {
			const existing = productSales.get(item.id) || {
				name: item.name,
				quantity: 0,
				revenue: 0,
			};
			productSales.set(item.id, {
				name: item.name,
				quantity: existing.quantity + item.quantity,
				revenue: existing.revenue + item.price * item.quantity,
			});
		});
	});

	const topProducts = Array.from(productSales.values())
		.sort((a, b) => b.quantity - a.quantity)
		.slice(0, 5);

	// Payment method distribution
	const paymentMethods = sales.reduce((acc, sale) => {
		acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	const paymentData = Object.entries(paymentMethods).map(([method, count]) => ({
		name: method.charAt(0).toUpperCase() + method.slice(1),
		value: count,
	}));

	const COLORS = [
		'var(--chart-1)',
		'var(--chart-2)',
		'var(--chart-3)',
		'var(--chart-4)',
	];

	return (
		<div className='space-y-6'>
			{/* Stats Cards */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
						<div className='w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center'>
							<DollarSign className='w-6 h-6 text-primary' />
						</div>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>${totalRevenue.toFixed(2)}</div>
						<p className='text-xs text-muted-foreground mt-1'>
							<TrendingUp className='w-4 h-4 inline mr-1' /> From {totalSales}{' '}
							sales
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Sales</CardTitle>
						<div className='w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center'>
							<ShoppingCart className='w-6 h-6 text-secondary' />
						</div>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{totalSales}</div>
						<p className='text-xs text-muted-foreground'>
							All time transactions
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Items Sold</CardTitle>
						<div className='w-10 h-10 bg-accent/60 rounded-lg flex items-center justify-center'>
							<Package className='w-6 h-6 text-accent' />
						</div>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{totalItemsSold}</div>
						<p className='text-xs text-muted-foreground'>Total units</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Low Stock Items
						</CardTitle>
						<div className='w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center'>
							<Package className='w-6 h-6 text-destructive' />
						</div>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{lowStockProducts}</div>
						<p className='text-xs text-destructive mt-1'>Below 10 units</p>
					</CardContent>
				</Card>
			</div>

			{/* Charts */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Revenue Chart */}
				<Card>
					<CardHeader>
						<CardTitle>Sales Overview (Last 7 Days)</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer
							width='100%'
							height={300}>
							<BarChart data={dailySales}>
								<CartesianGrid
									strokeDasharray='3 3'
									className='stroke-muted'
								/>
								<XAxis
									dataKey='date'
									className='fill-muted-foreground'
								/>
								<YAxis className='fill-muted-foreground' />
								<Tooltip />
								<Bar
									dataKey='revenue'
									fill='var(--chart-1)'
								/>
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Payment Methods */}
				<Card>
					<CardHeader>
						<CardTitle>Payment Methods</CardTitle>
					</CardHeader>
					<CardContent>
						{paymentData.length > 0 ? (
							<ResponsiveContainer
								width='100%'
								height={300}>
								<PieChart>
									<Pie
										data={paymentData}
										cx='50%'
										cy='50%'
										labelLine={false}
										label={({ name, percent }) =>
											`${name} ${(percent * 100).toFixed(0)}%`
										}
										outerRadius={80}
										fill='#8884d8'
										dataKey='value'>
										{paymentData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
									<Tooltip />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						) : (
							<div className='h-[300px] flex items-center justify-center text-muted-foreground'>
								No payment data available
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Top Products */}
			<Card>
				<CardHeader>
					<CardTitle>Top Selling Products</CardTitle>
				</CardHeader>
				<CardContent>
					{topProducts.length > 0 ? (
						<div className='overflow-x-auto'>
							<table className='w-full'>
								<thead className='border-b'>
									<tr>
										<th className='text-left py-3 px-4'>Rank</th>
										<th className='text-left py-3 px-4'>Product</th>
										<th className='text-right py-3 px-4'>Quantity Sold</th>
										<th className='text-right py-3 px-4'>Revenue</th>
									</tr>
								</thead>
								<tbody className='divide-y'>
									{topProducts.map((product, index) => (
										<tr
											key={product.name}
											className='hover:bg-accent/10'>
											<td className='py-3 px-4'>#{index + 1}</td>
											<td className='py-3 px-4'>{product.name}</td>
											<td className='py-3 px-4 text-right'>
												{product.quantity}
											</td>
											<td className='py-3 px-4 text-right'>
												${product.revenue.toFixed(2)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className='text-center py-12 text-muted-foreground'>
							<p>No sales data available</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Low Stock Alert */}
			{lowStockProducts > 0 && (
				<Card className='bg-destructive/10 border-destructive/20'>
					<CardHeader>
						<CardTitle className='text-destructive'>Low Stock Alert</CardTitle>
						<CardDescription>
							{lowStockProducts} product{lowStockProducts !== 1 ? 's' : ''}{' '}
							running low on stock
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
							{products
								.filter((p) => p.stock < 10)
								.map((product) => (
									<div
										key={product.id}
										className='bg-card rounded-lg p-3 border border-destructive/20'>
										<p className='font-medium mb-1'>{product.name}</p>
										<p className='text-sm text-destructive'>
											Only {product.stock} left
										</p>
									</div>
								))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
