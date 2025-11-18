// client/src/components/layout/Layout.jsx
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Navigation - Updated with pale green background */}
      <nav style={{
        background: '#f0fdf4', // Pale green background
        padding: '1rem 2rem',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderBottom: '1px solid #dcfce7' // Light green border
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#059669' // Dark green for text
          }}>
            <img 
              src="/assets/Logo.png" 
              alt="SoilIQ Logo" 
              style={{ 
                width: '40px', 
                height: '40px',
                borderRadius: '8px',
                objectFit: 'cover',
                border: '2px solid #bbf7d0' // Light green border around logo
              }}
            />
            SoilIQ
          </div>
          
          <div style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <a href="#home" style={{
              color: '#374151',
              textDecoration: 'none',
              fontWeight: '500',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#dcfce7'}
            onMouseOut={(e) => e.target.style.background = 'transparent'}>
              Home
            </a>
            <a href="#dashboard" style={{
              color: '#374151',
              textDecoration: 'none',
              fontWeight: '500',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#dcfce7'}
            onMouseOut={(e) => e.target.style.background = 'transparent'}>
              Dashboard
            </a>
            <a href="#soil-analysis" style={{
              color: '#374151',
              textDecoration: 'none',
              fontWeight: '500',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#dcfce7'}
            onMouseOut={(e) => e.target.style.background = 'transparent'}>
              Analysis
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ paddingTop: '80px' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;