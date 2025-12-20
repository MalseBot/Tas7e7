/** @format */

// lib/theme.ts
export function applyTheme(theme: 'light' | 'dark') {
	const root = document.documentElement;

	if (theme === 'dark') {
		root.classList.add('dark');
	} else {
		root.classList.remove('dark');
	}

	localStorage.setItem('cafe-pos-theme', theme);
}

export function getSavedTheme(): 'light' | 'dark' {
	if (typeof window === 'undefined') return 'light';

	const saved = localStorage.getItem('cafe-pos-theme') as 'light' | 'dark';
	return saved || 'light';
}

export function getSystemTheme(): 'light' | 'dark' {
	if (typeof window === 'undefined') return 'light';

	return window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';
}
