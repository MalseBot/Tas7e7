/** @format */

// src/routes/adminRoutes.js
import { Router } from 'express';
const router = Router();
import adminController from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
const { getDashboardStats, getSalesReport, getTopSellingItems, getAllStaff, updateStaffRole } = adminController
// All routes require manager/admin access
router.use(protect, authorize('manager', 'admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Reports
router.get('/reports/sales', getSalesReport);
router.get('/reports/top-items', getTopSellingItems);

// Staff management
// Staff management routes
router.get('/staff', adminController.getAllStaff);
router.get('/staff/stats', adminController.getStaffStats);
router.get('/staff/:id', adminController.getStaffById);
router.post('/staff', adminController.registerStaff);
router.put('/staff/:id', adminController.updateStaff);
router.delete('/staff/:id', adminController.deleteStaff);
router.put('/staff/:id/reset-pin', adminController.resetStaffPIN);

export default router;
