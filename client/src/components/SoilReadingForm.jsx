// client/src/components/SoilReadingForm.jsx
import React, { useState } from 'react';

const SoilReadingForm = ({ onClose = () => {}, onSave = () => {} }) => {
  const [formData, setFormData] = useState({
    pH: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    moisture: '',
    temperature: '',
    organicMatter: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'pH':
        if (!value) newErrors.pH = 'pH level is required';
        else if (value < 0 || value > 14) newErrors.pH = 'pH must be between 0 and 14';
        else delete newErrors.pH;
        break;
      case 'nitrogen':
        if (!value) newErrors.nitrogen = 'Nitrogen level is required';
        else if (value < 0) newErrors.nitrogen = 'Nitrogen cannot be negative';
        else delete newErrors.nitrogen;
        break;
      case 'phosphorus':
        if (!value) newErrors.phosphorus = 'Phosphorus level is required';
        else if (value < 0) newErrors.phosphorus = 'Phosphorus cannot be negative';
        else delete newErrors.phosphorus;
        break;
      case 'potassium':
        if (!value) newErrors.potassium = 'Potassium level is required';
        else if (value < 0) newErrors.potassium = 'Potassium cannot be negative';
        else delete newErrors.potassium;
        break;
      case 'moisture':
        if (value && (value < 0 || value > 100)) newErrors.moisture = 'Moisture must be between 0% and 100%';
        else delete newErrors.moisture;
        break;
      case 'temperature':
        if (value && value < -50) newErrors.temperature = 'Temperature seems too low';
        else if (value && value > 60) newErrors.temperature = 'Temperature seems too high';
        else delete newErrors.temperature;
        break;
      case 'organicMatter':
        if (value && value < 0) newErrors.organicMatter = 'Organic matter cannot be negative';
        else if (value && value > 100) newErrors.organicMatter = 'Organic matter seems too high';
        else delete newErrors.organicMatter;
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === '' ? '' : Number(value);
    
    setFormData({
      ...formData,
      [name]: numericValue
    });

    // Validate field in real-time
    validateField(name, numericValue);
  };

  const validateForm = () => {
    const requiredFields = ['pH', 'nitrogen', 'phosphorus', 'potassium'];
    const newErrors = {};
    
    requiredFields.forEach(field => {
      if (!formData[field] && formData[field] !== 0) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Additional validations
    if (formData.pH && (formData.pH < 0 || formData.pH > 14)) {
      newErrors.pH = 'pH must be between 0 and 14';
    }
    if (formData.moisture && (formData.moisture < 0 || formData.moisture > 100)) {
      newErrors.moisture = 'Moisture must be between 0% and 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fix the errors in the form before submitting.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      // Form closing is handled by parent component through onClose
    } catch (error) {
      console.error('Error saving reading:', error);
      alert('Failed to save soil reading. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const getOptimalRanges = (parameter) => {
    const ranges = {
      pH: { min: 6.0, max: 7.0, unit: '' },
      nitrogen: { min: 40, max: 60, unit: 'ppm' },
      phosphorus: { min: 25, max: 50, unit: 'ppm' },
      potassium: { min: 30, max: 50, unit: 'ppm' },
      moisture: { min: 40, max: 70, unit: '%' },
      organicMatter: { min: 3, max: 5, unit: '%' }
    };
    return ranges[parameter] || {};
  };

  const isInOptimalRange = (parameter, value) => {
    const range = getOptimalRanges(parameter);
    return value >= range.min && value <= range.max;
  };

  const InputField = ({ label, name, type = 'number', required = false, step, min, max, placeholder, unit = '' }) => {
    const range = getOptimalRanges(name);
    const value = formData[name];
    const showOptimal = value && range.min !== undefined;
    const isOptimal = showOptimal && isInOptimalRange(name, value);

    return (
      <div>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '500',
          color: '#374151'
        }}>
          {label} {required && '*'}
          {range.min !== undefined && (
            <span style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              fontWeight: 'normal',
              marginLeft: '0.5rem'
            }}>
              (Optimal: {range.min}-{range.max}{range.unit})
            </span>
          )}
        </label>
        
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          step={step}
          min={min}
          max={max}
          placeholder={placeholder}
          required={required}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: errors[name] ? '2px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '1rem',
            backgroundColor: errors[name] ? '#fef2f2' : 'white'
          }}
        />
        
        {errors[name] && (
          <div style={{
            color: '#ef4444',
            fontSize: '0.875rem',
            marginTop: '0.25rem'
          }}>
            {errors[name]}
          </div>
        )}
        
        {showOptimal && !errors[name] && (
          <div style={{
            color: isOptimal ? '#10b981' : '#f59e0b',
            fontSize: '0.875rem',
            marginTop: '0.25rem',
            fontWeight: '500'
          }}>
            {isOptimal ? '✓ Within optimal range' : '⚠ Outside optimal range'}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '2.5rem',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        border: '1px solid #e5e7eb',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            margin: 0,
            color: '#1f2937'
          }}>
            Add Soil Reading
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              color: '#6b7280',
              padding: '0.5rem',
              opacity: isSubmitting ? 0.5 : 1
            }}
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gap: '1.5rem'
          }}>
            <InputField
              label="pH Level"
              name="pH"
              step="0.1"
              min="0"
              max="14"
              placeholder="6.5"
              required={true}
            />

            <InputField
              label="Nitrogen"
              name="nitrogen"
              min="0"
              placeholder="45"
              required={true}
              unit="ppm"
            />

            <InputField
              label="Phosphorus"
              name="phosphorus"
              min="0"
              placeholder="32"
              required={true}
              unit="ppm"
            />

            <InputField
              label="Potassium"
              name="potassium"
              min="0"
              placeholder="38"
              required={true}
              unit="ppm"
            />

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}>
              <InputField
                label="Moisture"
                name="moisture"
                min="0"
                max="100"
                placeholder="65"
                unit="%"
              />

              <InputField
                label="Temperature"
                name="temperature"
                step="0.1"
                placeholder="22"
                unit="°C"
              />
            </div>

            <InputField
              label="Organic Matter"
              name="organicMatter"
              step="0.1"
              min="0"
              placeholder="3.2"
              unit="%"
            />

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                style={{
                  background: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.5 : 1
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || Object.keys(errors).length > 0}
                style={{
                  background: Object.keys(errors).length > 0 
                    ? '#9ca3af' 
                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: (isSubmitting || Object.keys(errors).length > 0) ? 'not-allowed' : 'pointer',
                  opacity: (isSubmitting || Object.keys(errors).length > 0) ? 0.6 : 1
                }}
              >
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </span>
                ) : (
                  'Save Reading'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SoilReadingForm;