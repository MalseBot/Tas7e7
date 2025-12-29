/** @format */

'use client';

import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useEffect, useState } from 'react';

export function LanguageSwitcher() {
	const { i18n, ready, changeLanguage } = useTranslation();
	const [currentLang, setCurrentLang] = useState(i18n.language || 'en');

	useEffect(() => {
		if (ready) {
			setCurrentLang(i18n.language);
		}
	}, [i18n.language, ready]);

	const languages = [
		{ code: 'en', name: 'English', flag: '🇺🇸' },
		{ code: 'ar', name: 'العربية', flag: '🇸🇦' },
	];

	const currentLanguage =
		languages.find((lang) => lang.code === currentLang) || languages[0];

	const handleLanguageChange = async (lng: string) => {
		await changeLanguage(lng);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					className='rounded-full lg:px-8'
					aria-label={`Switch language. Current: ${currentLanguage.name}`}>
					<div className='flex items-center gap-1'>
						<Globe className='w-5 h-5' />
						<span className='text-sm font-medium hidden sm:inline ml-1'>
							{currentLanguage.code.toUpperCase()}
						</span>
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				{languages.map((language) => (
					<DropdownMenuItem
						key={language.code}
						onClick={() => handleLanguageChange(language.code)}
						className='flex items-center gap-2 cursor-pointer py-2 px-3'>
						<span className='text-xl'>{language.flag}</span>
						<span
							className={currentLang === language.code ? 'font-semibold' : ''}>
							{language.name}
						</span>
						{currentLang === language.code && (
							<span className='ml-auto text-xs'>✓</span>
						)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
