// client/src/components/layout/Layout.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import Login from '../../pages/Login';
import Register from '../../pages/Register';
import Dashboard from '../../pages/Dashboard';
import Logo from '../common/Logo';

const Layout = () => {
  const { user, currentPage, setCurrentPage } = useContext(AuthContext);

  console.log('Layout - User:', user, 'Current Page:', currentPage);

  if (!user) {
    return (
      <div className="layout">
        <Logo size="large" showText={true} />
        {currentPage === 'login' ? <Login /> : <Register />}
        <div className="auth-switch">
          <button 
            onClick={() => setCurrentPage(currentPage === 'login' ? 'register' : 'login')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              textDecoration: 'underline',
              marginTop: '20px'
            }}
          >
            {currentPage === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
          </button>
        </div>
      </div>
    );
  }

  return <Dashboard />;
};

export default Layout;