const mongoose = require('mongoose');

const soilReadingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Soil reading must belong to a user']
  },
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: [true, 'Soil reading must belong to a farm']
  },
  
  // Core soil parameters
  pH: {
    type: Number,
    required: [true, 'pH level is required'],
    min: [0, 'pH cannot be less than 0'],
    max: [14, 'pH cannot be greater than 14']
  },
  nitrogen: {
    type: Number,
    required: [true, 'Nitrogen level is required'],
    min: [0, 'Nitrogen cannot be negative'],
    max: [200, 'Nitrogen level too high']
  },
  phosphorus: {
    type: Number,
    required: [true, 'Phosphorus level is required'],
    min: [0, 'Phosphorus cannot be negative'],
    max: [200, 'Phosphorus level too high']
  },
  potassium: {
    type: Number,
    required: [true, 'Potassium level is required'],
    min: [0, 'Potassium cannot be negative'],
    max: [200, 'Potassium level too high']
  },
  moisture: {
    type: Number,
    required: [true, 'Moisture level is required'],
    min: [0, 'Moisture cannot be less than 0%'],
    max: [100, 'Moisture cannot be greater than 100%']
  },
  
  // Optional parameters
  organicMatter: {
    type: Number,
    min: [0, 'Organic matter cannot be negative'],
    max: [20, 'Organic matter level too high']
  },
  temperature: {
    type: Number,
    min: [-10, 'Temperature too low'],
    max: [50, 'Temperature too high']
  },
  electricalConductivity: {
    type: Number,
    min: [0, 'EC cannot be negative']
  },
  
  // Additional metadata
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  weatherConditions: {
    temperature: Number,
    humidity: Number,
    precipitation: Number
  },
  
  // Location data for precision farming
  location: {
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    accuracy: Number // GPS accuracy in meters
  },
  
  // Reading metadata
  readingMethod: {
    type: String,
    enum: ['manual', 'sensor', 'lab_test'],
    default: 'manual'
  },
  readingDevice: String,
  
  // Automated calculations
  healthScore: Number,
  recommendations: [String],
  
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
soilReadingSchema.index({ user: 1, farm: 1, createdAt: -1 });
soilReadingSchema.index({ farm: 1, createdAt: -1 });
soilReadingSchema.index({ createdAt: -1 });

// Virtual for reading age
soilReadingSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = Math.abs(now - created);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to calculate health score
soilReadingSchema.pre('save', function(next) {
  if (this.isModified('pH') || this.isModified('nitrogen') || 
      this.isModified('phosphorus') || this.isModified('potassium') || 
      this.isModified('moisture') || this.isModified('organicMatter')) {
    this.healthScore = this.calculateHealthScore();
  }
  next();
});

// Instance method to calculate health score
soilReadingSchema.methods.calculateHealthScore = function() {
  let score = 0;
  let factors = 0;

  // pH Score (optimal: 6.0-7.0)
  if (this.pH >= 6.0 && this.pH <= 7.0) {
    score += 25;
  } else if (this.pH >= 5.5 && this.pH <= 7.5) {
    score += 15;
  } else {
    score += 5;
  }
  factors++;

  // Nutrient Score (average of N, P, K)
  const nutrientAvg = (this.nitrogen + this.phosphorus + this.potassium) / 3;
  if (nutrientAvg >= 40 && nutrientAvg <= 80) {
    score += 25;
  } else if (nutrientAvg >= 20 && nutrientAvg <= 100) {
    score += 15;
  } else {
    score += 5;
  }
  factors++;

  // Moisture Score (optimal: 40-60%)
  if (this.moisture >= 40 && this.moisture <= 60) {
    score += 25;
  } else if (this.moisture >= 25 && this.moisture <= 75) {
    score += 15;
  } else {
    score += 5;
  }
  factors++;

  // Organic Matter Score (optimal: 3-5%)
  if (this.organicMatter) {
    if (this.organicMatter >= 3 && this.organicMatter <= 5) {
      score += 25;
    } else if (this.organicMatter >= 2 && this.organicMatter <= 6) {
      score += 15;
    } else {
      score += 5;
    }
    factors++;
  }

  return Math.round(score / factors);
};

// Static method to get farm averages
soilReadingSchema.statics.getFarmAverages = async function(farmId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        farm: mongoose.Types.ObjectId(farmId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        avgPH: { $avg: '$pH' },
        avgNitrogen: { $avg: '$nitrogen' },
        avgPhosphorus: { $avg: '$phosphorus' },
        avgPotassium: { $avg: '$potassium' },
        avgMoisture: { $avg: '$moisture' },
        avgOrganicMatter: { $avg: '$organicMatter' },
        avgTemperature: { $avg: '$temperature' },
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('SoilReading', soilReadingSchema);