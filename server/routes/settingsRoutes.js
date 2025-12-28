/** @format */

// routes/settingsRoutes.js
import express from 'express';
import settingsController from '../controllers/settingsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin/manager role
router.use(protect);
router.use(authorize('admin', 'manager'));

router.get('/', settingsController.getSettings);
router.put('/', settingsController.updateSettings);
router.post('/reset', settingsController.resetSettings);

export default router;
