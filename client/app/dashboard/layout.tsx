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

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		router.push('/login');
	};

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

			{/* Sidebar */}
			<div
				className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 lg:translate-x-0 ${
					sidebarOpen ? 'translate-x-0' : '-translate-x-full'
				}`}>
				<Sidebar onClose={() => setSidebarOpen(false)} />
			</div>

			{/* Overlay for mobile */}
			{sidebarOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden'
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Main Content */}
			<div className='lg:pl-64'>
				<Header onLogout={handleLogout} />
				<main className='p-4 md:p-6'>{children}</main>
			</div>
		</div>
	);
}
