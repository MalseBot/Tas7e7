/** @format */

// src/routes/orderRoutes.js
import { Router } from 'express';
const router = Router();
import orderController from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
const { getOrders, createOrder, getOrder, updateOrderStatus, processPayment } = orderController
// All routes require authentication
router.use(protect);

// Order CRUD operations
router
	.route('/')
	.get(
		authorize('cashier', 'cook', 'manager', 'admin'),
		getOrders
	)
	.post(authorize('cashier', 'manager', 'admin'), createOrder);

router
	.route('/:id')
	.get(
		authorize('cashier', 'cook', 'manager', 'admin'),
		getOrder
	);

router
	.route('/:id/status')
	.put(
		authorize('cook', 'manager', 'admin'),
		updateOrderStatus
	);

router
	.route('/:id/pay')
	.post(
		authorize('cashier', 'manager', 'admin'),
		processPayment
	);

// Kitchen-specific routes
router.get(
	'/kitchen/pending',
	authorize('cook', 'manager', 'admin'),
	async (req, res) => {
		// Get orders that need kitchen attention
		const orders = await orders.find({
			status: { $in: ['pending', 'confirmed', 'preparing'] },
			'items.menuItem': { $exists: true },
		}).populate('items.menuItem');

		res.json({ success: true, data: orders });
	}
);

export default router;
