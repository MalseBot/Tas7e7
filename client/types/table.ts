/** @format */

// types/table.ts
export interface Table {
	_id: string;
	tableNumber: string;
	capacity: number;
	status: 'available' | 'occupied' | 'reserved' | 'cleaning';
	currentOrder?: string;
	location: 'indoors' | 'outdoors' | 'bar' | 'private';
	notes?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateTableDto {
	tableNumber: string;
	capacity: number;
	location?: 'indoors' | 'outdoors' | 'bar' | 'private';
}

export interface UpdateTableStatusDto {
	status: Table['status'];
}
