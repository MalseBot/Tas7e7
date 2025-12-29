/** @format */

// lib/api/services.ts
import { api } from './client';

// Auth Services
export const authService = {
	login: (email: string, password: string) =>
		api.post('/auth/login', { email, password }),
	pinLogin: (email: string, pin: string) =>
		api.post('/auth/pin-login', { email, pin }),
	getProfile: () => api.get('/auth/me'),
	register: (data: {
		name: string;
		email: string;
		password: string;
		role: string;
		pin?: string;
	}) => api.post('/auth/register', data),
};

export const settingsService = {
	// Get settings
	getSettings: () => api.get('/settings'),

	// Update settings
	updateSettings: (data:any) => api.put('/settings', data),

	// Reset settings
	resetSettings: () => api.post('/settings/reset'),
};

export const staffService = {
	// Get all staff
	getStaff: () => api.get('/admin/staff'),

	// Get staff stats
	getStaffStats: () => api.get('/admin/staff/stats'),

	// Get single staff member
	getStaffById: (id:string) => api.get(`/admin/staff/${id}`),

	// Create new staff
	createStaff: (data:any) => api.post('/admin/staff', data),

	// Update staff
	updateStaff: (id:string, data:any) => api.put(`/admin/staff/${id}`, data),

	// Delete staff
	deleteStaff: (id:string) => api.delete(`/admin/staff/${id}`),

	// Reset PIN
	resetPIN: (id:string, data:any) => api.put(`/admin/staff/${id}/reset-pin`, data),
};

// Order Services
export const orderService = {
	getOrders: (params?: any) => api.get('/orders', { params }),
	getOrder: (id: string) => api.get(`/orders/${id}`),
	createOrder: (data: any) => api.post('/orders', data),
	updateOrderStatus: (id: string, status: string) =>
		api.put(`/orders/${id}/status`, { status }),
	processPayment: (id: string, data: any) =>
		api.post(`/orders/${id}/pay`, data),
};

// Menu Services
export const menuService = {
	getMenu: (params?: any) => api.get('/menu', { params }),
	getMenuItem: (id: string) => api.get(`/menu/${id}`),
	createMenuItem: (data: any) => api.post('/menu', data),
	updateMenuItem: (id: string, data: any) => api.put(`/menu/${id}`, data),
	menuItemAvailability: (id: string) => api.put(`/menu/${id}/availability`),
	getCategories: () => api.get('/menu/categories'),
};

// Table Services
export const tableService = {
	getTables: () => api.get('/tables'),
	createTable: (data: any) => api.post('/tables', data),
	updateTableStatus: (id: string, status: string) =>
		api.put(`/tables/${id}/status`, { status }),
};

// Kitchen Services
export const kitchenService = {
	getKitchenOrders: () => api.get('/kitchen/orders'),
	startPreparation: (id: string) => api.put(`/kitchen/orders/${id}/start`),
	markAsReady: (id: string) => api.put(`/kitchen/orders/${id}/ready`),
	getLowInventory: () => api.get('/kitchen/inventory/low'),
};

// Admin Services
export const adminService = {
	getDashboardStats: () => api.get('/admin/dashboard'),
	getSalesReport: (params?: any) => api.get('/admin/reports/sales', { params }),
	getTopItems: () => api.get('/admin/reports/top-items'),
	getAllStaff: () => api.get('/admin/staff'),
	updateStaffRole: (id: string, data: any) =>
		api.put(`/admin/staff/${id}`, data),
	getActiveStaff: () => api.get('/admin/staff', { params: '?isActive=true' }),
};
