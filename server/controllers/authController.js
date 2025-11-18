const User = require('../models/User');

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Public (was Private)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update user details
// @route   PUT /api/auth/me
// @access  Public (was Private)
exports.updateMe = async (req, res) => {
  try {
    // For guest user, you might want to create a new user instead of updating
    if (req.user.email === 'guest@soiliq.com') {
      // Create a new user with the provided details
      const newUser = await User.create({
        name: req.body.name || 'Guest User',
        email: req.body.email || `guest-${Date.now()}@soiliq.com`,
        password: require('crypto').randomBytes(32).toString('hex'),
        role: 'user'
      });
      
      return res.status(200).json({
        success: true,
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      });
    }
    
    // For existing users, update normally
    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Keep existing register and login functions for future use
exports.register = async (req, res) => {
  // ... existing code
};

exports.login = async (req, res) => {
  // ... existing code
};