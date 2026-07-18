import React from 'react';
import { useLocation } from 'react-router-dom';

const Navbar = ({ toggleSidebar, theme, toggleTheme }) => {
  const location = useLocation();
  
  // Create readable page name from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    
    // Capitalize and format path: /products -> Products
    const sectionName = path.substring(1);
    return sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={() => toggleSidebar(prev => !prev)}>
          {/* Hamburger Menu Icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        
        <div className="breadcrumb">
          <span>Enterprise IMS</span>
          <span style={{ margin: '0 8px', color: 'var(--text-muted)' }}>/</span>
          <span className="breadcrumb-active">{getPageTitle()}</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Search Mock */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginRight: '16px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ position: 'absolute', left: '10px' }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            type="text" 
            placeholder="Search console..." 
            style={{ 
              padding: '6px 12px 6px 32px', 
              borderRadius: '20px', 
              border: '1px solid var(--border-color)',
              fontSize: '0.85rem',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              outline: 'none',
              width: '200px'
            }}
          />
        </div>

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme} 
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
            marginRight: '16px',
            backgroundColor: 'var(--bg-active)'
          }}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            /* Moon Icon */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            /* Sun Icon */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>

        <div className="user-profile">
          <div style={{ textAlign: 'right', display: 'block' }}>
            <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>Dharun Admin</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Global Manager</p>
          </div>
          <div className="avatar">
            <span>DA</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
