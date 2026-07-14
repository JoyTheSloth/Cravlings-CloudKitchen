import React, { useState, useEffect } from 'react';
import { dishes } from '../data/dishes';

export default function HomeView({ 
  weather, 
  location, 
  favorites, 
  onToggleFavorite, 
  onAddDish, 
  onNavigate, 
  onOpenDishDetails, 
  onTriggerNotification,
  setSpeechText,
  activeMood,
  setActiveMood,
  cravingDNA,
  streak,
  xp,
  xpMax,
  level,
  missions,
  setMissions,
  onAwardXP,
  pastOrders,
  priceFilter,
  setPriceFilter,
  onChangeLocation
}) {
  const [searchInput, setSearchInput] = useState('');
  const [showPromo, setShowPromo] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Food'); // Food, Instamart, Dineout, Wine Stores, Scenes
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('REORDER'); // REORDER vs FOOD IN 15 MINS
  const [isFastDelivery, setIsFastDelivery] = useState(false);
  const [isHighlyRated, setIsHighlyRated] = useState(false);
  const [sortBy, setSortBy] = useState(null); // 'price-low' or 'rating-high'

  const handleLocationClick = () => {
    const suggestions = [
      "Salt Lake, Sector V, Kolkata",
      "Indiranagar, 12th Main, Bengaluru",
      "Bandra West, Hill Road, Mumbai",
      "Connaught Place, Block E, New Delhi"
    ];
    const val = prompt(
      `Change delivery address:\n\nSuggestions:\n1. ${suggestions[0]}\n2. ${suggestions[1]}\n3. ${suggestions[2]}\n4. ${suggestions[3]}\n\nOr type your custom address below:`,
      location
    );
    if (val) {
      let selected = val.trim();
      if (selected === "1") selected = suggestions[0];
      else if (selected === "2") selected = suggestions[1];
      else if (selected === "3") selected = suggestions[2];
      else if (selected === "4") selected = suggestions[3];

      const weathers = ["sunny", "rainy"];
      const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
      if (onChangeLocation) {
        onChangeLocation(selected, randomWeather);
      }
    }
  };
  
  // Custom speech/companion updates when categories or items are clicked
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (category === 'Wizard') {
      onNavigate('wizard');
    } else if (category === 'Dineout') {
      onNavigate('kitchens');
    } else if (category === 'Crav DNA') {
      onNavigate('cravdna');
    } else {
      if (setSpeechText) {
        setSpeechText("Nice! Let's find your favorite food cravings! 🍔");
      }
    }
  };

  const handleDealClick = (dealName, maxPrice) => {
    if (priceFilter === maxPrice) {
      setPriceFilter(null);
      onTriggerNotification("Cleared price filter");
    } else {
      setPriceFilter(maxPrice);
      onTriggerNotification(`🎯 Filtered for: ${dealName}!`);
      if (setSpeechText) {
        setSpeechText(`Blobby says: Budget mode activated! Dishes under ₹${maxPrice}! 💸`);
      }
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchInput.trim()) {
      onNavigate('wizard', searchInput.trim());
    }
  };

  const toggleVegOnly = () => {
    setIsVegOnly(!isVegOnly);
    onTriggerNotification(isVegOnly ? "Showing all dishes" : "Showing VEG-only dishes 🌱");
    if (setSpeechText) {
      setSpeechText(isVegOnly ? "Back to full cravings list! 🍕" : "Fresh, green, and healthy! 🌱");
    }
  };

  // Filter dishes based on Veg, Price, and Sub-Tab
  let filteredDishes = dishes.filter(dish => {
    // Veg filter
    if (isVegOnly) {
      const vegIds = ['healthy-salad', 'lava-cake', 'paneer-tikka', 'acai-bowl', 'waffles', 'dal-makhani', 'cheesecake', 'garlic-bread'];
      if (!vegIds.includes(dish.id)) return false;
    }
    // Price filter
    if (priceFilter) {
      if (dish.price > priceFilter) return false;
    }
    // Time filter (Food in 15 mins)
    if (activeSubTab === 'FOOD IN 15 MINS') {
      const maxTime = parseInt(dish.time.split('-')[1]);
      if (maxTime > 25) return false;
    } else if (activeSubTab === 'REORDER') {
      // Show distinct past ordered items (at least 12 items)
      const reorderIds = ['pizza', 'comfort-ramen', 'lava-cake', 'biryani', 'butter-chicken', 'burger', 'paneer-tikka', 'garlic-bread', 'waffles', 'cheesecake', 'caesar-wrap', 'tacos'];
      return reorderIds.includes(dish.id);
    }
    // Fast delivery button
    if (isFastDelivery) {
      const maxTime = parseInt(dish.time.split('-')[1]);
      if (maxTime > 25) return false;
    }
    // Rating 4.0+ button
    if (isHighlyRated) {
      if (parseFloat(dish.rating) < 4.7) return false;
    }
    return true;
  });

  if (sortBy === 'price-low') {
    filteredDishes = [...filteredDishes].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'rating-high') {
    filteredDishes = [...filteredDishes].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
  }

  return (
    <div className="swiggy-home-container">
      
      {/* Solid Reddish-Pink Wrapped Branding & Action Section */}
      <div className="swiggy-purple-section">
        
        {/* 1. Location & User Profile Row */}
        <div className="swiggy-black-location-picker">
          <div className="black-loc-left" onClick={handleLocationClick}>
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

        {/* 2. Category Tabs (Horizontal Scroll) */}
        <div className="swiggy-categories-carousel">
          {[
            { id: 'Food', label: 'Food', emoji: '🍔' },
            { id: 'Wizard', label: 'Wizard', emoji: '🪄', badge: 'AI' },
            { id: 'Dineout', label: 'Dineout', emoji: '🍽️' },
            { id: 'Crav DNA', label: 'Crav DNA', emoji: '🧬', badge: `LVL ${level}` }
          ].map(cat => (
            <div 
              key={cat.id} 
              className={`swiggy-category-card ${activeCategory === cat.id ? 'active' : ''}`}
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

      <div className="swiggy-organic-container">

        {/* 3. Search Bar Row with VEG toggle */}
        <div className="swiggy-search-row">
          <form className="swiggy-search-capsule" onSubmit={handleSearchSubmit}>
            <i className="fa-solid fa-magnifying-glass swiggy-search-icon"></i>
            <input 
              type="text" 
              placeholder="Search for 'Cake'" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="swiggy-search-input"
            />
            <div className="swiggy-search-right-tools">
              <i className="fa-solid fa-microphone swiggy-mic-icon"></i>
              <div className="swiggy-search-divider"></div>
            </div>
          </form>

          {/* VEG Toggle Switch */}
          <div className="swiggy-veg-toggle-box" onClick={toggleVegOnly}>
            <span className="swiggy-veg-toggle-label">VEG</span>
            <div className={`swiggy-veg-switch ${isVegOnly ? 'active' : ''}`}>
              <div className="swiggy-veg-switch-handle">
                <div className="swiggy-veg-dot"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Promotional Banner - BIG BRAND HEIST */}
        <div 
          className="swiggy-brand-heist-banner" 
          onClick={() => onTriggerNotification("🎉 Big Brand Heist Coupon activated!")}
          style={{ cursor: 'pointer', padding: 0, overflow: 'hidden', background: 'transparent', border: 'none', boxShadow: 'none' }}
        >
          <img 
            src="/poster.png" 
            alt="Big Brand Heist" 
            style={{ 
              width: '100%', 
              height: 'auto', 
              borderRadius: '24px', 
              display: 'block',
              boxShadow: '0 8px 24px rgba(230, 0, 92, 0.15)'
            }} 
          />
        </div>

        {/* 5. Promotional Deal Cards (Horizontal Scroll) */}
        <div className="swiggy-deal-cards-carousel">
          {/* Card 1: PRICE DROP */}
          <div 
            className={`swiggy-deal-card ${priceFilter === 200 ? 'active' : ''}`}
            onClick={() => handleDealClick("Dishes Starting At ₹29", 200)}
          >
            <span className="deal-header">Dishes Starting At ₹29</span>
            <div className="deal-graphic-container">
              <svg width="95" height="50" viewBox="0 0 100 50" fill="none">
                <rect x="2" y="2" width="96" height="38" rx="8" fill="#1E004A" />
                <text x="50" y="27" fill="#B5FF38" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="Poppins">PRICE</text>
                <text x="50" y="38" fill="#FFFFFF" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="Poppins">DROP</text>
                <path d="M 12,30 Q 15,22 25,30 M 80,30 Q 85,22 92,30" stroke="#B5FF38" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="deal-dots-row">
              <span className="deal-dot dot-yellow"></span>
              <span className="deal-dot dot-orange"></span>
              <span className="deal-dot dot-green"></span>
              <span className="deal-dot dot-white"></span>
            </div>
          </div>

          {/* Card 2: GET 70% OFF */}
          <div 
            className={`swiggy-deal-card ${priceFilter === 150 ? 'active' : ''}`}
            onClick={() => handleDealClick("Deal Feast 70% Off", 150)}
          >
            <span className="deal-header">Deal Feast</span>
            <div className="deal-graphic-container">
              <svg width="95" height="60" viewBox="0 0 100 65" fill="none">
                {/* Wavy Stamp Badge */}
                <path d="M 50,5 L 62,8 L 72,5 L 75,17 L 87,20 L 82,32 L 88,44 L 77,47 L 72,59 L 60,56 L 50,60 L 40,56 L 30,59 L 25,47 L 14,44 L 20,32 L 15,20 L 27,17 L 30,5 L 40,8 Z" fill="#E23E2A" stroke="white" strokeWidth="1.5" />
                <text x="50" y="26" fill="white" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="Poppins">GET</text>
                <text x="50" y="44" fill="white" fontSize="16" fontWeight="950" textAnchor="middle" fontFamily="Poppins">70%</text>
                <text x="50" y="54" fill="white" fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="Poppins">OFF</text>
              </svg>
            </div>
          </div>

          {/* Card 3: FLAT 100 OFF */}
          <div 
            className={`swiggy-deal-card ${priceFilter === 250 ? 'active' : ''}`}
            onClick={() => handleDealClick("Flat ₹100 OFF deals", 250)}
          >
            <span className="deal-header">Top Brands, Top Deals</span>
            <div className="deal-graphic-container">
              <svg width="95" height="60" viewBox="0 0 100 60" fill="none">
                {/* Circular Seal Badge */}
                <circle cx="50" cy="30" r="26" fill="#0D421F" stroke="#B5FF38" strokeWidth="1.5" />
                <text x="50" y="20" fill="#B5FF38" fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="Poppins">FLAT</text>
                <text x="50" y="38" fill="white" fontSize="15" fontWeight="950" textAnchor="middle" fontFamily="Poppins">₹100</text>
                <text x="50" y="48" fill="#B5FF38" fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="Poppins">OFF</text>
              </svg>
            </div>
          </div>

          {/* Card 4: FLAT 200 OFF */}
          <div 
            className="swiggy-deal-card"
            onClick={() => handleDealClick("Flat ₹200 OFF deals", 300)}
          >
            <span className="deal-header">Flat ₹200 OFF</span>
            <div className="deal-graphic-container">
              <svg width="95" height="60" viewBox="0 0 100 60" fill="none">
                {/* Gold Coin inside bowl */}
                <path d="M 15,35 Q 50,55 85,35 Z" fill="#3D008F" />
                <circle cx="50" cy="26" r="18" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" />
                <text x="50" y="33" fill="#D97706" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="Poppins">₹</text>
              </svg>
            </div>
          </div>
        </div>

      </div> {/* End of Organic Content Container */}

      {/* White Background Layout below purple container */}
      <div className="swiggy-white-section">
        
        {/* 6. Subtabs Toggle Selector */}
        <div className="swiggy-subtabs-row">
          <button 
            className={`swiggy-subtab-btn ${activeSubTab === 'REORDER' ? 'active' : ''}`}
            onClick={() => {
              setActiveSubTab('REORDER');
              onTriggerNotification("Showing reorder highlights");
            }}
          >
            REORDER
          </button>
          <button 
            className={`swiggy-subtab-btn ${activeSubTab === 'FOOD IN 15 MINS' ? 'active' : ''}`}
            onClick={() => {
              setActiveSubTab('FOOD IN 15 MINS');
              onTriggerNotification("Showing fast delivery dishes (<= 25 mins)");
            }}
          >
            FOOD IN 15 MINS
          </button>
        </div>

        {/* 7. Restaurant & Dishes Scroll List */}
        <div className="swiggy-restaurants-scroll">
          {filteredDishes.length === 0 ? (
            <div className="swiggy-empty-dishes">
              <span className="empty-emoji">🥣</span>
              <p>No dishes match the active filters!</p>
              <button className="empty-clear-btn" onClick={() => {
                setIsVegOnly(false);
                setPriceFilter(null);
                setActiveSubTab('REORDER');
              }}>Clear Filters</button>
            </div>
          ) : (
            filteredDishes.map((dish) => {
              const isFav = favorites.includes(dish.id);
              
              // Custom discount/overlay labels to match screenshot style
              const overlays = {
                'pizza': 'ITEMS AT ₹99 + 10% EXTRA OFF',
                'biryani': '50% OFF + 10% EXTRA OFF',
                'comfort-ramen': 'ITEMS AT ₹29',
                'healthy-salad': 'GET 70% OFF',
                'lava-cake': 'FLAT ₹100 OFF',
                'sushi': 'ITEMS AT ₹199'
              };
              const overlayText = overlays[dish.id] || 'SPECIAL OFFER';

              return (
                <div 
                  key={dish.id} 
                  className="swiggy-restaurant-card"
                  onClick={() => onOpenDishDetails && onOpenDishDetails(dish)}
                >
                  {/* Dish / Restaurant Image Frame */}
                  <div className="swiggy-card-img-frame">
                    <img src={dish.img} alt={dish.name} className="swiggy-card-img" />
                    
                    {/* Top Left Swiggy One Badge */}
                    <div className="swiggy-card-one-badge">one</div>

                    {/* Top Right Heart Fav Overlay */}
                    <button 
                      className={`swiggy-card-heart-btn ${isFav ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(dish.id);
                      }}
                    >
                      <i className={`fa-solid fa-heart ${isFav ? 'filled' : ''}`}></i>
                    </button>

                    {/* Bottom Discount Overlay Banner */}
                    <div className="swiggy-card-discount-banner">
                      {overlayText}
                    </div>
                  </div>

                  {/* Details block */}
                  <div className="swiggy-card-details">
                    <div className="swiggy-card-header-row">
                      <h4 className="swiggy-card-restaurant-name">{dish.kitchen}</h4>
                      {/* Price Badge in title area for ordering */}
                      <span className="swiggy-card-price">₹{dish.price}</span>
                    </div>

                    <div className="swiggy-card-rating-row">
                      <div className="swiggy-card-star-badge">
                        <i className="fa-solid fa-star"></i>
                        <span>{dish.rating}</span>
                      </div>
                      <span className="swiggy-card-time">• {dish.time}</span>
                    </div>

                    <div className="swiggy-card-cuisine">
                      {dish.name}
                    </div>

                    <div className="swiggy-card-footer">
                      <span className="cuisine-tags-row">
                        {dish.tags.filter(t => t !== 'all').map(tag => (
                          <span key={tag} className="cuisine-tag-pill">{tag}</span>
                        ))}
                      </span>
                      {/* Direct Add CTA */}
                      <button 
                        className="swiggy-card-add-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddDish(dish);
                        }}
                      >
                        ADD +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Divider line */}
        <div className="swiggy-section-divider"></div>

        {/* 8. Delivering Header Row */}
        <div className="swiggy-delivering-header-box">
          <h3 className="swiggy-delivering-title">128 restaurants delivering to you</h3>
          
          <div className="swiggy-filter-pills-row">
            <button 
              className={`swiggy-filter-pill ${isVegOnly || priceFilter || isFastDelivery || isHighlyRated || sortBy ? 'active' : ''}`}
              onClick={() => {
                setIsVegOnly(false);
                setPriceFilter(null);
                setIsFastDelivery(false);
                setIsHighlyRated(false);
                setSortBy(null);
                onTriggerNotification("Filters reset!");
              }}
            >
              Reset <i className="fa-solid fa-rotate-left" style={{ marginLeft: '4px' }}></i>
            </button>
            <button 
              className={`swiggy-filter-pill ${sortBy ? 'active' : ''}`}
              onClick={() => {
                if (!sortBy) {
                  setSortBy('price-low');
                  onTriggerNotification("Sorting by Price: Low to High 💰");
                } else if (sortBy === 'price-low') {
                  setSortBy('rating-high');
                  onTriggerNotification("Sorting by Rating: High to Low ⭐");
                } else {
                  setSortBy(null);
                  onTriggerNotification("Cleared sorting");
                }
              }}
            >
              Sort {sortBy === 'price-low' ? '₹' : sortBy === 'rating-high' ? '⭐' : <i className="fa-solid fa-chevron-down"></i>}
            </button>
            <button 
              className={`swiggy-filter-pill ${isFastDelivery ? 'active' : ''}`}
              onClick={() => {
                setIsFastDelivery(!isFastDelivery);
                onTriggerNotification(isFastDelivery ? "Fast Delivery filter off" : "Filtering Fast Delivery (< 25 min) ⚡");
              }}
            >
              Fast Delivery
            </button>
            <button 
              className={`swiggy-filter-pill ${isHighlyRated ? 'active' : ''}`}
              onClick={() => {
                setIsHighlyRated(!isHighlyRated);
                onTriggerNotification(isHighlyRated ? "Highly Rated filter off" : "Filtering Highly Rated (4.7+) ⭐");
              }}
            >
              Ratings 4.7+
            </button>
          </div>
        </div>

        {/* 9. Vertical Restaurants List (Single-single cards for Phone UI) */}
        <div className="swiggy-vertical-restaurants-list">
          {filteredDishes.map((dish) => {
            const isFav = favorites.includes(dish.id);
            const overlays = {
              'pizza': 'ITEMS AT ₹99 + 10% EXTRA OFF',
              'biryani': '50% OFF + 10% EXTRA OFF',
              'comfort-ramen': 'ITEMS AT ₹29',
              'healthy-salad': 'GET 70% OFF',
              'lava-cake': 'FLAT ₹100 OFF',
              'sushi': 'ITEMS AT ₹199'
            };
            const overlayText = overlays[dish.id] || 'SPECIAL OFFER';

            return (
              <div 
                key={`vert-${dish.id}`}
                className="swiggy-vert-restaurant-card"
                onClick={() => onOpenDishDetails && onOpenDishDetails(dish)}
              >
                {/* Left Side: Food Image Frame */}
                <div className="vert-card-left">
                  <img src={dish.img} alt={dish.name} className="vert-card-img" />
                  
                  {/* Swiggy One Badge overlay */}
                  <span className="vert-card-one-badge">one</span>
                  
                  {/* Discount overlay banner */}
                  <span className="vert-card-discount-banner">{overlayText}</span>
                </div>

                {/* Right Side: Details & Actions */}
                <div className="vert-card-right">
                  <div className="vert-card-header-row">
                    <h4 className="vert-card-kitchen-name">{dish.kitchen}</h4>
                    <button 
                      className={`vert-card-heart-btn ${isFav ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(dish.id);
                      }}
                    >
                      <i className={`fa-solid fa-heart ${isFav ? 'filled' : ''}`}></i>
                    </button>
                  </div>

                  <div className="vert-card-rating-row">
                    <div className="vert-card-star-badge">
                      <i className="fa-solid fa-star"></i>
                      <span>{dish.rating}</span>
                    </div>
                    <span className="vert-card-meta-text">• {dish.time}</span>
                    <span className="vert-card-meta-text">• 1.5 km</span>
                  </div>

                  <div className="vert-card-dish-name">
                    {dish.name}
                  </div>

                  <p className="vert-card-cuisines-desc">
                    North Indian, Biryani, Mughlai, Desserts
                  </p>

                  <div className="vert-card-footer">
                    <span className="vert-card-price">₹{dish.price}</span>
                    
                    {/* Add Button */}
                    <button 
                      className="swiggy-card-add-btn vert-add-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddDish(dish);
                      }}
                    >
                      ADD +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}

