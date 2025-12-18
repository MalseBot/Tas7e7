/** @format */

// src/routes/authRoutes.js
import { Router } from 'express';
const router = Router();
import authController from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';
const {
	register,
	login,
	pinLogin,
	getMe,
} = authController

router.post('/register', protect, authorize('manager', 'admin'), register);
router.post('/login', login);
router.post('/pin-login', pinLogin);
router.get('/me', protect, getMe);

export default router;
