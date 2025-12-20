/** @format */

// components/admin/ProductModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

interface ProductModalProps {
	product: Product | null;
	onClose: () => void;
	onSave: (product: Product) => void;
}

export function ProductModal({ product, onClose, onSave }: ProductModalProps) {
	const [formData, setFormData] = useState<Product>({
		id: '',
		name: '',
		price: 0,
		category: '',
		stock: 0,
		barcode: '',
	});

	useEffect(() => {
		if (product) {
			setFormData(product);
		} else {
			setFormData({
				id: Date.now().toString(),
				name: '',
				price: 0,
				category: '',
				stock: 0,
				barcode: '',
			});
		}
	}, [product]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name || !formData.category || !formData.barcode) {
			alert('Please fill in all required fields');
			return;
		}
		onSave(formData);
	};

	return (
		<Dialog
			open={true}
			onOpenChange={onClose}>
			<DialogContent className='max-w-md'>
				<DialogHeader>
					<DialogTitle>
						{product ? 'Edit Product' : 'Add New Product'}
					</DialogTitle>
					<DialogDescription>
						{product
							? 'Update product details'
							: 'Add a new product to your inventory'}
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={handleSubmit}
					className='space-y-4'>
					<div>
						<label className='block text-sm font-medium mb-2'>
							Product Name *
						</label>
						<Input
							type='text'
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							required
						/>
					</div>

					<div>
						<label className='block text-sm font-medium mb-2'>Category *</label>
						<Input
							type='text'
							value={formData.category}
							onChange={(e) =>
								setFormData({ ...formData, category: e.target.value })
							}
							required
						/>
					</div>

					<div>
						<label className='block text-sm font-medium mb-2'>Price *</label>
						<Input
							type='number'
							step='0.01'
							value={formData.price}
							onChange={(e) =>
								setFormData({
									...formData,
									price: parseFloat(e.target.value) || 0,
								})
							}
							required
						/>
					</div>

					<div>
						<label className='block text-sm font-medium mb-2'>Stock *</label>
						<Input
							type='number'
							value={formData.stock}
							onChange={(e) =>
								setFormData({
									...formData,
									stock: parseInt(e.target.value) || 0,
								})
							}
							required
						/>
					</div>

					<div>
						<label className='block text-sm font-medium mb-2'>Barcode *</label>
						<Input
							type='text'
							value={formData.barcode}
							onChange={(e) =>
								setFormData({ ...formData, barcode: e.target.value })
							}
							required
						/>
					</div>

					<div className='flex gap-3 pt-4'>
						<Button
							type='button'
							variant='outline'
							onClick={onClose}
							className='flex-1'>
							Cancel
						</Button>
						<Button
							type='submit'
							className='flex-1'>
							{product ? 'Update' : 'Add'} Product
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
