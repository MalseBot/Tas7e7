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
				Order.aggregate([
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
				Order.aggregate([
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

			const report = await Order.aggregate([
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

			const topItems = await Order.aggregate([
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
			const populatedItems = await MenuItem.populate(topItems, {
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
			const staff = await User.find({
				role: { $in: ['cashier', 'manager', 'admin'] },
			}).select('-password -pin');

			res.status(200).json({
				success: true,
				count: staff.length,
				data: staff,
			});
		} catch (error) {
			next(error);
		}
	},

	// Get single staff member
	getStaffById: async (req, res, next) => {
		try {
			const staff = await User.findById(req.params.id).select('-password -pin');

			if (!staff) {
				return res.status(404).json({
					success: false,
					error: 'Staff member not found',
				});
			}

			res.status(200).json({
				success: true,
				data: staff,
			});
		} catch (error) {
			next(error);
		}
	},

	// Register new staff
	registerStaff: async (req, res, next) => {
		try {
			const { name, email, password, role, pin } = req.body;

			// Check if user already exists
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				return res.status(400).json({
					success: false,
					error: 'User already exists with this email',
				});
			}

			// Create user
			const user = await User.create({
				name,
				email,
				password,
				role: role || 'cashier',
				pin: pin || '0000',
				isActive: true,
			});

			// Remove password from response
			const userResponse = user.toObject();
			delete userResponse.password;
			delete userResponse.pin;

			res.status(201).json({
				success: true,
				message: 'Staff member created successfully',
				data: userResponse,
			});
		} catch (error) {
			next(error);
		}
	},

	// Update staff role/status
	updateStaff: async (req, res, next) => {
		try {
			const { role, isActive, name, email } = req.body;
			const staffId = req.params.id;

			// Check if staff exists
			const staff = await User.findById(staffId);
			if (!staff) {
				return res.status(404).json({
					success: false,
					error: 'Staff member not found',
				});
			}

			// Prevent updating own role/status
			if (staffId === req.user.id) {
				return res.status(400).json({
					success: false,
					error: 'Cannot update your own account',
				});
			}

			// Update fields
			if (name) staff.name = name;
			if (email) staff.email = email;
			if (role) staff.role = role;
			if (isActive !== undefined) staff.isActive = isActive;

			await staff.save();

			// Remove sensitive data
			const staffResponse = staff.toObject();
			delete staffResponse.password;
			delete staffResponse.pin;

			res.status(200).json({
				success: true,
				message: 'Staff updated successfully',
				data: staffResponse,
			});
		} catch (error) {
			next(error);
		}
	},

	// Delete staff member
	deleteStaff: async (req, res, next) => {
		try {
			const staffId = req.params.id;

			// Prevent deleting self
			if (staffId === req.user.id) {
				return res.status(400).json({
					success: false,
					error: 'Cannot delete your own account',
				});
			}

			const staff = await User.findByIdAndDelete(staffId);

			if (!staff) {
				return res.status(404).json({
					success: false,
					error: 'Staff member not found',
				});
			}

			res.status(200).json({
				success: true,
				message: 'Staff member deleted successfully',
			});
		} catch (error) {
			next(error);
		}
	},

	// Reset staff PIN
	resetStaffPIN: async (req, res, next) => {
		try {
			const { pin } = req.body;
			const staffId = req.params.id;

			const staff = await User.findById(staffId);
			if (!staff) {
				return res.status(404).json({
					success: false,
					error: 'Staff member not found',
				});
			}

			staff.pin = pin || '0000';
			await staff.save();

			res.status(200).json({
				success: true,
				message: 'PIN reset successfully',
			});
		} catch (error) {
			next(error);
		}
	},

	// Staff statistics
	getStaffStats: async (req, res, next) => {
		try {
			const stats = await User.aggregate([
				{
					$group: {
						_id: '$role',
						count: { $sum: 1 },
						active: {
							$sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] },
						},
					},
				},
				{
					$project: {
						role: '$_id',
						count: 1,
						active: 1,
						inactive: { $subtract: ['$count', '$active'] },
					},
				},
			]);

			const totalStaff = await User.countDocuments();
			const activeStaff = await User.countDocuments({ isActive: true });

			res.status(200).json({
				success: true,
				data: {
					stats,
					total: totalStaff,
					active: activeStaff,
					inactive: totalStaff - activeStaff,
				},
			});
		} catch (error) {
			next(error);
		}
	},
};

export default adminController;
