// client/src/pages/Dashboard.jsx
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import Logo from '../components/common/Logo';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [soilReadings, setSoilReadings] = useState([
    { id: 1, date: '2024-01-15', pH: 6.5, nitrogen: 45, phosphorus: 30, potassium: 25 },
    { id: 2, date: '2024-01-08', pH: 6.2, nitrogen: 42, phosphorus: 28, potassium: 22 }
  ]);

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
        <div className="soil-cards">
          <div className="soil-card">
            <h3>Latest pH Level</h3>
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

        <div className="add-reading-section">
          <h2>Add New Soil Reading</h2>
          <p>Track your soil health with regular readings</p>
          <button className="primary-btn">+ New Reading</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;