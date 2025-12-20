/** @format */

// lib/constants.ts
export const APP_NAME = 'Café POS';
export const APP_DESCRIPTION = 'Modern Restaurant Management System';

export const ORDER_STATUSES = [
	{ value: 'pending', label: 'Pending', color: 'yellow' },
	{ value: 'confirmed', label: 'Confirmed', color: 'blue' },
	{ value: 'preparing', label: 'Preparing', color: 'orange' },
	{ value: 'ready', label: 'Ready', color: 'green' },
	{ value: 'served', label: 'Served', color: 'purple' },
	{ value: 'paid', label: 'Paid', color: 'emerald' },
	{ value: 'cancelled', label: 'Cancelled', color: 'red' },
] as const;

export const TABLE_STATUSES = [
	{ value: 'available', label: 'Available', color: 'green' },
	{ value: 'occupied', label: 'Occupied', color: 'red' },
	{ value: 'reserved', label: 'Reserved', color: 'blue' },
	{ value: 'cleaning', label: 'Cleaning', color: 'yellow' },
] as const;

export const MENU_CATEGORIES = [
	'drinks',
	'food',
	'desserts',
	'pastries',
	'breakfast',
	'lunch',
	'dinner',
] as const;

export const ROLES = [
	{ value: 'admin', label: 'Administrator' },
	{ value: 'manager', label: 'Manager' },
	{ value: 'cashier', label: 'Cashier' },
	{ value: 'cook', label: 'Cook' },
] as const;

export const PAYMENT_METHODS = [
	{ value: 'cash', label: 'Cash' },
	{ value: 'card', label: 'Credit Card' },
	{ value: 'mobile', label: 'Mobile Payment' },
] as const;

export const TAX_RATE = 0.13; // 13% tax
