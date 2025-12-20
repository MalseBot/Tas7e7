/** @format */

// components/layout/Logo.tsx
import { Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
	className?: string;
	size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
	const sizeClasses = {
		sm: 'text-xl',
		md: 'text-2xl',
		lg: 'text-3xl',
	};

	return (
		<div className={cn('flex items-center space-x-3', className)}>
			<div className='w-10 h-10 bg-gradient-café rounded-xl flex items-center justify-center shadow-md'>
				<Coffee
					className='text-white'
					size={24}
				/>
			</div>
			<div>
				<h1 className={cn('font-bold tracking-tight', sizeClasses[size])}>
					Café<span className='text-primary'>POS</span>
				</h1>
				<p className='text-xs text-muted-foreground mt-0.5'>
					Restaurant Management
				</p>
			</div>
		</div>
	);
}

export function LogoIcon({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				'w-8 h-8 bg-gradient-café rounded-lg flex items-center justify-center',
				className
			)}>
			<Coffee
				className='text-white'
				size={16}
			/>
		</div>
	);
}
