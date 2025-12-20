/** @format */

// types/user.ts
export interface User {
	_id: string;
	name: string;
	email: string;
	role: 'admin' | 'manager' | 'cashier' | 'cook';
	isActive: boolean;
	lastLogin?: string;
	createdAt: string;
	updatedAt: string;
}

export interface AuthResponse {
	success: boolean;
	token: string;
	user: User;
}

export interface StaffMember extends User {
	pin?: string;
	shift?: string;
}

export interface CreateUserDto {
	name: string;
	email: string;
	password: string;
	role: User['role'];
	pin?: string;
}
