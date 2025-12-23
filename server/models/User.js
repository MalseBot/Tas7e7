import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please add a name'],
			trim: true,
		},
		email: {
			type: String,
			required: [true, 'Please add an email'],
			unique: true,
			lowercase: true,
			match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
		},
		password: {
			type: String,
			required: [true, 'Please add a password'],
			minlength: 6,
			select: false, // Don't return password in queries
		},
		role: {
			type: String,
			enum: ['cashier', 'cook', 'manager', 'admin'],
			default: 'cashier',
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		lastLogin: {
			type: Date,
		},
		pin: {
			type: String,
			length: 4,
			select: false,
		},
	},
	{
		timestamps: true, // Adds createdAt and updatedAt
	}
);

// Encrypt password before saving
userSchema.pre('save', async function (last) {
	// Only hash if password was modified
	if (!this.isModified('password')) return last;

	// Hash password with bcrypt
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);

	// Also hash PIN if it exists
	if (this.pin) {
		this.pin = await bcrypt.hash(this.pin, salt);
	}

	last;
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// Method to compare PIN
userSchema.methods.matchPin = async function (enteredPin) {
	if (!this.pin) return false;
	return await bcrypt.compare(enteredPin, this.pin);
};

const User = mongoose.model('User', userSchema);
export default User;