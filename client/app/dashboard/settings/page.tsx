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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

import { settingsService } from '@/lib/api/services';
import { Loader2 } from 'lucide-react';
import { useNotificationActions } from '@/lib/hooks/useNotificationActions.ts';
import { useTranslation } from '@/lib/hooks/useTranslation';

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

interface ApiError {
	response?: {
		data?: {
			error?: string;
		};
	};
	message?: string;
}

export default function SettingsPage() {
	const { t } = useTranslation();
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
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
				t('settings.updateSuccess.title'),
				t('settings.updateSuccess.message')
			);
			queryClient.invalidateQueries({ queryKey: ['settings'] });
			setFormErrors({});
		},
		onError: (error: ApiError) => {
			notifyError(
				t('settings.updateError.title'),
				error.response?.data?.error || t('settings.updateError.message')
			);
		},
	});

	// Reset settings mutation
	const resetSettingsMutation = useMutation({
		mutationFn: () => settingsService.resetSettings(),
		onSuccess: () => {
			notifySuccess(
				t('settings.resetSuccess.title'),
				t('settings.resetSuccess.message')
			);
			queryClient.invalidateQueries({ queryKey: ['settings'] });
		},
		onError: (error: ApiError) => {
			notifyError(
				t('settings.resetError.title'),
				error.response?.data?.error || t('settings.resetError.message')
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
				receiptHeader:
					settings.receiptHeader || t('settings.defaultReceiptHeader'),
				receiptFooter:
					settings.receiptFooter || t('settings.defaultReceiptFooter'),
				logoUrl: settings.logoUrl || '',
				enableTableReservation: settings.enableTableReservation !== false,
				enableOnlineOrders: settings.enableOnlineOrders || false,
				requireCustomerName: settings.requireCustomerName || false,
				lowStockThreshold: settings.lowStockThreshold || 10,
				autoPrintReceipts: settings.autoPrintReceipts !== false,
			});
		}
	}, [settings, t]);

	const validateForm = (): boolean => {
		const errors: Record<string, string> = {};

		if (!formData.cafeName.trim()) {
			errors.cafeName = t('settings.validation.cafeNameRequired');
		}

		if (formData.taxRate < 0 || formData.taxRate > 100) {
			errors.taxRate = t('settings.validation.taxRateRange');
		}

		if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			errors.email = t('settings.validation.invalidEmail');
		}

		if (formData.lowStockThreshold < 1) {
			errors.lowStockThreshold = t('settings.validation.lowStockThresholdMin');
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleInputChange = (field: keyof SettingsForm, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
		// Clear error for this field when user starts typing
		if (formErrors[field]) {
			setFormErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	const handleSaveSettings = () => {
		if (validateForm()) {
			updateSettingsMutation.mutate(formData);
		}
	};

	const handleResetSettings = () => {
		if (confirm(t('settings.resetConfirmation'))) {
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
					<span className='ml-2'>{t('common.loading')}...</span>
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
							<h3 className='text-lg font-medium'>{t('common.error')}</h3>
							<p className='text-muted-foreground mt-2'>
								{t('settings.loadError')}
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
						<h1 className='text-2xl font-bold text-foreground'>
							{t('settings.title')}
						</h1>
						<p className='text-muted-foreground mt-2'>
							{t('settings.subtitle')}
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
							{t('settings.resetToDefault')}
						</Button>
						<Button
							onClick={handleSaveSettings}
							disabled={
								updateSettingsMutation.isPending ||
								resetSettingsMutation.isPending ||
								Object.keys(formErrors).length > 0
							}>
							{updateSettingsMutation.isPending ?
								<Loader2 className='w-4 h-4 mr-2 animate-spin' />
							:	<Save className='w-4 h-4 mr-2' />}
							{t('settings.saveChanges')}
						</Button>
					</div>
				</div>
			</div>

			{/* Form Errors */}
			{Object.keys(formErrors).length > 0 && (
				<Alert
					variant='destructive'
					className='mb-6'>
					<AlertCircle className='h-4 w-4' />
					<AlertDescription>
						{t('settings.validation.fixErrors')}
						<ul className='mt-2 list-disc list-inside'>
							{Object.values(formErrors).map((error, index) => (
								<li key={index}>{error}</li>
							))}
						</ul>
					</AlertDescription>
				</Alert>
			)}

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className='space-y-6'>
				<TabsList className='grid grid-cols-4 w-full max-w-2xl'>
					<TabsTrigger
						value='general'
						className='flex items-center gap-2'>
						<SettingsIcon className='w-4 h-4' />
						{t('settings.tabs.general')}
					</TabsTrigger>
					<TabsTrigger
						value='business'
						className='flex items-center gap-2'>
						<Building className='w-4 h-4' />
						{t('settings.tabs.business')}
					</TabsTrigger>
					<TabsTrigger
						value='receipts'
						className='flex items-center gap-2'>
						<Receipt className='w-4 h-4' />
						{t('settings.tabs.receipts')}
					</TabsTrigger>
					<TabsTrigger
						value='features'
						className='flex items-center gap-2'>
						<TableIcon className='w-4 h-4' />
						{t('settings.tabs.features')}
					</TabsTrigger>
				</TabsList>

				{/* General Settings */}
				<TabsContent
					value='general'
					className='space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>{t('settings.tabs.general')}</CardTitle>
							<CardDescription>
								{t('settings.descriptions.general')}
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								{/* Café Name */}
								<div className='space-y-2'>
									<Label htmlFor='cafeName'>
										{t('settings.fields.cafeName')}
									</Label>
									<Input
										id='cafeName'
										value={formData.cafeName}
										onChange={(e) =>
											handleInputChange('cafeName', e.target.value)
										}
										placeholder={t('settings.placeholders.cafeName')}
										aria-invalid={!!formErrors.cafeName}
										aria-describedby={
											formErrors.cafeName ? 'cafeName-error' : undefined
										}
									/>
									{formErrors.cafeName && (
										<p
											className='text-sm text-destructive'
											id='cafeName-error'>
											{formErrors.cafeName}
										</p>
									)}
								</div>

								{/* Tax Rate */}
								<div className='space-y-2'>
									<Label htmlFor='taxRate'>
										{t('settings.fields.taxRate')} ({getCurrencySymbol()})
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
											aria-invalid={!!formErrors.taxRate}
											aria-describedby={
												formErrors.taxRate ? 'taxRate-error' : undefined
											}
										/>
										<span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground'>
											%
										</span>
									</div>
									{formErrors.taxRate && (
										<p
											className='text-sm text-destructive'
											id='taxRate-error'>
											{formErrors.taxRate}
										</p>
									)}
								</div>

								{/* Currency */}
								<div className='space-y-2'>
									<Label htmlFor='currency'>
										{t('settings.fields.currency')}
									</Label>
									<Select
										value={formData.currency}
										onValueChange={(value) =>
											handleInputChange('currency', value)
										}>
										<SelectTrigger>
											<SelectValue
												placeholder={t('settings.placeholders.currency')}
											/>
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
									<Label htmlFor='timezone'>
										{t('settings.fields.timezone')}
									</Label>
									<Select
										value={formData.timezone}
										onValueChange={(value) =>
											handleInputChange('timezone', value)
										}>
										<SelectTrigger>
											<SelectValue
												placeholder={t('settings.placeholders.timezone')}
											/>
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
									<Label htmlFor='openingHours'>
										{t('settings.fields.openingHours')}
									</Label>
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
									<Label htmlFor='closingHours'>
										{t('settings.fields.closingHours')}
									</Label>
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
							<CardTitle>{t('settings.tabs.business')}</CardTitle>
							<CardDescription>
								{t('settings.descriptions.business')}
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='space-y-4'>
								{/* Address */}
								<div className='space-y-2'>
									<Label htmlFor='address'>
										{t('settings.fields.address')}
									</Label>
									<div className='relative'>
										<MapPin className='absolute left-3 top-3 text-muted-foreground w-4 h-4' />
										<Textarea
											id='address'
											value={formData.address}
											onChange={(e) =>
												handleInputChange('address', e.target.value)
											}
											placeholder={t('settings.placeholders.address')}
											className='pl-10 min-h-20'
										/>
									</div>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									{/* Phone */}
									<div className='space-y-2'>
										<Label htmlFor='phone'>{t('settings.fields.phone')}</Label>
										<div className='relative'>
											<Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
											<Input
												id='phone'
												type='tel'
												value={formData.phone}
												onChange={(e) =>
													handleInputChange('phone', e.target.value)
												}
												placeholder={t('settings.placeholders.phone')}
												className='pl-10'
											/>
										</div>
									</div>

									{/* Email */}
									<div className='space-y-2'>
										<Label htmlFor='email'>{t('settings.fields.email')}</Label>
										<div className='relative'>
											<Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
											<Input
												id='email'
												type='email'
												value={formData.email}
												onChange={(e) =>
													handleInputChange('email', e.target.value)
												}
												placeholder={t('settings.placeholders.email')}
												className='pl-10'
												aria-invalid={!!formErrors.email}
												aria-describedby={
													formErrors.email ? 'email-error' : undefined
												}
											/>
										</div>
										{formErrors.email && (
											<p
												className='text-sm text-destructive'
												id='email-error'>
												{formErrors.email}
											</p>
										)}
									</div>
								</div>

								{/* Logo URL */}
								<div className='space-y-2'>
									<Label htmlFor='logoUrl'>
										{t('settings.fields.logoUrl')}
									</Label>
									<div className='relative'>
										<ImageIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
										<Input
											id='logoUrl'
											value={formData.logoUrl}
											onChange={(e) =>
												handleInputChange('logoUrl', e.target.value)
											}
											placeholder={t('settings.placeholders.logoUrl')}
											className='pl-10'
										/>
									</div>
									<p className='text-xs text-muted-foreground'>
										{t('settings.descriptions.logoUrl')}
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
							<CardTitle>{t('settings.tabs.receipts')}</CardTitle>
							<CardDescription>
								{t('settings.descriptions.receipts')}
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='space-y-4'>
								{/* Receipt Header */}
								<div className='space-y-2'>
									<Label htmlFor='receiptHeader'>
										{t('settings.fields.receiptHeader')}
									</Label>
									<Textarea
										id='receiptHeader'
										value={formData.receiptHeader}
										onChange={(e) =>
											handleInputChange('receiptHeader', e.target.value)
										}
										placeholder={t('settings.placeholders.receiptHeader')}
										className='min-h-20'
									/>
								</div>

								{/* Receipt Footer */}
								<div className='space-y-2'>
									<Label htmlFor='receiptFooter'>
										{t('settings.fields.receiptFooter')}
									</Label>
									<Textarea
										id='receiptFooter'
										value={formData.receiptFooter}
										onChange={(e) =>
											handleInputChange('receiptFooter', e.target.value)
										}
										placeholder={t('settings.placeholders.receiptFooter')}
										className='min-h-20'
									/>
								</div>

								<Separator />

								{/* Auto Print Receipts */}
								<div className='flex items-center justify-between'>
									<div className='space-y-0.5'>
										<Label
											htmlFor='autoPrintReceipts'
											className='text-base'>
											{t('settings.fields.autoPrintReceipts')}
										</Label>
										<p className='text-sm text-muted-foreground'>
											{t('settings.descriptions.autoPrintReceipts')}
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
							<CardTitle>{t('settings.tabs.features')}</CardTitle>
							<CardDescription>
								{t('settings.descriptions.features')}
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
											{t('settings.fields.enableTableReservation')}
										</Label>
										<p className='text-sm text-muted-foreground'>
											{t('settings.descriptions.enableTableReservation')}
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
											{t('settings.fields.enableOnlineOrders')}
										</Label>
										<p className='text-sm text-muted-foreground'>
											{t('settings.descriptions.enableOnlineOrders')}
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
											{t('settings.fields.requireCustomerName')}
										</Label>
										<p className='text-sm text-muted-foreground'>
											{t('settings.descriptions.requireCustomerName')}
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
									<Label htmlFor='lowStockThreshold'>
										{t('settings.fields.lowStockThreshold')}
									</Label>
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
											aria-invalid={!!formErrors.lowStockThreshold}
											aria-describedby={
												formErrors.lowStockThreshold ?
													'lowStockThreshold-error'
												:	undefined
											}
										/>
										<span className='text-sm text-muted-foreground'>
											{t('settings.descriptions.lowStockThreshold')}
										</span>
									</div>
									{formErrors.lowStockThreshold && (
										<p
											className='text-sm text-destructive'
											id='lowStockThreshold-error'>
											{formErrors.lowStockThreshold}
										</p>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Preview Card */}
					<Card>
						<CardHeader>
							<CardTitle>{t('settings.preview.title')}</CardTitle>
							<CardDescription>
								{t('settings.preview.description')}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4 p-4 border rounded-lg bg-muted/30'>
								<div className='flex items-center justify-between'>
									<span className='font-medium'>
										{t('settings.fields.cafeName')}:
									</span>
									<span>
										{formData.cafeName || t('settings.placeholders.cafeName')}
									</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='font-medium'>
										{t('settings.fields.taxRate')}:
									</span>
									<span>{formData.taxRate}%</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='font-medium'>
										{t('settings.fields.currency')}:
									</span>
									<span>
										{getCurrencySymbol()} ({formData.currency})
									</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='font-medium'>
										{t('settings.fields.businessHours')}:
									</span>
									<span>
										{formData.openingHours} - {formData.closingHours}
									</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='font-medium'>
										{t('settings.fields.lowStockAlert')}:
									</span>
									<span>
										{t('settings.preview.lowStockAlert', {
											threshold: formData.lowStockThreshold,
										})}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
