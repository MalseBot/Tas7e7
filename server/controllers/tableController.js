/** @format */

// src/controllers/tableController.js
import Table from '../models/Table.js';
const tableController = {
	// Get all tables
	getTables: async (req, res, next) => {
		try {
			const tables = await Table.find().sort('tableNumber');

			res.status(200).json({
				success: true,
				count: tables.length,
				data: tables,
			});
		} catch (error) {
			next(error);
		}
	},

	// Create table
	createTable: async (req, res, next) => {
		try {
			const { tableNumber, capacity, location } = req.body;

			const table = await Table.create({
				tableNumber,
				capacity,
				location,
			});

			res.status(201).json({
				success: true,
				data: table,
			});
		} catch (error) {
			next(error);
		}
	},

	// Update table status
	updateTableStatus: async (req, res, next) => {
		try {
			const { status } = req.body;

			const table = await Table.findById(req.params.id);

			if (!table) {
				return res.status(404).json({
					success: false,
					error: 'Table not found',
				});
			}

			table.status = status;

			// If setting to available, clear current order
			if (status === 'available') {
				table.currentOrder = null;
			}

			await table.save();

			// Emit real-time update
			if (req.io) {
				req.io.emit('tableUpdated', table);
			}

			res.status(200).json({
				success: true,
				data: table,
			});
		} catch (error) {
			next(error);
		}
	},

	// Get table with current order
	getTableWithOrder: async (req, res, next) => {
		try {
			const table = await Table.findById(req.params.id).populate({
				path: 'currentOrder',
				populate: {
					path: 'items.menuItem',
					select: 'name price',
				},
			});

			if (!table) {
				return res.status(404).json({
					success: false,
					error: 'Table not found',
				});
			}

			res.status(200).json({
				success: true,
				data: table,
			});
		} catch (error) {
			next(error);
		}
	},
};

export default tableController;
