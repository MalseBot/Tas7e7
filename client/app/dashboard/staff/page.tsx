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
import { useTranslation } from '@/lib/hooks/useTranslation';

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

interface ApiError {
	response?: {
		data?: {
			error?: string;
		};
	};
	message?: string;
}

export default function StaffPage() {
	const { t } = useTranslation();
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
				t('staff.addSuccess.title'),
				t('staff.addSuccess.message', { name: data.data.data.name }),
				{
					label: t('common.view'),
					onClick: () => {
						console.log('View staff:', data.data.data._id);
					},
				}
			);
			setShowAddDialog(false);
			resetForm();
			queryClient.invalidateQueries({ queryKey: ['staff'] });
			queryClient.invalidateQueries({ queryKey: ['staff-stats'] });
		},
		onError: (error: ApiError) => {
			notifyError(
				t('staff.addError.title'),
				error.response?.data?.error || t('staff.addError.message')
			);
		},
	});

	// Update staff mutation
	const updateStaffMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: any }) =>
			staffService.updateStaff(id, data),
		onSuccess: (data, variables) => {
			notifySuccess(
				t('staff.updateSuccess.title'),
				t('staff.updateSuccess.message', {
					name: variables.data.name || t('staff.table.name'),
				})
			);
			setShowEditDialog(false);
			resetForm();
			queryClient.invalidateQueries({ queryKey: ['staff'] });
			queryClient.invalidateQueries({ queryKey: ['staff-stats'] });
		},
		onError: (error: ApiError) => {
			notifyError(
				t('staff.updateError.title'),
				error.response?.data?.error || t('staff.updateError.message')
			);
		},
	});

	// Delete staff mutation
	const deleteStaffMutation = useMutation({
		mutationFn: (id: string) => staffService.deleteStaff(id),
		onSuccess: (_, id) => {
			notifyInfo(t('staff.deleteInfo.title'), t('staff.deleteInfo.message'));
			queryClient.invalidateQueries({ queryKey: ['staff'] });
			queryClient.invalidateQueries({ queryKey: ['staff-stats'] });
		},
		onError: (error: ApiError) => {
			notifyError(
				t('staff.deleteError.title'),
				error.response?.data?.error || t('staff.deleteError.message')
			);
		},
	});

	// Toggle active status mutation
	const toggleActiveMutation = useMutation({
		mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
			staffService.updateStaff(id, { isActive }),
		onSuccess: (_, variables) => {
			notifySuccess(
				t('staff.statusSuccess.title'),
				t('staff.statusSuccess.message', {
					status:
						variables.isActive ?
							t('staff.status.activated')
						:	t('staff.status.deactivated'),
				})
			);
			queryClient.invalidateQueries({ queryKey: ['staff'] });
			queryClient.invalidateQueries({ queryKey: ['staff-stats'] });
		},
		onError: (error: ApiError) => {
			notifyError(
				t('staff.statusError.title'),
				error.response?.data?.error || t('staff.statusError.message')
			);
		},
	});

	// Handle add new staff
	const handleAddStaff = () => {
		if (formData.password !== formData.confirmPassword) {
			toast({
				title: t('common.error'),
				description: t('staff.validation.passwordsMismatch'),
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
		if (!confirm(t('staff.validation.deleteConfirmation'))) return;
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
					<span className='ml-2'>{t('common.loading')}...</span>
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
							<h3 className='text-lg font-medium'>{t('common.error')}</h3>
							<p className='text-muted-foreground mt-2'>
								{t('errors.loadingFailed')}
							</p>
							<Button
								onClick={() => refetchStaff()}
								className='mt-4'>
								<RefreshCw className='w-4 h-4 mr-2' />
								{t('errors.tryAgain')}
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
							{t('staff.title')}
						</h1>
						<p className='text-muted-foreground mt-2'>{t('staff.subtitle')}</p>
					</div>
					<Button onClick={() => setShowAddDialog(true)}>
						<UserPlus className='w-4 h-4 mr-2' />
						{t('staff.addStaff')}
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			{!statsLoading && statsData && (
				<div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								{t('staff.stats.totalStaff')}
							</CardTitle>
							<Users className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{statsData.total}</div>
							<p className='text-xs text-muted-foreground'>
								{statsData.active} {t('common.active')}, {statsData.inactive}{' '}
								{t('common.inactive')}
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								{t('staff.stats.activeStaff')}
							</CardTitle>
							<UserCheck className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{statsData.active}</div>
							<p className='text-xs text-muted-foreground'>
								{t('staff.stats.currentlyActive')}
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								{t('staff.stats.inactiveStaff')}
							</CardTitle>
							<UserX className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{statsData.inactive}</div>
							<p className='text-xs text-muted-foreground'>
								{t('staff.stats.notActive')}
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								{t('staff.stats.roles')}
							</CardTitle>
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
							<Label htmlFor='search'>{t('common.search')}</Label>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
								<Input
									id='search'
									placeholder={t('staff.filters.search')}
									className='pl-10'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>
						</div>
						<div>
							<Label htmlFor='role'>{t('staff.filters.role')}</Label>
							<Select
								value={roleFilter}
								onValueChange={setRoleFilter}>
								<SelectTrigger>
									<SelectValue placeholder={t('staff.filters.allRoles')} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>
										{t('staff.filters.allRoles')}
									</SelectItem>
									<SelectItem value='admin'>
										{t('staff.roles.admin')}
									</SelectItem>
									<SelectItem value='manager'>
										{t('staff.roles.manager')}
									</SelectItem>
									<SelectItem value='cashier'>
										{t('staff.roles.cashier')}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label htmlFor='status'>{t('staff.filters.status')}</Label>
							<Select
								value={statusFilter}
								onValueChange={setStatusFilter}>
								<SelectTrigger>
									<SelectValue placeholder={t('staff.filters.allStatus')} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>
										{t('staff.filters.allStatus')}
									</SelectItem>
									<SelectItem value='active'>{t('common.active')}</SelectItem>
									<SelectItem value='inactive'>
										{t('common.inactive')}
									</SelectItem>
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
								{t('staff.filters.reset')}
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Staff Table */}
			<Card>
				<CardHeader>
					<CardTitle>{t('staff.table.title')}</CardTitle>
					<CardDescription>
						{t('staff.table.staffFound', { count: filteredStaff.length })}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{filteredStaff.length === 0 ?
						<div className='text-center py-8'>
							<Users className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
							<p className='text-lg font-medium'>
								{t('staff.table.noStaffFound')}
							</p>
							<p className='text-muted-foreground mt-2'>
								{t('staff.table.noStaffMessage')}
							</p>
						</div>
					:	<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t('staff.table.name')}</TableHead>
									<TableHead>{t('staff.table.email')}</TableHead>
									<TableHead>{t('staff.table.role')}</TableHead>
									<TableHead>{t('staff.table.status')}</TableHead>
									<TableHead>{t('staff.table.joinedDate')}</TableHead>
									<TableHead className='text-right'>
										{t('staff.table.actions')}
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredStaff.map((member: StaffMember) => (
									<TableRow key={member._id}>
										<TableCell className='font-medium'>{member.name}</TableCell>
										<TableCell>{member.email}</TableCell>
										<TableCell>
											<Badge className={getRoleColor(member.role)}>
												{t(`staff.roles.${member.role}`)}
											</Badge>
										</TableCell>
										<TableCell>
											<Badge
												variant={member.isActive ? 'default' : 'secondary'}
												className='cursor-pointer'
												onClick={() => handleToggleActive(member)}>
												{member.isActive ?
													t('common.active')
												:	t('common.inactive')}
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
													<DropdownMenuLabel>
														{t('staff.table.actions')}
													</DropdownMenuLabel>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => openEditDialog(member)}>
														<Edit className='w-4 h-4 mr-2' />
														{t('staff.table.edit')}
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleToggleActive(member)}>
														{member.isActive ?
															<>
																<UserX className='w-4 h-4 mr-2' />
																{t('staff.table.deactivate')}
															</>
														:	<>
																<UserCheck className='w-4 h-4 mr-2' />
																{t('staff.table.activate')}
															</>
														}
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														className='text-red-600'
														onClick={() => handleDeleteStaff(member._id)}
														disabled={deleteStaffMutation.isPending}>
														<Trash2 className='w-4 h-4 mr-2' />
														{t('staff.table.delete')}
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
						<DialogTitle>{t('staff.dialogs.addTitle')}</DialogTitle>
						<DialogDescription>
							{t('staff.dialogs.addDescription')}
						</DialogDescription>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div className='grid gap-2'>
							<Label htmlFor='name'>{t('staff.dialogs.fullName')}</Label>
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
							<Label htmlFor='email'>{t('staff.dialogs.emailAddress')}</Label>
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
								<Label htmlFor='password'>{t('staff.dialogs.password')}</Label>
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
								<Label htmlFor='confirmPassword'>
									{t('staff.dialogs.confirmPassword')}
								</Label>
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
								<Label htmlFor='role'>{t('staff.dialogs.role')}</Label>
								<Select
									value={formData.role}
									onValueChange={(value: 'cashier' | 'manager' | 'admin') =>
										setFormData({ ...formData, role: value })
									}
									disabled={createStaffMutation.isPending}>
									<SelectTrigger>
										<SelectValue placeholder={t('common.select')} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='cashier'>
											{t('staff.roles.cashier')}
										</SelectItem>
										<SelectItem value='manager'>
											{t('staff.roles.manager')}
										</SelectItem>
										<SelectItem value='admin'>
											{t('staff.roles.admin')}
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='pin'>{t('staff.dialogs.pinCode')}</Label>
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
									{t('staff.dialogs.pinDescription')}
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
							<Label htmlFor='isActive'>{t('staff.dialogs.activeStaff')}</Label>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setShowAddDialog(false)}
							disabled={createStaffMutation.isPending}>
							{t('staff.dialogs.cancel')}
						</Button>
						<Button
							onClick={handleAddStaff}
							disabled={createStaffMutation.isPending}>
							{createStaffMutation.isPending ?
								<>
									<Loader2 className='w-4 h-4 mr-2 animate-spin' />
									{t('staff.dialogs.adding')}
								</>
							:	t('staff.dialogs.addButton')}
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
						<DialogTitle>{t('staff.dialogs.editTitle')}</DialogTitle>
						<DialogDescription>
							{t('staff.dialogs.editDescription')}
						</DialogDescription>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div className='grid gap-2'>
							<Label htmlFor='edit-name'>{t('staff.dialogs.fullName')}</Label>
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
							<Label htmlFor='edit-email'>
								{t('staff.dialogs.emailAddress')}
							</Label>
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
							<Label htmlFor='edit-role'>{t('staff.dialogs.role')}</Label>
							<Select
								value={formData.role}
								onValueChange={(value: 'cashier' | 'manager' | 'admin') =>
									setFormData({ ...formData, role: value })
								}
								disabled={updateStaffMutation.isPending}>
								<SelectTrigger>
									<SelectValue placeholder={t('common.select')} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='cashier'>
										{t('staff.roles.cashier')}
									</SelectItem>
									<SelectItem value='manager'>
										{t('staff.roles.manager')}
									</SelectItem>
									<SelectItem value='admin'>
										{t('staff.roles.admin')}
									</SelectItem>
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
							<Label htmlFor='edit-isActive'>
								{t('staff.dialogs.activeStaff')}
							</Label>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setShowEditDialog(false)}
							disabled={updateStaffMutation.isPending}>
							{t('staff.dialogs.cancel')}
						</Button>
						<Button
							onClick={handleUpdateStaff}
							disabled={updateStaffMutation.isPending}>
							{updateStaffMutation.isPending ?
								<>
									<Loader2 className='w-4 h-4 mr-2 animate-spin' />
									{t('staff.dialogs.updating')}
								</>
							:	t('staff.dialogs.updateButton')}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
