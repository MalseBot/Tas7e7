/** @format */

// components/pos/checkout-modal.tsx
'use client';

import { useState } from 'react';
import { X, CreditCard, DollarSign, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface CheckoutModalProps {
	cart: any[];
	total: number;
	selectedTable: string;
	onClose: () => void;
	onConfirm: (paymentData: any) => void;
	isLoading: boolean;
}

export function CheckoutModal({
	cart,
	total,
	selectedTable,
	onClose,
	onConfirm,
	isLoading,
}: CheckoutModalProps) {
	const [paymentMethod, setPaymentMethod] = useState<
		'cash' | 'card' | 'mobile'
	>('card');
	const [cashAmount, setCashAmount] = useState('');
	const [tip, setTip] = useState(0);
	const [discount, setDiscount] = useState(0);

	const tax = total * 0.13;
	const finalTotal = total + tax + tip - discount;
	const change = cashAmount ? parseFloat(cashAmount) - finalTotal : 0;

	const handleConfirm = () => {
		if (paymentMethod === 'cash' && parseFloat(cashAmount) < finalTotal) {
			alert('Insufficient cash amount');
			return;
		}

		const paymentData = {
			method: paymentMethod,
			tip,
			discount: discount > 0 ? discount : undefined,
			discountCode: discount > 0 ? 'CUSTOM' : undefined,
		};

		onConfirm(paymentData);
	};

	return (
		<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
			<div className='bg-background rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
				{/* Header */}
				<div className='flex items-center justify-between p-6 border-b'>
					<h2 className='text-2xl font-bold'>Checkout</h2>
					<Button
						variant='ghost'
						size='icon'
						onClick={onClose}>
						<X className='w-5 h-5' />
					</Button>
				</div>

				<div className='p-6 space-y-6'>
					{/* Order Summary */}
					<Card>
						<CardContent className='p-6'>
							<h3 className='font-semibold mb-4'>Order Summary</h3>
							<div className='space-y-2'>
								{cart.map((item) => (
									<div
										key={item.menuItem}
										className='flex justify-between'>
										<span className='text-muted-foreground'>
											{item.name} × {item.quantity}
										</span>
										<span>${(item.price * item.quantity).toFixed(2)}</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Payment Method */}
					<div>
						<h3 className='font-semibold mb-4'>Payment Method</h3>
						<div className='grid grid-cols-3 gap-4'>
							<button
								onClick={() => setPaymentMethod('card')}
								className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 ${
									paymentMethod === 'card' ?
										'border-primary bg-primary/10'
									:	'border-border hover:border-primary/50'
								}`}>
								<CreditCard className='w-6 h-6' />
								<span>Card</span>
							</button>
							<button
								onClick={() => setPaymentMethod('cash')}
								className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 ${
									paymentMethod === 'cash' ?
										'border-primary bg-primary/10'
									:	'border-border hover:border-primary/50'
								}`}>
								<DollarSign className='w-6 h-6' />
								<span>Cash</span>
							</button>
							<button
								onClick={() => setPaymentMethod('mobile')}
								className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 ${
									paymentMethod === 'mobile' ?
										'border-primary bg-primary/10'
									:	'border-border hover:border-primary/50'
								}`}>
								<Smartphone className='w-6 h-6' />
								<span>Mobile</span>
							</button>
						</div>
					</div>

					{/* Cash Payment Details */}
					{paymentMethod === 'cash' && (
						<div>
							<label className='block text-sm font-medium mb-2'>
								Cash Received
							</label>
							<Input
								type='number'
								step='0.01'
								value={cashAmount}
								onChange={(e) => setCashAmount(e.target.value)}
								placeholder='0.00'
							/>
							{cashAmount && change >= 0 && (
								<p className='text-sm text-green-600 mt-2'>
									Change: ${change.toFixed(2)}
								</p>
							)}
							{cashAmount && change < 0 && (
								<p className='text-sm text-red-600 mt-2'>Insufficient amount</p>
							)}
						</div>
					)}

					{/* Tip & Discount */}
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-sm font-medium mb-2'>Tip</label>
							<Input
								type='number'
								step='0.01'
								value={tip}
								onChange={(e) => setTip(parseFloat(e.target.value) || 0)}
								placeholder='0.00'
							/>
						</div>
						<div>
							<label className='block text-sm font-medium mb-2'>Discount</label>
							<Input
								type='number'
								step='0.01'
								value={discount}
								onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
								placeholder='0.00'
							/>
						</div>
					</div>

					{/* Totals */}
					<Card>
						<CardContent className='p-6'>
							<div className='space-y-2'>
								<div className='flex justify-between'>
									<span>Subtotal</span>
									<span>${total.toFixed(2)}</span>
								</div>
								<div className='flex justify-between'>
									<span>Tax (13%)</span>
									<span>${tax.toFixed(2)}</span>
								</div>
								{tip > 0 && (
									<div className='flex justify-between'>
										<span>Tip</span>
										<span>${tip.toFixed(2)}</span>
									</div>
								)}
								{discount > 0 && (
									<div className='flex justify-between text-green-600'>
										<span>Discount</span>
										<span>-${discount.toFixed(2)}</span>
									</div>
								)}
								<div className='flex justify-between pt-2 border-t font-bold text-lg'>
									<span>Total</span>
									<span>${finalTotal.toFixed(2)}</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Actions */}
					<div className='flex gap-3'>
						<Button
							variant='outline'
							className='flex-1'
							onClick={onClose}
							disabled={isLoading}>
							Cancel
						</Button>
						<Button
							className='flex-1'
							onClick={handleConfirm}
							disabled={isLoading}>
							{isLoading ? 'Processing...' : 'Complete Sale'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
