/** @format */

// server.js - SIMPLIFIED VERSION
import express, { json, urlencoded } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

// Load env vars
config();

// Import database connection
import'./config/db.js';

// Import middleware
import errorHandler from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import tableRoutes from './routes/tableRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import kitchenRoutes from './routes/kitchenRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import connectDB from './config/db.js';
import printRoutes from './routes/printRoutes.js';

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Body parser
app.use(json());
app.use(urlencoded({ extended: true }));

// CORS
app.use(cors());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
app.use(morgan('dev'));
}

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/kitchen', kitchenRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/print', printRoutes);


// Welcome route
app.get('/', (req, res) => {
res.json({
success: true,
message: 'Café POS API',
version: '1.0.0',
endpoints: {
auth: '/api/auth',
orders: '/api/orders',
menu: '/api/menu',
tables: '/api/tables',
admin: '/api/admin',
kitchen: '/api/kitchen',
print: '/api/print'
},
});
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(
`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
console.log(`❌ Error: ${err.message} me`);
// Close server & exit process
process.exit(1);
});

export default app;
