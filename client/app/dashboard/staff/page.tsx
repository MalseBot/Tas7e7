/** @format */

// app/dashboard/staff/page.tsx
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	Users,
	UserPlus,
	UserCheck,
	UserX,
	Edit,
	Trash2,
	MoreVertical,
	Filter,
	Search,
	RefreshCw,
	Loader2,
} from 'lucide-react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast, useToast } from '@/lib/hooks/use-toast';
import { staffService } from '@/lib/api/services';
import { useNotificationActions } from '@/lib/hooks/useNotificationActions.ts';

interface StaffMember {
	_id: string;
	name: string;
	email: string;
	role: 'admin' | 'manager' | 'cashier';
	isActive: boolean;
	createdAt: string;
}

interface StaffStats {
	total: number;
	active: number;
	inactive: number;
	stats: Array<{ role: string; count: number; active: number }>;
}

export default function StaffPage() {
	const { notifySuccess, notifyError, notifyInfo } = useNotificationActions();

	const queryClient = useQueryClient();

	const [searchTerm, setSearchTerm] = useState('');
	const [roleFilter, setRoleFilter] = useState('all');
	const [statusFilter, setStatusFilter] = useState('all');
	const [showAddDialog, setShowAddDialog] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

	// Form states
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		role: 'cashier' as 'cashier' | 'manager' | 'admin',
		pin: '',
		isActive: true,
	});

	// Fetch staff data with React Query
	const {
		data: staffData,
		isLoading: staffLoading,
		error: staffError,
		refetch: refetchStaff,
	} = useQuery({
		queryKey: ['staff'],
		queryFn: () => staffService.getStaff(),
		select: (data) => data.data.data,
	});

	// Fetch staff stats
	const { data: statsData, isLoading: statsLoading } = useQuery({
		queryKey: ['staff-stats'],
		queryFn: () => staffService.getStaffStats(),
		select: (data) => data.data.data,
	});

	// Create staff mutation
	const createStaffMutation = useMutation({
		mutationFn: (data: any) => staffService.createStaff(data),
		onSuccess: (data) => {
			notifySuccess(
				'Staff Added',
				`${data.data.data.name} has been added to the staff`,
				{
					label: 'View Staff',
					onClick: () => {
						// Navigate to staff details if needed
						console.log('View staff:', data.data.data._id);
					},
				}
			);
			setShowAddDialog(false);
			resetForm();
			queryClient.invalidateQueries({ queryKey: ['staff'] });
			queryClient.invalidateQueries({ queryKey: ['staff-stats'] });
		},
		onError: (error: any) => {
			notifyError(
				'Add Staff Failed',
				error.response?.data?.error || 'Failed to add staff member'
			);
		},
	});

	// Update staff mutation
	const updateStaffMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: any }) =>
			staffService.updateStaff(id, data),
		onSuccess: (data, variables) => {
			notifySuccess(
				'Staff Updated',
				`${variables.data.name || 'Staff member'} has been updated`
			);
			setShowEditDialog(false);
			resetForm();
			queryClient.invalidateQueries({ queryKey: ['staff'] });
			queryClient.invalidateQueries({ queryKey: ['staff-stats'] });
		},
		onError: (error: any) => {
			notifyError(
				'Update Failed',
				error.response?.data?.error || 'Failed to update staff member'
			);
		},
	});

	// Delete staff mutation
	const deleteStaffMutation = useMutation({
		mutationFn: (id: string) => staffService.deleteStaff(id),
		onSuccess: (_, id) => {
			notifyInfo(
				'Staff Deleted',
				'Staff member has been removed from the system'
			);
			queryClient.invalidateQueries({ queryKey: ['staff'] });
			queryClient.invalidateQueries({ queryKey: ['staff-stats'] });
		},
		onError: (error: any) => {
			notifyError(
				'Delete Failed',
				error.response?.data?.error || 'Failed to delete staff member'
			);
		},
	});

	// Toggle active status mutation
	const toggleActiveMutation = useMutation({
		mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
			staffService.updateStaff(id, { isActive }),
		onSuccess: (_, variables) => {
			notifySuccess(
				'Status Updated',
				`Staff member ${variables.isActive ? 'activated' : 'deactivated'}`
			);
			queryClient.invalidateQueries({ queryKey: ['staff'] });
			queryClient.invalidateQueries({ queryKey: ['staff-stats'] });
		},
		onError: (error: any) => {
			notifyError('Status Update Failed', 'Failed to update staff status');
		},
	});

	// Handle add new staff
	const handleAddStaff = () => {
		if (formData.password !== formData.confirmPassword) {
			toast({
				title: 'Error',
				description: 'Passwords do not match',
				variant: 'destructive',
			});
			return;
		}

		createStaffMutation.mutate({
			name: formData.name,
			email: formData.email,
			password: formData.password,
			role: formData.role,
			pin: formData.pin || '0000',
		});
	};

	// Handle update staff
	const handleUpdateStaff = () => {
		if (!selectedStaff) return;

		updateStaffMutation.mutate({
			id: selectedStaff._id,
			data: {
				name: formData.name,
				email: formData.email,
				role: formData.role,
				isActive: formData.isActive,
			},
		});
	};

	// Handle delete staff
	const handleDeleteStaff = (id: string) => {
		if (!confirm('Are you sure you want to delete this staff member?')) return;
		deleteStaffMutation.mutate(id);
	};

	// Handle toggle active status
	const handleToggleActive = (staff: StaffMember) => {
		toggleActiveMutation.mutate({
			id: staff._id,
			isActive: !staff.isActive,
		});
	};

	// Reset form
	const resetForm = () => {
		setFormData({
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
			role: 'cashier',
			pin: '',
			isActive: true,
		});
		setSelectedStaff(null);
	};

	// Open edit dialog
	const openEditDialog = (staff: StaffMember) => {
		setSelectedStaff(staff);
		setFormData({
			name: staff.name,
			email: staff.email,
			password: '',
			confirmPassword: '',
			role: staff.role,
			pin: '',
			isActive: staff.isActive,
		});
		setShowEditDialog(true);
	};

	// Filter staff
	const filteredStaff =
		staffData?.filter((member: StaffMember) => {
			const matchesSearch =
				member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				member.email.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesRole = roleFilter === 'all' || member.role === roleFilter;
			const matchesStatus =
				statusFilter === 'all' ||
				(statusFilter === 'active' && member.isActive) ||
				(statusFilter === 'inactive' && !member.isActive);
			return matchesSearch && matchesRole && matchesStatus;
		}) || [];

	// Get role badge color
	const getRoleColor = (role: string) => {
		switch (role) {
			case 'admin':
				return 'bg-red-100 text-red-800 hover:bg-red-100';
			case 'manager':
				return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
			case 'cashier':
				return 'bg-green-100 text-green-800 hover:bg-green-100';
			default:
				return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
		}
	};

	// Format date
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	// Loading state
	if (staffLoading) {
		return (
			<div className='container mx-auto px-4 py-8'>
				<div className='flex items-center justify-center h-64'>
					<Loader2 className='w-8 h-8 animate-spin' />
					<span className='ml-2'>Loading staff data...</span>
				</div>
			</div>
		);
	}

	// Error state
	if (staffError) {
		return (
			<div className='container mx-auto px-4 py-8'>
				<Card>
					<CardContent className='pt-6'>
						<div className='text-center py-8'>
							<Users className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
							<h3 className='text-lg font-medium'>Failed to load staff data</h3>
							<p className='text-muted-foreground mt-2'>
								There was an error loading the staff information.
							</p>
							<Button
								onClick={() => refetchStaff()}
								className='mt-4'>
								<RefreshCw className='w-4 h-4 mr-2' />
								Try Again
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			{/* Header */}
			<div className='bg-card rounded-xl border border-border p-6 mb-8'>
				<div className='flex items-center justify-between'>
					<div>
						<h1 className='text-2xl font-bold text-foreground'>
							Staff Management
						</h1>
						<p className='text-muted-foreground mt-2'>
							Manage staff members, roles, and permissions
						</p>
					</div>
					<Button onClick={() => setShowAddDialog(true)}>
						<UserPlus className='w-4 h-4 mr-2' />
						Add Staff
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			{!statsLoading && statsData && (
				<div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>Total Staff</CardTitle>
							<Users className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{statsData.total}</div>
							<p className='text-xs text-muted-foreground'>
								{statsData.active} active, {statsData.inactive} inactive
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Active Staff
							</CardTitle>
							<UserCheck className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{statsData.active}</div>
							<p className='text-xs text-muted-foreground'>
								Currently active staff members
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Inactive Staff
							</CardTitle>
							<UserX className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{statsData.inactive}</div>
							<p className='text-xs text-muted-foreground'>
								Staff members not active
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>Roles</CardTitle>
							<Filter className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='flex flex-wrap gap-1'>
								{statsData.stats.map((stat: any) => (
									<Badge
										key={stat.role}
										variant='secondary'
										className='mr-1'>
										{stat.role}: {stat.active}/{stat.count}
									</Badge>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Filters */}
			<Card className='mb-6'>
				<CardContent className='pt-6'>
					<div className='flex flex-col md:flex-row gap-4'>
						<div className='flex-1'>
							<Label htmlFor='search'>Search</Label>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
								<Input
									id='search'
									placeholder='Search by name or email...'
									className='pl-10'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>
						</div>
						<div>
							<Label htmlFor='role'>Role</Label>
							<Select
								value={roleFilter}
								onValueChange={setRoleFilter}>
								<SelectTrigger>
									<SelectValue placeholder='All Roles' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>All Roles</SelectItem>
									<SelectItem value='admin'>Admin</SelectItem>
									<SelectItem value='manager'>Manager</SelectItem>
									<SelectItem value='cashier'>Cashier</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label htmlFor='status'>Status</Label>
							<Select
								value={statusFilter}
								onValueChange={setStatusFilter}>
								<SelectTrigger>
									<SelectValue placeholder='All Status' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>All Status</SelectItem>
									<SelectItem value='active'>Active</SelectItem>
									<SelectItem value='inactive'>Inactive</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='flex items-end'>
							<Button
								variant='outline'
								onClick={() => {
									setSearchTerm('');
									setRoleFilter('all');
									setStatusFilter('all');
								}}>
								<RefreshCw className='w-4 h-4 mr-2' />
								Reset
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Staff Table */}
			<Card>
				<CardHeader>
					<CardTitle>Staff Members</CardTitle>
					<CardDescription>
						{filteredStaff.length} staff members found
					</CardDescription>
				</CardHeader>
				<CardContent>
					{filteredStaff.length === 0 ?
						<div className='text-center py-8'>
							<Users className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
							<p className='text-lg font-medium'>No staff members found</p>
							<p className='text-muted-foreground mt-2'>
								Try adjusting your filters or add a new staff member
							</p>
						</div>
					:	<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Joined Date</TableHead>
									<TableHead className='text-right'>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredStaff.map((member: StaffMember) => (
									<TableRow key={member._id}>
										<TableCell className='font-medium'>{member.name}</TableCell>
										<TableCell>{member.email}</TableCell>
										<TableCell>
											<Badge className={getRoleColor(member.role)}>
												{member.role}
											</Badge>
										</TableCell>
										<TableCell>
											<Badge
												variant={member.isActive ? 'default' : 'secondary'}
												className='cursor-pointer'
												onClick={() => handleToggleActive(member)}>
												{member.isActive ? 'Active' : 'Inactive'}
											</Badge>
										</TableCell>
										<TableCell>{formatDate(member.createdAt)}</TableCell>
										<TableCell className='text-right'>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant='ghost'
														size='icon'>
														<MoreVertical className='w-4 h-4' />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end'>
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => openEditDialog(member)}>
														<Edit className='w-4 h-4 mr-2' />
														Edit
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleToggleActive(member)}>
														{member.isActive ?
															<>
																<UserX className='w-4 h-4 mr-2' />
																Deactivate
															</>
														:	<>
																<UserCheck className='w-4 h-4 mr-2' />
																Activate
															</>
														}
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														className='text-red-600'
														onClick={() => handleDeleteStaff(member._id)}
														disabled={deleteStaffMutation.isPending}>
														<Trash2 className='w-4 h-4 mr-2' />
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					}
				</CardContent>
			</Card>

			{/* Add Staff Dialog */}
			<Dialog
				open={showAddDialog}
				onOpenChange={setShowAddDialog}>
				<DialogContent className='sm:max-w-125'>
					<DialogHeader>
						<DialogTitle>Add New Staff Member</DialogTitle>
						<DialogDescription>
							Fill in the details to add a new staff member to the system.
						</DialogDescription>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div className='grid gap-2'>
							<Label htmlFor='name'>Full Name *</Label>
							<Input
								id='name'
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								placeholder='John Doe'
								required
								disabled={createStaffMutation.isPending}
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='email'>Email Address *</Label>
							<Input
								id='email'
								type='email'
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								placeholder='john@example.com'
								required
								disabled={createStaffMutation.isPending}
							/>
						</div>
						<div className='grid grid-cols-2 gap-4'>
							<div className='grid gap-2'>
								<Label htmlFor='password'>Password *</Label>
								<Input
									id='password'
									type='password'
									value={formData.password}
									onChange={(e) =>
										setFormData({ ...formData, password: e.target.value })
									}
									required
									disabled={createStaffMutation.isPending}
								/>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='confirmPassword'>Confirm Password *</Label>
								<Input
									id='confirmPassword'
									type='password'
									value={formData.confirmPassword}
									onChange={(e) =>
										setFormData({
											...formData,
											confirmPassword: e.target.value,
										})
									}
									required
									disabled={createStaffMutation.isPending}
								/>
							</div>
						</div>
						<div className='grid grid-cols-2 gap-4'>
							<div className='grid gap-2'>
								<Label htmlFor='role'>Role *</Label>
								<Select
									value={formData.role}
									onValueChange={(value: 'cashier' | 'manager' | 'admin') =>
										setFormData({ ...formData, role: value })
									}
									disabled={createStaffMutation.isPending}>
									<SelectTrigger>
										<SelectValue placeholder='Select role' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='cashier'>Cashier</SelectItem>
										<SelectItem value='manager'>Manager</SelectItem>
										<SelectItem value='admin'>Admin</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='pin'>PIN Code</Label>
								<Input
									id='pin'
									value={formData.pin}
									onChange={(e) =>
										setFormData({ ...formData, pin: e.target.value })
									}
									placeholder='0000'
									maxLength={4}
									disabled={createStaffMutation.isPending}
								/>
								<p className='text-xs text-muted-foreground'>
									4-digit PIN for quick login
								</p>
							</div>
						</div>
						<div className='flex items-center space-x-2'>
							<Switch
								id='isActive'
								checked={formData.isActive}
								onCheckedChange={(checked) =>
									setFormData({ ...formData, isActive: checked })
								}
								disabled={createStaffMutation.isPending}
							/>
							<Label htmlFor='isActive'>Active Staff Member</Label>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setShowAddDialog(false)}
							disabled={createStaffMutation.isPending}>
							Cancel
						</Button>
						<Button
							onClick={handleAddStaff}
							disabled={createStaffMutation.isPending}>
							{createStaffMutation.isPending ?
								<>
									<Loader2 className='w-4 h-4 mr-2 animate-spin' />
									Adding...
								</>
							:	'Add Staff Member'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Staff Dialog */}
			<Dialog
				open={showEditDialog}
				onOpenChange={setShowEditDialog}>
				<DialogContent className='sm:max-w-125'>
					<DialogHeader>
						<DialogTitle>Edit Staff Member</DialogTitle>
						<DialogDescription>
							Update staff member details. Leave password fields empty to keep
							current password.
						</DialogDescription>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div className='grid gap-2'>
							<Label htmlFor='edit-name'>Full Name</Label>
							<Input
								id='edit-name'
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								disabled={updateStaffMutation.isPending}
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='edit-email'>Email Address</Label>
							<Input
								id='edit-email'
								type='email'
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								disabled={updateStaffMutation.isPending}
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='edit-role'>Role</Label>
							<Select
								value={formData.role}
								onValueChange={(value: 'cashier' | 'manager' | 'admin') =>
									setFormData({ ...formData, role: value })
								}
								disabled={updateStaffMutation.isPending}>
								<SelectTrigger>
									<SelectValue placeholder='Select role' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='cashier'>Cashier</SelectItem>
									<SelectItem value='manager'>Manager</SelectItem>
									<SelectItem value='admin'>Admin</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='flex items-center space-x-2'>
							<Switch
								id='edit-isActive'
								checked={formData.isActive}
								onCheckedChange={(checked) =>
									setFormData({ ...formData, isActive: checked })
								}
								disabled={updateStaffMutation.isPending}
							/>
							<Label htmlFor='edit-isActive'>Active Staff Member</Label>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setShowEditDialog(false)}
							disabled={updateStaffMutation.isPending}>
							Cancel
						</Button>
						<Button
							onClick={handleUpdateStaff}
							disabled={updateStaffMutation.isPending}>
							{updateStaffMutation.isPending ?
								<>
									<Loader2 className='w-4 h-4 mr-2 animate-spin' />
									Updating...
								</>
							:	'Update Staff Member'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
