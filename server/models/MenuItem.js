import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please add item name'],
			trim: true,
			unique: true,
		},
		description: {
			type: String,
			default: '',
		},
		price: {
			type: Number,
			required: [true, 'Please add price'],
			min: [0, 'Price cannot be negative'],
		},
		cost: {
			type: Number,
			min: [0, 'Cost cannot be negative'],
		},
		category: {
			type: String,
			required: [true, 'Please add category'],
			enum: ['drinks', 'food', 'desserts', 'breakfast', 'lunch', 'dinner'],
		},
		subCategory: {
			type: String,
			enum: ['coffee', 'tea', 'sandwich', 'salad', 'cake', 'pastry', ''],
		},
		isAvailable: {
			type: Boolean,
			default: true,
		},
		preparationTime: {
			type: Number, // in minutes
			default: 10,
		},
		stock: {
			type: Number,
			default: 0,
			min: 0,
		},
		hasVariants: {
			type: Boolean,
			default: false,
		},
		variants: [
			{
				name: String,
				price: Number,
			},
		],
		modifiers: [
			{
				name: String,
				options: [
					{
						name: String,
						price: Number,
					},
				],
			},
		],
		image: {
			type: String,
			default: '',
		},
		tags: [String],
		allergens: [String],
	},
	{
		timestamps: true,
	}
);

// Index for faster searches
menuItemSchema.index({ name: 'text', description: 'text', category: 1 });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;