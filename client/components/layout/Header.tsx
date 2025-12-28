/** @format */

// components/layout/header.tsx
'use client';

import { useState } from 'react';
import { Menu, Bell, User, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NotificationDropdown } from './notification-dropdown';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeSwitch } from './theme-toggle';
import { Sidebar } from './sidebar';
import Link from 'next/link';

export function Header() {

	return (
		<header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
			<div className=' flex h-16 items-center justify-between px-4'>
				{/* Left side - Logo and Mobile Menu */}
				<div className='flex items-center gap-4'>
					{/* Mobile Menu (optional) */}
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
								className='lg:hidden'>
								<Menu className='h-5 w-5' />
								<span className='sr-only'>Toggle menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent
							side='left'
							className='w-64'>
							<SheetTitle>
								{/* Logo */}
								<div className='p-6 border-b border-border '>
									<Link
										href='/dashboard'
										className='flex items-center gap-2 ps-10'
										>
										<div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
											<Home className='w-5 h-5 text-white' />
										</div>
										<span className='text-xl font-bold text-foreground'>
											Café POS
										</span>
									</Link>
								</div>
							</SheetTitle>
							<Sidebar />
						</SheetContent>
					</Sheet>

					{/* Logo/Brand */}
					<div className='flex items-center gap-2'>
						<div className='h-8 w-8 rounded-md bg-primary flex items-center justify-center'>
							<span className='text-primary-foreground font-bold'>C</span>
						</div>
						<h1 className='text-xl font-bold hidden sm:block'>Café POS</h1>
					</div>
				</div>

				{/* Right side - Actions */}
				<div className='flex items-center gap-2'>
					{/* Theme Toggle */}
					<ThemeSwitch />

					{/* Notifications */}
					<NotificationDropdown />

					{/* User Profile */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
								className='rounded-full'>
								<User className='h-5 w-5' />
								<span className='sr-only'>User menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Profile</DropdownMenuItem>
							<DropdownMenuItem>Settings</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className='text-destructive'>
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
