/** @format */
'use client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translations
import { en } from './locales/en';
import { ar } from './locales/ar';

i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			en: { translation: en },
			ar: { translation: ar },
		},
		fallbackLng: 'en',
		supportedLngs: ['en', 'ar'],
		lng:
			typeof window !== 'undefined' ?
				localStorage.getItem('i18nextLng') || 'en'
			:	'en',
		interpolation: {
			escapeValue: false,
		},
		detection: {
			order: ['localStorage', 'navigator', 'htmlTag'],
			caches: ['localStorage'],
			lookupLocalStorage: 'i18nextLng',
			lookupFromPathIndex: 0,
			lookupFromSubdomainIndex: 0,
		},
		react: {
			useSuspense: false,
		},
		debug: process.env.NODE_ENV === 'development',
	});

export default i18n;
