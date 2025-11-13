// client/src/components/SoilReadingForm.jsx
import React, { useState } from 'react';

const SoilReadingForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    pH: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    moisture: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.pH || formData.pH < 0 || formData.pH > 14) {
      newErrors.pH = 'pH must be between 0 and 14';
    }

    if (!formData.nitrogen || formData.nitrogen < 0) {
      newErrors.nitrogen = 'Nitrogen must be a positive number';
    }

    if (!formData.phosphorus || formData.phosphorus < 0) {
      newErrors.phosphorus = 'Phosphorus must be a positive number';
    }

    if (!formData.potassium || formData.potassium < 0) {
      newErrors.potassium = 'Potassium must be a positive number';
    }

    if (formData.temperature && (formData.temperature < -50 || formData.temperature > 60)) {
      newErrors.temperature = 'Temperature must be between -50°C and 60°C';
    }

    if (formData.moisture && (formData.moisture < 0 || formData.moisture > 100)) {
      newErrors.moisture = 'Moisture must be between 0% and 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const readingData = {
        ...formData,
        pH: parseFloat(formData.pH),
        nitrogen: parseInt(formData.nitrogen),
        phosphorus: parseInt(formData.phosphorus),
        potassium: parseInt(formData.potassium),
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        moisture: formData.moisture ? parseInt(formData.moisture) : null,
        date: new Date().toISOString().split('T')[0],
        id: Date.now()
      };

      onSave(readingData);
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleQuickFill = (type) => {
    const quickData = {
      optimal: { pH: 6.5, nitrogen: 45, phosphorus: 35, potassium: 30 },
      acidic: { pH: 5.2, nitrogen: 35, phosphorus: 25, potassium: 20 },
      alkaline: { pH: 7.8, nitrogen: 50, phosphorus: 40, potassium: 25 },
      deficient: { pH: 6.0, nitrogen: 15, phosphorus: 12, potassium: 18 }
    };

    setFormData({
      ...formData,
      ...quickData[type]
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Add New Soil Reading</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        {/* Quick Fill Buttons */}
        <div className="quick-fill-section">
          <h4>Quick Fill Examples:</h4>
          <div className="quick-fill-buttons">
            <button type="button" onClick={() => handleQuickFill('optimal')} className="quick-btn optimal">
              Optimal Soil
            </button>
            <button type="button" onClick={() => handleQuickFill('acidic')} className="quick-btn acidic">
              Acidic Soil
            </button>
            <button type="button" onClick={() => handleQuickFill('alkaline')} className="quick-btn alkaline">
              Alkaline Soil
            </button>
            <button type="button" onClick={() => handleQuickFill('deficient')} className="quick-btn deficient">
              Nutrient Deficient
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Essential Nutrients</h3>
            <div className="form-row">
              <div className="form-group">
                <label>pH Level *</label>
                <input
                  type="number"
                  name="pH"
                  step="0.1"
                  min="0"
                  max="14"
                  value={formData.pH}
                  onChange={handleChange}
                  required
                  placeholder="6.5"
                  className={errors.pH ? 'error' : ''}
                />
                {errors.pH && <span className="error-text">{errors.pH}</span>}
                <div className="input-help">Optimal: 6.0 - 7.0</div>
              </div>
              
              <div className="form-group">
                <label>Nitrogen (N) ppm *</label>
                <input
                  type="number"
                  name="nitrogen"
                  min="0"
                  value={formData.nitrogen}
                  onChange={handleChange}
                  required
                  placeholder="45"
                  className={errors.nitrogen ? 'error' : ''}
                />
                {errors.nitrogen && <span className="error-text">{errors.nitrogen}</span>}
                <div className="input-help">Optimal: 40 - 60 ppm</div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phosphorus (P) ppm *</label>
                <input
                  type="number"
                  name="phosphorus"
                  min="0"
                  value={formData.phosphorus}
                  onChange={handleChange}
                  required
                  placeholder="30"
                  className={errors.phosphorus ? 'error' : ''}
                />
                {errors.phosphorus && <span className="error-text">{errors.phosphorus}</span>}
                <div className="input-help">Optimal: 30+ ppm</div>
              </div>
              
              <div className="form-group">
                <label>Potassium (K) ppm *</label>
                <input
                  type="number"
                  name="potassium"
                  min="0"
                  value={formData.potassium}
                  onChange={handleChange}
                  required
                  placeholder="25"
                  className={errors.potassium ? 'error' : ''}
                />
                {errors.potassium && <span className="error-text">{errors.potassium}</span>}
                <div className="input-help">Optimal: 30+ ppm</div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Additional Measurements</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Temperature (°C)</label>
                <input
                  type="number"
                  name="temperature"
                  step="0.1"
                  min="-50"
                  max="60"
                  value={formData.temperature}
                  onChange={handleChange}
                  placeholder="25.5"
                  className={errors.temperature ? 'error' : ''}
                />
                {errors.temperature && <span className="error-text">{errors.temperature}</span>}
              </div>
              
              <div className="form-group">
                <label>Moisture (%)</label>
                <input
                  type="number"
                  name="moisture"
                  min="0"
                  max="100"
                  value={formData.moisture}
                  onChange={handleChange}
                  placeholder="65"
                  className={errors.moisture ? 'error' : ''}
                />
                {errors.moisture && <span className="error-text">{errors.moisture}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label>Notes & Observations</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Any additional observations about the soil, crop condition, weather, etc..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="secondary-btn">
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Save Soil Reading
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SoilReadingForm;