import React, { useState } from 'react';
import { cloudKitchens, dishes } from '../data/dishes';

export default function KitchensView({ 
  location, 
  level, 
  onAddDish, 
  onOpenDishDetails, 
  onNavigate, 
  onTriggerNotification 
}) {
  const [selectedKitchenId, setSelectedKitchenId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(['Ramen', 'Pizza', 'Salad']);
  const [sortBy, setSortBy] = useState('rating'); // rating, distance, price
  const [dietFilter, setDietFilter] = useState('All'); // All, Vegan, LowCarb, HighProtein

  const selectedKitchen = cloudKitchens.find(k => k.id === selectedKitchenId);

  // Trending searches list
  const trendingSearches = ['Garlic Bread', 'Biryani', 'Lava Cake', 'Korean Noodles'];

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    if (query && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 4)]);
    }
  };

  const removeRecentSearch = (e, indexToRemove) => {
    e.stopPropagation();
    setRecentSearches(recentSearches.filter((_, idx) => idx !== indexToRemove));
  };

  // Filter and sort dishes/kitchens
  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.kitchen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDiet = dietFilter === 'All' || 
      (dietFilter === 'Vegan' && dish.tags.includes('Healthy')) ||
      (dietFilter === 'LowCarb' && parseInt(dish.nutrition.carb) < 30) ||
      (dietFilter === 'HighProtein' && parseInt(dish.nutrition.prot) > 20);

    return matchesSearch && matchesDiet;
  });

  const filteredKitchens = cloudKitchens.filter(kitchen => {
    const matchesSearch = kitchen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kitchen.cuisines.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Sort logic for kitchens
  const sortedKitchens = [...filteredKitchens].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'distance') {
      const distA = parseFloat(a.distance);
      const distB = parseFloat(b.distance);
      return distA - distB;
    }
    return 0;
  });

  const kitchenDishes = selectedKitchen 
    ? dishes.filter(d => d.kitchen === selectedKitchen.name) 
    : [];

  const handleCategoryClick = (category) => {
    if (category === 'Food') {
      onNavigate('home');
    } else if (category === 'Wizard') {
      onNavigate('wizard');
    } else if (category === 'Wardrobe') {
      onNavigate('wardrobe');
    } else if (category === 'Crav DNA') {
      onNavigate('profile');
    }
  };

  return (
    <div className="swiggy-home-container">
      {/* 1. Header (Black background) */}
      <div className="swiggy-purple-section">
        
        {/* Location Picker */}
        <div className="swiggy-black-location-picker">
          <div className="black-loc-left" onClick={() => onTriggerNotification("📍 Location options coming soon!")}>
            <div className="loc-title-row">
              <i className="fa-solid fa-location-dot location-pin-white"></i>
              <span className="loc-bold-title">Home</span>
              <i className="fa-solid fa-chevron-down location-arrow-white"></i>
            </div>
            <span className="black-location-text">{location}</span>
          </div>
          
          <div className="black-loc-right-tools">
            <div className="wallet-circle-btn" onClick={() => onTriggerNotification("💳 Wallet balance: ₹340.00")}>
              <i className="fa-solid fa-wallet"></i>
            </div>
          </div>
        </div>

        {/* Category switcher */}
        <div className="swiggy-categories-carousel">
          {[
            { id: 'Food', label: 'Food', emoji: '🍔' },
            { id: 'Wizard', label: 'Wizard', emoji: '🪄', badge: 'AI' },
            { id: 'Dineout', label: 'Dineout', emoji: '🍽️' },
            { id: 'Wardrobe', label: 'Wardrobe', emoji: '👑', badge: 'Gear' },
            { id: 'Crav DNA', label: 'Crav DNA', emoji: '🧬', badge: `LVL ${level || 1}` }
          ].map(cat => (
            <div 
              key={cat.id} 
              className={`swiggy-category-card ${cat.id === 'Dineout' ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              <div className="swiggy-category-icon-wrapper">
                <span className="swiggy-category-emoji">{cat.emoji}</span>
                {cat.badge && <span className="swiggy-category-badge-pill">{cat.badge}</span>}
              </div>
              <span className="swiggy-category-label">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Brand red continuous organic container */}
      <div className="swiggy-organic-container kitchens-organic-container" style={{ paddingBottom: '90px' }}>
        {!selectedKitchen ? (
          // Subview 1: Full Search, Filter & Kitchen Listings
          <div className="kitchens-view-container">
          
          {/* Search bar row */}
          <div className="swiggy-search-row" style={{ margin: '0 0 16px 0' }}>
            <div className="swiggy-search-capsule" style={{ width: '100%', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
              <i className="fa-solid fa-magnifying-glass search-icon-pink" style={{ marginRight: '10px' }}></i>
              <input 
                type="text" 
                placeholder="Search dishes, tags, or cloud kitchens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-field-element"
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '14px',
                  outline: 'none',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#1C1C1E',
                  padding: '12px 0'
                }}
              />
              {searchQuery && (
                <i 
                  className="fa-solid fa-circle-xmark clear-search-btn" 
                  onClick={() => setSearchQuery('')}
                  style={{ color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px' }}
                ></i>
              )}
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && !searchQuery && (
            <div className="recent-searches-box-row" style={{ marginBottom: '15px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>RECENT SEARCHES</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {recentSearches.map((item, idx) => (
                  <span 
                    key={idx} 
                    className="recent-search-tag"
                    onClick={() => handleSearchSubmit(item)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: '30px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'white',
                      fontWeight: '800'
                    }}
                  >
                    {item}
                    <i className="fa-solid fa-xmark" onClick={(e) => removeRecentSearch(e, idx)} style={{ fontSize: '10px' }}></i>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          {!searchQuery && (
            <div className="trending-searches-box-row" style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>TRENDING NOW 🔥</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {trendingSearches.map((item, idx) => (
                  <span 
                    key={idx} 
                    className="trending-search-tag"
                    onClick={() => handleSearchSubmit(item)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '30px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      color: '#E6005C',
                      fontWeight: '800',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Filters Row */}
          <div className="filters-control-panel-row">
            {/* Sort Buttons */}
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="kitchens-sort-select"
            >
              <option value="rating">Sort: Best Rating ⭐</option>
              <option value="distance">Sort: Near Me 📍</option>
            </select>

            {/* Diet Filter Buttons */}
            {['All', 'Vegan', 'LowCarb', 'HighProtein'].map(diet => (
              <button
                key={diet}
                onClick={() => setDietFilter(diet)}
                className={`kitchens-diet-pill ${dietFilter === diet ? 'active' : ''}`}
              >
                {diet === 'All' ? 'All Diets' : diet}
              </button>
            ))}
          </div>

          {/* Results Lists */}
          {searchQuery && (
            <div className="search-results-dishes-holder" style={{ marginBottom: '25px' }}>
              <div className="section-headline-bar">
                <h3>Matching Dishes ({filteredDishes.length})</h3>
              </div>
              {filteredDishes.length === 0 ? (
                <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.7)', padding: '10px 0' }}>No dishes match your parameters.</p>
              ) : (
                <div className="desktop-dishes-grid swiggy-restaurants-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                  {filteredDishes.map(dish => (
                    <div 
                      className="swiggy-restaurant-card" 
                      key={dish.id}
                      onClick={() => onOpenDishDetails(dish)}
                      style={{ width: '100%', margin: '0' }}
                    >
                      <div className="swiggy-card-img-frame" style={{ height: '120px' }}>
                        <img src={dish.img} className="swiggy-card-img" alt={dish.name} />
                        {dish.badge && <div className="swiggy-card-one-badge" style={{ background: '#FF5E7E' }}>{dish.badge}</div>}
                        
                        {/* Plus Add Button */}
                        <button 
                          className="swiggy-card-heart-btn"
                          style={{ background: 'white', color: '#E6005C', border: '1px solid rgba(230, 0, 92, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddDish(dish);
                            onTriggerNotification(`🛒 Added ${dish.name} to cart!`);
                          }}
                        >
                          <i className="fa-solid fa-plus"></i>
                        </button>
                      </div>

                      <div className="swiggy-card-details">
                        <div className="swiggy-card-header-row">
                          <h4 className="swiggy-card-restaurant-name" style={{ fontSize: '14px' }}>{dish.name}</h4>
                          <span className="swiggy-card-price" style={{ fontSize: '14px' }}>₹{dish.price}</span>
                        </div>

                        <div className="swiggy-card-rating-row">
                          <div className="swiggy-card-star-badge">
                            <i className="fa-solid fa-star"></i>
                            <span>{dish.rating}</span>
                          </div>
                          <span className="swiggy-card-time">• {dish.kitchen}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Kitchens Grid */}
          <div className="section-headline-bar">
            <h3 style={{ color: 'white', fontFamily: 'Fredoka, sans-serif', fontSize: '20px', fontWeight: '700' }}>
              {searchQuery ? `Matching Kitchens (${sortedKitchens.length})` : `Cloud Kitchens Near You 🏢`}
            </h3>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.6)' }}>{sortedKitchens.length} nearby</span>
          </div>
          {sortedKitchens.length === 0 ? (
            <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.7)' }}>No kitchens match your parameters.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {sortedKitchens.map(kitchen => (
                <div 
                  className="swiggy-restaurant-card" 
                  key={kitchen.id}
                  onClick={() => setSelectedKitchenId(kitchen.id)}
                  style={{ width: '100%', margin: '0' }}
                >
                  <div className="swiggy-card-img-frame" style={{ height: '140px' }}>
                    <img src={kitchen.img} className="swiggy-card-img" alt={kitchen.name} />
                    {/* Top-left: Approved badge */}
                    {kitchen.approved && (
                      <div className="swiggy-card-one-badge" style={{ background: 'linear-gradient(135deg,#10B981,#059669)', letterSpacing: '0.3px' }}>
                        ✓ Approved
                      </div>
                    )}
                    {/* Bottom: Offer banner */}
                    <div className="swiggy-card-discount-banner">
                      {kitchen.offer || `📍 ${kitchen.distance} AWAY`}
                    </div>
                  </div>

                  <div className="swiggy-card-details">
                    <div className="swiggy-card-header-row">
                      <h4 className="swiggy-card-restaurant-name" style={{ fontSize: '13.5px', fontWeight: '800' }}>{kitchen.name}</h4>
                    </div>

                    <div className="swiggy-card-rating-row">
                      <div className="swiggy-card-star-badge">
                        <i className="fa-solid fa-star"></i>
                        <span>{kitchen.rating}</span>
                      </div>
                      <span className="swiggy-card-time">• {kitchen.time}</span>
                      <span className="swiggy-card-time" style={{ marginLeft: 'auto', fontSize: '10px' }}>📍 {kitchen.distance}</span>
                    </div>

                    <div className="swiggy-card-cuisine">
                      {kitchen.cuisines}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Subview 2: Kitchen Details & Menu
        <div className="kitchen-details-view">
          <button className="kitchen-back-btn" onClick={() => setSelectedKitchenId(null)}>
            <i className="fa-solid fa-arrow-left"></i> Back to Cloud Kitchens
          </button>
          
          <div className="kitchen-details-header-card">
            <img src={selectedKitchen.img} alt={selectedKitchen.name} />
            <div className="kitchen-detail-info-block">
              <h3>{selectedKitchen.name}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {selectedKitchen.cuisines}
              </p>
              <p style={{ fontSize: '12px', marginTop: '8px', fontWeight: '700', color: 'var(--primary-coral)' }}>
                Rating: ⭐ {selectedKitchen.rating} • Delivery in {selectedKitchen.time} • Distance: {selectedKitchen.distance}
              </p>
            </div>
          </div>

          <div className="section-headline-bar" style={{ marginTop: '10px' }}>
            <h3>Menu Items</h3>
          </div>

          <div className="desktop-dishes-grid swiggy-restaurants-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {kitchenDishes.map(dish => (
              <div 
                className="swiggy-restaurant-card" 
                key={dish.id}
                onClick={() => onOpenDishDetails(dish)}
                style={{ width: '100%', margin: '0' }}
              >
                <div className="swiggy-card-img-frame" style={{ height: '120px' }}>
                  <img src={dish.img} className="swiggy-card-img" alt={dish.name} />
                  {dish.badge && <div className="swiggy-card-one-badge" style={{ background: '#FF5E7E' }}>{dish.badge}</div>}
                  
                  {/* Plus Add Button */}
                  <button 
                    className="swiggy-card-heart-btn"
                    style={{ background: 'white', color: '#E6005C', border: '1px solid rgba(230, 0, 92, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddDish(dish);
                      onTriggerNotification(`🛒 Added ${dish.name} to cart!`);
                    }}
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>

                <div className="swiggy-card-details">
                  <div className="swiggy-card-header-row">
                    <h4 className="swiggy-card-restaurant-name" style={{ fontSize: '14px' }}>{dish.name}</h4>
                    <span className="swiggy-card-price" style={{ fontSize: '14px' }}>₹{dish.price}</span>
                  </div>

                  <div className="swiggy-card-rating-row">
                    <div className="swiggy-card-star-badge">
                      <i className="fa-solid fa-star"></i>
                      <span>{dish.rating}</span>
                    </div>
                    <span className="swiggy-card-time">• {dish.kitchen}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
