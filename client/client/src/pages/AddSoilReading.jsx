import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AddSoilReading = () => {
  const { user, getActiveFarms } = useAuth();
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (activeFarms.length === 0) {
      navigate('/farms');
    }
  }, [activeFarms, navigate]);

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
    const processedValue = name === 'notes' || name === 'farm' || name === 'readingDate' 
      ? value 
      : value === '' ? '' : parseFloat(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    if (name !== 'notes' && name !== 'readingDate') {
      validateField(name, processedValue);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required fields
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

    try {
      setLoading(true);
      setErrors({});

      const response = await axios.post('/api/soil', formData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Error adding soil reading:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ submit: error.response?.data?.message || 'Failed to add soil reading' });
      }
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
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
    setErrors({});
  };

  const fillOptimalValues = () => {
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
  };

  if (activeFarms.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="card-body py-12">
            <div className="text-4xl mb-4">🏠</div>
            <h2 className="h2 mb-2">No Farms Available</h2>
            <p className="text-body text-gray-600 mb-6">
              You need to create a farm before adding soil readings.
            </p>
            <button 
              onClick={() => navigate('/farms')}
              className="btn btn-primary"
            >
              Create Your First Farm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="h1">Add Soil Reading</h1>
        <p className="text-body text-gray-600">
          Record new soil measurements for analysis and recommendations
        </p>
      </div>

      {success && (
        <div className="alert alert-success mb-6">
          ✅ Soil reading added successfully! Redirecting to dashboard...
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="alert alert-error">
                {errors.submit}
              </div>
            )}

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
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Soil Parameters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* pH Level */}
              <div className="form-group">
                <label htmlFor="pH" className="form-label">
                  pH Level *
                </label>
                <input
                  type="number"
                  id="pH"
                  name="pH"
                  min="0"
                  max="14"
                  step="0.1"
                  value={formData.pH}
                  onChange={handleChange}
                  className={`form-input ${errors.pH ? 'error' : ''}`}
                  placeholder="6.5"
                  required
                />
                {errors.pH && <div className="form-error">{errors.pH}</div>}
                <div className="text-xs text-gray-500 mt-1">Optimal: 6.0 - 7.0</div>
              </div>

              {/* Nitrogen */}
              <div className="form-group">
                <label htmlFor="nitrogen" className="form-label">
                  Nitrogen (ppm) *
                </label>
                <input
                  type="number"
                  id="nitrogen"
                  name="nitrogen"
                  min="0"
                  max="200"
                  step="1"
                  value={formData.nitrogen}
                  onChange={handleChange}
                  className={`form-input ${errors.nitrogen ? 'error' : ''}`}
                  placeholder="50"
                  required
                />
                {errors.nitrogen && <div className="form-error">{errors.nitrogen}</div>}
                <div className="text-xs text-gray-500 mt-1">Optimal: 40 - 80 ppm</div>
              </div>

              {/* Phosphorus */}
              <div className="form-group">
                <label htmlFor="phosphorus" className="form-label">
                  Phosphorus (ppm) *
                </label>
                <input
                  type="number"
                  id="phosphorus"
                  name="phosphorus"
                  min="0"
                  max="200"
                  step="1"
                  value={formData.phosphorus}
                  onChange={handleChange}
                  className={`form-input ${errors.phosphorus ? 'error' : ''}`}
                  placeholder="30"
                  required
                />
                {errors.phosphorus && <div className="form-error">{errors.phosphorus}</div>}
                <div className="text-xs text-gray-500 mt-1">Optimal: 30 - 50 ppm</div>
              </div>

              {/* Potassium */}
              <div className="form-group">
                <label htmlFor="potassium" className="form-label">
                  Potassium (ppm) *
                </label>
                <input
                  type="number"
                  id="potassium"
                  name="potassium"
                  min="0"
                  max="200"
                  step="1"
                  value={formData.potassium}
                  onChange={handleChange}
                  className={`form-input ${errors.potassium ? 'error' : ''}`}
                  placeholder="60"
                  required
                />
                {errors.potassium && <div className="form-error">{errors.potassium}</div>}
                <div className="text-xs text-gray-500 mt-1">Optimal: 40 - 80 ppm</div>
              </div>

              {/* Moisture */}
              <div className="form-group">
                <label htmlFor="moisture" className="form-label">
                  Moisture (%) *
                </label>
                <input
                  type="number"
                  id="moisture"
                  name="moisture"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.moisture}
                  onChange={handleChange}
                  className={`form-input ${errors.moisture ? 'error' : ''}`}
                  placeholder="45"
                  required
                />
                {errors.moisture && <div className="form-error">{errors.moisture}</div>}
                <div className="text-xs text-gray-500 mt-1">Optimal: 40 - 60%</div>
              </div>

              {/* Organic Matter */}
              <div className="form-group">
                <label htmlFor="organicMatter" className="form-label">
                  Organic Matter (%)
                </label>
                <input
                  type="number"
                  id="organicMatter"
                  name="organicMatter"
                  min="0"
                  max="20"
                  step="0.1"
                  value={formData.organicMatter}
                  onChange={handleChange}
                  className={`form-input ${errors.organicMatter ? 'error' : ''}`}
                  placeholder="3.5"
                />
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
                placeholder="Any additional observations about the soil condition, weather, or specific concerns..."
              />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={clearForm}
                className="btn btn-secondary"
                disabled={loading}
              >
                Clear All
              </button>

              <button
                type="button"
                onClick={fillOptimalValues}
                className="btn btn-outline"
                disabled={loading}
              >
                Fill Optimal Values
              </button>

              <div className="flex-1"></div>

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
        </div>
      </div>

      {/* Help Information */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-blue-50 border-blue-200">
          <div className="card-body">
            <h3 className="h3 text-blue-900">💡 Tips for Accurate Readings</h3>
            <ul className="text-sm text-blue-800 space-y-2 mt-2">
              <li>• Take readings at the same time each day for consistency</li>
              <li>• Test multiple locations within your farm</li>
              <li>• Record weather conditions for context</li>
              <li>• Calibrate your testing equipment regularly</li>
            </ul>
          </div>
        </div>

        <div className="card bg-green-50 border-green-200">
          <div className="card-body">
            <h3 className="h3 text-green-900">📊 Understanding Parameters</h3>
            <ul className="text-sm text-green-800 space-y-2 mt-2">
              <li>• <strong>pH</strong>: Affects nutrient availability (6.0-7.0 optimal)</li>
              <li>• <strong>NPK</strong>: Essential nutrients for plant growth</li>
              <li>• <strong>Moisture</strong>: Critical for nutrient uptake</li>
              <li>• <strong>Organic Matter</strong>: Improves soil structure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSoilReading;