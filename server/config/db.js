/** @format */

// config/db.js
import mongoose from 'mongoose';

import config from 'config'
const db = config.get('MONGODB_URI');

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(db);

		console.log(
			`✅ MongoDB Connected: ${conn.connection.host}  `
		);

		// Handle connection events
		mongoose.connection.on('error', (err) => {
			console.error(`MongoDB connection error: ${err}`);
		});

		mongoose.connection.on('disconnected', () => {
			console.log('MongoDB disconnected');
		});

		// Graceful shutdown
		process.on('SIGINT', async () => {
			await mongoose.connection.close();
			console.log('MongoDB connection closed through app termination');
			process.exit(0);
		});
	} catch (error) {
		console.error(
			`❌ MongoDB connection failed: ${error.message} ${process.env.MONGODB_URI}`
		);
		process.exit(1);
	}
};

export default connectDB;
