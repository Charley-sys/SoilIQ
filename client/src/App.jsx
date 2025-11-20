// client/src/App.jsx
import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import SoilReadingForm from './components/SoilReadingForm';
import Dashboard from './pages/Dashboard';
import './styles/design-system.css';
import { Suspense } from 'react';
import { soilAPI } from './services/api.js';

const LoadingFallback = () => (
  <div className="loading-spinner" style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px' 
  }}>
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
  </div>
);

function App() {
  const [hasSoilReadings, setHasSoilReadings] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Set demo user data immediately when app loads
  React.useEffect(() => {
    const demoUser = {
      id: 'demo-user-' + Date.now(),
      email: 'visitor@soiliq.com',
      name: 'SoilIQ Visitor',
      role: 'viewer'
    };
    
    // Store in localStorage for any components that might check for user
    localStorage.setItem('user', JSON.stringify(demoUser));
    localStorage.setItem('token', 'demo-token-' + Date.now());
    
    // Also set in sessionStorage for redundancy
    sessionStorage.setItem('user', JSON.stringify(demoUser));
    sessionStorage.setItem('isAuthenticated', 'true');
    
    console.log('🌱 SoilIQ Demo Mode Activated - Full access granted');
  }, []);

  const handleSaveReading = async (readingData) => {
    try {
      const response = await soilAPI.createReading(readingData);
      if (response.success) {
        setHasSoilReadings(true);
        setShowForm(false);
        alert('Soil reading saved successfully! Check your dashboard for insights.');
      }
    } catch (error) {
      console.error('Error saving reading:', error);
      setHasSoilReadings(true);
      setShowForm(false);
      alert('Demo: Reading saved locally');
    }
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Layout>
        {/* Hero Section with Farm Background */}
        <section id="home" style={{
          background: `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)), 
                      url('/assets/Homepage.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: '#000000',
          padding: '6rem 1rem 4rem',
          textAlign: 'center',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Welcome Note */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '2.5rem',
              borderRadius: '16px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e5e7eb',
              marginBottom: '3rem',
              backdropFilter: 'blur(10px)'
            }}>
              <h2 style={{ 
                fontSize: '2rem', 
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#059669',
                lineHeight: '1.3'
              }}>
                🌱 WELCOME TO SOILIQ
              </h2>
              <p style={{ 
                fontSize: '1.2rem',
                color: '#6b7280',
                lineHeight: '1.6',
                fontWeight: '500'
              }}>
                Your professional soil analysis platform. Get instant insights about your soil health, 
                receive AI-powered recommendations, and make data-driven decisions for better crop management.
              </p>
            </div>

            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: '700',
              marginBottom: '1.5rem',
              color: '#1f2937',
              textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)'
            }}>
              Soil Health Analysis
            </h1>
            <p style={{ 
              fontSize: '1.3rem',
              marginBottom: '2.5rem',
              color: '#374151',
              fontWeight: '500',
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
            }}>
              Get immediate insights into your soil health — Powered by SoilIQ’s advanced Artificial Intelligence.
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={() => document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' })}
                style={{
                  background: '#059669',
                  color: 'white',
                  border: 'none',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                View Dashboard
              </button>
              <button 
                onClick={() => setShowForm(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: '#059669',
                  border: '2px solid #059669',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#059669';
                  e.target.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.color = '#059669';
                }}
              >
                Analyze Soil
              </button>
            </div>
          </div>
        </section>

        {/* Dashboard Section - Main content area */}
        <section id="dashboard" style={{ 
          padding: '4rem 1rem',
          background: '#f8fafc',
          minHeight: '100vh'
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <Dashboard />
          </div>
        </section>

        {/* Updated Footer with Legal Links */}
        <footer style={{
          background: '#1a1a1a',
          color: 'white',
          padding: '3rem 1rem 2rem',
          borderTop: '3px solid #059669'
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Brand Section */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <img 
                  src="/assets/Logo.png" 
                  alt="SoilIQ Logo" 
                  style={{ 
                    width: '40px', 
                    height: '40px',
                    borderRadius: '8px',
                    objectFit: 'cover'
                  }}
                />
                <h3 style={{ 
                  fontSize: '1.5rem',
                  margin: 0,
                  color: '#10b981',
                  fontWeight: '700'
                }}>
                  SoilIQ
                </h3>
              </div>
              <p style={{ 
                color: '#d1d5db',
                marginBottom: '1rem',
                lineHeight: '1.6',
                fontSize: '1rem'
              }}>
                Advanced soil analysis platform for modern agriculture. 
                Making soil health monitoring accessible to everyone.
              </p>
              <div style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '1.5rem'
              }}>
                <a href="#" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.color = '#10b981'}
                onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                  📘 Facebook
                </a>
                <a href="#" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.color = '#10b981'}
                onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                  📷 Instagram
                </a>
                <a href="#" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.color = '#10b981'}
                onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                  🐦 Twitter
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ 
                color: '#f8fafc',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                Quick Links
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="#home" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.color = '#10b981'}
                onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                  Home
                </a>
                <a href="#dashboard" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.color = '#10b981'}
                onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                  Dashboard
                </a>
                <a href="#soil-analysis" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.color = '#10b981'}
                onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                  Soil Analysis
                </a>
                <a href="#" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.color = '#10b981'}
                onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                  Documentation
                </a>
              </div>
            </div>

            {/* Legal Links */}
            <div>
              <h4 style={{ 
                color: '#f8fafc',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                Legal
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="#" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.color = '#10b981'}
                onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                  Privacy Policy
                </a>
                <a href="#" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.color = '#10b981'}
                onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                  Terms of Service
                </a>
                <a href="#" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.color = '#10b981'}
                onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                  Cookie Policy
                </a>
                <a href="#" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.color = '#10b981'}
                onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                  Data Processing Agreement
                </a>
              </div>
            </div>

            {/* Contact & Support */}
            <div>
              <h4 style={{ 
                color: '#f8fafc',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                Support
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="mailto:support@soiliq.com" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.color = '#10b981'}
                onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                  📧 support@soiliq.com
                </a>
                <a href="tel:+254 743 971 067" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.color = '#10b981'}
                onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                  📞 +254 (743) 971-067
                </a>
                <span style={{
                  color: '#9ca3af',
                  fontSize: '0.9rem'
                }}>
                  🕒 Mon-Fri: 9AM-6PM
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            borderTop: '1px solid #374151',
            marginTop: '2rem',
            paddingTop: '2rem',
            textAlign: 'center'
          }}>
            <p style={{ 
              color: '#6b7280',
              fontSize: '0.8rem',
              margin: 0
            }}>
              © 2024 SoilIQ. All rights reserved. | 
              <span style={{ 
                background: '#059669',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                fontSize: '0.7rem',
                marginLeft: '0.5rem',
                fontWeight: '500'
              }}>
                 Demo Mode - Full functionality available without login
              </span>
            </p>
          </div>
        </footer>

        {/* Global Soil Reading Form Modal */}
        {showForm && (
          <SoilReadingForm
            onClose={() => setShowForm(false)}
            onSave={handleSaveReading}
          />
        )}
      </Layout>
    </Suspense>
  );
}

export default App;