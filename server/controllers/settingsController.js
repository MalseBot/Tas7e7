/** @format */

// controllers/settingsController.js
import Settings from '../models/Settings.js';

const settingsController = {
	// Get settings
	getSettings: async (req, res, next) => {
		try {
			const settings = await Settings.getSettings();

			res.status(200).json({
				success: true,
				data: settings,
			});
		} catch (error) {
			next(error);
		}
	},

	// Update settings
	updateSettings: async (req, res, next) => {
		try {
			const {
				cafeName,
				taxRate,
				currency,
				openingHours,
				closingHours,
				timezone,
				address,
				phone,
				email,
				receiptHeader,
				receiptFooter,
				logoUrl,
				enableTableReservation,
				enableOnlineOrders,
				requireCustomerName,
				lowStockThreshold,
				autoPrintReceipts,
			} = req.body;

			// Validate opening/closing hours format
			const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
			if (openingHours && !timeRegex.test(openingHours)) {
				return res.status(400).json({
					success: false,
					error: 'Invalid opening hours format. Use HH:MM',
				});
			}
			if (closingHours && !timeRegex.test(closingHours)) {
				return res.status(400).json({
					success: false,
					error: 'Invalid closing hours format. Use HH:MM',
				});
			}

			// Get current settings or create if doesn't exist
			let settings = await Settings.findOne();
			if (!settings) {
				settings = await Settings.create({});
			}

			// Update fields if provided
			const updateData = {};
			if (cafeName !== undefined) updateData.cafeName = cafeName;
			if (taxRate !== undefined) updateData.taxRate = parseFloat(taxRate);
			if (currency !== undefined) updateData.currency = currency;
			if (openingHours !== undefined) updateData.openingHours = openingHours;
			if (closingHours !== undefined) updateData.closingHours = closingHours;
			if (timezone !== undefined) updateData.timezone = timezone;
			if (address !== undefined) updateData.address = address;
			if (phone !== undefined) updateData.phone = phone;
			if (email !== undefined) updateData.email = email;
			if (receiptHeader !== undefined) updateData.receiptHeader = receiptHeader;
			if (receiptFooter !== undefined) updateData.receiptFooter = receiptFooter;
			if (logoUrl !== undefined) updateData.logoUrl = logoUrl;
			if (enableTableReservation !== undefined)
				updateData.enableTableReservation = enableTableReservation;
			if (enableOnlineOrders !== undefined)
				updateData.enableOnlineOrders = enableOnlineOrders;
			if (requireCustomerName !== undefined)
				updateData.requireCustomerName = requireCustomerName;
			if (lowStockThreshold !== undefined)
				updateData.lowStockThreshold = parseInt(lowStockThreshold);
			if (autoPrintReceipts !== undefined)
				updateData.autoPrintReceipts = autoPrintReceipts;

			// Update settings
			settings = await Settings.findByIdAndUpdate(settings._id, updateData, {
				new: true,
				runValidators: true,
			});

			res.status(200).json({
				success: true,
				message: 'Settings updated successfully',
				data: settings,
			});
		} catch (error) {
			next(error);
		}
	},

	// Reset to default settings
	resetSettings: async (req, res, next) => {
		try {
			let settings = await Settings.findOne();
			if (!settings) {
				settings = await Settings.create({});
			}

			// Reset to defaults
			settings = await Settings.findByIdAndUpdate(
				settings._id,
				{
					cafeName: 'My Café',
					taxRate: 13,
					currency: 'USD',
					openingHours: '08:00',
					closingHours: '22:00',
					timezone: 'UTC+03:00',
					address: '',
					phone: '',
					email: '',
					receiptHeader: 'Thank you for your visit!',
					receiptFooter: 'Have a great day!',
					logoUrl: '',
					enableTableReservation: true,
					enableOnlineOrders: false,
					requireCustomerName: false,
					lowStockThreshold: 10,
					autoPrintReceipts: true,
				},
				{ new: true }
			);

			res.status(200).json({
				success: true,
				message: 'Settings reset to default',
				data: settings,
			});
		} catch (error) {
			next(error);
		}
	},
};

export default settingsController;
