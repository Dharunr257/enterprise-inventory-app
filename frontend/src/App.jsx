import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Suppliers from './pages/Suppliers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { ToastProvider } from './components/Toast';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ToastProvider>
      <Router>
        <div className="app-container">
          
          {/* Collapsible Left Sidebar */}
          <Sidebar isOpen={sidebarOpen} toggleSidebar={setSidebarOpen} />

          {/* Core Main Content Workspace */}
          <div className="main-content">
            
            {/* Top Navigation Bar */}
            <Navbar toggleSidebar={setSidebarOpen} theme={theme} toggleTheme={toggleTheme} />

            {/* Dynamic Routed Views */}
            <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
            
          </div>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
