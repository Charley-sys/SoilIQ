// server/models/SoilReading.js
const mongoose = require('mongoose');

const soilReadingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Soil reading must belong to a user']
  },
  farm: {
    type: mongoose.Schema.ObjectId,
    ref: 'Farm'
  },
  pH: {
    type: Number,
    required: [true, 'Please provide pH value'],
    min: [0, 'pH cannot be less than 0'],
    max: [14, 'pH cannot be more than 14']
  },
  nitrogen: {
    type: Number,
    required: [true, 'Please provide nitrogen value'],
    min: [0, 'Nitrogen cannot be negative']
  },
  phosphorus: {
    type: Number,
    required: [true, 'Please provide phosphorus value'],
    min: [0, 'Phosphorus cannot be negative']
  },
  potassium: {
    type: Number,
    required: [true, 'Please provide potassium value'],
    min: [0, 'Potassium cannot be negative']
  },
  temperature: {
    type: Number,
    min: [-50, 'Temperature too low'],
    max: [60, 'Temperature too high']
  },
  moisture: {
    type: Number,
    min: [0, 'Moisture cannot be less than 0%'],
    max: [100, 'Moisture cannot be more than 100%']
  },
  location: {
    name: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  cropType: String,
  season: String,
  weatherConditions: {
    temperature: Number,
    rainfall: Number,
    humidity: Number
  },
  analysis: {
    healthScore: Number,
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    insights: [String],
    recommendations: [String],
    risks: [String],
    cropSuggestions: [String],
    fertilizerRecommendations: [{
      type: {
        type: String,
        required: true
      },
      amount: {
        type: String,
        required: true
      },
      timing: {
        type: String,
        required: true
      }
    }]
  },
  notes: String,
  readingDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

soilReadingSchema.index({ user: 1, readingDate: -1 });
soilReadingSchema.index({ readingDate: -1 });

module.exports = mongoose.model('SoilReading', soilReadingSchema);