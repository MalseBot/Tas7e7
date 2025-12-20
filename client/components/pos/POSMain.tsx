/** @format */

// components/pos/POSMain.tsx
'use client';

import { useState } from 'react';
import { Product, CartItem, Sale } from '@/types';
import { ProductGrid } from '@/components/pos/ProductGrid';
import { Cart } from '@/components/pos/Cart';
import { ReceiptModal } from '@/components/pos/ReceiptModal';
import { Card } from '@/components/ui/card';
import { CheckoutModal } from '../CheckoutModal';

interface POSMainProps {
	products: Product[];
	onAddSale: (sale: Sale) => void;
}

export function POSMain({ products, onAddSale }: POSMainProps) {
	const [cart, setCart] = useState<CartItem[]>([]);
	const [showCheckout, setShowCheckout] = useState(false);
	const [showReceipt, setShowReceipt] = useState(false);
	const [lastSale, setLastSale] = useState<Sale | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<string>('All');

	const categories = [
		'All',
		...Array.from(new Set(products.map((p) => p.category))),
	];

	const addToCart = (product: Product) => {
		const existingItem = cart.find((item) => item.id === product.id);
		if (existingItem) {
			if (existingItem.quantity < product.stock) {
				setCart(
					cart.map((item) =>
						item.id === product.id
							? { ...item, quantity: item.quantity + 1 }
							: item
					)
				);
			}
		} else {
			if (product.stock > 0) {
				setCart([...cart, { ...product, quantity: 1 }]);
			}
		}
	};

	const updateQuantity = (id: string, quantity: number) => {
		if (quantity === 0) {
			setCart(cart.filter((item) => item.id !== id));
		} else {
			const product = products.find((p) => p.id === id);
			if (product && quantity <= product.stock) {
				setCart(
					cart.map((item) => (item.id === id ? { ...item, quantity } : item))
				);
			}
		}
	};

	const removeFromCart = (id: string) => {
		setCart(cart.filter((item) => item.id !== id));
	};

	const clearCart = () => {
		setCart([]);
	};

	const handleCheckout = (
		paymentMethod: 'cash' | 'card' | 'mobile',
		discount: number
	) => {
		const subtotal = cart.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0
		);
		const tax = subtotal * 0.1; // 10% tax
		const total = subtotal + tax - discount;

		const sale: Sale = {
			id: Date.now().toString(),
			items: cart,
			subtotal,
			tax,
			discount,
			total,
			paymentMethod,
			cashier: 'Admin',
			timestamp: new Date(),
		};

		onAddSale(sale);
		setLastSale(sale);
		setShowCheckout(false);
		setCart([]);
		setShowReceipt(true);
	};

	const filteredProducts =
		selectedCategory === 'All'
			? products
			: products.filter((p) => p.category === selectedCategory);

	return (
		<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
			{/* Product Selection Area */}
			<div className='lg:col-span-2'>
				{/* Category Filter */}
				<Card className='p-4 mb-4'>
					<div className='flex gap-2 flex-wrap'>
						{categories.map((category) => (
							<button
								key={category}
								onClick={() => setSelectedCategory(category)}
								className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
									selectedCategory === category
										? 'bg-primary text-primary-foreground'
										: 'bg-secondary/20 text-foreground hover:bg-secondary hover:text-secondary-foreground'
								}`}>
								{category}
							</button>
						))}
					</div>
				</Card>

				<ProductGrid
					products={filteredProducts}
					onAddToCart={addToCart}
				/>
			</div>

			{/* Cart Area */}
			<div className='lg:col-span-1'>
				<Cart
					items={cart}
					onUpdateQuantity={updateQuantity}
					onRemoveItem={removeFromCart}
					onClearCart={clearCart}
					onCheckout={() => setShowCheckout(true)}
				/>
			</div>

			{/* Checkout Modal */}
			{showCheckout && (
				<CheckoutModal
					cart={cart}
					onClose={() => setShowCheckout(false)}
					onConfirm={handleCheckout}
				/>
			)}

			{/* Receipt Modal */}
			{showReceipt && lastSale && (
				<ReceiptModal
					sale={lastSale}
					onClose={() => setShowReceipt(false)}
				/>
			)}
		</div>
	);
}
