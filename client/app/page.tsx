/** @format */

// app/page.tsx (Hybrid Approach)
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LandingPageContent from '@/components/home/landing-page';

export default function HomePage() {
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

	useEffect(() => {
		// Check authentication status
		const token = localStorage.getItem('token');
		const user = localStorage.getItem('user');

		if (token && user) {
			setIsAuthenticated(true);
			// Redirect authenticated users to dashboard
			router.push('/dashboard');
		} else {
			setIsAuthenticated(false);
		}
	}, [router]);

	// Show loading state while checking auth
	if (isAuthenticated === null) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
			</div>
		);
	}

	// Show landing page to unauthenticated users
	if (isAuthenticated === false) {
		return <LandingPageContent />;
	}

	// For authenticated users (will redirect via useEffect)
	return null;
}
