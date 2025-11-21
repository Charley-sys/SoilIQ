// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Modified protect middleware that always passes
const protect = async (req, res, next) => {
  try {
    // Try to get token from header if exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    let user;
    
    if (token) {
      // If token exists, verify it
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id);
      } catch (error) {
        // Token invalid, continue with default user
        console.log('Invalid token, using default user');
      }
    }

    if (!user) {
      // Create a default user object for all requests
      user = await User.findOne({ email: 'guest@soiliq.com' });
      
      // If no guest user exists, create one
      if (!user) {
        user = await User.create({
          name: 'Guest User',
          email: 'guest@soiliq.com',
          password: 'default_password', // You might want to handle this differently
          role: 'user'
        });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('Auth middleware error:', error);
    // Even if everything fails, create a minimal user object
    req.user = { 
      _id: 'default-user-id', 
      name: 'Guest User', 
      email: 'guest@soiliq.com',
      role: 'user'
    };
    next();
  }
};

// Optional: Create a more simplified version that always succeeds
const allowAll = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: 'guest@soiliq.com' });
    
    if (!user) {
      user = await User.create({
        name: 'Guest User',
        email: 'guest@soiliq.com', 
        password: require('crypto').randomBytes(32).toString('hex'),
        role: 'user'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    // Fallback: minimal user object
    req.user = {
      _id: 'default-user-id',
      name: 'Guest User',
      email: 'guest@soiliq.com',
      role: 'user'
    };
    next();
  }
};

module.exports = { protect, allowAll };