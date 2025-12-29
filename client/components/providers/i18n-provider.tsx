/** @format */

'use client';

import { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

interface I18nProviderProps {
	children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
	useEffect(() => {
		// Set initial direction
		const lang = localStorage.getItem('i18nextLng') || 'en';
		const dir = lang === 'ar' ? 'rtl' : 'ltr';

		document.documentElement.dir = dir;
		document.documentElement.lang = lang;
		document.documentElement.setAttribute('data-direction', dir);
	}, []);

	useEffect(() => {
		const handleLanguageChange = () => {
			const lang = i18n.language || 'en';
			const dir = lang === 'ar' ? 'rtl' : 'ltr';

			document.documentElement.dir = dir;
			document.documentElement.lang = lang;
			document.documentElement.setAttribute('data-direction', dir);
		};

		i18n.on('languageChanged', handleLanguageChange);

		return () => {
			i18n.off('languageChanged', handleLanguageChange);
		};
	}, []);

	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
