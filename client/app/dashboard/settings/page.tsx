/** @format */

// app/dashboard/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	Settings as SettingsIcon,
	Save,
	RotateCcw,
	Building,
	DollarSign,
	Clock,
	MapPin,
	Phone,
	Mail,
	Receipt,
	Image as ImageIcon,
	Table as TableIcon,
	Globe,
	Package,
	User,
	Printer,
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { settingsService } from '@/lib/api/services';
import { Loader2 } from 'lucide-react';
import { useNotificationActions } from '@/lib/hooks/useNotificationActions.ts';

// Currency options
const CURRENCY_OPTIONS = [
	{ value: 'USD', label: 'US Dollar ($)', symbol: '$' },
	{ value: 'EUR', label: 'Euro (€)', symbol: '€' },
	{ value: 'GBP', label: 'British Pound (£)', symbol: '£' },
	{ value: 'CAD', label: 'Canadian Dollar (C$)', symbol: 'C$' },
	{ value: 'AUD', label: 'Australian Dollar (A$)', symbol: 'A$' },
	{ value: 'SAR', label: 'Saudi Riyal (﷼)', symbol: '﷼' },
	{ value: 'AED', label: 'UAE Dirham (د.إ)', symbol: 'د.إ' },
	{ value: 'EGP', label: 'Egyptian Pound (E£)', symbol: 'E£' },
];

// Timezone options
const TIMEZONE_OPTIONS = [
	'UTC+03:00',
	'UTC+02:00',
	'UTC+01:00',
	'UTC',
	'UTC-01:00',
	'UTC-02:00',
	'UTC-03:00',
	'UTC-04:00',
	'UTC-05:00',
	'UTC-06:00',
	'UTC-07:00',
	'UTC-08:00',
	'UTC-09:00',
	'UTC-10:00',
	'UTC+04:00',
	'UTC+05:00',
	'UTC+06:00',
	'UTC+07:00',
	'UTC+08:00',
	'UTC+09:00',
	'UTC+10:00',
	'UTC+11:00',
	'UTC+12:00',
];

interface SettingsForm {
	cafeName: string;
	taxRate: number;
	currency: string;
	openingHours: string;
	closingHours: string;
	timezone: string;
	address: string;
	phone: string;
	email: string;
	receiptHeader: string;
	receiptFooter: string;
	logoUrl: string;
	enableTableReservation: boolean;
	enableOnlineOrders: boolean;
	requireCustomerName: boolean;
	lowStockThreshold: number;
	autoPrintReceipts: boolean;
}

