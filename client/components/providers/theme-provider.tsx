/** @format */

// components/providers/theme-provider.tsx
'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	attribute?: string;
	enableSystem?: boolean;
};

const ThemeProviderContext = createContext<
	| {
			theme: Theme;
			setTheme: (theme: Theme) => void;
	  }
	| undefined
>(undefined);

export function ThemeProvider({
	children,
	defaultTheme = 'light',
	attribute = 'class',
	enableSystem = false,
	...props
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(defaultTheme);

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove('light', 'dark');

		if (attribute === 'class') {
			root.classList.add(theme);
		} else {
			root.setAttribute(attribute, theme);
		}
	}, [theme, attribute]);

	const value = {
		theme,
		setTheme: (theme: Theme) => {
			setTheme(theme);
		},
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

	if (context === undefined)
		throw new Error('useTheme must be used within a ThemeProvider');

	return context;
};
