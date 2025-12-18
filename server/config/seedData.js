/** @format */

// config/seedData.js

import { hash } from 'bcryptjs';
import User from '../models/User.js';
import MenuItem from '../models/MenuItem.js';
import Table from '../models/Table.js';
import mongoose from 'mongoose';
import 'dotenv/config'; 


const seedData = async () => {
	try {
		console.log('🔧 Starting database seeding...');

		await mongoose.connect(
			process.env.MONGODB_URI || 'mongodb://localhost:27017/cafe_pos'
		);
		console.log('✅ Connected to MongoDB');

		// Clear existing data
		await User.deleteMany({});
		await MenuItem.deleteMany({});
		await Table.deleteMany({});

		// Create users
		const users = await User.create([
			{
				name: 'Admin Manager',
				email: 'admin@cafe.com',
				password: await hash('admin123', 10),
				role: 'admin',
				isActive: true,
			},
			{
				name: 'John Cashier',
				email: 'cashier@cafe.com',
				password: await hash('cashier123', 10),
				role: 'cashier',
				isActive: true,
			},
			{
				name: 'Sarah Cook',
				email: 'cook@cafe.com',
				password: await hash('cook123', 10),
				role: 'cook',
				isActive: true,
			},
		]);

		// Create menu items
		const menuItems = await MenuItem.create([
			{
				name: 'Espresso',
				price: 3.5,
				category: 'drinks',
				preparationTime: 3,
				stock: 100,
			},
			{
				name: 'Cappuccino',
				price: 4.75,
				category: 'drinks',
				preparationTime: 4,
				stock: 100,
			},
			{
				name: 'Croissant',
				price: 4.25,
				category: 'pastries',
				preparationTime: 1,
				stock: 40,
			},
			{
				name: 'Club Sandwich',
				price: 14.5,
				category: 'food',
				preparationTime: 12,
				stock: 25,
			},
		]);

		// Create tables
		const tables = await Table.create([
			{ tableNumber: 'T1', capacity: 2, status: 'available' },
			{ tableNumber: 'T2', capacity: 2, status: 'available' },
			{ tableNumber: 'T3', capacity: 4, status: 'available' },
			{ tableNumber: 'T4', capacity: 4, status: 'available' },
		]);

		console.log('\n✅ SEEDING COMPLETED!');
		console.log(`👥 Users: ${users.length}`);
		console.log(`📋 Menu items: ${menuItems.length}`);
		console.log(`🪑 Tables: ${tables.length}`);

		console.log('\n🔐 TEST CREDENTIALS:');
		console.log('Admin: admin@cafe.com / admin123');
		console.log('Cashier: cashier@cafe.com / cashier123');
		console.log('Cook: cook@cafe.com / cook123');

		mongoose.connection.close();
	} catch (error) {
		console.error('❌ SEEDING FAILED:', error.message);
		process.exit(1);
	}
};

seedData();
