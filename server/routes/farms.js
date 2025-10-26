const express = require('express');
const Farm = require('../models/Farm');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

// Get all farms for user
router.get('/', async (req, res) => {
  try {
    const farms = await Farm.find({ user: req.user.id });
    
    res.status(200).json({
      status: 'success',
      data: {
        farms
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching farms'
    });
  }
});

// Get single farm
router.get('/:id', async (req, res) => {
  try {
    const farm = await Farm.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!farm) {
      return res.status(404).json({
        status: 'error',
        message: 'Farm not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        farm
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching farm'
    });
  }
});

// Create new farm
router.post('/', async (req, res) => {
  try {
    req.body.user = req.user.id;
    
    const farm = await Farm.create(req.body);
    
    // Populate user data
    await farm.populate('user', 'firstName lastName email');

    res.status(201).json({
      status: 'success',
      data: {
        farm
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Error creating farm'
    });
  }
});

// Update farm
router.patch('/:id', async (req, res) => {
  try {
    const farm = await Farm.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!farm) {
      return res.status(404).json({
        status: 'error',
        message: 'Farm not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        farm
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Error updating farm'
    });
  }
});

// Delete farm
router.delete('/:id', async (req, res) => {
  try {
    const farm = await Farm.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!farm) {
      return res.status(404).json({
        status: 'error',
        message: 'Farm not found'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting farm'
    });
  }
});

module.exports = router;