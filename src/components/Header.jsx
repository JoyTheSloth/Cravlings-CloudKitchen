import React, { useState, useEffect } from 'react';

export default function Header({ coins, cartCount, location, weather, onLocationChange, currentTab, onNavigate, onCartToggle }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.desktop-location-container')) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <header className="desktop-header">
      <div className="header-logo-section" onClick={() => onNavigate('home')}>
        <img src="/logo.png" className="header-logo-img" alt="Cravlings Logo" style={{ objectFit: 'contain', borderRadius: '8px' }} />
      </div>

      <nav className="header-nav-links">
        <a 
          className={`nav-link ${currentTab === 'home' ? 'active' : ''}`} 
          onClick={() => onNavigate('home')}
        >
          <i className="fa-solid fa-house" style={{ marginRight: '6px' }}></i>
          Home
        </a>
        <a 
          className={`nav-link ${currentTab === 'wizard' ? 'active' : ''}`} 
          onClick={() => onNavigate('wizard')}
        >
          <i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight: '6px' }}></i>
          Cravings Wizard
        </a>
        <a 
          className={`nav-link ${currentTab === 'kitchens' ? 'active' : ''}`} 
          onClick={() => onNavigate('kitchens')}
        >
          <i className="fa-solid fa-utensils" style={{ marginRight: '6px' }}></i>
          Cloud Kitchens
        </a>
        <a 
          className={`nav-link ${currentTab === 'orders' ? 'active' : ''}`} 
          onClick={() => onNavigate('orders')}
        >
          <i className="fa-solid fa-bag-shopping" style={{ marginRight: '6px' }}></i>
          My Orders
        </a>
      </nav>

      <div className="header-right-tools">
        {/* Interactive Location Dropdown */}
        <div className="desktop-location-container">
          <div className="desktop-location-picker" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary-coral)', fontSize: '14px' }}></i>
            <span className="location-text">{location}</span>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', color: '#777' }}></i>
          </div>

          {dropdownOpen && (
            <div className="location-dropdown-menu">
              <div 
                className="location-dropdown-item" 
                onClick={() => {
                  onLocationChange('Salt Lake, Kolkata', 'sunny');
                  setDropdownOpen(false);
                }}
              >
                <span>Salt Lake, Kolkata</span>
                <span style={{ color: 'var(--secondary-orange)' }}>☀️ Sunny</span>
              </div>
              <div 
                className="location-dropdown-item" 
                onClick={() => {
                  onLocationChange('Indiranagar, Bengaluru', 'rainy');
                  setDropdownOpen(false);
                }}
              >
                <span>Indiranagar, Bengaluru</span>
                <span style={{ color: '#7234FF' }}>☔ Rainy</span>
              </div>
              <div 
                className="location-dropdown-item" 
                onClick={() => {
                  onLocationChange('Connaught Place, Delhi', 'sunny');
                  setDropdownOpen(false);
                }}
              >
                <span>Connaught Place, Delhi</span>
                <span style={{ color: 'var(--secondary-orange)' }}>☀️ Sunny</span>
              </div>
            </div>
          )}
        </div>

        {/* Currency Coins */}
        <div className="desktop-coin-counter" onClick={() => onNavigate('wardrobe')} title="Visit Mascot Wardrobe">
          <div className="coin-hexagon-badge">
            <i className="fa-solid fa-hexagon-nodes" style={{ display: 'none' }}></i>
            🪙
          </div>
          <span className="coin-count-val">{coins}</span>
        </div>
      </div>
    </header>
  );
}
