/** @format */

// app/(auth)/layout.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isLoading, isAuthenticated } = useAuth();

	if (isLoading) {
		return <LoadingSpinner fullScreen />;
	}

	if (isAuthenticated) {
		redirect('/dashboard');
	}

	return <div className='min-h-screen bg-background'>{children}</div>;
}
