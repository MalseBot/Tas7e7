/** @format */

// components/admin/ProductManagement.tsx
import { useState } from 'react';
import { Product } from '@/types';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { ProductModal } from './ProductModal';

interface ProductManagementProps {
	products: Product[];
	onUpdateProduct: (product: Product) => void;
	onAddProduct: (product: Product) => void;
	onDeleteProduct: (id: string) => void;
}

export function ProductManagement({
	products,
	onUpdateProduct,
	onAddProduct,
	onDeleteProduct,
}: ProductManagementProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);

	const filteredProducts = products.filter(
		(product) =>
			product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.barcode.includes(searchQuery)
	);

	const handleEdit = (product: Product) => {
		setEditingProduct(product);
		setShowModal(true);
	};

	const handleAdd = () => {
		setEditingProduct(null);
		setShowModal(true);
	};

	const handleSave = (product: Product) => {
		if (editingProduct) {
			onUpdateProduct(product);
		} else {
			onAddProduct(product);
		}
		setShowModal(false);
		setEditingProduct(null);
	};

	const handleDelete = (id: string) => {
		if (confirm('Are you sure you want to delete this product?')) {
			onDeleteProduct(id);
		}
	};

	return (
		<div className='space-y-6'>
			<Card>
				<CardHeader>
					<div className='flex items-center justify-between'>
						<div>
							<CardTitle>Product Management</CardTitle>
							<CardDescription>
								Manage your products, stock, and pricing
							</CardDescription>
						</div>
						<Button onClick={handleAdd}>
							<Plus className='w-5 h-5 mr-2' />
							Add Product
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						<div className='relative'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5' />
							<Input
								placeholder='Search products...'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='pl-10'
							/>
						</div>

						{/* Product Table */}
						<div className='overflow-x-auto'>
							<table className='w-full'>
								<thead className='border-b'>
									<tr>
										<th className='text-left py-3 px-4'>Product Name</th>
										<th className='text-left py-3 px-4'>Category</th>
										<th className='text-left py-3 px-4'>Price</th>
										<th className='text-left py-3 px-4'>Stock</th>
										<th className='text-left py-3 px-4'>Barcode</th>
										<th className='text-left py-3 px-4'>Actions</th>
									</tr>
								</thead>
								<tbody className='divide-y'>
									{filteredProducts.map((product) => (
										<tr
											key={product.id}
											className='hover:bg-accent/10'>
											<td className='py-3 px-4 font-medium'>{product.name}</td>
											<td className='py-3 px-4'>
												<span className='px-2 py-1 bg-primary/10 text-primary rounded text-sm'>
													{product.category}
												</span>
											</td>
											<td className='py-3 px-4'>${product.price.toFixed(2)}</td>
											<td className='py-3 px-4'>
												<span
													className={`${
														product.stock < 10
															? 'text-destructive font-medium'
															: ''
													}`}>
													{product.stock}
												</span>
											</td>
											<td className='py-3 px-4 text-muted-foreground'>
												{product.barcode}
											</td>
											<td className='py-3 px-4'>
												<div className='flex items-center gap-2'>
													<Button
														variant='ghost'
														size='icon'
														onClick={() => handleEdit(product)}>
														<Edit className='w-4 h-4' />
													</Button>
													<Button
														variant='ghost'
														size='icon'
														onClick={() => handleDelete(product.id)}
														className='text-destructive hover:text-destructive'>
														<Trash2 className='w-4 h-4' />
													</Button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* Empty State */}
						{filteredProducts.length === 0 && (
							<div className='text-center py-12 text-muted-foreground'>
								<p>No products found</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Product Modal */}
			{showModal && (
				<ProductModal
					product={editingProduct}
					onClose={() => {
						setShowModal(false);
						setEditingProduct(null);
					}}
					onSave={handleSave}
				/>
			)}
		</div>
	);
}
