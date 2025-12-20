/** @format */

// app/(dashboard)/kitchen/page.tsx
'use client';

import KitchenDisplay from '@/components/kitchen/KitchenDisplay';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';

export default function KitchenPage() {
	const { user } = useAuth();

	// Check if user has access to kitchen
	if (!user || !['admin', 'manager', 'cook'].includes(user.role)) {
		redirect('/dashboard');
	}

	return (
		<div className='space-y-6'>
			<KitchenDisplay />
		</div>
	);
}