export default function SettingsPage() {
	const { notifySuccess, notifyError } = useNotificationActions();
	const queryClient = useQueryClient();
	const [activeTab, setActiveTab] = useState('general');
	const [formData, setFormData] = useState<SettingsForm>({
		cafeName: '',
		taxRate: 13,
		currency: 'USD',
		openingHours: '08:00',
		closingHours: '22:00',
		timezone: 'UTC+03:00',
		address: '',
		phone: '',
		email: '',
		receiptHeader: 'Thank you for your visit!',
		receiptFooter: 'Have a great day!',
		logoUrl: '',
		enableTableReservation: true,
		enableOnlineOrders: false,
		requireCustomerName: false,
		lowStockThreshold: 10,
		autoPrintReceipts: true,
	});

	// Fetch settings
	const {
		data: settings,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['settings'],
		queryFn: () => settingsService.getSettings(),
		select: (data) => data.data.data,
	});

	// Update settings mutation
	const updateSettingsMutation = useMutation({
		mutationFn: (data: SettingsForm) => settingsService.updateSettings(data),
		onSuccess: () => {
			notifySuccess(
				'Settings Updated',
				'Your changes have been saved successfully'
			);
			queryClient.invalidateQueries({ queryKey: ['settings'] });
		},
		onError: (error: any) => {
			notifyError(
				'Update Failed',
				error.response?.data?.error || 'Failed to update settings'
			);
		},
	});

	// Reset settings mutation
	const resetSettingsMutation = useMutation({
		mutationFn: () => settingsService.resetSettings(),
		onSuccess: () => {
			notifySuccess(
				'Settings Reset',
				'Settings have been reset to default values'
			);
			queryClient.invalidateQueries({ queryKey: ['settings'] });
		},
		onError: (error: any) => {
			notifyError(
				'Reset Failed',
				error.response?.data?.error || 'Failed to reset settings'
			);
		},
	});

	// Update form data when settings load
	useEffect(() => {
		if (settings) {
			setFormData({
				cafeName: settings.cafeName || '',
				taxRate: settings.taxRate || 13,
				currency: settings.currency || 'USD',
				openingHours: settings.openingHours || '08:00',
				closingHours: settings.closingHours || '22:00',
				timezone: settings.timezone || 'UTC+03:00',
				address: settings.address || '',
				phone: settings.phone || '',
				email: settings.email || '',
				receiptHeader: settings.receiptHeader || 'Thank you for your visit!',
				receiptFooter: settings.receiptFooter || 'Have a great day!',
				logoUrl: settings.logoUrl || '',
				enableTableReservation: settings.enableTableReservation !== false,
				enableOnlineOrders: settings.enableOnlineOrders || false,
				requireCustomerName: settings.requireCustomerName || false,
				lowStockThreshold: settings.lowStockThreshold || 10,
				autoPrintReceipts: settings.autoPrintReceipts !== false,
			});
		}
	}, [settings]);

	const handleInputChange = (field: keyof SettingsForm, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSaveSettings = () => {
		updateSettingsMutation.mutate(formData);
	};

	const handleResetSettings = () => {
		if (
			confirm('Are you sure you want to reset all settings to default values?')
		) {
			resetSettingsMutation.mutate();
		}
	};

	const getCurrencySymbol = () => {
		const currency = CURRENCY_OPTIONS.find(
			(c) => c.value === formData.currency
		);
		return currency?.symbol || '$';
	};

	if (isLoading) {
		return (
			<div className='container mx-auto px-4 py-8'>
				<div className='flex items-center justify-center h-64'>
					<Loader2 className='w-8 h-8 animate-spin' />
					<span className='ml-2'>Loading settings...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='container mx-auto px-4 py-8'>
				<Card>
					<CardContent className='pt-6'>
						<div className='text-center py-8'>
							<SettingsIcon className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
							<h3 className='text-lg font-medium'>Failed to load settings</h3>
							<p className='text-muted-foreground mt-2'>
								There was an error loading the settings. Please try again.
							</p>
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
						<h1 className='text-2xl font-bold text-foreground'>Settings</h1>
						<p className='text-muted-foreground mt-2'>
							Configure your café settings and preferences
						</p>
					</div>
					<div className='flex gap-2'>
						<Button
							variant='outline'
							onClick={handleResetSettings}
							disabled={
								resetSettingsMutation.isPending ||
								updateSettingsMutation.isPending
							}>
							{resetSettingsMutation.isPending ?
								<Loader2 className='w-4 h-4 mr-2 animate-spin' />
							:	<RotateCcw className='w-4 h-4 mr-2' />}
							Reset to Default
						</Button>
						<Button
							onClick={handleSaveSettings}
							disabled={
								updateSettingsMutation.isPending ||
								resetSettingsMutation.isPending
							}>
							{updateSettingsMutation.isPending ?
								<Loader2 className='w-4 h-4 mr-2 animate-spin' />
							:	<Save className='w-4 h-4 mr-2' />}
							Save Changes
						</Button>
					</div>
				</div>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className='space-y-6'>
				<TabsList className='grid grid-cols-4 w-full max-w-2xl'>
					<TabsTrigger
						value='general'
						className='flex items-center gap-2'>
						<SettingsIcon className='w-4 h-4' />
						General
					</TabsTrigger>
					<TabsTrigger
						value='business'
						className='flex items-center gap-2'>
						<Building className='w-4 h-4' />
						Business Info
					</TabsTrigger>
					<TabsTrigger
						value='receipts'
						className='flex items-center gap-2'>
						<Receipt className='w-4 h-4' />
						Receipts
					</TabsTrigger>
					<TabsTrigger
						value='features'
						className='flex items-center gap-2'>
						<TableIcon className='w-4 h-4' />
						Features
					</TabsTrigger>
				</TabsList>

				{/* General Settings */}
				<TabsContent
					value='general'
					className='space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>General Settings</CardTitle>
							<CardDescription>
								Basic configuration for your café
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								{/* Café Name */}
								<div className='space-y-2'>
									<Label htmlFor='cafeName'>Café Name</Label>
									<Input
										id='cafeName'
										value={formData.cafeName}
										onChange={(e) =>
											handleInputChange('cafeName', e.target.value)
										}
										placeholder='My Café'
									/>
								</div>

								{/* Tax Rate */}
								<div className='space-y-2'>
									<Label htmlFor='taxRate'>
										Tax Rate ({getCurrencySymbol()})
									</Label>
									<div className='relative'>
										<Input
											id='taxRate'
											type='number'
											min='0'
											max='100'
											step='0.1'
											value={formData.taxRate}
											onChange={(e) =>
												handleInputChange(
													'taxRate',
													parseFloat(e.target.value) || 0
												)
											}
											className='pl-8'
										/>
										<span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground'>
											%
										</span>
									</div>
								</div>

								{/* Currency */}
								<div className='space-y-2'>
									<Label htmlFor='currency'>Currency</Label>
									<Select
										value={formData.currency}
										onValueChange={(value) =>
											handleInputChange('currency', value)
										}>
										<SelectTrigger>
											<SelectValue placeholder='Select currency' />
										</SelectTrigger>
										<SelectContent>
											{CURRENCY_OPTIONS.map((currency) => (
												<SelectItem
													key={currency.value}
													value={currency.value}>
													{currency.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{/* Timezone */}
								<div className='space-y-2'>
									<Label htmlFor='timezone'>Timezone</Label>
									<Select
										value={formData.timezone}
										onValueChange={(value) =>
											handleInputChange('timezone', value)
										}>
										<SelectTrigger>
											<SelectValue placeholder='Select timezone' />
										</SelectTrigger>
										<SelectContent>
											{TIMEZONE_OPTIONS.map((tz) => (
												<SelectItem
													key={tz}
													value={tz}>
													{tz}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{/* Opening Hours */}
								<div className='space-y-2'>
									<Label htmlFor='openingHours'>Opening Hours</Label>
									<div className='relative'>
										<Clock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
										<Input
											id='openingHours'
											type='time'
											value={formData.openingHours}
											onChange={(e) =>
												handleInputChange('openingHours', e.target.value)
											}
											className='pl-10'
										/>
									</div>
								</div>

								{/* Closing Hours */}
								<div className='space-y-2'>
									<Label htmlFor='closingHours'>Closing Hours</Label>
									<div className='relative'>
										<Clock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
										<Input
											id='closingHours'
											type='time'
											value={formData.closingHours}
											onChange={(e) =>
												handleInputChange('closingHours', e.target.value)
											}
											className='pl-10'
										/>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Business Info */}
				<TabsContent
					value='business'
					className='space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>Business Information</CardTitle>
							<CardDescription>
								Your café contact and location details
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='space-y-4'>
								{/* Address */}
								<div className='space-y-2'>
									<Label htmlFor='address'>Address</Label>
									<div className='relative'>
										<MapPin className='absolute left-3 top-3 text-muted-foreground w-4 h-4' />
										<Textarea
											id='address'
											value={formData.address}
											onChange={(e) =>
												handleInputChange('address', e.target.value)
											}
											placeholder='123 Café Street, City, Country'
											className='pl-10 min-h-[80px]'
										/>
									</div>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									{/* Phone */}
									<div className='space-y-2'>
										<Label htmlFor='phone'>Phone Number</Label>
										<div className='relative'>
											<Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
											<Input
												id='phone'
												type='tel'
												value={formData.phone}
												onChange={(e) =>
													handleInputChange('phone', e.target.value)
												}
												placeholder='+1 (555) 123-4567'
												className='pl-10'
											/>
										</div>
									</div>

									{/* Email */}
									<div className='space-y-2'>
										<Label htmlFor='email'>Email Address</Label>
										<div className='relative'>
											<Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
											<Input
												id='email'
												type='email'
												value={formData.email}
												onChange={(e) =>
													handleInputChange('email', e.target.value)
												}
												placeholder='contact@mycafe.com'
												className='pl-10'
											/>
										</div>
									</div>
								</div>

								{/* Logo URL */}
								<div className='space-y-2'>
									<Label htmlFor='logoUrl'>Logo URL</Label>
									<div className='relative'>
										<ImageIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
										<Input
											id='logoUrl'
											value={formData.logoUrl}
											onChange={(e) =>
												handleInputChange('logoUrl', e.target.value)
											}
											placeholder='https://example.com/logo.png'
											className='pl-10'
										/>
									</div>
									<p className='text-xs text-muted-foreground'>
										Enter the URL of your café logo. This will appear on
										receipts.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Receipt Settings */}
				<TabsContent
					value='receipts'
					className='space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>Receipt Configuration</CardTitle>
							<CardDescription>
								Customize receipt content and behavior
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='space-y-4'>
								{/* Receipt Header */}
								<div className='space-y-2'>
									<Label htmlFor='receiptHeader'>Receipt Header Message</Label>
									<Textarea
										id='receiptHeader'
										value={formData.receiptHeader}
										onChange={(e) =>
											handleInputChange('receiptHeader', e.target.value)
										}
										placeholder='Thank you for your visit!'
										className='min-h-[80px]'
									/>
								</div>

								{/* Receipt Footer */}
								<div className='space-y-2'>
									<Label htmlFor='receiptFooter'>Receipt Footer Message</Label>
									<Textarea
										id='receiptFooter'
										value={formData.receiptFooter}
										onChange={(e) =>
											handleInputChange('receiptFooter', e.target.value)
										}
										placeholder='Have a great day!'
										className='min-h-[80px]'
									/>
								</div>

								<Separator />

								{/* Auto Print Receipts */}
								<div className='flex items-center justify-between'>
									<div className='space-y-0.5'>
										<Label
											htmlFor='autoPrintReceipts'
											className='text-base'>
											Auto Print Receipts
										</Label>
										<p className='text-sm text-muted-foreground'>
											Automatically print receipts after payment
										</p>
									</div>
									<Switch
										id='autoPrintReceipts'
										checked={formData.autoPrintReceipts}
										onCheckedChange={(checked) =>
											handleInputChange('autoPrintReceipts', checked)
										}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Feature Settings */}
				<TabsContent
					value='features'
					className='space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>Feature Settings</CardTitle>
							<CardDescription>
								Enable or disable various café features
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='space-y-4'>
								{/* Table Reservation */}
								<div className='flex items-center justify-between'>
									<div className='space-y-0.5'>
										<Label
											htmlFor='enableTableReservation'
											className='text-base'>
											Table Reservation
										</Label>
										<p className='text-sm text-muted-foreground'>
											Allow customers to reserve tables
										</p>
									</div>
									<Switch
										id='enableTableReservation'
										checked={formData.enableTableReservation}
										onCheckedChange={(checked) =>
											handleInputChange('enableTableReservation', checked)
										}
									/>
								</div>

								{/* Online Orders */}
								<div className='flex items-center justify-between'>
									<div className='space-y-0.5'>
										<Label
											htmlFor='enableOnlineOrders'
											className='text-base'>
											Online Orders
										</Label>
										<p className='text-sm text-muted-foreground'>
											Enable online order placement
										</p>
									</div>
									<Switch
										id='enableOnlineOrders'
										checked={formData.enableOnlineOrders}
										onCheckedChange={(checked) =>
											handleInputChange('enableOnlineOrders', checked)
										}
									/>
								</div>

								{/* Require Customer Name */}
								<div className='flex items-center justify-between'>
									<div className='space-y-0.5'>
										<Label
											htmlFor='requireCustomerName'
											className='text-base'>
											Require Customer Name
										</Label>
										<p className='text-sm text-muted-foreground'>
											Force cashiers to enter customer name for orders
										</p>
									</div>
									<Switch
										id='requireCustomerName'
										checked={formData.requireCustomerName}
										onCheckedChange={(checked) =>
											handleInputChange('requireCustomerName', checked)
										}
									/>
								</div>

								<Separator />

								{/* Low Stock Threshold */}
								<div className='space-y-2'>
									<Label htmlFor='lowStockThreshold'>Low Stock Threshold</Label>
									<div className='flex items-center gap-4'>
										<Input
											id='lowStockThreshold'
											type='number'
											min='1'
											value={formData.lowStockThreshold}
											onChange={(e) =>
												handleInputChange(
													'lowStockThreshold',
													parseInt(e.target.value) || 10
												)
											}
											className='w-32'
										/>
										<span className='text-sm text-muted-foreground'>
											items (Items with stock below this will be marked as low
											stock)
										</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Preview Card */}
					<Card>
						<CardHeader>
							<CardTitle>Preview</CardTitle>
							<CardDescription>
								See how your settings affect the system
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4 p-4 border rounded-lg bg-muted/30'>
								<div className='flex items-center justify-between'>
									<span className='font-medium'>Café Name:</span>
									<span>{formData.cafeName || 'My Café'}</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='font-medium'>Tax Rate:</span>
									<span>{formData.taxRate}%</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='font-medium'>Currency:</span>
									<span>
										{getCurrencySymbol()} ({formData.currency})
									</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='font-medium'>Business Hours:</span>
									<span>
										{formData.openingHours} - {formData.closingHours}
									</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='font-medium'>Low Stock Alert:</span>
									<span>
										When stock is below {formData.lowStockThreshold} items
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Save Button at Bottom
			<div className='sticky bottom-6 mt-8 flex justify-end'>
				<Card className='shadow-lg'>
					<CardContent className='pt-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='font-medium'>Unsaved Changes</p>
								<p className='text-sm text-muted-foreground'>
									Click save to apply your changes
								</p>
							</div>
							<div className='flex gap-2'>
								<Button
									variant='outline'
									onClick={handleResetSettings}
									disabled={
										resetSettingsMutation.isPending ||
										updateSettingsMutation.isPending
									}>
									{resetSettingsMutation.isPending ?
										<Loader2 className='w-4 h-4 mr-2 animate-spin' />
									:	<RotateCcw className='w-4 h-4 mr-2' />}
									Reset
								</Button>
								<Button
									onClick={handleSaveSettings}
									disabled={
										updateSettingsMutation.isPending ||
										resetSettingsMutation.isPending
									}
									className='min-w-32'>
									{updateSettingsMutation.isPending ?
										<>
											<Loader2 className='w-4 h-4 mr-2 animate-spin' />
											Saving...
										</>
									:	<>
											<Save className='w-4 h-4 mr-2' />
											Save Changes
										</>
									}
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div> */}
		</div>
	);
}
