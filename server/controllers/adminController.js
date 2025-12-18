/** @format */

// src/controllers/adminController.js
import User from '../models/User.js';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';

const adminController = {
	// Dashboard statistics
	getDashboardStats: async (req, res, next) => {
		try {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const tomorrow = new Date(today);
			tomorrow.setDate(tomorrow.getDate() + 1);

			const [
				todayOrders,
				todayRevenue,
				totalOrders,
				totalRevenue,
				lowStockItems,
				activeUsers,
			] = await Promise.all([
				// Today's orders count
				Order.countDocuments({
					createdAt: { $gte: today, $lt: tomorrow },
				}),

				// Today's revenue
				aggregate([
					{
						$match: {
							createdAt: { $gte: today, $lt: tomorrow },
							paymentStatus: 'paid',
						},
					},
					{
						$group: {
							_id: null,
							total: { $sum: '$total' },
						},
					},
				]),

				// Total orders
				Order.countDocuments(),

				// Total revenue
				aggregate([
					{
						$match: { paymentStatus: 'paid' },
					},
					{
						$group: {
							_id: null,
							total: { $sum: '$total' },
						},
					},
				]),

				// Low stock items
				MenuItem.countDocuments({
					stock: { $gt: 0, $lt: 10 },
				}),

				// Active staff
				User.countDocuments({ isActive: true }),
			]);

			res.status(200).json({
				success: true,
				data: {
					todayOrders,
					todayRevenue: todayRevenue[0]?.total || 0,
					totalOrders,
					totalRevenue: totalRevenue[0]?.total || 0,
					lowStockItems,
					activeUsers,
				},
			});
		} catch (error) {
			next(error);
		}
	},

	// Sales report by date range
	getSalesReport: async (req, res, next) => {
		try {
			const { startDate, endDate, groupBy = 'day' } = req.query;

			const matchStage = {};

			if (startDate || endDate) {
				matchStage.createdAt = {};
				if (startDate) matchStage.createdAt.$gte = new Date(startDate);
				if (endDate) matchStage.createdAt.$lte = new Date(endDate);
			}

			matchStage.paymentStatus = 'paid';

			let groupStage;
			if (groupBy === 'day') {
				groupStage = {
					_id: {
						year: { $year: '$createdAt' },
						month: { $month: '$createdAt' },
						day: { $dayOfMonth: '$createdAt' },
					},
				};
			} else if (groupBy === 'hour') {
				groupStage = {
					_id: {
						hour: { $hour: '$createdAt' },
					},
				};
			}

			const report = await aggregate([
				{ $match: matchStage },
				{
					$group: {
						...groupStage,
						totalOrders: { $sum: 1 },
						totalRevenue: { $sum: '$total' },
						averageOrderValue: { $avg: '$total' },
					},
				},
				{ $sort: { _id: 1 } },
			]);

			res.status(200).json({
				success: true,
				data: report,
			});
		} catch (error) {
			next(error);
		}
	},

	// Top selling items
	getTopSellingItems: async (req, res, next) => {
		try {
			const { limit = 10, startDate, endDate } = req.query;

			const matchStage = { paymentStatus: 'paid' };

			if (startDate || endDate) {
				matchStage.createdAt = {};
				if (startDate) matchStage.createdAt.$gte = new Date(startDate);
				if (endDate) matchStage.createdAt.$lte = new Date(endDate);
			}

			const topItems = await aggregate([
				{ $match: matchStage },
				{ $unwind: '$items' },
				{
					$group: {
						_id: '$items.menuItem',
						itemName: { $first: '$items.name' },
						totalQuantity: { $sum: '$items.quantity' },
						totalRevenue: {
							$sum: {
								$multiply: ['$items.price', '$items.quantity'],
							},
						},
					},
				},
				{ $sort: { totalQuantity: -1 } },
				{ $limit: parseInt(limit) },
			]);

			// Populate menu item details
			const populatedItems = await populate(topItems, {
				path: '_id',
				select: 'name category',
			});

			res.status(200).json({
				success: true,
				data: populatedItems,
			});
		} catch (error) {
			next(error);
		}
	},

	// Staff management
	getAllStaff: async (req, res, next) => {
		try {
			const staff = await find().select('-password -pin');

			res.status(200).json({
				success: true,
				count: staff.length,
				data: staff,
			});
		} catch (error) {
			next(error);
		}
	},

	// Update staff role
	updateStaffRole: async (req, res, next) => {
		try {
			const { role, isActive } = req.body;

			const user = await findById(req.params.id);

			if (!user) {
				return res.status(404).json({
					success: false,
					error: 'Staff member not found',
				});
			}

			if (role) user.role = role;
			if (isActive !== undefined) user.isActive = isActive;

			await user.save();

			res.status(200).json({
				success: true,
				data: user,
			});
		} catch (error) {
			next(error);
		}
	},
};

export default adminController;
