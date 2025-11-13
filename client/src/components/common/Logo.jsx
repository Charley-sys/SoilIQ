// client/src/components/common/Logo.jsx
import React from "react";
import logo from "../../assets/Logo.jpg"; // Adjust path based on where you placed it

const Logo = ({ size = "medium", className = "", showText = true }) => {
  const sizes = {
    small: "40px",
    medium: "60px", 
    large: "80px"
  };

  return (
    <div className={`Logo ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img 
        src={logo} 
        alt="SoilIQ Logo" 
        style={{ 
          width: sizes[size], 
          height: sizes[size],
          borderRadius: '8px',
          objectFit: 'cover'
        }}
      />
      {showText && <h1 style={{ color: 'white', margin: 0 }}>SoilIQ</h1>}
    </div>
  );
};

export default Logo;