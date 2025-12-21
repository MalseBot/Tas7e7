/** @format */

// components/pos/product-grid.tsx
'use client';

import { useState } from 'react';
import { Search, Package, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MenuItem {
	_id: string;
	name: string;
	description: string;
	price: number;
	category: string;
	isAvailable: boolean;
	stock: number;
}

interface ProductGridProps {
	menu: Record<string, MenuItem[]> | MenuItem[];
	onAddToCart: (item: MenuItem) => void;
}

export function ProductGrid({ menu, onAddToCart }: ProductGridProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<string>('all');

	// Flatten menu if it's grouped by category
	const menuArray = Array.isArray(menu) ? menu : Object.values(menu).flat();

	// Get unique categories
	const categories = [
		'all',
		...new Set(menuArray.map((item) => item.category)),
	];

	// Filter products
	const filteredProducts = menuArray.filter((item) => {
		const matchesSearch =
			item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.description.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory =
			selectedCategory === 'all' || item.category === selectedCategory;
		return matchesSearch && matchesCategory && item.isAvailable;
	});

	return (
		<Card>
			<CardContent className='p-6'>
				{/* Search and Filter */}
				<div className='space-y-4 mb-6'>
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground' />
						<Input
							placeholder='Search products...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='pl-10'
						/>
					</div>

					<div className='flex gap-2 overflow-x-auto pb-2'>
						{categories.map((category) => (
							<Button
								key={category}
								variant={selectedCategory === category ? 'default' : 'outline'}
								size='sm'
								onClick={() => setSelectedCategory(category)}
								className='capitalize'>
								{category}
							</Button>
						))}
					</div>
				</div>

				{/* Product Grid */}
				{filteredProducts.length === 0 ?
					<div className='text-center py-12 text-muted-foreground'>
						<Package className='w-12 h-12 mx-auto mb-2 opacity-50' />
						<p>No products found</p>
					</div>
				:	<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
						{filteredProducts.map((item) => (
							<button
								key={item._id}
								onClick={() => onAddToCart(item)}
								className='group relative bg-card border border-border rounded-lg p-4 text-left hover:border-primary hover:shadow-md transition-all'>
								<div className='aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center'>
									<Package className='w-8 h-8 text-muted-foreground group-hover:text-primary' />
								</div>
								<h3 className='font-medium text-foreground mb-1 truncate'>
									{item.name}
								</h3>
								<p className='text-sm text-muted-foreground mb-2 line-clamp-2'>
									{item.description}
								</p>
								<div className='flex items-center justify-between'>
									<span className='font-semibold text-primary'>
										${item.price.toFixed(2)}
									</span>
									<Plus className='w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity' />
								</div>
								{item.stock < 10 && (
									<div className='absolute top-2 right-2'>
										<span className='text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full'>
											Low stock: {item.stock}
										</span>
									</div>
								)}
							</button>
						))}
					</div>
				}
			</CardContent>
		</Card>
	);
}
