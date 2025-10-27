import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="flex items-center justify-between px-8 py-6"> {/* Increased padding */}
        <div className="ml-4"> {/* Added margin */}
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1> {/* Larger text */}
          <p className="text-gray-500 mt-2 text-lg">Welcome back! Here's your soil overview.</p> {/* Larger text */}
        </div>
        
        <div className="flex items-center space-x-8 mr-4"> {/* Increased spacing */}
          <div className="relative">
            <button className="p-3 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
              <span className="text-2xl">🔔</span> {/* Larger icon */}
              <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-base">
              TF
            </div>
            <span className="text-gray-700 font-medium text-lg">Test Farmer</span> {/* Larger text */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;