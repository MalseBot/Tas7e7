/** @format */

// app/dashboard/layout.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Coffee, LogOut, Menu, X } from 'lucide-react';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className='min-h-screen bg-background'>
			{/* Mobile Sidebar Toggle */}
			<button
				onClick={() => setSidebarOpen(!sidebarOpen)}
				className='lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg'>
				{sidebarOpen ?
					<X className='w-6 h-6' />
				:	<Menu className='w-6 h-6' />}
			</button>

			{/* Overlay for mobile */}
			{sidebarOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden'
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Main Content */}
			<div className=''>
				<Header  />
				<main className='p-4 md:p-6'>{children}</main>
			</div>
		</div>
	);
}
