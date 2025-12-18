import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
	menuItem: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'MenuItem',
		required: true,
	},
	name: String, // Store name at time of order (in case menu changes)
	price: Number, // Store price at time of order
	quantity: {
		type: Number,
		required: true,
		min: 1,
		default: 1,
	},
	specialInstructions: {
		type: String,
		default: '',
	},
	modifiers: [
		{
			name: String,
			option: String,
			price: Number,
		},
	],
	variant: {
		name: String,
		price: Number,
	},
});

const orderSchema = new mongoose.Schema(
	{
		orderNumber: {
			type: String,
			unique: true,
		},
		items: [orderItemSchema],
		tableNumber: {
			type: String,
			required: true,
		},
		customerName: {
			type: String,
			default: '',
		},
		orderType: {
			type: String,
			enum: ['dine-in', 'takeaway', 'delivery'],
			default: 'dine-in',
		},
		status: {
			type: String,
			enum: [
				'pending',
				'confirmed',
				'preparing',
				'ready',
				'served',
				'paid',
				'cancelled',
			],
			default: 'pending',
		},
		subTotal: {
			type: Number,
			required: true,
			min: 0,
		},
		tax: {
			type: Number,
			default: 0,
		},
		tip: {
			type: Number,
			default: 0,
		},
		discount: {
			type: Number,
			default: 0,
		},
		total: {
			type: Number,
			required: true,
			min: 0,
		},
		paymentMethod: {
			type: String,
			enum: ['cash', 'card', 'mobile', 'none'],
			default: 'none',
		},
		paymentStatus: {
			type: String,
			enum: ['pending', 'paid', 'refunded'],
			default: 'pending',
		},
		cashier: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		kitchenNotes: {
			type: String,
			default: '',
		},
		estimatedReadyTime: Date,
		actualReadyTime: Date,
		servedTime: Date,
	},
	{
		timestamps: true,
	}
);

// Generate order number before saving
orderSchema.pre('save', async function (next) {
	if (!this.orderNumber) {
		const date = new Date();
		const dateStr = date.toISOString().slice(2, 10).replace(/-/g, '');
		const count = await this.constructor.countDocuments({
			createdAt: {
				$gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
			},
		});
		this.orderNumber = `ORD-${dateStr}-${(count + 1)
			.toString()
			.padStart(4, '0')}`;
	}
	next();
});

// Calculate totals before saving
orderSchema.pre('save', function (next) {
	// Calculate subtotal from items
	this.subTotal = this.items.reduce((sum, item) => {
		let itemTotal = item.price * item.quantity;

		// Add variant price if exists
		if (item.variant && item.variant.price) {
			itemTotal += item.variant.price * item.quantity;
		}

		// Add modifiers prices
		if (item.modifiers && item.modifiers.length > 0) {
			item.modifiers.forEach((mod) => {
				if (mod.price) {
					itemTotal += mod.price * item.quantity;
				}
			});
		}

		return sum + itemTotal;
	}, 0);

	// Calculate tax (13% HST as example)
	this.tax = this.subTotal * 0.13;

	// Calculate total
	this.total = this.subTotal + this.tax + this.tip - this.discount;

	next();
});

const Order = mongoose.model('Order', orderItemSchema);
export default Order;