/** @format */

// components/shared/StatusBadge.tsx
import { Badge } from '@/components/ui/badge';
import { getStatusColor } from '@/lib/utils';

interface StatusBadgeProps {
	status: string;
	size?: 'sm' | 'md' | 'lg';
	showIcon?: boolean;
}

export default function StatusBadge({
	status,
	size = 'md',
	showIcon = false,
}: StatusBadgeProps) {
	const sizeClasses = {
		sm: 'text-xs px-2 py-0.5',
		md: 'text-sm px-3 py-1',
		lg: 'text-base px-4 py-1.5',
	};

	return (
		<Badge
			variant='outline'
			className={cn(getStatusColor(status), sizeClasses[size])}>
			{showIcon && (
				<span className='mr-1'>
					{status === 'pending' && '⏱️'}
					{status === 'preparing' && '👨‍🍳'}
					{status === 'ready' && '✅'}
					{status === 'paid' && '💰'}
				</span>
			)}
			{status.charAt(0).toUpperCase() + status.slice(1)}
		</Badge>
	);
}
