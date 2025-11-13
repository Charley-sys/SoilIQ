// client/src/App.jsx
import React from 'react';
import { AuthProvider } from './context/AuthContext.jsx';  // Add .jsx extension
import Layout from './components/layout/Layout';
import './styles/design-system.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Layout />
      </div>
    </AuthProvider>
  );
}

export default App;