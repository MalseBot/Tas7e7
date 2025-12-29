/** @format */

// components/providers/index.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { ThemeProvider } from './theme-provider';
import { I18nProvider } from './i18n-provider';

export function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000,
						refetchOnWindowFocus: false,
					},
				},
			})
	);

	return (
		<I18nProvider>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider
					defaultTheme='light'
					enableSystem>
					{children}
				</ThemeProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</I18nProvider>
	);
}
