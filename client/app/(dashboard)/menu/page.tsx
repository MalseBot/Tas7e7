/** @format */

// app/(dashboard)/menu/page.tsx
'use client';

import { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMenu, useToggleMenuItemAvailability } from '@/hooks/useMenu';
import { formatCurrency } from '@/lib/utils';
import MenuItemForm from '@/components/admin/MenuItemForm';

export default function MenuPage() {
	const [search, setSearch] = useState('');
	const [categoryFilter, setCategoryFilter] = useState<string>('all');
	const [isFormOpen, setIsFormOpen] = useState(false);
	const { data: menuResponse, isLoading } = useMenu();
	const toggleAvailability = useToggleMenuItemAvailability();

	const menuData = menuResponse?.data || {};
	const categories = Object.keys(menuData);
	const allItems = Object.values(menuData).flat();

	const filteredItems = allItems.filter((item: any) => {
		const matchesSearch =
			item.name.toLowerCase().includes(search.toLowerCase()) ||
			item.description?.toLowerCase().includes(search.toLowerCase());

		const matchesCategory =
			categoryFilter === 'all' || item.category === categoryFilter;

		return matchesSearch && matchesCategory;
	});

	const handleToggleAvailability = async (itemId: string) => {
		try {
			await toggleAvailability.mutateAsync(itemId);
		} catch (error) {
			console.error('Failed to toggle availability:', error);
		}
	};

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>
						Menu Management
					</h1>
					<p className='text-muted-foreground'>
						Manage your restaurant's menu items and categories
					</p>
				</div>

				<Dialog
					open={isFormOpen}
					onOpenChange={setIsFormOpen}>
					<DialogTrigger asChild>
						<Button variant='café'>
							<Plus className='h-4 w-4 mr-2' />
							Add Menu Item
						</Button>
					</DialogTrigger>
					<DialogContent className='max-w-2xl'>
						<DialogHeader>
							<DialogTitle>Add New Menu Item</DialogTitle>
						</DialogHeader>
						<MenuItemForm onSuccess={() => setIsFormOpen(false)} />
					</DialogContent>
				</Dialog>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className='p-4'>
					<div className='flex flex-col md:flex-row gap-4'>
						{/* Search */}
						<div className='flex-1'>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
								<Input
									placeholder='Search menu items...'
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className='pl-10'
								/>
							</div>
						</div>

						{/* Category Filter */}
						<div className='flex gap-2 overflow-x-auto pb-2'>
							<Button
								variant={categoryFilter === 'all' ? 'default' : 'outline'}
								size='sm'
								onClick={() => setCategoryFilter('all')}>
								All
							</Button>
							{categories.map((category) => (
								<Button
									key={category}
									variant={categoryFilter === category ? 'default' : 'outline'}
									size='sm'
									onClick={() => setCategoryFilter(category)}
									className='capitalize'>
									{category}
								</Button>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Menu Items Grid */}
			{isLoading ? (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{[...Array(6)].map((_, i) => (
						<Card
							key={i}
							className='animate-pulse'>
							<CardContent className='p-6'>
								<div className='h-40 bg-muted rounded-lg mb-4'></div>
								<div className='h-4 bg-muted rounded w-3/4 mb-2'></div>
								<div className='h-4 bg-muted rounded w-1/2'></div>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{filteredItems.map((item: any) => (
						<Card
							key={item._id}
							className='overflow-hidden'>
							{/* Item Image/Placeholder */}
							<div className='h-48 bg-gradient-to-br from-primary/10 to-secondary/10 relative'>
								<div className='absolute inset-0 flex items-center justify-center'>
									<span className='text-6xl'>
										{item.category === 'drinks'
											? '☕'
											: item.category === 'food'
											? '🍽️'
											: item.category === 'desserts'
											? '🍰'
											: '🥐'}
									</span>
								</div>

								{/* Status Badges */}
								<div className='absolute top-3 right-3 flex gap-2'>
									{!item.isAvailable && (
										<Badge variant='destructive'>Unavailable</Badge>
									)}
									{item.stock > 0 && item.stock < 10 && (
										<Badge
											variant='outline'
											className='bg-amber-100 text-amber-800'>
											Low Stock: {item.stock}
										</Badge>
									)}
								</div>
							</div>

							<CardContent className='p-6'>
								{/* Item Header */}
								<div className='flex items-start justify-between mb-3'>
									<div>
										<h3 className='text-xl font-semibold text-foreground'>
											{item.name}
										</h3>
										<div className='flex items-center gap-2 mt-1'>
											<Badge
												variant='outline'
												className='capitalize'>
												{item.category}
											</Badge>
											{item.subCategory && (
												<Badge
													variant='secondary'
													className='capitalize'>
													{item.subCategory}
												</Badge>
											)}
										</div>
									</div>
									<span className='text-2xl font-bold text-primary'>
										{formatCurrency(item.price)}
									</span>
								</div>

								{/* Description */}
								{item.description && (
									<p className='text-muted-foreground mb-4 line-clamp-2'>
										{item.description}
									</p>
								)}

								{/* Details */}
								<div className='grid grid-cols-2 gap-4 mb-4 text-sm'>
									<div>
										<div className='text-muted-foreground'>Prep Time</div>
										<div className='font-medium'>
											{item.preparationTime} min
										</div>
									</div>
									<div>
										<div className='text-muted-foreground'>In Stock</div>
										<div className='font-medium'>{item.stock}</div>
									</div>
								</div>

								{/* Tags */}
								{item.tags && item.tags.length > 0 && (
									<div className='flex flex-wrap gap-1 mb-4'>
										{item.tags.slice(0, 3).map((tag: string, index: number) => (
											<span
												key={index}
												className='px-2 py-1 bg-muted text-xs rounded'>
												{tag}
											</span>
										))}
										{item.tags.length > 3 && (
											<span className='px-2 py-1 bg-muted text-xs rounded'>
												+{item.tags.length - 3}
											</span>
										)}
									</div>
								)}

								{/* Actions */}
								<div className='flex items-center justify-between'>
									<Button
										variant='outline'
										size='sm'
										onClick={() => handleToggleAvailability(item._id)}>
										{item.isAvailable ? (
											<>
												<EyeOff className='h-3 w-3 mr-2' />
												Disable
											</>
										) : (
											<>
												<Eye className='h-3 w-3 mr-2' />
												Enable
											</>
										)}
									</Button>

									<div className='flex items-center gap-2'>
										<Button
											variant='ghost'
											size='icon'>
											<Edit className='h-4 w-4' />
										</Button>
										<Button
											variant='ghost'
											size='icon'>
											<Trash2 className='h-4 w-4 text-destructive' />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{filteredItems.length === 0 && !isLoading && (
				<div className='text-center py-12'>
					<div className='inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6'>
						<Search className='h-10 w-10 text-muted-foreground' />
					</div>
					<h3 className='text-xl font-semibold text-foreground mb-2'>
						No menu items found
					</h3>
					<p className='text-muted-foreground mb-6'>
						Try adjusting your search or add a new menu item
					</p>
					<Button
						variant='café'
						onClick={() => setIsFormOpen(true)}>
						<Plus className='h-4 w-4 mr-2' />
						Add Menu Item
					</Button>
				</div>
			)}
		</div>
	);
}
