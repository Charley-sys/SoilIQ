import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/Logo.jpg';

const Sidebar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Soil Analytics', href: '/soil', icon: '🌱' },
    { name: 'Weather', href: '/weather', icon: '🌤️' },
  ];

  return (
    <div className="w-80 bg-white shadow-xl border-r border-gray-200">
      {/* Logo section with imported logo */}
      <div className="p-8 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <img 
              src={logo} 
              alt="SoilIQ Logo"
              className="w-16 h-16 rounded-xl object-cover border-2 border-green-200 shadow-sm"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">SoilIQ</h1>
            <p className="text-sm text-gray-500 mt-1">Smart Soil Monitoring</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 px-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-4 mx-2 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200 mb-2 ${
                isActive ? 'bg-green-50 text-green-600 shadow-md border border-green-200' : 'border border-transparent'
              }`
            }
          >
            <span className="text-xl mr-4">{item.icon}</span>
            <span className="font-semibold text-lg">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Quick Actions */}
      <div className="mt-12 px-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 px-2">
          Quick Actions
        </h3>
        <div className="space-y-3 px-2">
          <button className="w-full flex items-center px-4 py-3 text-base text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-100 hover:border-gray-300 hover:shadow-sm">
            <span className="mr-4 text-lg">➕</span>
            Add Soil Reading
          </button>
          <button className="w-full flex items-center px-4 py-3 text-base text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-100 hover:border-gray-300 hover:shadow-sm">
            <span className="mr-4 text-lg">📋</span>
            Generate Report
          </button>
          <button className="w-full flex items-center px-4 py-3 text-base text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-100 hover:border-gray-300 hover:shadow-sm">
            <span className="mr-4 text-lg">🔔</span>
            View Alerts
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;