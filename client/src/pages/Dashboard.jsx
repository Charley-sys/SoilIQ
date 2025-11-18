// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { soilAPI } from '../services/api.js';
import AIInsights from '../components/AIInsights.jsx';
import SoilCharts from '../components/SoilCharts.jsx';
import SoilReadingForm from '../components/SoilReadingForm.jsx';

const Dashboard = () => {
  const [soilReadings, setSoilReadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [hasReadings, setHasReadings] = useState(false);
  
  // Demo user data for display
  const demoUser = {
    email: 'visitor@soiliq.com',
    name: 'SoilIQ Visitor'
  };

  useEffect(() => {
    // Try to fetch real data, but fall back to demo data
    fetchSoilReadings();
  }, []);

  const fetchSoilReadings = async () => {
    setLoading(true);
    try {
      const response = await soilAPI.getReadings();
      if (response.success && response.data.readings && response.data.readings.length > 0) {
        setSoilReadings(response.data.readings);
        setHasReadings(true);
      } else {
        // If API call fails or no readings, use demo data but don't set hasReadings
        setSoilReadings([]);
        setHasReadings(false);
      }
    } catch (error) {
      console.error('Failed to fetch soil readings:', error);
      setSoilReadings([]);
      setHasReadings(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReading = async (newReading) => {
    try {
      const response = await soilAPI.createReading(newReading);
      if (response.success) {
        setSoilReadings([response.data.soilReading, ...soilReadings]);
        setShowForm(false); // Close the form
        setHasReadings(true); // Mark that we now have readings
        // Refresh the readings to get updated data
        fetchSoilReadings();
      } else {
        // If API fails, add to local state for demo
        const demoReading = {
          id: 'demo-' + Date.now(),
          ...newReading,
          createdAt: new Date().toISOString()
        };
        setSoilReadings([demoReading, ...soilReadings]);
        setShowForm(false); // Close the form
        setHasReadings(true); // Mark that we now have readings
      }
    } catch (error) {
      console.error('Failed to save soil reading, saving locally:', error);
      // Add to local state for demo purposes
      const demoReading = {
        id: 'demo-' + Date.now(),
        ...newReading,
        createdAt: new Date().toISOString()
      };
      setSoilReadings([demoReading, ...soilReadings]);
      setShowForm(false); // Close the form
      setHasReadings(true); // Mark that we now have readings
    }
  };

  const latestReading = soilReadings[0];

  // Function to format numbers as whole numbers
  const formatNumber = (value) => {
    if (value === undefined || value === null) return 'N/A';
    return Math.round(value);
  };

  const getStatus = (value, type) => {
    if (value === undefined || value === null) {
      return { label: 'No Data', class: 'moderate' };
    }
    
    const roundedValue = Math.round(value);
    
    switch(type) {
      case 'pH':
        if (roundedValue >= 6.0 && roundedValue <= 7.0) return { label: 'Optimal', class: 'good' };
        if (roundedValue >= 5.5 && roundedValue <= 7.5) return { label: 'Moderate', class: 'moderate' };
        return { label: 'Poor', class: 'low' };
      case 'nitrogen':
        if (roundedValue >= 40) return { label: 'Good', class: 'good' };
        if (roundedValue >= 25) return { label: 'Moderate', class: 'moderate' };
        return { label: 'Low', class: 'low' };
      case 'phosphorus':
        if (roundedValue >= 30) return { label: 'Good', class: 'good' };
        if (roundedValue >= 20) return { label: 'Moderate', class: 'moderate' };
        return { label: 'Low', class: 'low' };
      case 'potassium':
        if (roundedValue >= 30) return { label: 'Good', class: 'good' };
        if (roundedValue >= 20) return { label: 'Moderate', class: 'moderate' };
        return { label: 'Low', class: 'low' };
      default:
        return { label: 'Unknown', class: 'moderate' };
    }
  };

  const pHStatus = getStatus(latestReading?.pH, 'pH');
  const nitrogenStatus = getStatus(latestReading?.nitrogen, 'nitrogen');
  const phosphorusStatus = getStatus(latestReading?.phosphorus, 'phosphorus');
  const potassiumStatus = getStatus(latestReading?.potassium, 'potassium');

  return (
    <div className="dashboard">
      {/* Dashboard Header - Updated with pale green background */}
      <header className="dashboard-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2rem',
        marginBottom: '2rem',
        background: '#f0fdf4', // Pale green background
        borderRadius: '12px',
        border: '1px solid #dcfce7',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <img 
              src="/assets/Logo.png" 
              alt="SoilIQ Logo" 
              style={{ 
                width: '48px', 
                height: '48px',
                borderRadius: '8px',
                objectFit: 'cover',
                border: '2px solid #bbf7d0' // Light green border
              }}
            />
            <div>
              <h1 style={{ 
                margin: 0, 
                color: '#059669', // Dark green for title
                fontSize: '2rem',
                fontWeight: '700'
              }}>
                SoilIQ Dashboard
              </h1>
              <p style={{ 
                margin: 0,
                color: '#65a30d', // Medium green for subtitle
                fontSize: '1rem',
                fontWeight: '500'
              }}>
                Real-time soil health monitoring and analysis
              </p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ 
            color: '#374151',
            fontWeight: '500'
          }}>
            Welcome, {demoUser.email}
          </span>
          <span style={{ 
            padding: '0.5rem 1rem', 
            background: '#dcfce7', 
            color: '#166534',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '600',
            border: '1px solid #bbf7d0'
          }}>
            Demo Mode
          </span>
        </div>
      </header>
     
      <div className="dashboard-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading soil data...</p>
          </div>
        ) : (
          <>
            {/* Welcome message when no readings exist */}
            {!hasReadings && soilReadings.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                background: 'white',
                borderRadius: '12px',
                marginBottom: '3rem',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }}>
                <h2 style={{ 
                  marginBottom: '1rem',
                  color: '#1f2937',
                  fontSize: '1.75rem',
                  fontWeight: '700'
                }}>
                  Welcome to SoilIQ Analytics 🌱
                </h2>
                <p style={{ 
                  marginBottom: '2rem',
                  color: '#6b7280',
                  fontSize: '1.1rem',
                  maxWidth: '500px',
                  margin: '0 auto 2rem auto',
                  fontWeight: '500'
                }}>
                  Start by adding your first soil reading to unlock comprehensive analysis, AI insights, and personalized recommendations.
                </p>
                <button 
                  onClick={() => setShowForm(true)}
                  style={{
                    background: '#059669',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                  }}
                >
                  + Add First Soil Reading
                </button>
              </div>
            )}

            {/* Soil Metrics Cards - Only show when we have readings */}
            {hasReadings && soilReadings.length > 0 && (
              <div className="section" style={{ marginBottom: '3rem' }}>
                <h2 style={{ 
                  marginBottom: '1.5rem',
                  color: '#1f2937',
                  fontSize: '1.5rem',
                  fontWeight: '700'
                }}>Soil Health Metrics</h2>
                <div className="soil-cards" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1.5rem'
                }}>
                  <div className="soil-card" style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>pH Level</h3>
                    <p className="reading" style={{ 
                      fontSize: '2.5rem', 
                      fontWeight: 'bold',
                      margin: '0 0 0.5rem 0',
                      color: '#1f2937'
                    }}>{formatNumber(latestReading?.pH)}</p>
                    <span className={`status ${pHStatus.class}`} style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      background: pHStatus.class === 'good' ? '#dcfce7' : 
                                 pHStatus.class === 'moderate' ? '#fef3c7' : '#fecaca',
                      color: pHStatus.class === 'good' ? '#166534' : 
                            pHStatus.class === 'moderate' ? '#92400e' : '#991b1b'
                    }}>{pHStatus.label}</span>
                  </div>
                  
                  <div className="soil-card" style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>Nitrogen (N)</h3>
                    <p className="reading" style={{ 
                      fontSize: '2.5rem', 
                      fontWeight: 'bold',
                      margin: '0 0 0.5rem 0',
                      color: '#1f2937'
                    }}>{formatNumber(latestReading?.nitrogen)} <span style={{fontSize: '1rem', color: '#6b7280'}}>ppm</span></p>
                    <span className={`status ${nitrogenStatus.class}`} style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      background: nitrogenStatus.class === 'good' ? '#dcfce7' : 
                                 nitrogenStatus.class === 'moderate' ? '#fef3c7' : '#fecaca',
                      color: nitrogenStatus.class === 'good' ? '#166534' : 
                            nitrogenStatus.class === 'moderate' ? '#92400e' : '#991b1b'
                    }}>{nitrogenStatus.label}</span>
                  </div>
                  
                  <div className="soil-card" style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>Phosphorus (P)</h3>
                    <p className="reading" style={{ 
                      fontSize: '2.5rem', 
                      fontWeight: 'bold',
                      margin: '0 0 0.5rem 0',
                      color: '#1f2937'
                    }}>{formatNumber(latestReading?.phosphorus)} <span style={{fontSize: '1rem', color: '#6b7280'}}>ppm</span></p>
                    <span className={`status ${phosphorusStatus.class}`} style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      background: phosphorusStatus.class === 'good' ? '#dcfce7' : 
                                 phosphorusStatus.class === 'moderate' ? '#fef3c7' : '#fecaca',
                      color: phosphorusStatus.class === 'good' ? '#166534' : 
                            phosphorusStatus.class === 'moderate' ? '#92400e' : '#991b1b'
                    }}>{phosphorusStatus.label}</span>
                  </div>
                  
                  <div className="soil-card" style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>Potassium (K)</h3>
                    <p className="reading" style={{ 
                      fontSize: '2.5rem', 
                      fontWeight: 'bold',
                      margin: '0 0 0.5rem 0',
                      color: '#1f2937'
                    }}>{formatNumber(latestReading?.potassium)} <span style={{fontSize: '1rem', color: '#6b7280'}}>ppm</span></p>
                    <span className={`status ${potassiumStatus.class}`} style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      background: potassiumStatus.class === 'good' ? '#dcfce7' : 
                                 potassiumStatus.class === 'moderate' ? '#fef3c7' : '#fecaca',
                      color: potassiumStatus.class === 'good' ? '#166534' : 
                            potassiumStatus.class === 'moderate' ? '#92400e' : '#991b1b'
                    }}>{potassiumStatus.label}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Charts Section - Only show when we have readings */}
            {hasReadings && soilReadings.length > 0 && (
              <SoilCharts soilReadings={soilReadings} />
            )}

            {/* AI Insights Section - Only show when we have readings */}
            {hasReadings && soilReadings.length > 0 && (
              <div className="section" style={{ marginBottom: '3rem' }}>
                <AIInsights soilReadings={soilReadings} />
              </div>
            )}

            {/* Action Section - Always show but with different messaging */}
            <div className="add-reading-section" style={{
              textAlign: 'center',
              padding: '2rem',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              marginTop: hasReadings ? '2rem' : '0',
              border: '1px solid #e5e7eb'
            }}>
              <h2 style={{ marginBottom: '1rem', color: '#1f2937', fontWeight: '700' }}>
                {hasReadings ? 'Manage Soil Data' : 'Ready to Get Started?'}
              </h2>
              <p style={{ marginBottom: '1.5rem', color: '#6b7280', fontWeight: '500' }}>
                {hasReadings 
                  ? 'Add new soil readings to update your analysis and insights' 
                  : 'Add your first soil reading to unlock all analytical features'
                }
              </p>
              <button 
                className="primary-btn" 
                onClick={() => setShowForm(true)}
                style={{
                  background: '#059669',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {hasReadings ? '+ New Soil Reading' : '+ Add First Reading'}
              </button>
            </div>

            {/* Soil Reading Form Modal */}
            {showForm && (
              <SoilReadingForm
                onClose={() => setShowForm(false)}
                onSave={handleSaveReading}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;