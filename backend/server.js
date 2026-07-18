const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const pool = require('./config/db');
const initializeDatabase = require('./database/initDb');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Main API Routing
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Kubernetes health probe endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Ping database
    await pool.query('SELECT 1');
    res.status(200).json({
      success: true,
      status: 'UP',
      timestamp: new Date(),
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'DOWN',
      timestamp: new Date(),
      error: error.message
    });
  }
});

// Serve frontend assets if deployed in combined container mode (optional backup)
app.get('/', (req, res) => {
  res.json({ message: 'Enterprise Inventory Management System API Server is running.' });
});

// Error handling middleware
app.use(errorHandler);

// Database self-bootstrapping and start server
async function startServer() {
  try {
    // Run db checks and seed tables
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize application server:', error);
    process.exit(1);
  }
}

startServer();
