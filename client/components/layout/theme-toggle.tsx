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
import { useTranslation } from 'react-i18next';

export function ThemeSwitch() {
	const { theme, setTheme, resolvedTheme } = useTheme();
	const { t } = useTranslation();

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
				return t('theme.dark');
			case 'light':
				return t('theme.light');
			case 'system':
				return t('theme.system');
			default:
				return t('theme.toggle');
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
				aria-label={`${t('theme.switch')}: ${getThemeLabel()}`}>
				<Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
				<Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
				<Monitor className='absolute h-5 w-5 rotate-0 scale-0 transition-all system:rotate-0 system:scale-100' />
			</Button>
		</div>
	);
}
