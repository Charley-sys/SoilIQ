const mongoose = require('mongoose');

const soilReadingSchema = new mongoose.Schema({
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: [true, 'Soil reading must belong to a farm']
  },
  moisture: {
    type: Number,
    required: [true, 'Soil reading must have moisture data'],
    min: 0,
    max: 100
  },
  ph: {
    type: Number,
    required: [true, 'Soil reading must have pH data'],
    min: 0,
    max: 14
  },
  temperature: {
    type: Number,
    required: [true, 'Soil reading must have temperature data']
  },
  nutrients: {
    nitrogen: { type: Number, default: 0 },
    phosphorus: { type: Number, default: 0 },
    potassium: { type: Number, default: 0 }
  },
  location: {
    lat: Number,
    lng: Number
  },
  recordedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const SoilReading = mongoose.model('SoilReading', soilReadingSchema);

module.exports = SoilReading;