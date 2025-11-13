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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Soil Reading</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>pH Level</label>
              <input
                type="number"
                name="pH"
                step="0.1"
                min="0"
                max="14"
                value={formData.pH}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Nitrogen (ppm)</label>
              <input
                type="number"
                name="nitrogen"
                value={formData.nitrogen}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Phosphorus (ppm)</label>
              <input
                type="number"
                name="phosphorus"
                value={formData.phosphorus}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Potassium (ppm)</label>
              <input
                type="number"
                name="potassium"
                value={formData.potassium}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Temperature (°C)</label>
              <input
                type="number"
                name="temperature"
                step="0.1"
                value={formData.temperature}
                onChange={handleChange}
              />
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
              />
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Any additional observations..."
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="secondary-btn">
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Save Reading
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SoilReadingForm;