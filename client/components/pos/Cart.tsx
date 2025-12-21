/** @format */

// components/pos/cart.tsx
'use client';

import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingCart, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CartItem {
	menuItem: string;
	name: string;
	price: number;
	quantity: number;
}

interface CartProps {
	items: CartItem[];
	selectedTable: string;
	onUpdateQuantity: (itemId: string, quantity: number) => void;
	onCheckout: () => void;
}

export function Cart({
	items,
	selectedTable,
	onUpdateQuantity,
	onCheckout,
}: CartProps) {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const subtotal = items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	const tax = subtotal * 0.13; // 13% tax
	const total = subtotal + tax;

	if (isCollapsed) {
		return (
			<Button
				variant='outline'
				className='fixed right-4 top-4 z-50'
				onClick={() => setIsCollapsed(false)}>
				<ShoppingCart className='w-4 h-4 mr-2' />
				<Badge
					variant='secondary'
					className='ml-2'>
					{items.length}
				</Badge>
			</Button>
		);
	}

	return (
		<Card className='sticky top-4 h-[calc(100vh-2rem)]'>
			<CardHeader className='flex flex-row items-center justify-between'>
				<CardTitle className='flex items-center gap-2'>
					<ShoppingCart className='w-5 h-5' />
					Current Order
				</CardTitle>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => setIsCollapsed(true)}>
					<X className='w-4 h-4' />
				</Button>
			</CardHeader>

			<CardContent className='overflow-y-auto h-[calc(100%-12rem)]'>
				{items.length === 0 ?
					<div className='text-center py-12 text-muted-foreground'>
						<ShoppingCart className='w-12 h-12 mx-auto mb-4 opacity-50' />
						<p>Your cart is empty</p>
						<p className='text-sm mt-2'>Add items from the menu</p>
					</div>
				:	<div className='space-y-3'>
						{items.map((item) => (
							<div
								key={item.menuItem}
								className='bg-muted/30 rounded-lg p-3 border'>
								<div className='flex justify-between items-start mb-2'>
									<h4 className='font-medium text-foreground'>{item.name}</h4>
									<Button
										variant='ghost'
										size='icon'
										className='h-6 w-6'
										onClick={() => onUpdateQuantity(item.menuItem, 0)}>
										<Trash2 className='w-3 h-3' />
									</Button>
								</div>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<Button
											variant='outline'
											size='icon'
											className='h-7 w-7'
											onClick={() =>
												onUpdateQuantity(item.menuItem, item.quantity - 1)
											}>
											<Minus className='w-3 h-3' />
										</Button>
										<span className='w-8 text-center font-medium'>
											{item.quantity}
										</span>
										<Button
											variant='outline'
											size='icon'
											className='h-7 w-7'
											onClick={() =>
												onUpdateQuantity(item.menuItem, item.quantity + 1)
											}>
											<Plus className='w-3 h-3' />
										</Button>
									</div>
									<div className='text-right'>
										<p className='text-sm text-muted-foreground'>
											${item.price.toFixed(2)} each
										</p>
										<p className='font-semibold'>
											${(item.price * item.quantity).toFixed(2)}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				}
			</CardContent>

			{items.length > 0 && (
				<div className='absolute bottom-0 left-0 right-0 border-t p-6'>
					{/* Table Selection */}
					<div className='mb-4'>
						<label className='block text-sm font-medium text-foreground mb-2'>
							Table
						</label>
						<div className='flex gap-2'>
							<input
								type='text'
								value={selectedTable}
								onChange={(e) => {
									/* Handle table change */
								}}
								placeholder='Table number'
								className='flex-1 px-3 py-2 border rounded-lg'
							/>
							<Button variant='outline'>Takeaway</Button>
						</div>
					</div>

					{/* Totals */}
					<div className='space-y-2 mb-6'>
						<div className='flex justify-between text-sm'>
							<span className='text-muted-foreground'>Subtotal</span>
							<span>${subtotal.toFixed(2)}</span>
						</div>
						<div className='flex justify-between text-sm'>
							<span className='text-muted-foreground'>Tax (13%)</span>
							<span>${tax.toFixed(2)}</span>
						</div>
						<div className='flex justify-between pt-2 border-t font-semibold'>
							<span>Total</span>
							<span>${total.toFixed(2)}</span>
						</div>
					</div>

					<Button
						className='w-full'
						size='lg'
						onClick={onCheckout}
						disabled={items.length === 0}>
						Proceed to Checkout
					</Button>
				</div>
			)}
		</Card>
	);
}
