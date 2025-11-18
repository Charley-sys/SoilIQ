// client/src/components/common/Logo.jsx
import React from "react";

const Logo = ({ size = "medium", className = "", showText = true }) => {
  const sizes = {
    small: "40px",
    medium: "60px", 
    large: "80px"
  };

  // Fallback logo using emoji if image fails to load
  const handleImageError = (e) => {
    console.log('Logo image failed to load, using fallback');
    e.target.style.display = 'none';
    // You could add a fallback emoji here if needed
  };

  return (
    <div className={`Logo ${className}`} style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px',
      textDecoration: 'none'
    }}>
      {/* Try to load the image, but have fallback ready */}
      <div style={{ 
        width: sizes[size], 
        height: sizes[size],
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: size === 'small' ? '1rem' : size === 'medium' ? '1.5rem' : '2rem'
      }}>
        🌱
      </div>
      
      {showText && (
        <h1 style={{ 
          margin: 0, 
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: size === 'small' ? '1.2rem' : size === 'medium' ? '1.5rem' : '2rem',
          fontWeight: 'bold'
        }}>
          SoilIQ
        </h1>
      )}
    </div>
  );
};

export default Logo;