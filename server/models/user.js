const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const farmSchema = new mongoose.Schema({
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
        required: true,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180
      }
    },
    region: String,
    country: {
      type: String,
      default: 'Unknown'
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
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  role: {
    type: String,
    enum: ['farmer', 'researcher', 'admin'],
    default: 'farmer'
  },
  farms: [farmSchema],
  
  // Profile Information
  profile: {
    phone: String,
    avatar: String,
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    experience: {
      type: String,
      enum: ['beginner', 'intermediate', 'expert', 'commercial'],
      default: 'beginner'
    }
  },
  
  // Preferences
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    units: {
      temperature: { type: String, enum: ['celsius', 'fahrenheit'], default: 'celsius' },
      distance: { type: String, enum: ['metric', 'imperial'], default: 'metric' }
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  
  // Account Status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ 'farms.location.coordinates': '2dsphere' });
userSchema.index({ createdAt: -1 });

// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
  // Only run if password was modified
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware to update updatedAt timestamp
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to check password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for active farms count
userSchema.virtual('activeFarmsCount').get(function() {
  return this.farms.filter(farm => farm.isActive).length;
});

// Method to add a new farm
userSchema.methods.addFarm = function(farmData) {
  this.farms.push(farmData);
  return this.save();
};

// Method to get active farms
userSchema.methods.getActiveFarms = function() {
  return this.farms.filter(farm => farm.isActive);
};

// Method to deactivate farm
userSchema.methods.deactivateFarm = function(farmId) {
  const farm = this.farms.id(farmId);
  if (farm) {
    farm.isActive = false;
  }
  return this.save();
};

// Static method to find users by location
userSchema.statics.findByLocation = function(coordinates, maxDistance = 50000) {
  return this.find({
    'farms.location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    }
  });
};

// Transform output to remove sensitive data
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', userSchema);