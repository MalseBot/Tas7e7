/** @format */

// src/controllers/menuController.js (COMPLETE)
import MenuItem from '../models/MenuItem.js';
const { find, findById, create, findByIdAndUpdate, distinct } = MenuItem
const menuController = {
	// Get all menu items (public)
	getMenuItems: async (req, res, next) => {
		try {
			const { category, availableOnly = true } = req.query;

			let query = {};

			if (category) {
				query.category = category;
			}

			if (availableOnly === 'true') {
				query.isAvailable = true;
			}

			const menuItems = await find(query).sort('category name');

			// Group by category for easier frontend display
			const groupedByCategory = menuItems.reduce((acc, item) => {
				if (!acc[item.category]) {
					acc[item.category] = [];
				}
				acc[item.category].push(item);
				return acc;
			}, {});

			res.status(200).json({
				success: true,
				count: menuItems.length,
				data: groupedByCategory,
				flat: menuItems,
			});
		} catch (error) {
			next(error);
		}
	},

	// Get single menu item
	getMenuItem: async (req, res, next) => {
		try {
			const menuItem = await findById(req.params.id);

			if (!menuItem) {
				return res.status(404).json({
					success: false,
					error: 'Menu item not found',
				});
			}

			res.status(200).json({
				success: true,
				data: menuItem,
			});
		} catch (error) {
			next(error);
		}
	},

	// Create menu item
	createMenuItem: async (req, res, next) => {
		try {
			const menuItem = await create(req.body);

			res.status(201).json({
				success: true,
				data: menuItem,
			});
		} catch (error) {
			next(error);
		}
	},

	// Update menu item
	updateMenuItem: async (req, res, next) => {
		try {
			const menuItem = await findByIdAndUpdate(
				req.params.id,
				req.body,
				{
					new: true,
					runValidators: true,
				}
			);

			if (!menuItem) {
				return res.status(404).json({
					success: false,
					error: 'Menu item not found',
				});
			}

			res.status(200).json({
				success: true,
				data: menuItem,
			});
		} catch (error) {
			next(error);
		}
	},

	// Delete menu item
	deleteMenuItem: async (req, res, next) => {
		try {
			const menuItem = await findById(req.params.id);

			if (!menuItem) {
				return res.status(404).json({
					success: false,
					error: 'Menu item not found',
				});
			}

			// Soft delete (set isAvailable to false)
			menuItem.isAvailable = false;
			await menuItem.save();

			res.status(200).json({
				success: true,
				data: {},
				message: 'Menu item deactivated',
			});
		} catch (error) {
			next(error);
		}
	},

	// Toggle availability
	toggleAvailability: async (req, res, next) => {
		try {
			const menuItem = await findById(req.params.id);

			if (!menuItem) {
				return res.status(404).json({
					success: false,
					error: 'Menu item not found',
				});
			}

			menuItem.isAvailable = !menuItem.isAvailable;
			await menuItem.save();

			res.status(200).json({
				success: true,
				data: menuItem,
				message: `Menu item ${
					menuItem.isAvailable ? 'activated' : 'deactivated'
				}`,
			});
		} catch (error) {
			next(error);
		}
	},

	// Get categories
	getCategories: async (req, res, next) => {
		try {
			const categories = await distinct('category');

			res.status(200).json({
				success: true,
				data: categories,
			});
		} catch (error) {
			next(error);
		}
	},

	// Get low stock items
	getLowStockItems: async (req, res, next) => {
		try {
			const lowStockItems = await find({
				stock: { $gt: 0, $lt: 10 },
			}).sort('stock');

			res.status(200).json({
				success: true,
				count: lowStockItems.length,
				data: lowStockItems,
			});
		} catch (error) {
			next(error);
		}
	},
};

export default menuController;
