/** @format */

// components/admin/StaffTable.tsx
'use client';

import { useState } from 'react';
import { MoreVertical, Edit, Trash2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils';

// Mock data - replace with API call
const staffData = [
	{
		id: 1,
		name: 'Alex Johnson',
		email: 'alex@cafe.com',
		role: 'admin',
		status: 'active',
		lastLogin: '2024-01-15T10:30:00Z',
		joinDate: '2023-06-01',
	},
	{
		id: 2,
		name: 'Maria Garcia',
		email: 'maria@cafe.com',
		role: 'manager',
		status: 'active',
		lastLogin: '2024-01-15T09:15:00Z',
		joinDate: '2023-08-15',
	},
	{
		id: 3,
		name: 'John Smith',
		email: 'john@cafe.com',
		role: 'cashier',
		status: 'active',
		lastLogin: '2024-01-14T16:45:00Z',
		joinDate: '2023-10-01',
	},
	{
		id: 4,
		name: 'Sarah Chen',
		email: 'sarah@cafe.com',
		role: 'cook',
		status: 'inactive',
		lastLogin: '2024-01-10T14:20:00Z',
		joinDate: '2023-11-20',
	},
	{
		id: 5,
		name: 'Mike Wilson',
		email: 'mike@cafe.com',
		role: 'cashier',
		status: 'active',
		lastLogin: '2024-01-15T11:00:00Z',
		joinDate: '2024-01-01',
	},
];

export default function StaffTable() {
	const [staff, setStaff] = useState(staffData);

	const getRoleColor = (role: string) => {
		switch (role) {
			case 'admin':
				return 'bg-purple-100 text-purple-800';
			case 'manager':
				return 'bg-blue-100 text-blue-800';
			case 'cashier':
				return 'bg-green-100 text-green-800';
			case 'cook':
				return 'bg-orange-100 text-orange-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusColor = (status: string) => {
		return status === 'active'
			? 'bg-green-100 text-green-800'
			: 'bg-red-100 text-red-800';
	};

	const handleDelete = (id: number) => {
		setStaff(staff.filter((member) => member.id !== id));
	};

	return (
		<div className='space-y-4'>
			{/* Table Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h3 className='text-lg font-semibold'>Staff Members</h3>
					<p className='text-sm text-muted-foreground'>
						Manage your restaurant staff and permissions
					</p>
				</div>
				<Button
					variant='café'
					size='sm'>
					<UserPlus className='h-4 w-4 mr-2' />
					Add Staff
				</Button>
			</div>

			{/* Staff Table */}
			<div className='rounded-lg border'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Staff Member</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Last Login</TableHead>
							<TableHead>Join Date</TableHead>
							<TableHead className='text-right'>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{staff.map((member) => (
							<TableRow key={member.id}>
								<TableCell>
									<div className='flex items-center gap-3'>
										<Avatar>
											<AvatarFallback className={getRoleColor(member.role)}>
												{member.name.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div>
											<div className='font-medium'>{member.name}</div>
											<div className='text-sm text-muted-foreground'>
												{member.email}
											</div>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<Badge className={getRoleColor(member.role)}>
										{member.role}
									</Badge>
								</TableCell>
								<TableCell>
									<Badge className={getStatusColor(member.status)}>
										{member.status}
									</Badge>
								</TableCell>
								<TableCell className='text-sm text-muted-foreground'>
									{formatDate(member.lastLogin)}
								</TableCell>
								<TableCell className='text-sm text-muted-foreground'>
									{formatDate(member.joinDate)}
								</TableCell>
								<TableCell className='text-right'>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant='ghost'
												size='icon'>
												<MoreVertical className='h-4 w-4' />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align='end'>
											<DropdownMenuItem>
												<Edit className='h-4 w-4 mr-2' />
												Edit
											</DropdownMenuItem>
											<DropdownMenuItem
												className='text-destructive'
												onClick={() => handleDelete(member.id)}>
												<Trash2 className='h-4 w-4 mr-2' />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Summary */}
			<div className='flex items-center justify-between text-sm text-muted-foreground'>
				<div>Showing {staff.length} staff members</div>
				<div className='flex items-center gap-4'>
					<div className='flex items-center gap-2'>
						<div className='w-3 h-3 rounded-full bg-green-500'></div>
						<span>Active</span>
					</div>
					<div className='flex items-center gap-2'>
						<div className='w-3 h-3 rounded-full bg-red-500'></div>
						<span>Inactive</span>
					</div>
				</div>
			</div>
		</div>
	);
}
