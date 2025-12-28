/** @format */

// components/layout/theme-switch.tsx
'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeSwitch() {
	const { theme, setTheme, resolvedTheme } = useTheme();

	// Get appropriate icon based on theme
	const getThemeIcon = () => {
		switch (resolvedTheme) {
			case 'dark':
				return <Moon className='h-5 w-5' />;
			case 'light':
				return <Sun className='h-5 w-5' />;
			default:
				return <Monitor className='h-5 w-5' />;
		}
	};

	// Get theme label for tooltip
	const getThemeLabel = () => {
		switch (theme) {
			case 'dark':
				return 'Dark mode';
			case 'light':
				return 'Light mode';
			case 'system':
				return 'System theme';
			default:
				return 'Toggle theme';
		}
	};

	// Simple toggle function
	const toggleTheme = () => {
		if (theme === 'light') {
			setTheme('dark');
		} else if (theme === 'dark') {
			setTheme('system');
		} else {
			setTheme('light');
		}
	};

	return (
		<div className='relative'>
			{/* Simple Toggle Button */}
			<Button
				variant='ghost'
				size='icon'
				onClick={toggleTheme}
				className='relative h-10 w-10 rounded-full'
				aria-label={`Switch theme. Current: ${getThemeLabel()}`}>
				<Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
				<Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
				<Monitor className='absolute h-5 w-5 rotate-0 scale-0 transition-all system:rotate-0 system:scale-100' />
			</Button>

			{/* Optional: Dropdown Menu for Manual Selection */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						size='sm'
						className='absolute -bottom-6 -right-6 text-xs opacity-0 hover:opacity-100 transition-opacity'>
						<span className='sr-only'>Theme options</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuItem onClick={() => setTheme('light')}>
						<Sun className='mr-2 h-4 w-4' />
						<span>Light</span>
						{theme === 'light' && <span className='ml-auto text-xs'>✓</span>}
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme('dark')}>
						<Moon className='mr-2 h-4 w-4' />
						<span>Dark</span>
						{theme === 'dark' && <span className='ml-auto text-xs'>✓</span>}
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme('system')}>
						<Monitor className='mr-2 h-4 w-4' />
						<span>System</span>
						{theme === 'system' && <span className='ml-auto text-xs'>✓</span>}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
