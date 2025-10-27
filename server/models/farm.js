const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Farm must belong to a user']
  },
  name: {
    type: String,
    required: [true, 'Farm name is required'],
    trim: true,
    maxlength: [100, 'Farm name cannot exceed 100 characters']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Farm address is required']
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    }
  },
  soilType: {
    type: String,
    enum: ['sandy', 'clay', 'silt', 'loamy', 'peat', 'chalky', 'unknown'],
    default: 'unknown'
  },
  cropType: {
    type: String,
    required: [true, 'Crop type is required'],
    trim: true
  },
  farmSize: {
    value: {
      type: Number,
      required: [true, 'Farm size is required'],
      min: [0.1, 'Farm size must be at least 0.1 hectares']
    },
    unit: {
      type: String,
      enum: ['hectares', 'acres'],
      default: 'hectares'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
farmSchema.index({ user: 1 });
farmSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Farm', farmSchema);