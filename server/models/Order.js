/** @format */

import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
	menuItem: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'MenuItem',
		required: true, // This is causing the error
	},
	name: { type: String, required: true },
	price: { type: Number, required: true },
	quantity: { type: Number, required: true, min: 1 },
	specialInstructions: String,
	modifiers: [String],
	variant: {
		name: String,
		price: Number,
	},
});

const orderSchema = new mongoose.Schema(
	{
		items: [orderItemSchema],
		tableNumber: String,
		customerName: { type: String, required: true },
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
				'cancelled',
			],
			default: 'pending',
		},
		subTotal: { type: Number, default: 0 },
		total: { type: Number, default: 0 },
		cashier: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		estimatedReadyTime: Date,
		kitchenNotes: String,
		paymentStatus: {
			type: String,
			enum: ['pending', 'paid', 'refunded'],
			default: 'pending',
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Order', orderSchema);
