/** @format */

// components/providers/theme-provider.tsx
'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
	enableSystem?: boolean;
};

type ThemeProviderState = {
	theme: Theme;
	resolvedTheme: 'light' | 'dark';
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
	isDark: boolean;
};

const initialState: ThemeProviderState = {
	theme: 'system',
	resolvedTheme: 'light',
	setTheme: () => null,
	toggleTheme: () => null,
	isDark: false,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
	children,
	defaultTheme = 'system',
	storageKey = 'cafe-pos-theme',
	enableSystem = true,
	...props
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(defaultTheme);
	const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);

		// Load theme from localStorage
		const stored = localStorage.getItem(storageKey);
		if (stored === 'light' || stored === 'dark' || stored === 'system') {
			setTheme(stored);
		}
	}, [storageKey]);

	// Resolve the actual theme to apply
	useEffect(() => {
		if (!mounted) return;

		const root = window.document.documentElement;
		root.classList.remove('light', 'dark');

		let resolved = theme;

		if (theme === 'system' && enableSystem) {
			const systemTheme =
				window.matchMedia('(prefers-color-scheme: dark)').matches ?
					'dark'
				:	'light';
			resolved = systemTheme;
		}

		setResolvedTheme(resolved as 'light' | 'dark');
		root.classList.add(resolved);

		// Save to localStorage
		localStorage.setItem(storageKey, theme);
	}, [theme, mounted, enableSystem, storageKey]);

	// Listen for system theme changes
	useEffect(() => {
		if (!mounted || theme !== 'system') return;

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		const handleChange = () => {
			const root = window.document.documentElement;
			root.classList.remove('light', 'dark');

			const newTheme = mediaQuery.matches ? 'dark' : 'light';
			setResolvedTheme(newTheme);
			root.classList.add(newTheme);
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [mounted, theme]);

	// Toggle between light and dark (skip system)
	const toggleTheme = () => {
		setTheme((current) => {
			if (current === 'light') return 'dark';
			if (current === 'dark') return enableSystem ? 'system' : 'light';
			return window.matchMedia('(prefers-color-scheme: dark)').matches ?
					'light'
				:	'dark';
		});
	};

	const value = {
		theme,
		resolvedTheme,
		isDark: resolvedTheme === 'dark',
		setTheme: (theme: Theme) => {
			setTheme(theme);
		},
		toggleTheme,
	};

	return (
		<ThemeProviderContext.Provider
			{...props}
			value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};
