import React from 'react';

const Header = ({ darkMode, setDarkMode }) => {
  return (
    <div className="dashboard-header">
      <div className="header-content">
        <img
          src="https://www.shutterstock.com/image-vector/cybersecurity-lock-icon-representing-digital-260nw-2502187663.jpg"
          alt="Cybersecurity"
          className="header-icon"
        />
        <div>
          <h1 className="header-title">Threat Intelligence Dashboard</h1>
          <p className="header-subtitle">Monitor and analyze security threats in real-time</p>
        </div>
      </div>
      <button 
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    </div>
  );
};

export default Header;