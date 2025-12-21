/** @format */

// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Add these if not already present
export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(amount);
}

export function formatDate(date: Date | string): string {
	return new Intl.DateTimeFormat('en-US', {
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(new Date(date));
}

export function calculateTax(subtotal: number, taxRate = 0.13): number {
	return parseFloat((subtotal * taxRate).toFixed(2));
}

export function calculateTotal(
	subtotal: number,
	tax: number,
	tip = 0,
	discount = 0
): number {
	return parseFloat((subtotal + tax + tip - discount).toFixed(2));
}
