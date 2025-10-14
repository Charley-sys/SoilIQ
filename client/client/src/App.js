// client/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddSoilReading from "./pages/AddSoilReading";
import logo from "./assets/my_logo.jpg"; // ✅ Make sure this path exists (lowercase name matters on some systems)

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        {/* ✅ Sidebar */}
        <aside className="w-64 bg-green-800 text-white flex flex-col shadow-lg fixed h-full">
          {/* ✅ Logo + Title */}
          <div className="flex items-center justify-center gap-3 p-6 border-b border-green-700">
            <img
              src={logo}
              alt="SoilIQ Logo"
              className="w-10 h-10 rounded-full object-cover shadow-md"
            />
            <h1 className="text-2xl font-bold tracking-wide">SoilIQ</h1>
          </div>

          {/* ✅ Sidebar Navigation */}
          <nav className="flex-grow p-4 space-y-4">
            <Link
              to="/"
              className="flex items-center gap-2 py-2 px-4 rounded hover:bg-green-700 transition-colors"
            >
              <span>📊</span>
              <span>Dashboard</span>
            </Link>

            <Link
              to="/add-reading"
              className="flex items-center gap-2 py-2 px-4 rounded hover:bg-green-700 transition-colors"
            >
              <span>➕</span>
              <span>Add Reading</span>
            </Link>
          </nav>

          {/* ✅ Footer */}
          <div className="p-4 border-t border-green-700 text-sm text-gray-300 text-center">
            © {new Date().getFullYear()} SoilIQ
          </div>
        </aside>

        {/* ✅ Main Content Area */}
        <main className="flex-1 ml-64 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-reading" element={<AddSoilReading />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
