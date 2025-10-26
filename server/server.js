const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const { initializeWebSocket, attachWebSocket } = require('./middleware/websocketIntegration');

const app = express();
const server = http.createServer(app);

// Initialize WebSocket
initializeWebSocket(server);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(attachWebSocket);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/soil', require('./routes/soil'));
app.use('/api/farms', require('./routes/farms'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/analytics', require('./routes/analytics')); // ✅ Added analytics routes

// Health check endpoint with comprehensive status
app.get('/api/health', (req, res) => {
  const webSocketHealth = req.webSocketServer ? req.webSocketServer.healthCheck() : { error: 'WebSocket not initialized' };
  
  const healthStatus = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    memory: process.memoryUsage(),
    webSocket: webSocketHealth,
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
      analytics: '/api/analytics',
      health: '/api/health'
    },
    documentation: 'https://github.com/Charley-sys/SoilIQ'
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../client/build')));

  // The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
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

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `API endpoint ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;

// MongoDB connection with retry logic
const connectDB = async (retries = 5, delay = 5000) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/soiliq', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    
    if (retries > 0) {
      console.log(`Retrying connection in ${delay/1000} seconds... (${retries} retries left)`);
      setTimeout(() => connectDB(retries - 1, delay), delay);
    } else {
      console.error('❌ Could not connect to MongoDB after multiple attempts');
      process.exit(1);
    }
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    server.listen(PORT, () => {
      console.log(`
🚀 SoilIQ Server Started!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📊 WebSocket: Enabled
🗄️ Database: MongoDB
⏰ Started at: ${new Date().toISOString()}

📋 Available Endpoints:
   🔐 Auth: http://localhost:${PORT}/api/auth
   🌱 Soil: http://localhost:${PORT}/api/soil
   🏠 Farms: http://localhost:${PORT}/api/farms
   🌤️ Weather: http://localhost:${PORT}/api/weather
   📈 Analytics: http://localhost:${PORT}/api/analytics
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
  server.close(() => {
    mongoose.connection.close();
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close();
    console.log('Process terminated');
  });
});

// Start the application
startServer();