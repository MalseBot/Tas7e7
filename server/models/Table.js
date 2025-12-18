import mongoose from 'mongoose'

const tableSchema = new mongoose.Schema(
	{
		tableNumber: {
			type: String,
			required: true,
			unique: true,
		},
		capacity: {
			type: Number,
			required: true,
			min: 1,
		},
		status: {
			type: String,
			enum: ['available', 'occupied', 'reserved', 'cleaning'],
			default: 'available',
		},
		currentOrder: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Order',
			default: null,
		},
		location: {
			type: String,
			enum: ['indoors', 'outdoors', 'bar', 'private'],
			default: 'indoors',
		},
		notes: {
			type: String,
			default: '',
		},
	},
	{
		timestamps: true,
	}
);

const Table = mongoose.model('Table', tableSchema);
export default Table;