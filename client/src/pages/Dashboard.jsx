// client/src/pages/Dashboard.jsx
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { soilAPI } from '../services/api.js'; // Make sure this path is correct
import Logo from '../components/common/Logo.jsx';
import AIInsights from '../components/AIInsights.jsx';
import SoilCharts from '../components/SoilCharts.jsx';
import SoilReadingForm from '../components/SoilReadingForm.jsx';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [soilReadings, setSoilReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSoilReadings();
  }, []);

  const fetchSoilReadings = async () => {
    try {
      const response = await soilAPI.getReadings();
      if (response.success) {
        setSoilReadings(response.data.readings);
      }
    } catch (error) {
      console.error('Failed to fetch soil readings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReading = async (newReading) => {
    try {
      const response = await soilAPI.createReading(newReading);
      if (response.success) {
        setSoilReadings([response.data.soilReading, ...soilReadings]);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to save soil reading:', error);
    }
  };

  const latestReading = soilReadings[0];

  const getStatus = (value, type) => {
    switch(type) {
      case 'pH':
        if (value >= 6.0 && value <= 7.0) return { label: 'Optimal', class: 'good' };
        if (value >= 5.5 && value <= 7.5) return { label: 'Moderate', class: 'moderate' };
        return { label: 'Poor', class: 'low' };
      case 'nitrogen':
        if (value >= 40) return { label: 'Good', class: 'good' };
        if (value >= 25) return { label: 'Moderate', class: 'moderate' };
        return { label: 'Low', class: 'low' };
      case 'phosphorus':
        if (value >= 30) return { label: 'Good', class: 'good' };
        if (value >= 20) return { label: 'Moderate', class: 'moderate' };
        return { label: 'Low', class: 'low' };
      case 'potassium':
        if (value >= 30) return { label: 'Good', class: 'good' };
        if (value >= 20) return { label: 'Moderate', class: 'moderate' };
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
      <header className="dashboard-header">
        <Logo size="small" showText={false} />
        <h1>SoilIQ Dashboard</h1>
        <div>
          <span style={{ marginRight: '15px' }}>Welcome, {user?.email}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>
      
      <div className="dashboard-content">
        {/* Soil Metrics Cards */}
        <div className="section">
          <h2>🌱 Soil Health Metrics</h2>
          <div className="soil-cards">
            <div className="soil-card">
              <h3>pH Level</h3>
              <p className="reading">{latestReading?.pH || 'N/A'}</p>
              <span className={`status ${pHStatus.class}`}>{pHStatus.label}</span>
            </div>
            
            <div className="soil-card">
              <h3>Nitrogen (N)</h3>
              <p className="reading">{latestReading?.nitrogen ? `${latestReading.nitrogen} ppm` : 'N/A'}</p>
              <span className={`status ${nitrogenStatus.class}`}>{nitrogenStatus.label}</span>
            </div>
            
            <div className="soil-card">
              <h3>Phosphorus (P)</h3>
              <p className="reading">{latestReading?.phosphorus ? `${latestReading.phosphorus} ppm` : 'N/A'}</p>
              <span className={`status ${phosphorusStatus.class}`}>{phosphorusStatus.label}</span>
            </div>
            
            <div className="soil-card">
              <h3>Potassium (K)</h3>
              <p className="reading">{latestReading?.potassium ? `${latestReading.potassium} ppm` : 'N/A'}</p>
              <span className={`status ${potassiumStatus.class}`}>{potassiumStatus.label}</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <SoilCharts soilReadings={soilReadings} />

        {/* AI Insights Section */}
        <div className="section">
          <AIInsights soilReadings={soilReadings} />
        </div>

        {/* Action Section */}
        <div className="add-reading-section">
          <h2>Manage Your Soil Data</h2>
          <p>Add new soil readings to get updated insights and charts</p>
          <button 
            className="primary-btn" 
            onClick={() => setShowForm(true)}
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
      </div>
    </div>
  );
};

// Make sure this default export exists
export default Dashboard;