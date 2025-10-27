import React from 'react';
import logo from '../../assets/my_logo.jpg'; // ✅ client/client/src/assets/my_logo.jpg

const Logo = ({ size = 'medium', className = '', showText = true }) => {
  const sizes = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12', 
    large: 'w-20 h-20',
    xlarge: 'w-32 h-32'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${sizes[size]}`}>
        <img
          src={logo}
          alt="SoilIQ Logo"
          className="w-full h-full rounded-full object-cover border-2 border-white shadow-lg"
          onError={(e) => {
            e.target.style.display = 'none';
            const fallback = e.target.parentElement.querySelector('.logo-fallback');
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div 
          className="logo-fallback w-full h-full bg-green-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg hidden"
        >
          {size === 'small' ? '🌱' : 
           size === 'medium' ? '🌱' : 
           size === 'large' ? '🌱' : '🌍'}
        </div>
      </div>
      
      {showText && (
        <div>
          <h1 className="text-xl font-bold text-white">SoilIQ</h1>
          <p className="text-xs text-green-200 opacity-80">Smart Soil Monitoring</p>
        </div>
      )}
    </div>
  );
};

export default Logo;