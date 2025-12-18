/** @format */

// src/routes/tableRoutes.js
import { Router } from 'express';
const router = Router();
import tableController from '../controllers/tableController.js';
import { protect, authorize } from '../middleware/auth.js';
const { getTables, createTable, getTableWithOrder, updateTableStatus } = tableController
// All routes require authentication
router.use(protect);

router
	.route('/')
	.get(authorize('cashier', 'manager', 'admin'), getTables)
	.post(authorize('manager', 'admin'), createTable);

router
	.route('/:id')
	.get(
		authorize('cashier', 'manager', 'admin'),
		getTableWithOrder
	);

router
	.route('/:id/status')
	.put(
		authorize('cashier', 'manager', 'admin'),
		updateTableStatus
	);

export default router;
