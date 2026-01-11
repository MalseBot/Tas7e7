/** @format */

// components/layout/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	LayoutDashboard,
	ShoppingCart,
	ChefHat,
	Package,
	BarChart3,
	Settings,
	Users,
	Receipt,
	Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { authService } from '@/lib/api/services';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface SidebarProps {
	onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
	const pathname = usePathname();
	const { data: user } = useQuery({
		queryKey: ['current-profile'],
		queryFn: () => authService.getProfile(),
	});
	const { t } = useTranslation(); // Direct import

	const menuItems = [
		{ href: '/dashboard', label: t('dashboard.title'), icon: LayoutDashboard },
		{ href: '/dashboard/pos', label: t('pos.title'), icon: ShoppingCart },
		{ href: '/dashboard/kitchen', label: t('kitchen.title'), icon: ChefHat },
		{ href: '/dashboard/orders', label: t('orders.title'), icon: Receipt },
		{ href: '/dashboard/menu', label: t('menu.title'), icon: Package },
		{ href: '/dashboard/staff', label: t('staff.title'), icon: Users },
		{ href: '/dashboard/settings', label: t('settings.title'), icon: Settings },
	];

	return (
		<aside className={`h-full w-64 bg-card  border-border flex flex-col  border-s justify-start`}>
			{/* Navigation */}
			<nav className='flex-1 p-4'>
				<ul className='space-y-2'>
					{menuItems.map((item) => {
						const Icon = item.icon;
						const isActive =
							pathname === item.href || pathname.startsWith(`${item.href}/`);

						return (
							<li key={item.href}>
								<Link
									href={item.href}
									onClick={onClose}
									className={cn(
										'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
										isActive ?
											'bg-primary text-primary-foreground'
										:	'hover:bg-muted'
									)}>
									<Icon className='w-5 h-5' />
									<span className='font-medium'>{item.label}</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			{/* Current User */}
			<div className='p-4 border-t border-border'>
				<div className='flex items-center gap-3'>
					<div className='w-10 h-10 bg-muted rounded-full flex items-center justify-center'>
						<Users className='w-5 h-5 text-muted-foreground' />
					</div>
					<div>
						<p className='font-medium text-foreground'>
							{user?.data.data.name}
						</p>
						<p className='text-sm text-muted-foreground'>
							{user?.data.data.role}
						</p>
					</div>
				</div>
			</div>
		</aside>
	);
}
