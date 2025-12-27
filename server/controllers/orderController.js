/** @format */

// src/controllers/orderController.js
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import Table from '../models/Table.js';

const orderController = {
	// @desc    Create new order
	// @route   POST /api/orders
	// @access  Private
	createOrder: async (req, res, next) => {
		try {
			const { items, tableNumber, customerName, orderType, kitchenNotes } =
				req.body;

			// Validate items
			if (!items || items.length === 0) {
				return res.status(400).json({
					success: false,
					error: 'Order must have at least one item',
				});
			}

			// Get menu item details and validate
			const orderItems = [];
			let invalidItems = [];
			let estimatedReadyTime = 0;

			for (const item of items) {
				const menuItem = await MenuItem.findById(item.menuItem);

				if (!menuItem) {
					invalidItems.push(item.menuItem);
					continue;
				}

				if (!menuItem.isAvailable) {
					return res.status(400).json({
						success: false,
						error: `Item "${menuItem.name}" is not available`,
					});
				}

				// Check stock if applicable
				if (menuItem.stock !== undefined && menuItem.stock < item.quantity) {
					return res.status(400).json({
						success: false,
						error: `Insufficient stock for "${menuItem.name}"`,
					});
				}

				// Build order item WITH PRICE
				const orderItem = {
					menuItem: menuItem._id,
					name: menuItem.name,
					price: menuItem.price, // CRITICAL: Include price
					quantity: item.quantity,
					specialInstructions: item.specialInstructions || '',
					modifiers: item.modifiers || [],
				};

				// Handle variant if specified
				if (item.variant && menuItem.variants) {
					const variant = menuItem.variants.find(
						(v) => v.name === item.variant
					);
					if (variant) {
						orderItem.variant = {
							name: variant.name,
							price: variant.price,
						};
						// Use variant price instead of base price
						orderItem.price = variant.price;
					}
				}

				// Handle modifiers price
				if (item.modifiers && Array.isArray(item.modifiers)) {
					for (const modifierName of item.modifiers) {
						const modifier = menuItem.modifiers?.find(
							(m) => m.name === modifierName
						);
						if (modifier && modifier.price) {
							orderItem.price += modifier.price;
						}
					}
				}

				orderItems.push(orderItem);

				// Track the longest preparation time
				const itemPrepTime = (menuItem.preparationTime || 0) * item.quantity;
				if (itemPrepTime > estimatedReadyTime) {
					estimatedReadyTime = itemPrepTime;
				}
			}

			if (invalidItems.length > 0) {
				return res.status(400).json({
					success: false,
					error: `Invalid menu items: ${invalidItems.join(', ')}`,
				});
			}

			// Update table status
			let table;
			if (tableNumber) {
				table = await Table.findOne({ tableNumber });

				if (table) {
					if (table.status === 'occupied') {
						return res.status(400).json({
							success: false,
							error: `Table ${tableNumber} is already occupied`,
						});
					}

					table.status = 'occupied';
				} else {
					// Create table if it doesn't exist
					table = await Table.create({
						tableNumber,
						capacity: 4, // Default capacity
						status: 'occupied',
					});
				}
			}

			// Calculate estimated ready time
			estimatedReadyTime = new Date(Date.now() + estimatedReadyTime * 60000);

			// REMOVED: Don't calculate subtotal/total here - pre-save hook will handle it
			// Create order WITHOUT setting subtotal and total to 0
			const order = await Order.create({
				items: orderItems,
				tableNumber: tableNumber || 'Takeaway',
				customerName: customerName || '',
				orderType: orderType || 'dine-in',
				kitchenNotes: kitchenNotes || '',
				status: 'pending',
				// REMOVED: Don't set these here
				// subTotal: 0,
				// total: 0,
				cashier: req.user.id,
				estimatedReadyTime,
				paymentStatus: 'pending',
			});

			// Link order to table
			if (table) {
				table.currentOrder = order._id;
				await table.save();
			}

			// Update stock AFTER order is created
			for (const item of orderItems) {
				const menuItem = await MenuItem.findById(item.menuItem);
				if (menuItem && menuItem.stock !== undefined) {
					menuItem.stock -= item.quantity;
					await menuItem.save();
				}
			}

			res.status(201).json({
				success: true,
				data: order,
				message: 'Order created successfully',
			});
		} catch (error) {
			next(error);
		}
	},

	// @desc    Get all orders
	// @route   GET /api/orders
	// @access  Private
	getOrders: async (req, res, next) => {
		try {
			const { status, startDate, endDate, page = 1, limit = 20 } = req.query;

			// Build query
			let query = {};

			if (status) {
				query.status = status;
			}

			if (startDate || endDate) {
				query.createdAt = {};
				if (startDate) query.createdAt.$gte = new Date(startDate);
				if (endDate) query.createdAt.$lte = new Date(endDate);
			}

			// Pagination
			const pageNum = parseInt(page);
			const limitNum = parseInt(limit);
			const skip = (pageNum - 1) * limitNum;

			const orders = await Order.find(query)
				.populate('cashier', 'name email')
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limitNum);

			const total = await Order.countDocuments(query);

			res.status(200).json({
				success: true,
				count: orders.length,
				total,
				totalPages: Math.ceil(total / limitNum),
				currentPage: pageNum,
				data: orders,
			});
		} catch (error) {
			next(error);
		}
	},

	// @desc    Get single order
	// @route   GET /api/orders/:id
	// @access  Private
	getOrder: async (req, res, next) => {
		try {
			const order = await Order.findById(req.params.id)
				.populate('cashier', 'name email')
				.populate('items.menuItem');

			if (!order) {
				return res.status(404).json({
					success: false,
					error: 'Order not found',
				});
			}

			res.status(200).json({
				success: true,
				data: order,
			});
		} catch (error) {
			next(error);
		}
	},

	// @desc    Update order status
	// @route   PUT /api/orders/:id/status
	// @access  Private
	updateOrderStatus: async (req, res, next) => {
		try {
			const { status } = req.body;
			const validStatuses = [
				'pending',
				'confirmed',
				'preparing',
				'ready',
				'served',
				'paid',
				'cancelled',
			];

			if (!validStatuses.includes(status)) {
				return res.status(400).json({
					success: false,
					error: 'Invalid status',
				});
			}

			const order = await Order.findById(req.params.id);

			if (!order) {
				return res.status(404).json({
					success: false,
					error: 'Order not found',
				});
			}

			// Update timestamps based on status
			const updates = { status };

			if (status === 'preparing' && !order.estimatedReadyTime) {
				// Calculate estimated ready time when starting preparation
				const prepTimes = await Promise.all(
					order.items.map(async (item) => {
						const menuItem = await MenuItem.findById(item.menuItem);
						return (menuItem?.preparationTime || 10) * item.quantity;
					})
				);
				const maxPrepTime = Math.max(...prepTimes);
				updates.estimatedReadyTime = new Date(Date.now() + maxPrepTime * 60000);
			}

			if (status === 'ready') {
				updates.actualReadyTime = new Date();
			}

			if (status === 'served') {
				updates.servedTime = new Date();
			}

			if (status === 'cancelled') {
				// Restore stock if order is cancelled
				for (const item of order.items) {
					const menuItem = await MenuItem.findById(item.menuItem);
					if (menuItem && menuItem.stock !== undefined) {
						menuItem.stock += item.quantity;
						await menuItem.save();
					}
				}

				// Free table if it was a table order
				if (order.tableNumber && order.tableNumber !== 'Takeaway') {
					await Table.findOneAndUpdate(
						{ tableNumber: order.tableNumber },
						{ status: 'available', currentOrder: null }
					);
				}
			}

			const updatedOrder = await Order.findByIdAndUpdate(
				req.params.id,
				updates,
				{
					new: true,
					runValidators: true,
				}
			);

			res.status(200).json({
				success: true,
				data: updatedOrder,
				message: `Order status updated to ${status}`,
			});
		} catch (error) {
			next(error);
		}
	},

	// @desc    Process payment
	// @route   POST /api/orders/:id/pay
	// @access  Private
	processPayment: async (req, res, next) => {
		try {
			const { paymentMethod, tip, discountCode } = req.body;

			const order = await Order.findById(req.params.id);

			if (!order) {
				return res.status(404).json({
					success: false,
					error: 'Order not found',
				});
			}

			if (order.paymentStatus === 'paid') {
				return res.status(400).json({
					success: false,
					error: 'Order is already paid',
				});
			}

			// Apply tip if provided
			if (tip !== undefined) {
				order.tip = tip;
			}

			// Apply discount if valid (simplified)
			if (discountCode) {
				// In real app, validate discount code
				order.discount = order.subTotal * 0.1; // 10% discount example
			}

			// Update payment details
			order.paymentMethod = paymentMethod || 'cash';
			order.paymentStatus = 'paid';
			order.status = 'preparing';
			// Free table if it was a table order
			if (order.tableNumber && order.tableNumber !== 'Takeaway') {
				await Table.findOneAndUpdate(
					{ tableNumber: order.tableNumber },
					{ status: 'available', currentOrder: null }
				);
			}

			await order.save();

			// Generate receipt (in real app, you'd use a PDF library)
			const receipt = {
				orderNumber: order.orderNumber,
				date: order.createdAt,
				items: order.items,
				subTotal: order.subTotal,
				tax: order.tax,
				tip: order.tip,
				discount: order.discount,
				total: order.total,
				paymentMethod: order.paymentMethod,
			};

			res.status(200).json({
				success: true,
				data: {
					order,
					receipt,
				},
				message: 'Payment processed successfully',
			});
		} catch (error) {
			next(error);
		}
	},
};

export default orderController;
