/** @format */

// app/page.tsx
'use client';

import { useState } from 'react';
import { Product, Sale } from '@/types';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/admin/dashboard';
import { POSMain } from '@/components/pos/POSMain';
import { SalesHistory } from '@/components/admin/SalesHistory';
import { ProductManagement } from '@/components/admin/ProductManagement';
// Note: These components should be moved to their respective folders
// For now, let's keep them here temporarily and we'll create them properly

// Import the components you already have (from the files you shared)


// Sample initial data
const initialProducts: Product[] = [
	{
		id: '1',
		name: 'Coffee',
		price: 3.99,
		category: 'Beverages',
		stock: 50,
		barcode: '001',
	},
	{
		id: '2',
		name: 'Sandwich',
		price: 6.99,
		category: 'Food',
		stock: 30,
		barcode: '002',
	},
	{
		id: '3',
		name: 'Cake',
		price: 4.99,
		category: 'Desserts',
		stock: 20,
		barcode: '003',
	},
	{
		id: '4',
		name: 'Tea',
		price: 2.99,
		category: 'Beverages',
		stock: 40,
		barcode: '004',
	},
	{
		id: '5',
		name: 'Salad',
		price: 8.99,
		category: 'Food',
		stock: 25,
		barcode: '005',
	},
	{
		id: '6',
		name: 'Cookie',
		price: 1.99,
		category: 'Desserts',
		stock: 60,
		barcode: '006',
	},
];

export default function HomePage() {
	const [products, setProducts] = useState<Product[]>(initialProducts);
	const [sales, setSales] = useState<Sale[]>([]);
	const [currentView, setCurrentView] = useState<
		'dashboard' | 'pos' | 'history' | 'products'
	>('dashboard');

	const handleAddSale = (sale: Sale) => {
		// Update products stock
		const updatedProducts = products.map((product) => {
			const saleItem = sale.items.find((item) => item.id === product.id);
			if (saleItem) {
				return { ...product, stock: product.stock - saleItem.quantity };
			}
			return product;
		});

		setProducts(updatedProducts);
		setSales((prev) => [sale, ...prev]);
	};

	const handleAddProduct = (product: Product) => {
		setProducts((prev) => [...prev, product]);
	};

	const handleUpdateProduct = (product: Product) => {
		setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
	};

	const handleDeleteProduct = (id: string) => {
		setProducts((prev) => prev.filter((p) => p.id !== id));
	};

	const renderView = () => {
		switch (currentView) {
			case 'dashboard':
				return (
					<Dashboard
						sales={sales}
						products={products}
					/>
				);
			case 'pos':
				return (
					<POSMain
						products={products}
						onAddSale={handleAddSale}
					/>
				);
			case 'history':
				return <SalesHistory sales={sales} />;
			case 'products':
				return (
					<ProductManagement
						products={products}
						onAddProduct={handleAddProduct}
						onUpdateProduct={handleUpdateProduct}
						onDeleteProduct={handleDeleteProduct}
					/>
				);
			default:
				return (
					<Dashboard
						sales={sales}
						products={products}
					/>
				);
		}
	};

	return (
		<div className='min-h-screen bg-background'>
			<Header />
			<div className='flex'>
				<Sidebar
					currentView={currentView}
					onViewChange={setCurrentView}
				/>
				<main className='flex-1 p-6 pt-24 md:pt-6'>
					<div className='max-w-7xl mx-auto'>{renderView()}</div>
				</main>
			</div>
		</div>
	);
}
