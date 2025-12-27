/** @format */

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
	{
		items: [
			{
				menuItem: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'MenuItem',
					required: true,
				},
				name: String,
				price: {
					type: Number,
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				specialInstructions: String,
				modifiers: [String],
				variant: {
					name: String,
					price: Number,
				},
			},
		],
		tableNumber: String,
		customerName: String,
		orderType: {
			type: String,
			enum: ['dine-in', 'takeaway', 'delivery'],
			default: 'dine-in',
		},
		kitchenNotes: String,
		status: {
			type: String,
			enum: [
				'pending',
				'confirmed',
				'preparing',
				'ready',
				'served',
				'completed',
				'cancelled',
			],
			default: 'pending',
		},
		subTotal: {
			type: Number,
			default: 0,
		},
		tax: {
			type: Number,
			default: 0,
		},
		total: {
			type: Number,
			default: 0,
		},
		cashier: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		estimatedReadyTime: Date,
		paymentStatus: {
			type: String,
			enum: ['pending', 'paid', 'refunded', 'failed'],
			default: 'pending',
		},
		paymentMethod: {
			type: String,
			enum: ['cash', 'card', 'mobile'],
			default: 'cash',
		},
		orderNumber: {
			type: String,
			unique: true,
		},
	},
	{ timestamps: true }
);

// ============ FIXED PRE-SAVE HOOK ============
orderSchema.pre('save', async function () {
	// REMOVED: (next) parameter
	try {
		// Calculate subtotal from items
		if (this.items && this.items.length > 0) {
			let subTotal = 0;

			// Sum up (price * quantity) for each item
			for (const item of this.items) {
				// Use item.price which should already include variant/modifier prices
				const itemPrice = item.price || 0;
				const quantity = item.quantity || 1;
				subTotal += itemPrice * quantity;
			}

			this.subTotal = parseFloat(subTotal.toFixed(2));

			// Calculate tax (example: 10% tax rate)
			const taxRate = 0.1; // 10%
			this.tax = parseFloat((this.subTotal * taxRate).toFixed(2));

			// Calculate total
			this.total = parseFloat((this.subTotal + this.tax).toFixed(2));
		}

		// Generate order number if not present
		if (!this.orderNumber) {
			const date = new Date();
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const random = String(Math.floor(Math.random() * 900) + 100).padStart(
				3,
				'0'
			);
			this.orderNumber = `ORD-${year}${month}${day}-${random}`;
		}

		// REMOVED: Don't call next() in pre-save hook
		// The function will automatically continue
	} catch (error) {
		console.error('Pre-save hook error:', error);
		// Throw the error instead of calling next(error)
		throw error;
	}
});

// ============ POST-SAVE HOOK (Optional) ============
orderSchema.post('save', async function (doc) {
	try {
		// Update stock levels for each menu item
		for (const item of doc.items) {
			await mongoose
				.model('MenuItem')
				.findByIdAndUpdate(item.menuItem, { $inc: { stock: -item.quantity } });
		}
	} catch (error) {
		console.error('Post-save hook error (stock update):', error);
		// Don't throw in post-save hook to avoid blocking the save
	}
});

export default mongoose.model('Order', orderSchema);
