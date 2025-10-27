const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/soil', require('./routes/soil'));
app.use('/api/farms', require('./routes/farms'));
app.use('/api/weather', require('./routes/weather')); // This should exist

// Health check endpoint
app.get('/api/health', (req, res) => {
  const healthStatus = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  };

  res.json(healthStatus);
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'SoilIQ API',
    version: '1.0.0',
    description: 'Smart Soil Monitoring API',
    endpoints: {
      auth: '/api/auth',
      soil: '/api/soil',
      farms: '/api/farms',
      weather: '/api/weather',
      health: '/api/health'
    }
  });
});

// 404 handler for API routes - FIXED VERSION
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/')) {
    // Check if this route should have been handled by existing routes
    const handledRoutes = [
      '/api/auth', 
      '/api/soil', 
      '/api/farms', 
      '/api/weather', 
      '/api/health',
      '/api' // root API endpoint
    ];
    
    const isHandled = handledRoutes.some(route => 
      req.originalUrl === route || req.originalUrl.startsWith(route + '/')
    );
    
    if (!isHandled) {
      return res.status(404).json({
        status: 'error',
        message: `API endpoint ${req.originalUrl} not found`
      });
    }
  }
  next();
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../client/build')));

  // The "catchall" handler
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      status: 'error',
      message: 'Duplicate field value entered'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token expired'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

// MongoDB connection
// MongoDB connection - SIMPLIFIED VERSION
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/soiliq');
    console.log('✅ MongoDB Connected:', conn.connection.host);
    console.log('📊 Database:', conn.connection.name);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('💡 Connection string used:', process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/soiliq');
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`
🚀 SoilIQ Server Started!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🗄️ Database: MongoDB
⏰ Started at: ${new Date().toISOString()}

📋 Available Endpoints:
   🔐 Auth: http://localhost:${PORT}/api/auth
   🌱 Soil: http://localhost:${PORT}/api/soil
   🏠 Farms: http://localhost:${PORT}/api/farms
   🌤️ Weather: http://localhost:${PORT}/api/weather
   ❤️ Health: http://localhost:${PORT}/api/health

✅ Server is ready to accept requests!
      `);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close();
  console.log('Process terminated');
});

// Start the application
startServer();