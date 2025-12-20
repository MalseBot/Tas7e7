/** @format */

// types/menu.ts
export interface MenuItem {
	_id: string;
	name: string;
	description: string;
	price: number;
	cost?: number;
	category: string;
	subCategory?: string;
	isAvailable: boolean;
	preparationTime: number;
	stock: number;
	hasVariants?: boolean;
	variants?: Array<{
		name: string;
		price: number;
	}>;
	modifiers?: Array<{
		name: string;
		options: Array<{
			name: string;
			price: number;
		}>;
	}>;
	image?: string;
	tags: string[];
	allergens?: string[];
	createdAt: string;
	updatedAt: string;
}

export interface CreateMenuItemDto {
	name: string;
	description?: string;
	price: number;
	cost?: number;
	category: string;
	subCategory?: string;
	preparationTime?: number;
	stock?: number;
	isAvailable?: boolean;
	tags?: string[];
	allergens?: string[];
}

export interface UpdateMenuItemDto extends Partial<CreateMenuItemDto> {}

export interface MenuCategory {
	name: string;
	count: number;
	items: MenuItem[];
}
