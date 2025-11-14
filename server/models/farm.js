// server/models/Farm.js
const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Farm must belong to a user']
  },
  name: {
    type: String,
    required: [true, 'Please provide a farm name'],
    trim: true,
    maxlength: [100, 'Farm name cannot be more than 100 characters']
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: {
      type: String,
      default: 'Kenya'
    },
    coordinates: {
      lat: {
        type: Number,
        required: [true, 'Please provide latitude']
      },
      lng: {
        type: Number,
        required: [true, 'Please provide longitude']
      }
    }
  },
  size: {
    value: Number,
    unit: {
      type: String,
      enum: ['acres', 'hectares'],
      default: 'acres'
    }
  },
  soilType: {
    type: String,
    enum: ['sandy', 'clay', 'loamy', 'silty', 'peat', 'chalky', 'rocky']
  },
  primaryCrops: [String],
  irrigation: {
    type: String,
    enum: ['rainfed', 'drip', 'sprinkler', 'flood', 'none']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
farmSchema.index({ location: '2dsphere' });
farmSchema.index({ user: 1 });

farmSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Farm', farmSchema);