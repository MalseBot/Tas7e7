/** @format */

// components/menu/menu-item-modal.tsx
'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService } from '@/lib/api/services';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface MenuItemModalProps {
	item?: any;
	onClose: () => void;
	onSave: () => void;
}

export function MenuItemModal({ item, onClose, onSave }: MenuItemModalProps) {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [formData, setFormData] = useState({
		name: item?.name || '',
		description: item?.description || '',
		price: item?.price || 0,
		cost: item?.cost || 0,
		category: item?.category || 'drinks',
		subCategory: item?.subCategory || '',
		preparationTime: item?.preparationTime || 10,
		stock: item?.stock || 0,
		isAvailable: item?.isAvailable ?? true,
	});

	const categories = [
		'drinks',
		'food',
		'desserts',
		'pastries',
		'breakfast',
		'lunch',
		'dinner',
	];
	const subCategories: Record<string, string[]> = {
		drinks: ['coffee', 'tea', 'juice', 'soda'],
		food: ['breakfast', 'lunch', 'dinner', 'appetizer'],
		desserts: ['cake', 'pie', 'ice cream'],
		pastries: ['croissant', 'muffin', 'cookie'],
	};

	const saveMutation = useMutation({
		mutationFn: () =>
			item ?
				menuService.updateMenuItem(item._id, formData)
			:	menuService.createMenuItem(formData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['menu'] });
			onSave();
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		saveMutation.mutate();
	};

	const getCategoryLabel = (cat: string) => {
		return t(`menu.categories.${cat}`, cat);
	};

	const getSubCategoryLabel = (sub: string) => {
		return t(`menu.subcategories.${sub}`, sub);
	};

	return (
		<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
			<div className='bg-background rounded-xl max-w-md w-full'>
				{/* Header */}
				<div className='flex items-center justify-between p-6 border-b'>
					<h2 className='text-2xl font-bold'>
						{item ?
							t('menuItemModal.editMenuItem')
						:	t('menuItemModal.addMenuItem')}
					</h2>
					<Button
						variant='ghost'
						size='icon'
						onClick={onClose}>
						<X className='w-5 h-5' />
					</Button>
				</div>

				<form
					onSubmit={handleSubmit}
					className='p-6 space-y-4'>
					<div>
						<label className='block text-sm font-medium mb-2'>
							{t('menuItemModal.name')} *
						</label>
						<Input
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							required
						/>
					</div>

					<div>
						<label className='block text-sm font-medium mb-2'>
							{t('menuItemModal.description')}
						</label>
						<Input
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
						/>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-sm font-medium mb-2'>
								{t('menuItemModal.price')} *
							</label>
							<Input
								type='number'
								step='0.01'
								value={formData.price}
								onChange={(e) =>
									setFormData({
										...formData,
										price: parseFloat(e.target.value),
									})
								}
								required
							/>
						</div>
						<div>
							<label className='block text-sm font-medium mb-2'>
								{t('menuItemModal.cost')}
							</label>
							<Input
								type='number'
								step='0.01'
								value={formData.cost}
								onChange={(e) =>
									setFormData({ ...formData, cost: parseFloat(e.target.value) })
								}
							/>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-sm font-medium mb-2'>
								{t('menuItemModal.category')} *
							</label>
							<select
								className='w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm'
								value={formData.category}
								onChange={(e) =>
									setFormData({
										...formData,
										category: e.target.value,
										subCategory: '',
									})
								}>
								{categories.map((cat) => (
									<option
										key={cat}
										value={cat}>
										{getCategoryLabel(cat)}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className='block text-sm font-medium mb-2'>
								{t('menuItemModal.subCategory')}
							</label>
							<select
								className='w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm'
								value={formData.subCategory}
								onChange={(e) =>
									setFormData({ ...formData, subCategory: e.target.value })
								}>
								<option value=''>{t('common.none')}</option>
								{subCategories[formData.category]?.map((sub) => (
									<option
										key={sub}
										value={sub}>
										{getSubCategoryLabel(sub)}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-sm font-medium mb-2'>
								{t('menuItemModal.preparationTime')}
							</label>
							<Input
								type='number'
								value={formData.preparationTime}
								onChange={(e) =>
									setFormData({
										...formData,
										preparationTime: parseInt(e.target.value),
									})
								}
							/>
						</div>
						<div>
							<label className='block text-sm font-medium mb-2'>
								{t('menuItemModal.stock')}
							</label>
							<Input
								type='number'
								value={formData.stock}
								onChange={(e) =>
									setFormData({ ...formData, stock: parseInt(e.target.value) })
								}
							/>
						</div>
					</div>

					<div className='flex items-center gap-2'>
						<input
							type='checkbox'
							id='isAvailable'
							checked={formData.isAvailable}
							onChange={(e) =>
								setFormData({ ...formData, isAvailable: e.target.checked })
							}
							className='rounded border-gray-300'
						/>
						<label
							htmlFor='isAvailable'
							className='text-sm'>
							{t('menuItemModal.isAvailable')}
						</label>
					</div>

					<div className='flex gap-3 pt-4'>
						<Button
							type='button'
							variant='outline'
							className='flex-1'
							onClick={onClose}
							disabled={saveMutation.isPending}>
							{t('common.cancel')}
						</Button>
						<Button
							type='submit'
							className='flex-1'
							disabled={saveMutation.isPending}>
							{saveMutation.isPending ?
								t('menuItemModal.saving')
							: item ?
								t('common.update')
							:	t('menuItemModal.addItem')}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
