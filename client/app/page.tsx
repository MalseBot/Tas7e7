/** @format */

// Updated app/page.tsx with registration awareness
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
	const router = useRouter();

	useEffect(() => {
		// Check if setup is needed (no users in system)
		const checkSetup = async () => {
			try {
				// You could make an API call here to check if any users exist
				// For now, we'll check localStorage
				const token = localStorage.getItem('token');
				const user = localStorage.getItem('user');

				if (token && user) {
					router.push('/dashboard');
				} else {
					// Check if this is first time setup
					const isFirstVisit = !localStorage.getItem('hasVisited');

					if (isFirstVisit) {
						localStorage.setItem('hasVisited', 'true');
						// Optionally redirect to setup page
						// router.push('/setup');
					}

					router.push('/login');
				}
			} catch (error) {
				router.push('/login');
			}
		};

		checkSetup();
	}, [router]);

	return (
		<div className='min-h-screen flex items-center justify-center bg-linear-to-br from-primary/10 to-secondary/10'>
			{/* Loading spinner */}
			<div className='text-center'>
				<div className='inline-flex items-center justify-center w-20 h-20 rounded-2xl overflow-hidden shadow-sm bg-white mb-6 animate-pulse'>
					<img
						src='/logo.png'
						alt='Tas7e7'
						className='w-full h-full object-cover'
					/>
				</div>
				<h1 className='text-3xl font-bold text-foreground mb-2'>Café POS</h1>
				<div className='flex items-center justify-center gap-2'>
					<Loader2 className='w-5 h-5 animate-spin text-primary' />
					<span className='text-sm text-muted-foreground'>Loading...</span>
				</div>
			</div>
		</div>
	);
}
