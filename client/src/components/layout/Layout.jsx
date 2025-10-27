import React from 'react';
import { Outlet } from 'react-router-dom';

// SUPER SIMPLE LAYOUT THAT CANNOT BE SQUEEZED
const Layout = () => {
  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: '#f9fafb',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Sidebar - Fixed width with plenty of space */}
      <aside style={{
        width: '350px',
        backgroundColor: 'white',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        borderRight: '1px solid #e5e7eb',
        padding: '30px 25px',
        overflowY: 'auto'
      }}>
        {/* Logo Section */}
        <div style={{ 
          paddingBottom: '30px', 
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '20px',
              border: '2px solid #059669'
            }}>
              SQ
            </div>
            <div>
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#1f2937',
                margin: 0
              }}>
                SoilIQ
              </h1>
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280',
                margin: '5px 0 0 0'
              }}>
                Soil Monitoring
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ marginBottom: '40px' }}>
          {[
            { name: 'Dashboard', icon: '📊', path: '/' },
            { name: 'Soil Analytics', icon: '🌱', path: '/soil' },
            { name: 'Weather', icon: '🌤️', path: '/weather' }
          ].map(item => (
            <a
              key={item.name}
              href={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px 20px',
                margin: '8px 0',
                borderRadius: '10px',
                textDecoration: 'none',
                color: '#374151',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.2s',
                backgroundColor: window.location.pathname === item.path ? '#ecfdf5' : 'transparent',
                color: window.location.pathname === item.path ? '#059669' : '#374151',
                border: window.location.pathname === item.path ? '1px solid #a7f3d0' : '1px solid transparent'
              }}
              onMouseOver={(e) => {
                if (window.location.pathname !== item.path) {
                  e.target.style.backgroundColor = '#f9fafb';
                  e.target.style.borderColor = '#e5e7eb';
                }
              }}
              onMouseOut={(e) => {
                if (window.location.pathname !== item.path) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '20px', marginRight: '15px' }}>{item.icon}</span>
              {item.name}
            </a>
          ))}
        </nav>

        {/* Quick Actions */}
        <div>
          <h3 style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '20px',
            paddingLeft: '20px'
          }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 10px' }}>
            {['Add Soil Reading', 'Generate Report', 'View Alerts'].map((action, index) => (
              <button
                key={action}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px 20px',
                  border: '1px solid #f3f4f6',
                  borderRadius: '10px',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f9fafb';
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#f3f4f6';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: '18px', marginRight: '15px' }}>
                  {['➕', '📋', '🔔'][index]}
                </span>
                {action}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content - LOTS of padding */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minWidth: 0
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '25px 40px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <div>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: 'bold', 
                color: '#111827',
                margin: 0
              }}>
                Dashboard
              </h1>
              <p style={{ 
                fontSize: '16px', 
                color: '#6b7280',
                margin: '8px 0 0 0'
              }}>
                Welcome back! Here's your soil overview.
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
              <button style={{
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                backgroundColor: 'white',
                cursor: 'pointer',
                position: 'relative',
                fontSize: '20px'
              }}>
                🔔
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#ef4444',
                  borderRadius: '50%',
                  border: '2px solid white'
                }}></span>
              </button>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                backgroundColor: '#f9fafb',
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  width: '45px',
                  height: '45px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  TF
                </div>
                <span style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#374151'
                }}>
                  Test Farmer
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - FORCE HUGE PADDING */}
        <main style={{
          flex: 1,
          overflow: 'auto',
          padding: '40px', /* HUGE PADDING */
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ maxWidth: '100%' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;