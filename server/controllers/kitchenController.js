/** @format */

// src/controllers/kitchenController.js
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';

const kitchenController = {
	// Get orders for kitchen display
	getKitchenOrders: async (req, res, next) => {
		try {
			const orders = await Order.find({
				status: { $in: ['pending', 'confirmed', 'preparing'] },
			})
				.populate('items.menuItem', 'name preparationTime category')
				.sort({ createdAt: 1 });

			// Group by status
			const groupedOrders = orders.reduce((acc, order) => {
				if (!acc[order.status]) {
					acc[order.status] = [];
				}
				acc[order.status].push(order);
				return acc;
			}, {});

			res.status(200).json({
				success: true,
				data: groupedOrders,
				count: orders.length,
			});
		} catch (error) {
			next(error);
		}
	},

	// Start preparing order
	startPreparation: async (req, res, next) => {
		try {
			const order = await Order.findById(req.params.id);

			if (!order) {
				return res.status(404).json({
					success: false,
					error: 'Order not found',
				});
			}

			if (order.status !== 'pending' && order.status !== 'confirmed') {
				return res.status(400).json({
					success: false,
					error: 'Order cannot be started from current status',
				});
			}

			order.status = 'preparing';
			await order.save();

			res.status(200).json({
				success: true,
				data: order,
				message: 'Order preparation started',
			});
		} catch (error) {
			next(error);
		}
	},

	// Mark order as ready
	markAsReady: async (req, res, next) => {
		try {
			const order = await Order.findById(req.params.id);

			if (!order) {
				return res.status(404).json({
					success: false,
					error: 'Order not found',
				});
			}

			if (order.status !== 'preparing') {
				return res.status(400).json({
					success: false,
					error: 'Order must be in preparation first',
				});
			}

			order.status = 'ready';
			order.actualReadyTime = new Date();
			await order.save();

			res.status(200).json({
				success: true,
				data: order,
				message: 'Order marked as ready',
			});
		} catch (error) {
			next(error);
		}
	},

	// Get preparation time estimates
	getPreparationEstimates: async (req, res, next) => {
		try {
			const orders = await Order.find({
				status: { $in: ['pending', 'confirmed', 'preparing'] },
			}).populate('items.menuItem', 'preparationTime');

			const estimates = orders.map((order) => {
				let totalPrepTime = 0;

				order.items.forEach((item) => {
					if (item.menuItem && item.menuItem.preparationTime) {
						totalPrepTime += item.menuItem.preparationTime * item.quantity;
					}
				});

				return {
					orderId: order._id,
					orderNumber: order.orderNumber,
					tableNumber: order.tableNumber,
					status: order.status,
					estimatedPrepTime: totalPrepTime,
					createdAt: order.createdAt,
				};
			});

			res.status(200).json({
				success: true,
				data: estimates,
			});
		} catch (error) {
			next(error);
		}
	},

	// Get low inventory items
	getLowInventory: async (req, res, next) => {
		try {
			const lowStockItems = await  MenuItem.find({
				stock: { $gt: 0, $lt: 10 }, // Less than 10 in stock
			}).select('name stock category');

			res.status(200).json({
				success: true,
				data: lowStockItems,
				count: lowStockItems.length,
			});
		} catch (error) {
			next(error);
		}
	},
};

export default kitchenController;
