/** @format */

// components/shared/EmptyState.tsx
import { Coffee, ChefHat, ShoppingBag, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
	title: string;
	description: string;
	icon?: 'coffee' | 'chef' | 'bag' | 'users';
	actionLabel?: string;
	onAction?: () => void;
}

const icons = {
	coffee: Coffee,
	chef: ChefHat,
	bag: ShoppingBag,
	users: Users,
};

export default function EmptyState({
	title,
	description,
	icon = 'coffee',
	actionLabel,
	onAction,
}: EmptyStateProps) {
	const Icon = icons[icon];

	return (
		<div className='text-center py-12'>
			<div className='inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6'>
				<Icon className='h-10 w-10 text-muted-foreground' />
			</div>
			<h3 className='text-xl font-semibold text-foreground mb-2'>{title}</h3>
			<p className='text-muted-foreground mb-6 max-w-md mx-auto'>
				{description}
			</p>
			{actionLabel && onAction && (
				<Button
					onClick={onAction}
					variant='café'>
					{actionLabel}
				</Button>
			)}
		</div>
	);
}
