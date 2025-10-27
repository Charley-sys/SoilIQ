import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AddSoilReadingForm = ({ onSubmit, loading }) => {
  const { user, getActiveFarms } = useAuth();
  const activeFarms = getActiveFarms();

  const [formData, setFormData] = useState({
    farm: '',
    pH: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    moisture: '',
    organicMatter: '',
    temperature: '',
    notes: '',
    readingDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'pH':
        if (value < 0 || value > 14) {
          newErrors.pH = 'pH must be between 0 and 14';
        } else {
          delete newErrors.pH;
        }
        break;
      
      case 'nitrogen':
      case 'phosphorus':
      case 'potassium':
        if (value < 0 || value > 200) {
          newErrors[name] = `${name} must be between 0 and 200 ppm`;
        } else {
          delete newErrors[name];
        }
        break;
      
      case 'moisture':
        if (value < 0 || value > 100) {
          newErrors.moisture = 'Moisture must be between 0 and 100%';
        } else {
          delete newErrors.moisture;
        }
        break;
      
      case 'organicMatter':
        if (value < 0 || value > 20) {
          newErrors.organicMatter = 'Organic matter must be between 0 and 20%';
        } else {
          delete newErrors.organicMatter;
        }
        break;
      
      case 'farm':
        if (!value) {
          newErrors.farm = 'Please select a farm';
        } else {
          delete newErrors.farm;
        }
        break;
      
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'notes' ? value : value === '' ? '' : parseFloat(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    if (name !== 'notes' && name !== 'readingDate') {
      validateField(name, processedValue);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    const requiredFields = ['farm', 'pH', 'nitrogen', 'phosphorus', 'potassium', 'moisture'];
    
    requiredFields.forEach(field => {
      if (!formData[field] && formData[field] !== 0) {
        setErrors(prev => ({ ...prev, [field]: 'This field is required' }));
        isValid = false;
      }
    });

    if (!isValid || Object.keys(errors).length > 0) {
      return;
    }

    onSubmit(formData);
  };

  const getParameterStatus = (param, value) => {
    if (!value && value !== 0) return 'empty';
    
    const ranges = {
      pH: { optimal: [6.0, 7.0], acceptable: [5.5, 7.5] },
      nitrogen: { optimal: [40, 80], acceptable: [20, 100] },
      phosphorus: { optimal: [30, 50], acceptable: [15, 70] },
      potassium: { optimal: [40, 80], acceptable: [20, 100] },
      moisture: { optimal: [40, 60], acceptable: [25, 75] },
      organicMatter: { optimal: [3, 5], acceptable: [2, 6] }
    };

    const range = ranges[param];
    if (!range) return 'unknown';

    if (value >= range.optimal[0] && value <= range.optimal[1]) return 'optimal';
    if (value >= range.acceptable[0] && value <= range.acceptable[1]) return 'acceptable';
    return 'needs-attention';
  };

  const getStatusColor = (status) => {
    const colors = {
      optimal: 'text-green-600 bg-green-50 border-green-200',
      acceptable: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'needs-attention': 'text-red-600 bg-red-50 border-red-200',
      empty: 'text-gray-400 bg-gray-50 border-gray-200',
      unknown: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[status] || colors.unknown;
  };

  const getStatusText = (status) => {
    const texts = {
      optimal: 'Optimal',
      acceptable: 'Acceptable',
      'needs-attention': 'Needs Attention',
      empty: 'Not set',
      unknown: 'Unknown'
    };
    return texts[status];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Farm Selection */}
      <div className="form-group">
        <label htmlFor="farm" className="form-label">
          Select Farm *
        </label>
        <select
          id="farm"
          name="farm"
          value={formData.farm}
          onChange={handleChange}
          className={`form-input ${errors.farm ? 'error' : ''}`}
          required
        >
          <option value="">Choose a farm</option>
          {activeFarms.map(farm => (
            <option key={farm._id} value={farm._id}>
              {farm.name} - {farm.cropType}
            </option>
          ))}
        </select>
        {errors.farm && <div className="form-error">{errors.farm}</div>}
      </div>

      {/* Reading Date */}
      <div className="form-group">
        <label htmlFor="readingDate" className="form-label">
          Reading Date
        </label>
        <input
          type="date"
          id="readingDate"
          name="readingDate"
          value={formData.readingDate}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      {/* Soil Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* pH Level */}
        <div className="form-group">
          <label htmlFor="pH" className="form-label">
            pH Level *
          </label>
          <div className="relative">
            <input
              type="number"
              id="pH"
              name="pH"
              min="0"
              max="14"
              step="0.1"
              value={formData.pH}
              onChange={handleChange}
              className={`form-input pr-20 ${errors.pH ? 'error' : ''}`}
              placeholder="6.5"
              required
            />
            <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 border rounded ${getStatusColor(getParameterStatus('pH', formData.pH))}`}>
              {getStatusText(getParameterStatus('pH', formData.pH))}
            </div>
          </div>
          {errors.pH && <div className="form-error">{errors.pH}</div>}
          <div className="text-xs text-gray-500 mt-1">Optimal: 6.0 - 7.0</div>
        </div>

        {/* Nitrogen */}
        <div className="form-group">
          <label htmlFor="nitrogen" className="form-label">
            Nitrogen (ppm) *
          </label>
          <div className="relative">
            <input
              type="number"
              id="nitrogen"
              name="nitrogen"
              min="0"
              max="200"
              step="1"
              value={formData.nitrogen}
              onChange={handleChange}
              className={`form-input pr-20 ${errors.nitrogen ? 'error' : ''}`}
              placeholder="50"
              required
            />
            <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 border rounded ${getStatusColor(getParameterStatus('nitrogen', formData.nitrogen))}`}>
              {getStatusText(getParameterStatus('nitrogen', formData.nitrogen))}
            </div>
          </div>
          {errors.nitrogen && <div className="form-error">{errors.nitrogen}</div>}
          <div className="text-xs text-gray-500 mt-1">Optimal: 40 - 80 ppm</div>
        </div>

        {/* Phosphorus */}
        <div className="form-group">
          <label htmlFor="phosphorus" className="form-label">
            Phosphorus (ppm) *
          </label>
          <div className="relative">
            <input
              type="number"
              id="phosphorus"
              name="phosphorus"
              min="0"
              max="200"
              step="1"
              value={formData.phosphorus}
              onChange={handleChange}
              className={`form-input pr-20 ${errors.phosphorus ? 'error' : ''}`}
              placeholder="30"
              required
            />
            <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 border rounded ${getStatusColor(getParameterStatus('phosphorus', formData.phosphorus))}`}>
              {getStatusText(getParameterStatus('phosphorus', formData.phosphorus))}
            </div>
          </div>
          {errors.phosphorus && <div className="form-error">{errors.phosphorus}</div>}
          <div className="text-xs text-gray-500 mt-1">Optimal: 30 - 50 ppm</div>
        </div>

        {/* Potassium */}
        <div className="form-group">
          <label htmlFor="potassium" className="form-label">
            Potassium (ppm) *
          </label>
          <div className="relative">
            <input
              type="number"
              id="potassium"
              name="potassium"
              min="0"
              max="200"
              step="1"
              value={formData.potassium}
              onChange={handleChange}
              className={`form-input pr-20 ${errors.potassium ? 'error' : ''}`}
              placeholder="60"
              required
            />
            <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 border rounded ${getStatusColor(getParameterStatus('potassium', formData.potassium))}`}>
              {getStatusText(getParameterStatus('potassium', formData.potassium))}
            </div>
          </div>
          {errors.potassium && <div className="form-error">{errors.potassium}</div>}
          <div className="text-xs text-gray-500 mt-1">Optimal: 40 - 80 ppm</div>
        </div>

        {/* Moisture */}
        <div className="form-group">
          <label htmlFor="moisture" className="form-label">
            Moisture (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              id="moisture"
              name="moisture"
              min="0"
              max="100"
              step="1"
              value={formData.moisture}
              onChange={handleChange}
              className={`form-input pr-20 ${errors.moisture ? 'error' : ''}`}
              placeholder="45"
              required
            />
            <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 border rounded ${getStatusColor(getParameterStatus('moisture', formData.moisture))}`}>
              {getStatusText(getParameterStatus('moisture', formData.moisture))}
            </div>
          </div>
          {errors.moisture && <div className="form-error">{errors.moisture}</div>}
          <div className="text-xs text-gray-500 mt-1">Optimal: 40 - 60%</div>
        </div>

        {/* Organic Matter */}
        <div className="form-group">
          <label htmlFor="organicMatter" className="form-label">
            Organic Matter (%)
          </label>
          <div className="relative">
            <input
              type="number"
              id="organicMatter"
              name="organicMatter"
              min="0"
              max="20"
              step="0.1"
              value={formData.organicMatter}
              onChange={handleChange}
              className={`form-input pr-20 ${errors.organicMatter ? 'error' : ''}`}
              placeholder="3.5"
            />
            <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 border rounded ${getStatusColor(getParameterStatus('organicMatter', formData.organicMatter))}`}>
              {getStatusText(getParameterStatus('organicMatter', formData.organicMatter))}
            </div>
          </div>
          {errors.organicMatter && <div className="form-error">{errors.organicMatter}</div>}
          <div className="text-xs text-gray-500 mt-1">Optimal: 3 - 5%</div>
        </div>
      </div>

      {/* Temperature */}
      <div className="form-group">
        <label htmlFor="temperature" className="form-label">
          Soil Temperature (°C)
        </label>
        <input
          type="number"
          id="temperature"
          name="temperature"
          min="-10"
          max="50"
          step="0.1"
          value={formData.temperature}
          onChange={handleChange}
          className="form-input"
          placeholder="20.5"
        />
      </div>

      {/* Notes */}
      <div className="form-group">
        <label htmlFor="notes" className="form-label">
          Additional Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows="3"
          value={formData.notes}
          onChange={handleChange}
          className="form-input"
          placeholder="Any additional observations about the soil condition..."
        />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setFormData({
            farm: '',
            pH: '',
            nitrogen: '',
            phosphorus: '',
            potassium: '',
            moisture: '',
            organicMatter: '',
            temperature: '',
            notes: '',
            readingDate: new Date().toISOString().split('T')[0]
          })}
          className="btn btn-secondary"
        >
          Clear All
        </button>

        <button
          type="button"
          onClick={() => {
            // Set optimal values for demonstration
            setFormData(prev => ({
              ...prev,
              pH: 6.5,
              nitrogen: 50,
              phosphorus: 35,
              potassium: 60,
              moisture: 45,
              organicMatter: 3.5,
              temperature: 22.0
            }));
          }}
          className="btn btn-outline"
        >
          Fill Optimal Values
        </button>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t">
        <button
          type="submit"
          disabled={loading || Object.keys(errors).length > 0}
          className="btn btn-primary px-8"
        >
          {loading ? (
            <>
              <div className="spinner w-4 h-4 border-2"></div>
              Adding Reading...
            </>
          ) : (
            'Add Soil Reading'
          )}
        </button>
      </div>
    </form>
  );
};

export default AddSoilReadingForm;