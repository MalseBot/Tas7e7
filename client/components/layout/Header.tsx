/** @format */

// components/layout/Header.tsx
'use client';

import { useState } from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
	const [searchQuery, setSearchQuery] = useState('');

	return (
		<header className='fixed top-0 left-0 right-0 z-50 bg-background border-b border-border'>
			<div className='flex items-center justify-between h-16 px-4 sm:px-6'>
				<div className='flex items-center gap-4'>
					<Button
						variant='ghost'
						size='icon'
						className='md:hidden'>
						<Menu className='w-5 h-5' />
					</Button>

					<div className='hidden md:flex items-center gap-2'>
						<div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
							<span className='text-primary-foreground font-bold'>POS</span>
						</div>
						<h1 className='text-xl font-semibold'>StorePOS</h1>
					</div>

					<div className='relative hidden md:block ml-4'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
						<Input
							placeholder='Search transactions, products...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='pl-10 w-64'
						/>
					</div>
				</div>

				<div className='flex items-center gap-2'>
					<ThemeToggle />

					<Button
						variant='ghost'
						size='icon'
						className='relative'>
						<Bell className='w-5 h-5' />
						<span className='absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full'></span>
					</Button>

					<Button
						variant='ghost'
						className='gap-2'>
						<div className='w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center'>
							<User className='w-4 h-4 text-primary' />
						</div>
						<span className='hidden md:inline text-sm font-medium'>Admin</span>
					</Button>
				</div>
			</div>
		</header>
	);
}
