/** @format */

// components/shared/LoadingSpinner.tsx
import { Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
	message?: string;
	fullScreen?: boolean;
	size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({
	message = 'Loading...',
	fullScreen = false,
	size = 'md',
}: LoadingSpinnerProps) {
	const sizeClasses = {
		sm: 'h-6 w-6',
		md: 'h-12 w-12',
		lg: 'h-16 w-16',
	};

	const containerClasses = cn(
		'flex flex-col items-center justify-center',
		fullScreen && 'min-h-screen'
	);

	return (
		<div className={containerClasses}>
			<div className='relative'>
				<Coffee
					className={cn('text-primary animate-bounce', sizeClasses[size])}
				/>
				<div
					className={cn(
						'absolute inset-0 border-2 border-primary/30 rounded-full animate-ping',
						sizeClasses[size]
					)}
				/>
			</div>
			{message && (
				<p className='mt-4 text-muted-foreground animate-pulse'>{message}</p>
			)}
		</div>
	);
}
