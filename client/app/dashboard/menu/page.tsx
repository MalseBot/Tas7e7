/** @format */

// app/dashboard/menu/page.tsx
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService } from '@/lib/api/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
	Search,
	Plus,
	MoreHorizontal,
	Edit,
	Trash2,
	Eye,
	Package,
} from 'lucide-react';
import { MenuItemModal } from '@/components/menu/menu-item-modal';

export default function MenuPage() {
	const queryClient = useQueryClient();
	const [searchQuery, setSearchQuery] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [editingItem, setEditingItem] = useState<any>(null);

	const { data: menu, isLoading } = useQuery({
		queryKey: ['menu'],
		queryFn: () => menuService.getMenu({ availableOnly: false }),
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => menuService.deleteMenuItem(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['menu'] });
		},
	});

	const toggleAvailability = useMutation({
		mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
			menuService.updateMenuItem(id, { isAvailable }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['menu'] });
		},
	});

	const menuItems = menu?.data?.flat || [];

	const filteredItems = menuItems.filter(
		(item: any) =>
			item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.description.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleEdit = (item: any) => {
		setEditingItem(item);
		setShowModal(true);
	};

	const handleDelete = (id: string) => {
		if (confirm('Are you sure you want to delete this item?')) {
			deleteMutation.mutate(id);
		}
	};

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>
						Menu Management
					</h1>
					<p className='text-muted-foreground'>
						Manage your restaurant menu items
					</p>
				</div>
				<Button
					onClick={() => {
						setEditingItem(null);
						setShowModal(true);
					}}>
					<Plus className='w-4 h-4 mr-2' />
					Add Item
				</Button>
			</div>

			{/* Search */}
			<Card>
				<CardContent className='p-6'>
					<div className='relative max-w-md'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground' />
						<Input
							placeholder='Search menu items...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='pl-10'
						/>
					</div>
				</CardContent>
			</Card>

			{/* Menu Table */}
			<Card>
				<CardHeader>
					<CardTitle>Menu Items ({filteredItems.length})</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Item</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Price</TableHead>
								<TableHead>Stock</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className='text-right'>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredItems.map((item: any) => (
								<TableRow key={item._id}>
									<TableCell>
										<div className='flex items-center gap-3'>
											<div className='w-10 h-10 bg-muted rounded-lg flex items-center justify-center'>
												<Package className='w-5 h-5 text-muted-foreground' />
											</div>
											<div>
												<p className='font-medium'>{item.name}</p>
												<p className='text-sm text-muted-foreground line-clamp-1'>
													{item.description}
												</p>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<Badge
											variant='outline'
											className='capitalize'>
											{item.category}
										</Badge>
									</TableCell>
									<TableCell className='font-semibold'>
										${item.price.toFixed(2)}
									</TableCell>
									<TableCell>
										<span
											className={
												item.stock < 10 ? 'text-destructive font-medium' : ''
											}>
											{item.stock}
										</span>
									</TableCell>
									<TableCell>
										<Badge
											variant={item.isAvailable ? 'default' : 'destructive'}
											className='cursor-pointer'
											onClick={() =>
												toggleAvailability.mutate({
													id: item._id,
													isAvailable: !item.isAvailable,
												})
											}>
											{item.isAvailable ? 'Available' : 'Unavailable'}
										</Badge>
									</TableCell>
									<TableCell className='text-right'>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant='ghost'
													size='icon'>
													<MoreHorizontal className='w-4 h-4' />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align='end'>
												<DropdownMenuLabel>Actions</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuItem onClick={() => handleEdit(item)}>
													<Edit className='w-4 h-4 mr-2' />
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem>
													<Eye className='w-4 h-4 mr-2' />
													View
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => handleDelete(item._id)}
													className='text-destructive'>
													<Trash2 className='w-4 h-4 mr-2' />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					{filteredItems.length === 0 && (
						<div className='text-center py-12 text-muted-foreground'>
							<Package className='w-12 h-12 mx-auto mb-4 opacity-50' />
							<p>No menu items found</p>
							<p className='text-sm mt-2'>
								{searchQuery ?
									'Try a different search term'
								:	'Add your first menu item'}
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Menu Item Modal */}
			{showModal && (
				<MenuItemModal
					item={editingItem}
					onClose={() => {
						setShowModal(false);
						setEditingItem(null);
					}}
					onSave={() => {
						setShowModal(false);
						setEditingItem(null);
						queryClient.invalidateQueries({ queryKey: ['menu'] });
					}}
				/>
			)}
		</div>
	);
}
