/** @format */

// src/routes/menuRoutes.js
import { Router } from 'express';
const router = Router();
import menuController from '../controllers/menuController.js';
import { protect, authorize } from '../middleware/auth.js';
const { getMenuItems, getCategories, createMenuItem, getMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability, getLowStockItems } = menuController
// Public routes (for display)
router.get('/', getMenuItems);
router.get('/categories', getCategories);

// Protected routes
router.use(protect);

router
	.route('/')
	.post(authorize('manager', 'admin'), createMenuItem);

router
	.route('/:id')
	.get(getMenuItem)
	.put(authorize('manager', 'admin'), updateMenuItem)
	.delete(authorize('manager', 'admin'), deleteMenuItem);

router.put(
	'/:id/availability',
	authorize('manager', 'admin'),
	toggleAvailability
);
router.get(
	'/low-stock',
	authorize('manager', 'admin'),
	getLowStockItems
);

export default router;
