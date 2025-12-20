/** @format */

// lib/validations.ts
import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const orderItemSchema = z.object({
	menuItem: z.string().min(1, 'Menu item is required'),
	name: z.string().min(1, 'Item name is required'),
	price: z.number().min(0, 'Price must be positive'),
	quantity: z.number().min(1, 'Quantity must be at least 1'),
	specialInstructions: z.string().optional(),
});

export const orderSchema = z.object({
	items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
	tableNumber: z.string().min(1, 'Table number is required'),
	customerName: z.string().optional(),
	orderType: z.enum(['dine-in', 'takeaway', 'delivery']).default('dine-in'),
	kitchenNotes: z.string().optional(),
});

export const menuItemSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	price: z.number().min(0, 'Price must be positive'),
	cost: z.number().min(0, 'Cost must be positive').optional(),
	category: z.string().min(1, 'Category is required'),
	subCategory: z.string().optional(),
	preparationTime: z
		.number()
		.min(0, 'Preparation time must be positive')
		.default(10),
	stock: z.number().min(0, 'Stock cannot be negative').default(0),
	isAvailable: z.boolean().default(true),
	tags: z.array(z.string()).optional(),
});

export const tableSchema = z.object({
	tableNumber: z.string().min(1, 'Table number is required'),
	capacity: z.number().min(1, 'Capacity must be at least 1'),
	location: z
		.enum(['indoors', 'outdoors', 'bar', 'private'])
		.default('indoors'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
export type MenuItemFormData = z.infer<typeof menuItemSchema>;
export type TableFormData = z.infer<typeof tableSchema>;
