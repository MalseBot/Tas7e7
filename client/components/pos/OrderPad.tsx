/** @format */

// client/components/pos/OrderPad.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import MenuGrid from './MenuGrid';
import { Cart } from './Cart';

export default function OrderPad() {
	const [tableNumber, setTableNumber] = useState('T1');
	const [customerName, setCustomerName] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [cart, setCart] = useState<any[]>([]);

	// Fetch menu
	const { data: menuResponse, isLoading } = useQuery({
		queryKey: ['menu'],
		queryFn: () => api.get('/menu'),
	});

	const menuData = menuResponse?.data?.flat || [];
	const categories = menuResponse?.data?.data
		? Object.keys(menuResponse.data.data)
		: [];

	const addToCart = (item: any) => {
		const existingItem = cart.find(
			(cartItem) => cartItem.menuItem === item._id
		);

		if (existingItem) {
			setCart(
				cart.map((cartItem) =>
					cartItem.menuItem === item._id
						? { ...cartItem, quantity: cartItem.quantity + 1 }
						: cartItem
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

	return (
		<div className='flex h-[calc(100vh-5rem)]'>
			{/* Menu Section */}
			<div className='w-2/3 p-6 overflow-y-auto'>
				<div className='mb-6'>
					<h1 className='text-2xl font-bold text-gray-900'>New Order</h1>
					<div className='flex gap-4 mt-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Table
							</label>
							<select
								value={tableNumber}
								onChange={(e) => setTableNumber(e.target.value)}
								className='w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'>
								{['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'Takeaway'].map(
									(table) => (
										<option
											key={table}
											value={table}>
											{table}
										</option>
									)
								)}
							</select>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Customer Name
							</label>
							<input
								type='text'
								value={customerName}
								onChange={(e) => setCustomerName(e.target.value)}
								placeholder='Guest'
								className='w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
							/>
						</div>
					</div>
				</div>

				{/* Categories */}
				<div className='flex gap-2 mb-6 overflow-x-auto pb-2'>
					<button
						onClick={() => setSelectedCategory('all')}
						className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
							selectedCategory === 'all'
								? 'bg-blue-600 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}>
						All Items
					</button>
					{categories.map((category) => (
						<button
							key={category}
							onClick={() => setSelectedCategory(category)}
							className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap ${
								selectedCategory === category
									? 'bg-blue-600 text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}`}>
							{category}
						</button>
					))}
				</div>

				{/* Menu Grid */}
				{isLoading ? (
					<div className='flex justify-center items-center h-64'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
					</div>
				) : (
					<MenuGrid
						menuData={menuData}
						selectedCategory={selectedCategory}
						onItemClick={addToCart}
					/>
				)}
			</div>

			{/* Cart Section */}
			<div className='w-1/3 bg-white border-l border-gray-200 p-6'>
				<Cart
					cart={cart}
					tableNumber={tableNumber}
					customerName={customerName}
					onUpdateCart={setCart}
				/>
			</div>
		</div>
	);
}
