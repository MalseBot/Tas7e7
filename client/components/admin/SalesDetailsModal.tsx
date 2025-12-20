/** @format */

// components/admin/SaleDetailsModal.tsx
'use client';

import { Sale } from '@/types';
import { X } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

interface SaleDetailsModalProps {
	sale: Sale;
	onClose: () => void;
}

export function SaleDetailsModal({ sale, onClose }: SaleDetailsModalProps) {
	return (
		<Dialog
			open={true}
			onOpenChange={onClose}>
			<DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Sale Details</DialogTitle>
					<DialogDescription>Transaction ID: #{sale.id}</DialogDescription>
				</DialogHeader>

				<div className='space-y-6'>
					{/* Transaction Info */}
					<div className='grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg'>
						<div>
							<p className='text-sm text-muted-foreground mb-1'>
								Transaction ID
							</p>
							<p className='font-medium'>#{sale.id}</p>
						</div>
						<div>
							<p className='text-sm text-muted-foreground mb-1'>Date & Time</p>
							<p className='font-medium'>
								{new Date(sale.timestamp).toLocaleDateString()}{' '}
								{new Date(sale.timestamp).toLocaleTimeString()}
							</p>
						</div>
						<div>
							<p className='text-sm text-muted-foreground mb-1'>Cashier</p>
							<p className='font-medium'>{sale.cashier}</p>
						</div>
						<div>
							<p className='text-sm text-muted-foreground mb-1'>
								Payment Method
							</p>
							<p className='font-medium capitalize'>{sale.paymentMethod}</p>
						</div>
					</div>

					{/* Items */}
					<div>
						<h3 className='font-medium mb-3'>Items</h3>
						<div className='border rounded-lg overflow-hidden'>
							<table className='w-full'>
								<thead className='bg-muted/30'>
									<tr>
										<th className='px-4 py-3 text-left text-sm'>Product</th>
										<th className='px-4 py-3 text-center text-sm'>Quantity</th>
										<th className='px-4 py-3 text-right text-sm'>Price</th>
										<th className='px-4 py-3 text-right text-sm'>Total</th>
									</tr>
								</thead>
								<tbody className='divide-y'>
									{sale.items.map((item) => (
										<tr key={item.id}>
											<td className='px-4 py-3'>{item.name}</td>
											<td className='px-4 py-3 text-center text-primary'>
												{item.quantity}
											</td>
											<td className='px-4 py-3 text-right text-primary'>
												${item.price.toFixed(2)}
											</td>
											<td className='px-4 py-3 text-right font-medium'>
												${(item.price * item.quantity).toFixed(2)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* Totals */}
					<div className='bg-muted/30 rounded-lg p-4 space-y-2'>
						<div className='flex justify-between text-muted-foreground'>
							<span>Subtotal</span>
							<span>${sale.subtotal.toFixed(2)}</span>
						</div>
						<div className='flex justify-between text-muted-foreground'>
							<span>Tax</span>
							<span>${sale.tax.toFixed(2)}</span>
						</div>
						{sale.discount > 0 && (
							<div className='flex justify-between text-accent'>
								<span>Discount</span>
								<span>-${sale.discount.toFixed(2)}</span>
							</div>
						)}
						<div className='flex justify-between font-medium pt-2 border-t'>
							<span>Total</span>
							<span>${sale.total.toFixed(2)}</span>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
