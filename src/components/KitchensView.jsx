import React, { useState } from 'react';
import { cloudKitchens, dishes } from '../data/dishes';

export default function KitchensView({ onAddDish, onOpenDishDetails }) {
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
      (dietFilter === 'Vegan' && dish.tags.includes('Healthy')) || // map appropriately
      (dietFilter === 'LowCarb' && dish.nutrition.carb < 30) ||
      (dietFilter === 'HighProtein' && dish.nutrition.prot > 20);

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

  return (
    <div className="viewport-content-panel">
      {!selectedKitchen ? (
        // Subview 1: Full Search, Filter & Kitchen Listings
        <div className="kitchens-view-container">
          
          {/* Search bar row */}
          <div className="search-bar-row-field" style={{ position: 'relative', marginBottom: '16px' }}>
            <i className="fa-solid fa-magnifying-glass search-icon-left" style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }}></i>
            <input 
              type="text" 
              placeholder="Search dishes, tags, or cloud kitchens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-field-element"
              style={{
                width: '100%',
                padding: '14px 16px 14px 44px',
                borderRadius: '50px',
                border: '1.5px solid rgba(229, 213, 197, 0.5)',
                background: 'white',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
                fontFamily: 'Fredoka, sans-serif'
              }}
            />
            {searchQuery && (
              <i 
                className="fa-solid fa-circle-xmark clear-search-btn" 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '16px', top: '16px', color: 'var(--text-muted)', cursor: 'pointer' }}
              ></i>
            )}
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && !searchQuery && (
            <div className="recent-searches-box-row" style={{ marginBottom: '15px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>RECENT SEARCHES</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {recentSearches.map((item, idx) => (
                  <span 
                    key={idx} 
                    className="recent-search-tag"
                    onClick={() => handleSearchSubmit(item)}
                    style={{
                      background: '#FFF5F6',
                      border: '1px solid rgba(255, 94, 126, 0.1)',
                      borderRadius: '30px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--primary-coral)',
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
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>TRENDING NOW 🔥</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {trendingSearches.map((item, idx) => (
                  <span 
                    key={idx} 
                    className="trending-search-tag"
                    onClick={() => handleSearchSubmit(item)}
                    style={{
                      background: 'white',
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                      borderRadius: '30px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      color: 'var(--text-dark)',
                      fontWeight: '700'
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Filters Row */}
          <div className="filters-control-panel-row" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px' }}>
            {/* Sort Buttons */}
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: 'white',
                border: '1.5px solid rgba(0,0,0,0.06)',
                borderRadius: '30px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: '800',
                outline: 'none'
              }}
            >
              <option value="rating">Sort: Best Rating ⭐</option>
              <option value="distance">Sort: Near Me 📍</option>
            </select>

            {/* Diet Filter Buttons */}
            {['All', 'Vegan', 'LowCarb', 'HighProtein'].map(diet => (
              <button
                key={diet}
                onClick={() => setDietFilter(diet)}
                style={{
                  background: dietFilter === diet ? 'var(--primary-coral)' : 'white',
                  color: dietFilter === diet ? 'white' : 'var(--text-dark)',
                  border: '1.5px solid rgba(0,0,0,0.06)',
                  borderRadius: '30px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
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
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', padding: '10px 0' }}>No dishes match your parameters.</p>
              ) : (
                <div className="desktop-dishes-grid">
                  {filteredDishes.map(dish => (
                    <div 
                      className="desktop-dish-card" 
                      key={dish.id}
                      onClick={() => onOpenDishDetails(dish)}
                    >
                      <div className="desktop-dish-badge">{dish.badge}</div>
                      <img src={dish.img} className="desktop-dish-card-img" alt={dish.name} />
                      <div className="desktop-dish-info">
                        <span className="desktop-dish-title">{dish.name}</span>
                        <div className="desktop-dish-footer" style={{ marginTop: '15px' }}>
                          <span className="desktop-dish-price">₹{dish.price}</span>
                          <button 
                            className="desktop-dish-add-btn" 
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddDish(dish);
                            }}
                          >
                            <i className="fa-solid fa-plus"></i>
                          </button>
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
            <h3>{searchQuery ? `Matching Kitchens (${sortedKitchens.length})` : 'Local Cloud Kitchen Hubs 🏢'}</h3>
          </div>
          {sortedKitchens.length === 0 ? (
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>No kitchens match your parameters.</p>
          ) : (
            <div className="kitchens-grid">
              {sortedKitchens.map(kitchen => (
                <div 
                  className="kitchen-card" 
                  key={kitchen.id}
                  onClick={() => setSelectedKitchenId(kitchen.id)}
                >
                  <img src={kitchen.img} className="kitchen-card-img" alt={kitchen.name} />
                  <div className="kitchen-card-info">
                    <div className="kitchen-name-lbl">
                      <span>{kitchen.name}</span>
                      {kitchen.approved && <span className="kitchen-approved-badge">Approved</span>}
                    </div>
                    <p className="kitchen-cuisines-text">{kitchen.cuisines}</p>
                    <div className="kitchen-stats-row">
                      <span>⭐ {kitchen.rating}</span>
                      <span>⏱️ {kitchen.time}</span>
                      <span>📍 {kitchen.distance}</span>
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

          <div className="desktop-dishes-grid">
            {kitchenDishes.map(dish => (
              <div 
                className="desktop-dish-card" 
                key={dish.id}
                onClick={() => onOpenDishDetails(dish)}
              >
                <div className="desktop-dish-badge">{dish.badge}</div>
                <img src={dish.img} className="desktop-dish-card-img" alt={dish.name} />
                <div className="desktop-dish-info">
                  <span className="desktop-dish-title">{dish.name}</span>
                  <div className="desktop-dish-footer" style={{ marginTop: '15px' }}>
                    <span className="desktop-dish-price">₹{dish.price}</span>
                    <button 
                      className="desktop-dish-add-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddDish(dish);
                      }}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
