/** @format */

// src/routes/kitchenRoutes.js
import { Router } from 'express';
const router = Router();
import kitchenController from '../controllers/kitchenController.js';
import { protect, authorize } from '../middleware/auth.js';
const { getKitchenOrders, getPreparationEstimates, startPreparation, markAsReady, getLowInventory } = kitchenController
// All routes require kitchen staff or higher access
router.use(protect, authorize('cook', 'manager', 'admin'));

// Kitchen orders
router.get('/orders', getKitchenOrders);
router.get('/preparation-times', getPreparationEstimates);

// Order status updates
router.put('/orders/:id/start', startPreparation);
router.put('/orders/:id/ready', markAsReady);

// Inventory
router.get('/inventory/low', getLowInventory);

// Kitchen stats
router.get('/stats', (req, res) => {
	res.json({
		success: true,
		data: {
			activeOrders: 0,
			avgPrepTime: 12,
			efficiency: 85,
		},
	});
});

export default router;
