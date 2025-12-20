/** @format */

// components/layout/Sidebar.tsx
'use client';

import {
	LayoutDashboard,
	ShoppingCart,
	History,
	Package,
	Settings,
	LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
	currentView: string;
	onViewChange: (view: 'dashboard' | 'pos' | 'history' | 'products') => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
	const menuItems = [
		{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
		{ id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
		{ id: 'history', label: 'Sales History', icon: History },
		{ id: 'products', label: 'Products', icon: Package },
	];

	return (
		<aside className='hidden md:flex md:w-64 lg:w-72 bg-card border-r border-border flex-col min-h-[calc(100vh-4rem)] mt-16'>
			<nav className='flex-1 p-4'>
				<ul className='space-y-1'>
					{menuItems.map((item) => {
						const Icon = item.icon;
						const isActive = currentView === item.id;

						return (
							<li key={item.id}>
								<Button
									variant={isActive ? 'default' : 'ghost'}
									className={`w-full justify-start gap-3 ${
										isActive
											? ''
											: 'hover:bg-accent hover:text-accent-foreground'
									}`}
									onClick={() => onViewChange(item.id as any)}>
									<Icon className='w-5 h-5' />
									<span className='font-medium'>{item.label}</span>
								</Button>
							</li>
						);
					})}
				</ul>
			</nav>

			<div className='p-4 border-t border-border space-y-2'>
				<Button
					variant='ghost'
					className='w-full justify-start gap-3'>
					<Settings className='w-5 h-5' />
					<span className='font-medium'>Settings</span>
				</Button>

				<Button
					variant='ghost'
					className='w-full justify-start gap-3 text-destructive hover:text-destructive'>
					<LogOut className='w-5 h-5' />
					<span className='font-medium'>Logout</span>
				</Button>
			</div>
		</aside>
	);
}
