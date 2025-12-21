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
	register: (data: any) => api.post('/auth/register', data),
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
	deleteMenuItem: (id: string) => api.delete(`/menu/${id}`),
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
	getTopItems: (params?: any) =>
		api.get('/admin/reports/top-items', { params }),
	getAllStaff: () => api.get('/admin/staff'),
	updateStaffRole: (id: string, data: any) =>
		api.put(`/admin/staff/${id}`, data),
};
