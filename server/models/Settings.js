/** @format */

// models/Settings.js
import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
	{
		cafeName: {
			type: String,
			default: 'My Café',
			required: true,
		},
		taxRate: {
			type: Number,
			default: 13,
			min: 0,
			max: 100,
		},
		currency: {
			type: String,
			default: 'USD',
			enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SAR', 'AED', 'EGP'],
		},
		openingHours: {
			type: String,
			default: '08:00',
		},
		closingHours: {
			type: String,
			default: '22:00',
		},
		timezone: {
			type: String,
			default: 'UTC+03:00',
		},
		address: {
			type: String,
			default: '',
		},
		phone: {
			type: String,
			default: '',
		},
		email: {
			type: String,
			default: '',
		},
		receiptHeader: {
			type: String,
			default: 'Thank you for your visit!',
		},
		receiptFooter: {
			type: String,
			default: 'Have a great day!',
		},
		logoUrl: {
			type: String,
			default: '',
		},
		enableTableReservation: {
			type: Boolean,
			default: true,
		},
		enableOnlineOrders: {
			type: Boolean,
			default: false,
		},
		requireCustomerName: {
			type: Boolean,
			default: false,
		},
		lowStockThreshold: {
			type: Number,
			default: 10,
			min: 1,
		},
		autoPrintReceipts: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
		// Ensure only one settings document exists
		statics: {
			async getSettings() {
				let settings = await this.findOne();
				if (!settings) {
					settings = await this.create({});
				}
				return settings;
			},
		},
	}
);

export default mongoose.model('Settings', settingsSchema);
