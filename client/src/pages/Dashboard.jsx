// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { soilAPI } from '../services/api.js';
import AIInsights from '../components/AIInsights.jsx';
import SoilCharts from '../components/SoilCharts.jsx';
import SoilReadingForm from '../components/SoilReadingForm.jsx';

const Dashboard = () => {
  const [soilReadings, setSoilReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [hasReadings, setHasReadings] = useState(true); // Start with true to show demo data
  
  // Demo user data for display
  const demoUser = {
    email: 'visitor@soiliq.com',
    name: 'SoilIQ Visitor'
  };

  // Demo soil data that will show immediately
  const demoSoilReadings = [
    {
      id: 'demo-1',
      pH: 6.8,
      nitrogen: 45,
      phosphorus: 20,
      potassium: 120,
      moisture: 42,
      temperature: 24,
      organicMatter: 2.1,
      analysis: {
        healthScore: 72,
        status: 'Good',
        recommendations: [
          'Maintain current irrigation levels',
          'Monitor pH levels weekly',
          'Consider adding phosphorus fertilizer if planting heavy feeders'
        ],
        insights: [
          'Soil pH is in optimal range for most crops (6.0-7.0)',
          'Nitrogen levels are adequate for vegetative growth',
          'Potassium levels are excellent for fruit development'
        ],
        urgency: 'low',
        nutrientBalance: {
          nitrogen: 'Sufficient',
          phosphorus: 'Moderate', 
          potassium: 'Excellent'
        }
      },
      createdAt: new Date().toISOString(),
      location: 'North Field',
      cropType: 'maize'
    },
    {
      id: 'demo-2',
      pH: 6.5,
      nitrogen: 52,
      phosphorus: 28,
      potassium: 42,
      moisture: 38,
      temperature: 26,
      organicMatter: 2.8,
      analysis: {
        healthScore: 68,
        status: 'Moderate',
        recommendations: [
          'Increase irrigation frequency - soil moisture is low',
          'Apply potassium-rich fertilizer',
          'Add organic compost to improve soil structure'
        ],
        insights: [
          'Soil moisture below optimal levels (30-70%)',
          'Potassium deficiency detected',
          'Organic matter content is improving'
        ],
        urgency: 'medium',
        nutrientBalance: {
          nitrogen: 'Good',
          phosphorus: 'Sufficient',
          potassium: 'Low'
        }
      },
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      location: 'South Field',
      cropType: 'beans'
    }
  ];

  useEffect(() => {
    // Load demo data immediately, then try to fetch real data
    setSoilReadings(demoSoilReadings);
    setHasReadings(true);
    setLoading(false);
    
    // Then try to fetch real data in background
    fetchSoilReadings();
  }, []);

  const fetchSoilReadings = async () => {
    try {
      console.log('🌱 Fetching soil readings from API...');
      const response = await soilAPI.getReadings();
      console.log('📊 API Response:', response);
      
      if (response.success && response.data.readings && response.data.readings.length > 0) {
        console.log('✅ Using real soil data from API');
        setSoilReadings(response.data.readings);
        setHasReadings(true);
      } else {
        console.log('ℹ️ No real data, continuing with demo data');
        // Keep demo data, no need to change state
      }
    } catch (error) {
      console.error('❌ API fetch failed, continuing with demo data:', error);
      // Keep demo data on error
    }
  };

  const handleSaveReading = async (newReading) => {
    setLoading(true);
    try {
      console.log('💾 Saving soil reading:', newReading);
      const response = await soilAPI.createReading(newReading);
      
      if (response.success) {
        console.log('✅ Soil reading saved successfully:', response.data);
        
        // Add the new reading to our list
        const newReadingWithAnalysis = {
          ...response.data.soilReading,
          // Ensure analysis exists
          analysis: response.data.soilReading.analysis || generateAIAnalysis(newReading)
        };
        
        setSoilReadings([newReadingWithAnalysis, ...soilReadings]);
        setShowForm(false);
        
        // Show success message
        alert('✅ Soil reading saved successfully! AI analysis generated.');
      } else {
        throw new Error('API returned success: false');
      }
    } catch (error) {
      console.error('❌ Failed to save soil reading:', error);
      
      // Generate local AI analysis as fallback
      const analysis = generateAIAnalysis(newReading);
      const demoReading = {
        id: 'demo-' + Date.now(),
        ...newReading,
        analysis: analysis,
        createdAt: new Date().toISOString(),
        location: newReading.location || 'My Field',
        cropType: newReading.cropType || 'general'
      };
      
      setSoilReadings([demoReading, ...soilReadings]);
      setShowForm(false);
      
      // Show success message even in demo mode
      alert('✅ Soil reading analyzed! (Demo mode - data saved locally)');
    } finally {
      setLoading(false);
    }
  };

  // Local AI analysis generator for immediate results
  const generateAIAnalysis = (reading) => {
    const { pH, nitrogen, phosphorus, potassium, moisture } = reading;
    
    // Calculate health score
    const healthScore = calculateHealthScore(pH, nitrogen, phosphorus, potassium, moisture);
    
    // Generate recommendations
    const recommendations = [];
    const insights = [];
    
    // pH analysis
    if (pH < 6.0) {
      recommendations.push('Apply lime to increase pH level to optimal range (6.0-7.0)');
      insights.push('Soil is slightly acidic - may affect nutrient availability');
    } else if (pH > 7.5) {
      recommendations.push('Add sulfur to decrease pH level to optimal range (6.0-7.0)');
      insights.push('Soil is alkaline - may limit micronutrient uptake');
    } else {
      insights.push('Soil pH is in optimal range for most crops');
    }
    
    // Nutrient analysis
    if (nitrogen < 30) {
      recommendations.push('Apply nitrogen-rich fertilizer (urea or ammonium nitrate)');
      insights.push('Nitrogen levels are low - essential for plant growth');
    } else if (nitrogen < 50) {
      insights.push('Nitrogen levels are adequate');
    } else {
      insights.push('Nitrogen levels are excellent');
    }
    
    if (phosphorus < 20) {
      recommendations.push('Add phosphorus fertilizer (superphosphate)');
      insights.push('Phosphorus deficiency detected - important for root development');
    } else if (phosphorus < 30) {
      insights.push('Phosphorus levels are moderate');
    } else {
      insights.push('Phosphorus levels are optimal');
    }
    
    if (potassium < 100) {
      recommendations.push('Apply potassium fertilizer (potassium chloride)');
      insights.push('Potassium levels are low - affects disease resistance and fruit quality');
    } else if (potassium < 150) {
      insights.push('Potassium levels are good');
    } else {
      insights.push('Potassium levels are excellent for fruit development');
    }
    
    // Moisture analysis
    if (moisture && moisture < 30) {
      recommendations.push('Increase irrigation frequency - soil moisture is low');
      insights.push('Soil moisture below optimal levels');
    } else if (moisture && moisture > 70) {
      recommendations.push('Reduce irrigation to prevent waterlogging');
      insights.push('Soil moisture above optimal levels');
    } else if (moisture) {
      insights.push('Soil moisture levels are optimal');
    }
    
    // Default recommendations if all is good
    if (recommendations.length === 0) {
      recommendations.push('Maintain current soil management practices');
      recommendations.push('Continue regular soil testing');
    }
    
    if (insights.length === 0) {
      insights.push('Soil conditions are generally favorable for crop growth');
    }
    
    return {
      healthScore,
      status: healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : healthScore >= 40 ? 'Moderate' : 'Poor',
      recommendations,
      insights,
      urgency: healthScore < 50 ? 'high' : healthScore < 70 ? 'medium' : 'low',
      nutrientBalance: {
        nitrogen: nitrogen >= 50 ? 'Excellent' : nitrogen >= 30 ? 'Sufficient' : 'Low',
        phosphorus: phosphorus >= 30 ? 'Excellent' : phosphorus >= 20 ? 'Sufficient' : 'Low',
        potassium: potassium >= 150 ? 'Excellent' : potassium >= 100 ? 'Sufficient' : 'Low'
      }
    };
  };

  const calculateHealthScore = (pH, nitrogen, phosphorus, potassium, moisture) => {
    let score = 100;
    
    // pH scoring (optimal: 6.0-7.5)
    if (pH < 5.5 || pH > 8.0) score -= 30;
    else if (pH < 6.0 || pH > 7.5) score -= 15;

    // Nutrient scoring
    if (nitrogen < 30) score -= 20;
    else if (nitrogen < 50) score -= 10;
    
    if (phosphorus < 15) score -= 20;
    else if (phosphorus < 25) score -= 10;
    
    if (potassium < 100) score -= 20;
    else if (potassium < 150) score -= 10;

    // Moisture scoring (optimal: 30-70%)
    if (moisture && (moisture < 20 || moisture > 80)) score -= 25;
    else if (moisture && (moisture < 30 || moisture > 70)) score -= 10;

    return Math.max(0, Math.round(score));
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
      {/* Dashboard Header */}
      <header className="dashboard-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2rem',
        marginBottom: '2rem',
        background: '#f0fdf4',
        borderRadius: '12px',
        border: '1px solid #dcfce7',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src="/assets/Logo.png" 
              alt="SoilIQ Logo" 
              style={{ 
                width: '48px', 
                height: '48px',
                borderRadius: '8px',
                objectFit: 'cover',
                border: '2px solid #bbf7d0'
              }}
            />
            <div>
              <h1 style={{ 
                margin: 0, 
                color: '#059669',
                fontSize: '2rem',
                fontWeight: '700'
              }}>
                SoilIQ Dashboard
              </h1>
              <p style={{ 
                margin: 0,
                color: '#65a30d',
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
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>Processing soil data...</p>
          </div>
        ) : (
          <>
            {/* Always show soil metrics - demo data loads immediately */}
            {hasReadings && soilReadings.length > 0 && (
              <>
                {/* Soil Health Metrics */}
                <div className="section" style={{ marginBottom: '3rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ 
                      color: '#1f2937',
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      margin: 0
                    }}>
                      Soil Health Metrics
                    </h2>
                    <div style={{ 
                      padding: '0.5rem 1rem', 
                      background: '#fef3c7', 
                      color: '#92400e',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      {soilReadings[0]?.isDemo ? 'Demo Data' : 'Live Data'}
                    </div>
                  </div>
                  <div className="soil-cards" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem'
                  }}>
                    {/* pH Card */}
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
                      }}>
                        {pHStatus.label}
                      </span>
                    </div>
                    
                    {/* Nitrogen Card */}
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
                      }}>
                        {formatNumber(latestReading?.nitrogen)} 
                        <span style={{fontSize: '1rem', color: '#6b7280', marginLeft: '0.25rem'}}>ppm</span>
                      </p>
                      <span className={`status ${nitrogenStatus.class}`} style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        background: nitrogenStatus.class === 'good' ? '#dcfce7' : 
                                   nitrogenStatus.class === 'moderate' ? '#fef3c7' : '#fecaca',
                        color: nitrogenStatus.class === 'good' ? '#166534' : 
                              nitrogenStatus.class === 'moderate' ? '#92400e' : '#991b1b'
                      }}>
                        {nitrogenStatus.label}
                      </span>
                    </div>
                    
                    {/* Phosphorus Card */}
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
                      }}>
                        {formatNumber(latestReading?.phosphorus)} 
                        <span style={{fontSize: '1rem', color: '#6b7280', marginLeft: '0.25rem'}}>ppm</span>
                      </p>
                      <span className={`status ${phosphorusStatus.class}`} style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        background: phosphorusStatus.class === 'good' ? '#dcfce7' : 
                                   phosphorusStatus.class === 'moderate' ? '#fef3c7' : '#fecaca',
                        color: phosphorusStatus.class === 'good' ? '#166534' : 
                              phosphorusStatus.class === 'moderate' ? '#92400e' : '#991b1b'
                      }}>
                        {phosphorusStatus.label}
                      </span>
                    </div>
                    
                    {/* Potassium Card */}
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
                      }}>
                        {formatNumber(latestReading?.potassium)} 
                        <span style={{fontSize: '1rem', color: '#6b7280', marginLeft: '0.25rem'}}>ppm</span>
                      </p>
                      <span className={`status ${potassiumStatus.class}`} style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        background: potassiumStatus.class === 'good' ? '#dcfce7' : 
                                   potassiumStatus.class === 'moderate' ? '#fef3c7' : '#fecaca',
                        color: potassiumStatus.class === 'good' ? '#166534' : 
                              potassiumStatus.class === 'moderate' ? '#92400e' : '#991b1b'
                      }}>
                        {potassiumStatus.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Overall Health Score */}
                {latestReading?.analysis && (
                  <div style={{
                    background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                    padding: '2rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    textAlign: 'center',
                    border: '1px solid #bbf7d0'
                  }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#166534', fontSize: '1.25rem', fontWeight: '600' }}>
                      Overall Soil Health Score
                    </h3>
                    <div style={{ 
                      fontSize: '3rem', 
                      fontWeight: 'bold',
                      color: '#059669',
                      marginBottom: '0.5rem'
                    }}>
                      {latestReading.analysis.healthScore}/100
                    </div>
                    <div style={{
                      padding: '0.5rem 1.5rem',
                      background: 'white',
                      color: '#059669',
                      borderRadius: '20px',
                      display: 'inline-block',
                      fontWeight: '600',
                      fontSize: '1rem',
                      border: '1px solid #86efac'
                    }}>
                      Status: {latestReading.analysis.status}
                    </div>
                  </div>
                )}

                {/* Charts Section */}
                <SoilCharts soilReadings={soilReadings} />

                {/* AI Insights Section */}
                <div className="section" style={{ marginBottom: '3rem' }}>
                  <AIInsights soilReadings={soilReadings} />
                </div>
              </>
            )}

            {/* Action Section */}
            <div className="add-reading-section" style={{
              textAlign: 'center',
              padding: '2rem',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <h2 style={{ marginBottom: '1rem', color: '#1f2937', fontWeight: '700' }}>
                Add New Soil Reading
              </h2>
              <p style={{ marginBottom: '1.5rem', color: '#6b7280', fontWeight: '500' }}>
                Get instant AI analysis and recommendations for your soil
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
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                }}
              >
                + New Soil Reading
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