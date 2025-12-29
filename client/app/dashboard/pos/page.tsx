/** @format */

// app/dashboard/pos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService, orderService, tableService } from '@/lib/api/services';
import { ProductGrid } from '@/components/pos/product-grid';
import { Cart } from '@/components/pos/cart';
import { TablesView } from '@/components/pos/tables-view';
import { CheckoutModal } from '@/components/pos/checkout-modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, ShoppingCart, Table as TableIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function POSPage() {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [cart, setCart] = useState<any[]>([]);
	const [selectedTable, setSelectedTable] = useState<string>('');
	const [showCheckout, setShowCheckout] = useState(false);
	const [activeTab, setActiveTab] = useState('menu');

	// Fetch data
	const { data: menuData } = useQuery({
		queryKey: ['menu'],
		queryFn: () => menuService.getMenu(),
	});

	const { data: tablesData } = useQuery({
		queryKey: ['tables'],
		queryFn: () => tableService.getTables(),
	});

	// Create order mutation
	const createOrderMutation = useMutation({
		mutationFn: (orderData: any) => orderService.createOrder(orderData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			setCart([]);
			setSelectedTable('');
			setShowCheckout(false);
		},
	});

	const handleTableChange = (tableNumber: string) => {
		setSelectedTable(tableNumber);
	};

	const handleAddToCart = (item: any) => {
		const existingItem = cart.find(
			(cartItem) => cartItem.menuItem === item._id
		);
		if (existingItem) {
			setCart(
				cart.map((cartItem) =>
					cartItem.menuItem === item._id ?
						{ ...cartItem, quantity: cartItem.quantity + 1 }
					:	cartItem
				)
			);
		} else {
			setCart([
				...cart,
				{
					menuItem: item._id,
					name: item.name,
					price: item.price,
					quantity: 1,
				},
			]);
		}
	};

	const handleUpdateQuantity = (itemId: string, quantity: number) => {
		if (quantity === 0) {
			setCart(cart.filter((item) => item.menuItem !== itemId));
		} else {
			setCart(
				cart.map((item) =>
					item.menuItem === itemId ? { ...item, quantity } : item
				)
			);
		}
	};

	const handleCheckout = (paymentData: any) => {
		const orderData = {
			items: cart,
			tableNumber: selectedTable || 'Takeaway',
			paymentMethod: paymentData.method,
			tip: paymentData.tip || 0,
			discountCode: paymentData.discountCode,
		};
		createOrderMutation.mutate(orderData);
	};

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='bg-card rounded-xl border border-border p-6'>
				<h1 className='text-2xl font-bold text-foreground'>{t('pos.title')}</h1>
				<p className='text-muted-foreground'>{t('pos.subtitle')}</p>
			</div>

			{/* Main Content */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Left Column - Menu/Tables */}
				<div className='lg:col-span-2 space-y-6'>
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}>
						<TabsList className='grid grid-cols-2 w-full max-w-md'>
							<TabsTrigger
								value='menu'
								className='flex items-center gap-2'>
								<Package className='w-4 h-4' />
								{t('pos.menu')}
							</TabsTrigger>
							<TabsTrigger
								value='tables'
								className='flex items-center gap-2'>
								<TableIcon className='w-4 h-4' />
								{t('pos.tables')}
							</TabsTrigger>
						</TabsList>

						<TabsContent
							value='menu'
							className='mt-4'>
							<ProductGrid
								menu={menuData?.data.data}
								onAddToCart={handleAddToCart}
							/>
						</TabsContent>

						<TabsContent
							value='tables'
							className='mt-4'>
							<TablesView
								selectedTable={selectedTable}
								onSelectTable={setSelectedTable}
							/>
						</TabsContent>
					</Tabs>
				</div>

				{/* Right Column - Cart */}
				<div className='lg:col-span-1'>
					<Cart
						items={cart}
						selectedTable={selectedTable}
						onTableChange={handleTableChange}
						onUpdateQuantity={handleUpdateQuantity}
						onCheckout={() => setShowCheckout(true)}
					/>
				</div>
			</div>

			{/* Checkout Modal */}
			{showCheckout && (
				<CheckoutModal
					cart={cart}
					total={cart.reduce(
						(sum, item) => sum + item.price * item.quantity,
						0
					)}
					selectedTable={selectedTable}
					onClose={() => setShowCheckout(false)}
					onConfirm={handleCheckout}
					isLoading={createOrderMutation.isPending}
				/>
			)}
		</div>
	);
}
