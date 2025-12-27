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
router.get('/staff', getAllStaff);
router.put('/staff/:id', updateStaffRole);

// Settings (placeholder)
// router.get('/settings', (req, res) => {
// 	res.json({
// 		success: true,
// 		data: {
// 			cafeName: 'My Café',
// 			taxRate: 13,
// 			currency: 'USD',
// 			openingHours: '08:00',
// 			closingHours: '22:00',
// 		},
// 	});
// });

export default router;
