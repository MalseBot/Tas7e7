import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const protect = async (req, res, next) => {
	let token;

	// Check for token in headers
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			// Get token from header
			token = req.headers.authorization.split(' ')[1];

			// Verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// Get user from token (excluding password)
			req.user = await User.findById(decoded.id).select('-password');

			if (!req.user) {
				return res.status(401).json({
					success: false,
					error: 'User not found',
				});
			}

			// Update last login (optional)
			req.user.lastLogin = new Date();
			await req.user.save();

			next();
		} catch (error) {
			console.error('Auth error:', error);
			return res.status(401).json({
				success: false,
				error: 'Not authorized, token failed',
			});
		}
	}

	if (!token) {
		return res.status(401).json({
			success: false,
			error: 'Not authorized, no token',
		});
	}
};

// Role-based authorization
const authorize = (...roles) => {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				error: 'Not authenticated',
			});
		}

		if (!roles.includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				error: `Role ${req.user.role} is not authorized to access this route`,
			});
		}

		next();
	};
};

export { protect, authorize };