/** @format */

// components/pos/ProductGrid.tsx
'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { Search, Plus, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '../ui/button';

interface ProductGridProps {
	products: Product[];
	onAddToCart: (product: Product) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
	const [searchQuery, setSearchQuery] = useState('');

	const filteredProducts = products.filter(
		(product) =>
			product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.barcode.includes(searchQuery)
	);

	return (
		<Card>
			{/* Search Bar */}
			<div className='p-4 border-b'>
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5' />
					<Input
						type='text'
						placeholder='Search products or scan barcode...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='pl-10'
					/>
				</div>
			</div>

			{/* Product Grid */}
			<div className='p-4 max-h-[calc(100vh-280px)] overflow-y-auto'>
				{filteredProducts.length === 0 ? (
					<div className='text-center py-12 text-muted-foreground'>
						<Package className='w-12 h-12 mx-auto mb-2 opacity-50' />
						<p>No products found</p>
					</div>
				) : (
					<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
						{filteredProducts.map((product) => (
							<Button
								key={product.id}
								onClick={() => onAddToCart(product)}
								disabled={product.stock === 0}
								className={`bg-card border-2 border-border rounded-lg p-4 text-left transition-all hover:shadow-md hover:border-primary ${
									product.stock === 0
										? 'opacity-50 cursor-not-allowed'
										: 'cursor-pointer'
								}`}>
								<div className='aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center'>
									<Package className='w-8 h-8 text-primary' />
								</div>
								<h3 className='font-medium mb-1 truncate'>{product.name}</h3>
								<p className='text-primary mb-2'>${product.price.toFixed(2)}</p>
								<div className='flex items-center justify-between text-xs'>
									<span
										className={`${
											product.stock < 10
												? 'text-destructive'
												: 'text-muted-foreground'
										}`}>
										Stock: {product.stock}
									</span>
									{product.stock > 0 && (
										<Plus className='w-4 h-4 text-primary' />
									)}
								</div>
							</Button>
						))}
					</div>
				)}
			</div>
		</Card>
	);
}
