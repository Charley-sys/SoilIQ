// server/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Import database connection
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const soilRoutes = require('./routes/soil');

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


// Update CORS middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://soiliq.vercel.app'
  ],
  credentials: true
}));
// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}
// Add this before your routes in server.js
app.get('/api/debug', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Debug endpoint working',
    url: req.url,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    path: req.path
  });
});
// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SoilIQ API is running successfully!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/soil', soilRoutes);

// Handle undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🌱 SoilIQ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
// Add to server.js - debug soil reading
app.post('/api/debug-soil-test', async (req, res) => {
  try {
    console.log('🧪 Debug soil test:', req.body);
    
    const SoilAI = require('./utils/aiEngine');
    const analysis = SoilAI.analyzeSoil(req.body);
    
    res.status(200).json({
      success: true,
      analysis: analysis,
      message: 'AI analysis working correctly'
    });
  } catch (error) {
    console.error('❌ Debug soil test error:', error);
    res.status(500).json({
      success: false,
      message: 'AI analysis failed: ' + error.message
    });
  }
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', err);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;