/** @format */

// components/layout/header.tsx
'use client';

import { Bell, Search, User, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
	onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
	return (
		<header className='sticky top-0 z-30 bg-card border-b border-border'>
			<div className='flex items-center justify-between px-6 py-4'>
				{/* Search */}
				<div className='flex-1 max-w-md'>
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
						<Input
							placeholder='Search orders, products, customers...'
							className='pl-10'
						/>
					</div>
				</div>

				{/* Right side */}
				<div className='flex items-center gap-4'>
					{/* Notifications */}
					<Button
						variant='ghost'
						size='icon'
						className='relative'>
						<Bell className='w-5 h-5' />
						<Badge className='absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center'>
							3
						</Badge>
					</Button>

					{/* User Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='ghost'
								className='gap-2'>
								<User className='w-5 h-5' />
								<span className='hidden md:inline'>Cashier</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Profile</DropdownMenuItem>
							<DropdownMenuItem>Settings</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={onLogout}>
								<LogOut className='w-4 h-4 mr-2' />
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
