/** @format */

// components/pos/QuickActions.tsx
'use client';

import { Plus, Printer, Calculator, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function QuickActions() {
	return (
		<div className='flex items-center gap-2'>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='outline'
						size='sm'>
						<Plus className='h-4 w-4 mr-2' />
						Quick Actions
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align='end'
					className='w-48'>
					<DropdownMenuItem>
						<Calculator className='h-4 w-4 mr-2' />
						Split Bill
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Printer className='h-4 w-4 mr-2' />
						Print Receipt
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Clock className='h-4 w-4 mr-2' />
						View Order History
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Tag className='h-4 w-4 mr-2' />
						Apply Discount
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Button
				variant='café'
				size='sm'>
				Quick Sale
			</Button>
		</div>
	);
}
