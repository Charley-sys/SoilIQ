import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Soil Analytics', href: '/soil', icon: '🌱' },
    { name: 'Weather', href: '/weather', icon: '🌤️' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      {/* Logo section with proper spacing */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {/* Updated logo section */}
          <div className="flex-shrink-0">
            <img 
              src="/assets/my_logo.jpg" 
              alt="SoilIQ Logo"
              className="w-12 h-12 rounded-lg object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback if logo doesn't load */}
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-lg hidden">
              SQ
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">SoilIQ</h1>
            <p className="text-sm text-gray-500">Soil Monitoring</p>
          </div>
        </div>
      </div>

      {/* Navigation with better spacing */}
      <nav className="mt-6 px-3">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-3 mx-2 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200 ${
                isActive ? 'bg-green-50 text-green-600 shadow-sm' : ''
              }`
            }
          >
            <span className="text-lg mr-3">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Quick Actions with better spacing */}
      <div className="mt-8 px-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">
          Quick Actions
        </h3>
        <div className="space-y-1 px-2">
          <button className="w-full flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200">
            <span className="mr-3 text-base">➕</span>
            Add Soil Reading
          </button>
          <button className="w-full flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200">
            <span className="mr-3 text-base">📋</span>
            Generate Report
          </button>
          <button className="w-full flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200">
            <span className="mr-3 text-base">🔔</span>
            View Alerts
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;