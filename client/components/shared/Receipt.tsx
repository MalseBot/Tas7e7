/** @format */

// components/shared/Receipt.tsx
'use client';

import { Printer, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ReceiptItem {
	name: string;
	quantity: number;
	price: number;
	total: number;
}

interface ReceiptProps {
	orderNumber: string;
	items: ReceiptItem[];
	subtotal: number;
	tax: number;
	tip: number;
	discount: number;
	total: number;
	paymentMethod: string;
	tableNumber: string;
	customerName?: string;
	date: string;
	cashier: string;
}

export default function Receipt({
	orderNumber,
	items,
	subtotal,
	tax,
	tip,
	discount,
	total,
	paymentMethod,
	tableNumber,
	customerName = 'Guest',
	date,
	cashier,
}: ReceiptProps) {
	const handlePrint = () => {
		window.print();
	};

	const handleDownload = () => {
		const receiptContent = generateReceiptText();
		const blob = new Blob([receiptContent], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `receipt-${orderNumber}.txt`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleCopy = () => {
		const receiptContent = generateReceiptText();
		navigator.clipboard.writeText(receiptContent);
	};

	const generateReceiptText = () => {
		return `
Café POS Receipt
================
Order: ${orderNumber}
Date: ${formatDate(date)}
Table: ${tableNumber}
Customer: ${customerName}
Cashier: ${cashier}
----------------
${items
	.map(
		(item) =>
			`${item.quantity}x ${item.name.padEnd(20)} ${formatCurrency(item.total)}`
	)
	.join('\n')}
----------------
Subtotal: ${formatCurrency(subtotal)}
Tax: ${formatCurrency(tax)}
Tip: ${formatCurrency(tip)}
Discount: -${formatCurrency(discount)}
----------------
TOTAL: ${formatCurrency(total)}
================
Payment: ${paymentMethod}
Thank you for dining with us!
    `.trim();
	};

	return (
		<div className='max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 print:p-0 print:shadow-none'>
			{/* Receipt Header */}
			<div className='text-center mb-6'>
				<div className='text-2xl font-bold text-foreground'>Café POS</div>
				<div className='text-sm text-muted-foreground'>
					Restaurant Management
				</div>
				<div className='text-xs text-muted-foreground mt-1'>
					123 Café Street • (555) 123-4567
				</div>
			</div>

			{/* Order Info */}
			<div className='space-y-2 mb-6 text-sm'>
				<div className='flex justify-between'>
					<span className='text-muted-foreground'>Order #</span>
					<span className='font-medium'>{orderNumber}</span>
				</div>
				<div className='flex justify-between'>
					<span className='text-muted-foreground'>Date</span>
					<span>{formatDate(date)}</span>
				</div>
				<div className='flex justify-between'>
					<span className='text-muted-foreground'>Table</span>
					<span>{tableNumber}</span>
				</div>
				<div className='flex justify-between'>
					<span className='text-muted-foreground'>Customer</span>
					<span>{customerName}</span>
				</div>
				<div className='flex justify-between'>
					<span className='text-muted-foreground'>Cashier</span>
					<span>{cashier}</span>
				</div>
			</div>

			{/* Divider */}
			<div className='border-t border-dashed border-border my-4'></div>

			{/* Order Items */}
			<div className='space-y-3 mb-6'>
				<div className='text-sm font-medium text-muted-foreground'>ITEMS</div>
				{items.map((item, index) => (
					<div
						key={index}
						className='flex justify-between text-sm'>
						<div className='flex-1'>
							<div className='font-medium'>{item.name}</div>
							<div className='text-muted-foreground text-xs'>
								{item.quantity} × {formatCurrency(item.price)}
							</div>
						</div>
						<div className='font-medium'>{formatCurrency(item.total)}</div>
					</div>
				))}
			</div>

			{/* Divider */}
			<div className='border-t border-dashed border-border my-4'></div>

			{/* Totals */}
			<div className='space-y-2 mb-6 text-sm'>
				<div className='flex justify-between'>
					<span className='text-muted-foreground'>Subtotal</span>
					<span>{formatCurrency(subtotal)}</span>
				</div>
				<div className='flex justify-between'>
					<span className='text-muted-foreground'>Tax (13%)</span>
					<span>{formatCurrency(tax)}</span>
				</div>
				{tip > 0 && (
					<div className='flex justify-between'>
						<span className='text-muted-foreground'>Tip</span>
						<span>{formatCurrency(tip)}</span>
					</div>
				)}
				{discount > 0 && (
					<div className='flex justify-between text-green-600'>
						<span>Discount</span>
						<span>-{formatCurrency(discount)}</span>
					</div>
				)}
				<div className='flex justify-between text-lg font-bold mt-4 pt-4 border-t'>
					<span>TOTAL</span>
					<span>{formatCurrency(total)}</span>
				</div>
			</div>

			{/* Payment Method */}
			<div className='text-center mb-6'>
				<div className='text-sm text-muted-foreground'>Payment Method</div>
				<div className='font-medium capitalize'>{paymentMethod}</div>
			</div>

			{/* Footer */}
			<div className='text-center text-xs text-muted-foreground'>
				<div className='mb-2'>Thank you for dining with us!</div>
				<div>Please visit again soon</div>
			</div>

			{/* Actions - Hidden when printing */}
			<div className='flex gap-3 mt-8 print:hidden'>
				<Button
					variant='outline'
					className='flex-1'
					onClick={handlePrint}>
					<Printer className='h-4 w-4 mr-2' />
					Print
				</Button>
				<Button
					variant='outline'
					className='flex-1'
					onClick={handleDownload}>
					<Download className='h-4 w-4 mr-2' />
					Download
				</Button>
				<Button
					variant='outline'
					className='flex-1'
					onClick={handleCopy}>
					<Copy className='h-4 w-4 mr-2' />
					Copy
				</Button>
			</div>
		</div>
	);
}
