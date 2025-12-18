import User from '../models/User.js'
import jwt from 'jsonwebtoken'

// Generate JWT Token
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

const authController = {
	// @desc    Register new staff member
	// @route   POST /api/auth/register
	// @access  Private/Manager
	register: async (req, res, next) => {
		try {
			const { name, email, password, role, pin } = req.body;

			// Check if user exists
			const userExists = await User.findOne({ email });
			if (userExists) {
				return res.status(400).json({
					success: false,
					error: 'User already exists',
				});
			}

			// Create user
			const user = await User.create({
				name,
				email,
				password,
				role,
				pin,
			});

			// Create token
			const token = generateToken(user._id);

			res.status(201).json({
				success: true,
				token,
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
				},
			});
		} catch (error) {
			next(error);
		}
	},

	// @desc    Login staff member
	// @route   POST /api/auth/login
	// @access  Public
	login: async (req, res, next) => {
		try {
			const { email, password } = req.body;

			// Validate email & password
			if (!email || !password) {
				return res.status(400).json({
					success: false,
					error: 'Please provide email and password',
				});
			}

			// Check for user
			const user = await User.findOne({ email }).select('+password');

			if (!user) {
				return res.status(401).json({
					success: false,
					error: 'Invalid credentials',
				});
			}

			// Check if user is active
			if (!user.isActive) {
				return res.status(401).json({
					success: false,
					error: 'Account is deactivated',
				});
			}

			// Check password
			const isMatch = await user.matchPassword(password);

			if (!isMatch) {
				return res.status(401).json({
					success: false,
					error: 'Invalid credentials',
				});
			}

			// Create token
			const token = generateToken(user._id);

			// Update last login
			user.lastLogin = new Date();
			await user.save();

			res.status(200).json({
				success: true,
				token,
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
				},
			});
		} catch (error) {
			next(error);
		}
	},

	// @desc    Quick login with PIN (for POS terminals)
	// @route   POST /api/auth/pin-login
	// @access  Public
	pinLogin: async (req, res, next) => {
		try {
			const { email, pin } = req.body;

			const user = await User.findOne({ email }).select('+pin');

			if (!user || !user.pin) {
				return res.status(401).json({
					success: false,
					error: 'Invalid credentials',
				});
			}

			const isMatch = await user.matchPin(pin);

			if (!isMatch) {
				return res.status(401).json({
					success: false,
					error: 'Invalid PIN',
				});
			}

			const token = generateToken(user._id);

			res.status(200).json({
				success: true,
				token,
				user: {
					id: user._id,
					name: user.name,
					role: user.role,
				},
			});
		} catch (error) {
			next(error);
		}
	},

	// @desc    Get current logged in user
	// @route   GET /api/auth/me
	// @access  Private
	getMe: async (req, res, next) => {
		try {
			const user = await User.findById(req.user.id);

			res.status(200).json({
				success: true,
				data: user,
			});
		} catch (error) {
			next(error);
		}
	},
};

export default authController;
