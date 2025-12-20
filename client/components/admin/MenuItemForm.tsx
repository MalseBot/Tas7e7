/** @format */

// components/admin/MenuItemForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { menuItemSchema, MenuItemFormData } from '@/lib/validations';
import { useCreateMenuItem } from '@/hooks/useMenu';
import { MENU_CATEGORIES } from '@/lib/constants';

interface MenuItemFormProps {
	onSuccess?: () => void;
	initialData?: any;
}

export default function MenuItemForm({
	onSuccess,
	initialData,
}: MenuItemFormProps) {
	const [tags, setTags] = useState<string[]>(initialData?.tags || []);
	const [tagInput, setTagInput] = useState('');

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<MenuItemFormData>({
		resolver: zodResolver(menuItemSchema),
		defaultValues: initialData || {
			name: '',
			description: '',
			price: 0,
			cost: 0,
			category: 'drinks',
			preparationTime: 10,
			stock: 0,
			isAvailable: true,
		},
	});

	const createMenuItem = useCreateMenuItem();

	const onSubmit = async (data: MenuItemFormData) => {
		try {
			await createMenuItem.mutateAsync({
				...data,
				tags: tags.length > 0 ? tags : undefined,
			});

			if (onSuccess) onSuccess();
		} catch (error) {
			console.error('Failed to create menu item:', error);
		}
	};

	const addTag = () => {
		if (tagInput.trim() && !tags.includes(tagInput.trim())) {
			setTags([...tags, tagInput.trim()]);
			setTagInput('');
		}
	};

	const removeTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='space-y-6'>
			{/* Basic Information */}
			<div className='space-y-4'>
				<div>
					<Label htmlFor='name'>Item Name *</Label>
					<Input
						id='name'
						{...register('name')}
						placeholder='e.g., Espresso'
						className='mt-1'
					/>
					{errors.name && (
						<p className='text-sm text-destructive mt-1'>
							{errors.name.message}
						</p>
					)}
				</div>

				<div>
					<Label htmlFor='description'>Description</Label>
					<Textarea
						id='description'
						{...register('description')}
						placeholder='Describe the item...'
						className='mt-1'
						rows={3}
					/>
				</div>

				<div className='grid grid-cols-2 gap-4'>
					<div>
						<Label htmlFor='price'>Price ($) *</Label>
						<Input
							id='price'
							type='number'
							step='0.01'
							{...register('price', { valueAsNumber: true })}
							className='mt-1'
						/>
						{errors.price && (
							<p className='text-sm text-destructive mt-1'>
								{errors.price.message}
							</p>
						)}
					</div>

					<div>
						<Label htmlFor='cost'>Cost ($)</Label>
						<Input
							id='cost'
							type='number'
							step='0.01'
							{...register('cost', { valueAsNumber: true })}
							className='mt-1'
						/>
					</div>
				</div>
			</div>

			{/* Category & Details */}
			<div className='grid grid-cols-2 gap-4'>
				<div>
					<Label htmlFor='category'>Category *</Label>
					<Select
						onValueChange={(value) => setValue('category', value)}
						defaultValue={watch('category')}>
						<SelectTrigger className='mt-1'>
							<SelectValue placeholder='Select category' />
						</SelectTrigger>
						<SelectContent>
							{MENU_CATEGORIES.map((category) => (
								<SelectItem
									key={category}
									value={category}
									className='capitalize'>
									{category}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.category && (
						<p className='text-sm text-destructive mt-1'>
							{errors.category.message}
						</p>
					)}
				</div>

				<div>
					<Label htmlFor='subCategory'>Sub Category</Label>
					<Input
						id='subCategory'
						{...register('subCategory')}
						placeholder='e.g., coffee, sandwich'
						className='mt-1'
					/>
				</div>
			</div>

			<div className='grid grid-cols-3 gap-4'>
				<div>
					<Label htmlFor='preparationTime'>Prep Time (min)</Label>
					<Input
						id='preparationTime'
						type='number'
						{...register('preparationTime', { valueAsNumber: true })}
						className='mt-1'
					/>
				</div>

				<div>
					<Label htmlFor='stock'>Initial Stock</Label>
					<Input
						id='stock'
						type='number'
						{...register('stock', { valueAsNumber: true })}
						className='mt-1'
					/>
				</div>

				<div className='flex items-end'>
					<div className='flex items-center space-x-2'>
						<Switch
							id='isAvailable'
							checked={watch('isAvailable')}
							onCheckedChange={(checked) => setValue('isAvailable', checked)}
						/>
						<Label htmlFor='isAvailable'>Available</Label>
					</div>
				</div>
			</div>

			{/* Tags */}
			<div>
				<Label>Tags</Label>
				<div className='flex gap-2 mt-1'>
					<Input
						value={tagInput}
						onChange={(e) => setTagInput(e.target.value)}
						placeholder='Add a tag...'
						onKeyDown={(e) =>
							e.key === 'Enter' && (e.preventDefault(), addTag())
						}
					/>
					<Button
						type='button'
						onClick={addTag}
						variant='outline'>
						Add
					</Button>
				</div>

				{tags.length > 0 && (
					<div className='flex flex-wrap gap-2 mt-2'>
						{tags.map((tag) => (
							<div
								key={tag}
								className='inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm'>
								{tag}
								<button
									type='button'
									onClick={() => removeTag(tag)}
									className='ml-1 text-muted-foreground hover:text-foreground'>
									×
								</button>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Form Actions */}
			<div className='flex justify-end gap-3 pt-6 border-t'>
				<Button
					type='button'
					variant='outline'
					onClick={onSuccess}>
					Cancel
				</Button>
				<Button
					type='submit'
					variant='café'
					disabled={createMenuItem.isPending}>
					{createMenuItem.isPending ? 'Saving...' : 'Save Item'}
				</Button>
			</div>
		</form>
	);
}
