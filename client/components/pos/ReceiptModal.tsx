/** @format */

import { Sale } from '@/types';
import { X, Printer } from 'lucide-react';

interface ReceiptModalProps {
	sale: Sale;
	onClose: () => void;
}

export function ReceiptModal({ sale, onClose }: ReceiptModalProps) {
	const handlePrint = () => {
		window.print();
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
			<div className='bg-white rounded-lg max-w-md w-full border-2 border-[#628141]'>
				{/* Header */}
				<div className='flex items-center justify-between p-6 border-b border-[#EBD5AB]'>
					<h2 className='text-[#1B211A]'>Receipt</h2>
					<button
						onClick={onClose}
						className='text-[#628141] hover:text-[#8BAE66]'>
						<X className='w-6 h-6' />
					</button>
				</div>

				{/* Receipt Content */}
				<div
					className='p-6'
					id='receipt'>
					<div className='text-center mb-6'>
						<h1 className='text-[#1B211A] mb-1'>StorePOS</h1>
						<p className='text-sm text-[#628141]'>123 Main Street</p>
						<p className='text-sm text-[#628141]'>Phone: (555) 123-4567</p>
					</div>

					<div className='border-t border-b border-[#EBD5AB] py-3 mb-3'>
						<p className='text-sm text-[#628141]'>Transaction ID: {sale.id}</p>
						<p className='text-sm text-[#628141]'>
							Date: {sale.timestamp.toLocaleDateString()}{' '}
							{sale.timestamp.toLocaleTimeString()}
						</p>
						<p className='text-sm text-[#628141]'>Cashier: {sale.cashier}</p>
					</div>

					<div className='mb-4'>
						<table className='w-full text-sm'>
							<thead>
								<tr className='border-b border-[#EBD5AB]'>
									<th className='text-left py-2 text-[#1B211A]'>Item</th>
									<th className='text-center py-2 text-[#1B211A]'>Qty</th>
									<th className='text-right py-2 text-[#1B211A]'>Price</th>
									<th className='text-right py-2 text-[#1B211A]'>Total</th>
								</tr>
							</thead>
							<tbody>
								{sale.items.map((item) => (
									<tr
										key={item.id}
										className='border-b border-[#EBD5AB]/50'>
										<td className='py-2 text-[#628141]'>{item.name}</td>
										<td className='py-2 text-center text-[#628141]'>
											{item.quantity}
										</td>
										<td className='py-2 text-right text-[#628141]'>
											${item.price.toFixed(2)}
										</td>
										<td className='py-2 text-right text-[#1B211A]'>
											${(item.price * item.quantity).toFixed(2)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className='border-t border-[#EBD5AB] pt-3 space-y-2'>
						<div className='flex justify-between text-sm text-[#628141]'>
							<span>Subtotal</span>
							<span>${sale.subtotal.toFixed(2)}</span>
						</div>
						<div className='flex justify-between text-sm text-[#628141]'>
							<span>Tax</span>
							<span>${sale.tax.toFixed(2)}</span>
						</div>
						{sale.discount > 0 && (
							<div className='flex justify-between text-sm text-[#8BAE66]'>
								<span>Discount</span>
								<span>-${sale.discount.toFixed(2)}</span>
							</div>
						)}
						<div className='flex justify-between text-[#1B211A] pt-2 border-t border-[#EBD5AB]'>
							<span>Total</span>
							<span>${sale.total.toFixed(2)}</span>
						</div>
						<div className='flex justify-between text-sm text-[#628141] pt-2'>
							<span>Payment Method</span>
							<span className='capitalize'>{sale.paymentMethod}</span>
						</div>
					</div>

					<div className='text-center mt-6 pt-4 border-t border-[#EBD5AB]'>
						<p className='text-sm text-[#628141]'>
							Thank you for your purchase!
						</p>
					</div>
				</div>

				{/* Actions */}
				<div className='p-6 border-t border-[#EBD5AB] flex gap-3'>
					<button
						onClick={handlePrint}
						className='flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#628141]/30 rounded-lg hover:bg-[#EBD5AB]/30 transition-colors text-[#1B211A]'>
						<Printer className='w-5 h-5' />
						Print
					</button>
					<button
						onClick={onClose}
						className='flex-1 px-4 py-3 bg-[#628141] text-white rounded-lg hover:bg-[#8BAE66] transition-colors'>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}
