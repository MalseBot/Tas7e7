/** @format */

import { useState } from 'react';
import { X, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { CartItem } from '@/types';

interface CheckoutModalProps {
	cart: CartItem[];
	onClose: () => void;
	onConfirm: (
		paymentMethod: 'cash' | 'card' | 'mobile',
		discount: number
	) => void;
}

export function CheckoutModal({
	cart,
	onClose,
	onConfirm,
}: CheckoutModalProps) {
	const [paymentMethod, setPaymentMethod] = useState<
		'cash' | 'card' | 'mobile'
	>('card');
	const [discount, setDiscount] = useState(0);
	const [cashAmount, setCashAmount] = useState('');

	const subtotal = cart.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	const tax = subtotal * 0.1;
	const total = subtotal + tax - discount;
	const change = cashAmount ? parseFloat(cashAmount) - total : 0;

	const handleConfirm = () => {
		if (paymentMethod === 'cash' && parseFloat(cashAmount) < total) {
			alert('Insufficient cash amount');
			return;
		}
		onConfirm(paymentMethod, discount);
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
			<div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#628141]'>
				{/* Header */}
				<div className='flex items-center justify-between p-6 border-b border-[#EBD5AB]'>
					<h2 className='text-[#1B211A]'>Checkout</h2>
					<button
						onClick={onClose}
						className='text-[#628141] hover:text-[#8BAE66]'>
						<X className='w-6 h-6' />
					</button>
				</div>

				{/* Content */}
				<div className='p-6'>
					{/* Order Summary */}
					<div className='mb-6'>
						<h3 className='text-[#1B211A] mb-3'>Order Summary</h3>
						<div className='bg-[#EBD5AB]/30 rounded-lg p-4 space-y-2 border border-[#628141]/20'>
							{cart.map((item) => (
								<div
									key={item.id}
									className='flex justify-between text-sm'>
									<span className='text-[#628141]'>
										{item.name} x {item.quantity}
									</span>
									<span className='text-[#1B211A]'>
										${(item.price * item.quantity).toFixed(2)}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Payment Method */}
					<div className='mb-6'>
						<h3 className='text-[#1B211A] mb-3'>Payment Method</h3>
						<div className='grid grid-cols-3 gap-3'>
							<button
								onClick={() => setPaymentMethod('card')}
								className={`p-4 rounded-lg border-2 transition-all ${
									paymentMethod === 'card'
										? 'border-[#628141] bg-[#8BAE66]/20'
										: 'border-[#EBD5AB] hover:border-[#628141]/50'
								}`}>
								<CreditCard className='w-8 h-8 mx-auto mb-2 text-[#628141]' />
								<p className='text-sm text-[#1B211A]'>Card</p>
							</button>
							<button
								onClick={() => setPaymentMethod('cash')}
								className={`p-4 rounded-lg border-2 transition-all ${
									paymentMethod === 'cash'
										? 'border-[#628141] bg-[#8BAE66]/20'
										: 'border-[#EBD5AB] hover:border-[#628141]/50'
								}`}>
								<Banknote className='w-8 h-8 mx-auto mb-2 text-[#628141]' />
								<p className='text-sm text-[#1B211A]'>Cash</p>
							</button>
							<button
								onClick={() => setPaymentMethod('mobile')}
								className={`p-4 rounded-lg border-2 transition-all ${
									paymentMethod === 'mobile'
										? 'border-[#628141] bg-[#8BAE66]/20'
										: 'border-[#EBD5AB] hover:border-[#628141]/50'
								}`}>
								<Smartphone className='w-8 h-8 mx-auto mb-2 text-[#628141]' />
								<p className='text-sm text-[#1B211A]'>Mobile</p>
							</button>
						</div>
					</div>

					{/* Cash Payment Details */}
					{paymentMethod === 'cash' && (
						<div className='mb-6'>
							<label className='block text-[#1B211A] mb-2'>Cash Received</label>
							<input
								type='number'
								step='0.01'
								value={cashAmount}
								onChange={(e) => setCashAmount(e.target.value)}
								placeholder='0.00'
								className='w-full px-4 py-2 border border-[#628141]/30 rounded-lg focus:ring-2 focus:ring-[#628141] focus:border-transparent'
							/>
							{cashAmount && change >= 0 && (
								<p className='mt-2 text-[#628141]'>
									Change: ${change.toFixed(2)}
								</p>
							)}
							{cashAmount && change < 0 && (
								<p className='mt-2 text-red-600'>Insufficient amount</p>
							)}
						</div>
					)}

					{/* Discount */}
					<div className='mb-6'>
						<label className='block text-[#1B211A] mb-2'>Discount</label>
						<input
							type='number'
							step='0.01'
							value={discount}
							onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
							placeholder='0.00'
							className='w-full px-4 py-2 border border-[#628141]/30 rounded-lg focus:ring-2 focus:ring-[#628141] focus:border-transparent'
						/>
					</div>

					{/* Total */}
					<div className='bg-[#EBD5AB]/30 rounded-lg p-4 space-y-2 mb-6 border border-[#628141]/20'>
						<div className='flex justify-between text-[#628141]'>
							<span>Subtotal</span>
							<span>${subtotal.toFixed(2)}</span>
						</div>
						<div className='flex justify-between text-[#628141]'>
							<span>Tax (10%)</span>
							<span>${tax.toFixed(2)}</span>
						</div>
						{discount > 0 && (
							<div className='flex justify-between text-[#8BAE66]'>
								<span>Discount</span>
								<span>-${discount.toFixed(2)}</span>
							</div>
						)}
						<div className='flex justify-between text-[#1B211A] pt-2 border-t border-[#628141]/20'>
							<span>Total</span>
							<span>${total.toFixed(2)}</span>
						</div>
					</div>

					{/* Actions */}
					<div className='flex gap-3'>
						<button
							onClick={onClose}
							className='flex-1 px-4 py-3 border-2 border-[#628141]/30 rounded-lg hover:bg-[#EBD5AB]/30 transition-colors text-[#1B211A]'>
							Cancel
						</button>
						<button
							onClick={handleConfirm}
							className='flex-1 px-4 py-3 bg-[#628141] text-white rounded-lg hover:bg-[#8BAE66] transition-colors'>
							Complete Sale
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
