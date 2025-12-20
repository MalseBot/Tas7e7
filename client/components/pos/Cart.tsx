/** @format */

import { CartItem } from '@/types';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';

interface CartProps {
	items: CartItem[];
	onUpdateQuantity: (id: string, quantity: number) => void;
	onRemoveItem: (id: string) => void;
	onClearCart: () => void;
	onCheckout: () => void;
}

export function Cart({
	items,
	onUpdateQuantity,
	onRemoveItem,
	onClearCart,
	onCheckout,
}: CartProps) {
	const subtotal = items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	const tax = subtotal * 0.1; // 10% tax
	const total = subtotal + tax;

	return (
		<div className='bg-white rounded-lg shadow-sm sticky top-24 border border-[#628141]/20'>
			{/* Cart Header */}
			<div className='p-4 border-b border-[#EBD5AB]'>
				<div className='flex items-center justify-between'>
					<h2 className='text-[#1B211A]'>Current Order</h2>
					{items.length > 0 && (
						<button
							onClick={onClearCart}
							className='text-red-500 hover:text-red-700 text-sm'>
							Clear All
						</button>
					)}
				</div>
			</div>

			{/* Cart Items */}
			<div className='p-4 max-h-[calc(100vh-420px)] overflow-y-auto'>
				{items.length === 0 ? (
					<div className='text-center py-12 text-[#628141]'>
						<ShoppingCart className='w-12 h-12 mx-auto mb-2 opacity-50' />
						<p>Cart is empty</p>
					</div>
				) : (
					<div className='space-y-3'>
						{items.map((item) => (
							<div
								key={item.id}
								className='bg-[#EBD5AB]/30 rounded-lg p-3 border border-[#628141]/10'>
								<div className='flex justify-between items-start mb-2'>
									<h3 className='text-[#1B211A] flex-1'>{item.name}</h3>
									<button
										onClick={() => onRemoveItem(item.id)}
										className='text-red-500 hover:text-red-700 ml-2'>
										<Trash2 className='w-4 h-4' />
									</button>
								</div>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<button
											onClick={() =>
												onUpdateQuantity(item.id, item.quantity - 1)
											}
											className='w-8 h-8 rounded bg-white border border-[#628141]/30 flex items-center justify-center hover:bg-[#8BAE66] hover:text-white'>
											<Minus className='w-4 h-4' />
										</button>
										<span className='w-8 text-center text-[#1B211A]'>
											{item.quantity}
										</span>
										<button
											onClick={() =>
												onUpdateQuantity(item.id, item.quantity + 1)
											}
											className='w-8 h-8 rounded bg-white border border-[#628141]/30 flex items-center justify-center hover:bg-[#8BAE66] hover:text-white'
											disabled={item.quantity >= item.stock}>
											<Plus className='w-4 h-4' />
										</button>
									</div>
									<div className='text-right'>
										<p className='text-sm text-[#628141]'>
											${item.price.toFixed(2)} each
										</p>
										<p className='text-[#628141]'>
											${(item.price * item.quantity).toFixed(2)}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Cart Summary */}
			{items.length > 0 && (
				<div className='p-4 border-t border-[#EBD5AB]'>
					<div className='space-y-2 mb-4'>
						<div className='flex justify-between text-[#628141]'>
							<span>Subtotal</span>
							<span>${subtotal.toFixed(2)}</span>
						</div>
						<div className='flex justify-between text-[#628141]'>
							<span>Tax (10%)</span>
							<span>${tax.toFixed(2)}</span>
						</div>
						<div className='flex justify-between text-[#1B211A] pt-2 border-t border-[#EBD5AB]'>
							<span>Total</span>
							<span>${total.toFixed(2)}</span>
						</div>
					</div>
					<button
						onClick={onCheckout}
						className='w-full bg-[#628141] text-white py-3 rounded-lg hover:bg-[#8BAE66] transition-colors'>
						Proceed to Payment
					</button>
				</div>
			)}
		</div>
	);
}
