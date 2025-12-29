/** @format */

import { useTranslation as useI18nTranslation } from 'react-i18next';

export function useTranslation() {
	const { t, i18n, ready } = useI18nTranslation();

	const isRTL = i18n.language === 'ar';
	const direction = isRTL ? 'rtl' : 'ltr';
	const textAlign = isRTL ? 'right' : 'left';

	const changeLanguage = async (lng: string) => {
		try {
			await i18n.changeLanguage(lng);
			localStorage.setItem('i18nextLng', lng);
		} catch (error) {
			console.error('Failed to change language:', error);
		}
	};

	return {
		t,
		i18n,
		ready,
		isRTL,
		direction,
		textAlign,
		changeLanguage,
		currentLanguage: i18n.language,
	};
}
