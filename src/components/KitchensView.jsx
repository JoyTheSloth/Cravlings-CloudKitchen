import React, { useState } from 'react';
import { cloudKitchens, dishes } from '../data/dishes';

export default function KitchensView({ 
  location, 
  level, 
  onAddDish, 
  onOpenDishDetails, 
  onNavigate, 
  onTriggerNotification,
  bookings,
  onAddBooking,
  onChangeLocation
}) {
  const [selectedKitchenId, setSelectedKitchenId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(['Ramen', 'Pizza', 'Salad']);
  const [sortBy, setSortBy] = useState('rating'); // rating, distance
  const [dietFilter, setDietFilter] = useState('All'); // All, Vegan, LowCarb, HighProtein
  const [collectionFilter, setCollectionFilter] = useState(null); // Curated collections filter
  
  // Advanced Filter Dialog states
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filterApprovedOnly, setFilterApprovedOnly] = useState(false);
  const [filterDiscountOnly, setFilterDiscountOnly] = useState(false);
  const [filterCuisineType, setFilterCuisineType] = useState('All');
  const [filterMaxPrice, setFilterMaxPrice] = useState(800);

  // Dineout Table Booking state
  const [bookingKitchen, setBookingKitchen] = useState(null);
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingDate, setBookingDate] = useState('Today');
  const [bookingTime, setBookingTime] = useState('8:30 PM');

  // Kitchen details screen tabs: dineout vs menu
  const [detailSubTab, setDetailSubTab] = useState('dineout');

  const selectedKitchen = cloudKitchens.find(k => k.id === selectedKitchenId);

  // Curated Dining Collections
  const diningCollections = [
    { id: 'date', label: 'Date Nights 🌹', cuisine: 'Italian', bg: 'linear-gradient(135deg, #FF5E7E, #FF2E93)' },
    { id: 'rooftop', label: 'Rooftops 🌇', cuisine: 'Biryanis', bg: 'linear-gradient(135deg, #FFA040, #FF6A00)' },
    { id: 'cafes', label: 'Cafes ☕', cuisine: 'Cakes', bg: 'linear-gradient(135deg, #AF69EE, #8A2BE2)' },
    { id: 'buffets', label: 'Buffets 🍲', cuisine: 'Mughlai', bg: 'linear-gradient(135deg, #10B981, #059669)' }
  ];

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

  // Generate dynamic extended mock menus for each kitchen to guarantee 4-5 items
  const getExtendedKitchenMenu = (kitchen) => {
    const baseItems = dishes.filter(d => d.kitchen.toLowerCase() === kitchen.name.toLowerCase());
    const extraItems = [];
    
    if (kitchen.id === 'lapinoz') {
      extraItems.push(
        { id: 'lapinoz-pasta', name: 'Creamy White Sauce Penne', rating: '4.7', reviews: '340', price: 189, badge: 'Popular', img: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400', tags: ['Cheesy', 'all'] },
        { id: 'lapinoz-bruschetta', name: 'Tomato Basil Bruschetta', rating: '4.5', reviews: '120', price: 129, badge: 'Veggies', img: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?w=400', tags: ['Healthy', 'all'] },
        { id: 'lapinoz-lasagna', name: 'Baked Veg Lasagna', rating: '4.8', reviews: '550', price: 279, badge: 'Mascot Fav', img: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400', tags: ['Cheesy', 'all'] }
      );
    } else if (kitchen.id === 'bongdum') {
      extraItems.push(
        { id: 'bongdum-kebab', name: 'Mutton Seekh Kebab', rating: '4.9', reviews: '820', price: 299, badge: 'Bestseller', img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', tags: ['Spicy', 'all'] },
        { id: 'bongdum-phirni', name: 'Kesar Phirni Sweet', rating: '4.7', reviews: '410', price: 89, badge: 'Dessert', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', tags: ['Sweet', 'all'] },
        { id: 'bongdum-rumali', name: 'Rumali Roti (2 pcs)', rating: '4.4', reviews: '200', price: 49, badge: 'Soft Bread', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', tags: ['Comfort', 'all'] }
      );
    } else if (kitchen.id === 'noodlebowl') {
      extraItems.push(
        { id: 'noodlebowl-dimsum', name: 'Steamed Chicken Dimsums (6 pcs)', rating: '4.8', reviews: '1.5k', price: 159, badge: 'Trending', img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400', tags: ['Comfort', 'all'] },
        { id: 'noodlebowl-bao', name: 'Fluffy BBQ Pork Bao', rating: '4.6', reviews: '640', price: 179, badge: 'Hot Seller', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', tags: ['Comfort', 'all'] },
        { id: 'noodlebowl-padthai', name: 'Classic Prawn Pad Thai Noodles', rating: '4.7', reviews: '990', price: 249, badge: 'Classic', img: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', tags: ['Spicy', 'all'] }
      );
    } else if (kitchen.id === 'greenlean') {
      extraItems.push(
        { id: 'greenlean-shake', name: 'Whey Protein Keto Shake', rating: '4.5', reviews: '230', price: 149, badge: 'Workout Active', img: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400', tags: ['Healthy', 'all'] },
        { id: 'greenlean-wrap', name: 'Tofu Peanut Butter Wrap', rating: '4.6', reviews: '190', price: 169, badge: 'Lean Veg', img: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400', tags: ['Healthy', 'all'] },
        { id: 'greenlean-chia', name: 'Chia Seed Pudding Bowl', rating: '4.4', reviews: '110', price: 119, badge: 'Fiber Rich', img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400', tags: ['Healthy', 'all'] }
      );
    } else if (kitchen.id === 'dessertheaven') {
      extraItems.push(
        { id: 'dessertheaven-crepe', name: 'Nutella Strawberry Crepe', rating: '4.8', reviews: '760', price: 169, badge: 'Sweet Tooth', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', tags: ['Sweet', 'all'] },
        { id: 'dessertheaven-shake', name: 'Monster Oreo Shake', rating: '4.7', reviews: '980', price: 149, badge: 'Kids Fav', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', tags: ['Sweet', 'all'] }
      );
    } else {
      extraItems.push(
        { id: 'extra-naan', name: 'Butter Garlic Naan Bread', rating: '4.8', reviews: '1.2k', price: 59, badge: 'Hot Flatbread', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', tags: ['Comfort', 'all'] },
        { id: 'extra-lassi', name: 'Creamy Sweet Kesar Lassi', rating: '4.6', reviews: '340', price: 79, badge: 'Refreshing', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', tags: ['Sweet', 'all'] },
        { id: 'extra-tandoori', name: 'Tandoori Murgh Full', rating: '4.9', reviews: '1.1k', price: 399, badge: 'Mascot Pick', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', tags: ['Spicy', 'all'] }
      );
    }
    
    const merged = [...baseItems];
    extraItems.forEach(item => {
      if (!merged.some(m => m.id === item.id)) {
        merged.push(item);
      }
    });
    return merged;
  };

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    setCollectionFilter(null);
    if (query && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 4)]);
    }
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
      
    const matchesCollection = !collectionFilter || 
      kitchen.cuisines.toLowerCase().includes(collectionFilter.cuisine.toLowerCase());

    const matchesApproved = !filterApprovedOnly || kitchen.approved;
    const matchesDiscount = !filterDiscountOnly || kitchen.approved; // Approved spots have FLAT 30% OFF
    const matchesCuisine = filterCuisineType === 'All' || 
      kitchen.cuisines.toLowerCase().includes(filterCuisineType.toLowerCase());

    const costForTwo = 600; 
    const matchesPrice = costForTwo <= filterMaxPrice;

    return matchesSearch && matchesCollection && matchesApproved && matchesDiscount && matchesCuisine && matchesPrice;
  });

  const sortedKitchens = [...filteredKitchens].sort((a, b) => {
    if (sortBy === 'rating') return parseFloat(b.rating) - parseFloat(a.rating);
    if (sortBy === 'distance') {
      const distA = parseFloat(a.distance);
      const distB = parseFloat(b.distance);
      return distA - distB;
    }
    return 0;
  });

  const kitchenDishes = selectedKitchen ? getExtendedKitchenMenu(selectedKitchen) : [];

  const handleCategoryClick = (category) => {
    if (category === 'Food') {
      onNavigate('home');
    } else if (category === 'Wizard') {
      onNavigate('wizard');
    } else if (category === 'Crav DNA') {
      onNavigate('cravdna');
    }
  };

  const handleBookTableClick = (e, kitchen) => {
    e.stopPropagation();
    setBookingKitchen(kitchen);
    setBookingGuests(2);
    setBookingDate('Today');
    setBookingTime('8:30 PM');
  };

  const submitTableBooking = () => {
    const randomId = `CB-${Math.floor(1000 + Math.random() * 9000)}`;
    onAddBooking({
      id: randomId,
      kitchenName: bookingKitchen.name,
      guests: bookingGuests,
      date: bookingDate,
      time: bookingTime,
      status: 'Confirmed',
      img: bookingKitchen.img
    });
    setBookingKitchen(null);
  };

  const resetFilters = () => {
    setFilterApprovedOnly(false);
    setFilterDiscountOnly(false);
    setFilterCuisineType('All');
    setFilterMaxPrice(800);
    setDietFilter('All');
    setSearchQuery('');
    setCollectionFilter(null);
    onTriggerNotification("♻️ Filter preferences reset!");
    setShowFilterDialog(false);
  };

  return (
    <div className="swiggy-home-container dineout-portal-root" style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden', background: 'white' }}>
      
      {/* Header section */}
      <div className="swiggy-purple-section" style={{ width: '100%', boxSizing: 'border-box' }}>
        
        {/* Dynamic Location Picker */}
        <div className="swiggy-black-location-picker" style={{ width: '100%', boxSizing: 'border-box' }}>
          <div className="black-loc-left" onClick={handleLocationClick}>
            <div className="loc-title-row">
              <i className="fa-solid fa-location-dot location-pin-white"></i>
              <span className="loc-bold-title">Home</span>
              <i className="fa-solid fa-chevron-down location-arrow-white"></i>
            </div>
            <span className="black-location-text">{location}</span>
          </div>
          
          <div className="black-loc-right-tools">
            <div className="wallet-circle-btn" onClick={() => onTriggerNotification("💳 Wallet Balance: ₹340.00")}>
              <i className="fa-solid fa-wallet"></i>
            </div>
          </div>
        </div>

        {/* Category Switcher Tabs */}
        <div className="swiggy-categories-carousel" style={{ width: '100%', boxSizing: 'border-box' }}>
          {[
            { id: 'Food', label: 'Food', emoji: '🍔' },
            { id: 'Wizard', label: 'Wizard', emoji: '🪄', badge: 'AI' },
            { id: 'Dineout', label: 'Dineout', emoji: '🍽️' },
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

      {!selectedKitchen ? (
        // LISTINGS PAGE
        <>
          <div 
            className="swiggy-organic-container kitchens-organic-container" 
            style={{ 
              paddingBottom: '24px', 
              width: '100%', 
              maxWidth: '100%', 
              boxSizing: 'border-box', 
              overflowX: 'hidden',
              borderBottomLeftRadius: '40px',
              borderBottomRightRadius: '40px'
            }}
          >
            {/* Guide Greeting Card */}
            <div className="dineout-greeting-card" style={{
              background: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{ fontSize: '32px' }}>🤵‍♂️</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#B5FF38' }}>Chef Blobby's Dineout Guide</p>
                <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.3' }}>
                  "Dine in style! Reserve premium tables for free and grab up to 40% OFF bills! 🥂"
                </p>
              </div>
            </div>

            {/* Dynamic Search Bar */}
            <div className="swiggy-search-row" style={{ margin: '0 0 16px 0', width: '100%', boxSizing: 'border-box' }}>
              <div className="swiggy-search-capsule" style={{ width: '100%', padding: '0 16px', display: 'flex', alignItems: 'center', boxSizing: 'border-box' }}>
                <i className="fa-solid fa-magnifying-glass search-icon-pink" style={{ marginRight: '10px' }}></i>
                <input 
                  type="text" 
                  placeholder="Search dining spots, cuisines, and offers..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCollectionFilter(null);
                  }}
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

            {/* Curated Collections Horizontal Scroll */}
            {!searchQuery && (
              <div className="dineout-collections-section" style={{ marginBottom: '20px', width: '100%', boxSizing: 'border-box' }}>
                <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>CURATED DINEOUT COLLECTIONS 💎</span>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'none', width: '100%', boxSizing: 'border-box' }} className="swiggy-restaurants-scroll">
                  {diningCollections.map((col) => (
                    <div
                      key={col.id}
                      onClick={() => {
                        if (collectionFilter?.id === col.id) {
                          setCollectionFilter(null);
                          onTriggerNotification("Cleared collection filter");
                        } else {
                          setCollectionFilter(col);
                          onTriggerNotification(`Showing collections for: ${col.label}`);
                        }
                      }}
                      style={{
                        flex: '0 0 auto',
                        background: col.bg,
                        border: collectionFilter?.id === col.id ? '2.5px solid #B5FF38' : '1px solid rgba(255, 255, 255, 0.2)',
                        padding: '12px 18px',
                        borderRadius: '20px',
                        color: 'white',
                        fontWeight: '800',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
                        minWidth: '110px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>{col.label}</span>
                      <span style={{ fontSize: '9px', opacity: 0.7, fontWeight: '700', marginTop: '2px' }}>Explore ➜</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filters Row */}
            <div className="filters-control-panel-row" style={{ width: '100%', boxSizing: 'border-box', margin: 0, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              
              {/* Filter Dialogue Toggle Button */}
              <button 
                onClick={() => setShowFilterDialog(true)}
                style={{
                  background: 'white',
                  border: '1px solid #D1D5DB',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: '800',
                  color: '#3A3A3C',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fa-solid fa-sliders"></i> Advanced Filters
                {(filterApprovedOnly || filterDiscountOnly || filterCuisineType !== 'All' || filterMaxPrice < 800) && (
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E6005C' }}></span>
                )}
              </button>

              {/* Sort Selector */}
              <select 
                value={sortBy} 
                onChange={(e) => {
                  setSortBy(e.target.value);
                  onTriggerNotification(`Sorting by ${e.target.value === 'rating' ? 'Top Rated' : 'Nearest'}`);
                }}
                className="kitchens-sort-select"
                style={{ padding: '8px 12px', fontSize: '12px', border: '1px solid #D1D5DB', borderRadius: '12px', fontWeight: '800' }}
              >
                <option value="rating">Sort: Top Rated ⭐</option>
                <option value="distance">Sort: Nearest 📍</option>
              </select>

              {/* Diet Pills */}
              {['All', 'Vegan', 'LowCarb'].map(diet => (
                <button
                  key={diet}
                  onClick={() => {
                    setDietFilter(diet);
                    onTriggerNotification(`Filtered by diet preference: ${diet}`);
                  }}
                  className={`kitchens-diet-pill ${dietFilter === diet ? 'active' : ''}`}
                  style={{ padding: '8px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', border: '1px solid #D1D5DB', background: dietFilter === diet ? '#FFF0F5' : 'white', color: dietFilter === diet ? '#E6005C' : '#3A3A3C' }}
                >
                  {diet === 'All' ? 'All Diets' : diet}
                </button>
              ))}
            </div>
          </div>

          {/* White Listings Container */}
          <div 
            className="dineout-listings-white-container" 
            style={{ 
              background: 'white', 
              padding: '24px 16px 100px 16px', 
              width: '100%', 
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            {/* Search Results (Dishes) */}
            {searchQuery && (
              <div className="search-results-dishes-holder" style={{ width: '100%', boxSizing: 'border-box' }}>
                <div className="section-headline-bar">
                  <h3 style={{ color: '#1C1C1E', fontFamily: 'Fredoka, sans-serif', fontSize: '18px', fontWeight: '800' }}>Dishes You Can Order ({filteredDishes.length})</h3>
                </div>
                {filteredDishes.length === 0 ? (
                  <p style={{ fontSize: '12.5px', color: '#6F6F6F', padding: '10px 0' }}>No dishes match your search.</p>
                ) : (
                  <div className="dineout-menu-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
                    {filteredDishes.map(dish => (
                      <div 
                        className="swiggy-restaurant-card" 
                        key={dish.id}
                        onClick={() => onOpenDishDetails(dish)}
                        style={{ width: '100%', margin: '0', background: 'white', borderRadius: '20px', border: '1px solid #EAEAEA', boxSizing: 'border-box' }}
                      >
                        <div className="swiggy-card-img-frame" style={{ height: '110px' }}>
                          <img src={dish.img} className="swiggy-card-img" alt={dish.name} />
                          {dish.badge && <div className="swiggy-card-one-badge" style={{ background: '#FF5E7E' }}>{dish.badge}</div>}
                          
                          {/* Plus Add Button */}
                          <button 
                            className="swiggy-card-heart-btn"
                            style={{ background: 'white', color: '#E6005C', border: '1px solid rgba(230, 0, 92, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddDish(dish);
                            }}
                          >
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>

                        <div className="swiggy-card-details" style={{ padding: '10px' }}>
                          <h4 className="swiggy-card-restaurant-name" style={{ fontSize: '13px', color: '#1c1c1e' }}>{dish.name}</h4>
                          <div className="swiggy-card-rating-row" style={{ marginTop: '4px' }}>
                            <div className="swiggy-card-star-badge" style={{ padding: '2px 6px', fontSize: '9px' }}>
                              <i className="fa-solid fa-star"></i>
                              <span>{dish.rating}</span>
                            </div>
                            <span className="swiggy-card-price" style={{ fontSize: '13px', marginLeft: 'auto', fontWeight: '800' }}>₹{dish.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Premium Dining spots Grid */}
            <div>
              <div className="section-headline-bar" style={{ width: '100%', boxSizing: 'border-box', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ color: '#1C1C1E', fontFamily: 'Fredoka, sans-serif', fontSize: '18px', fontWeight: '800', margin: 0 }}>
                  {collectionFilter ? `Collection: ${collectionFilter.label}` : searchQuery ? `Dining Spots (${sortedKitchens.length})` : `Premium Dining Spots`}
                </h3>
                <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#8E8E93' }}>{sortedKitchens.length} nearby</span>
              </div>

              {sortedKitchens.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', border: '1px dashed #E5E7EB', borderRadius: '24px' }}>
                  <span style={{ fontSize: '32px' }}>🔍</span>
                  <h4 style={{ margin: '8px 0 4px 0', fontSize: '14.5px', fontWeight: '800' }}>No dining spots match filters</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#8E8E93' }}>Try adjusting advanced filters or search tags.</p>
                  <button onClick={resetFilters} style={{ marginTop: '12px', padding: '8px 16px', background: '#E6005C', color: 'white', border: 'none', borderRadius: '12px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="dineout-restaurant-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
                  {sortedKitchens.map(kitchen => (
                    <div 
                      className="swiggy-restaurant-card dineout-card" 
                      key={kitchen.id}
                      onClick={() => {
                        setSelectedKitchenId(kitchen.id);
                        setDetailSubTab('dineout');
                      }}
                      style={{ width: '100%', margin: '0', background: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid #EAEAEA', boxSizing: 'border-box', cursor: 'pointer' }}
                    >
                      <div className="swiggy-card-img-frame" style={{ height: '150px' }}>
                        <img src={kitchen.img} className="swiggy-card-img" alt={kitchen.name} />
                        
                        {kitchen.approved && (
                          <div className="swiggy-card-one-badge" style={{ background: 'linear-gradient(135deg,#10B981,#059669)', letterSpacing: '0.3px', fontWeight: '800' }}>
                            ✓ MASCOT APPROVED
                          </div>
                        )}
                        
                        <div className="swiggy-card-discount-banner" style={{ background: 'linear-gradient(90deg, #E6005C, #FF4D88)', fontWeight: '800' }}>
                          🎁 FLAT 30% OFF Bill via Cravlings Pay
                        </div>
                      </div>

                      <div className="swiggy-card-details" style={{ padding: '14px', boxSizing: 'border-box' }}>
                        <div className="swiggy-card-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <h4 className="swiggy-card-restaurant-name" style={{ fontSize: '15px', fontWeight: '800', color: '#1C1C1E', margin: 0, flex: 1, minWidth: 0 }}>{kitchen.name}</h4>
                          <div className="swiggy-card-star-badge" style={{ background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', gap: '3px', borderRadius: '8px', padding: '3px 8px', fontSize: '11px', fontWeight: '800', flexShrink: 0 }}>
                            <span>{kitchen.rating}</span>
                            <i className="fa-solid fa-star" style={{ fontSize: '9px' }}></i>
                          </div>
                        </div>

                        <div className="swiggy-card-cuisine" style={{ color: '#6F6F6F', fontSize: '12px', marginTop: '4px' }}>
                          {kitchen.cuisines}
                        </div>

                        <div className="dineout-meta-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 10px', alignItems: 'center', fontSize: '11.5px', color: '#777', marginTop: '8px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '8px', width: '100%' }}>
                          <span>📍 {kitchen.distance}</span>
                          <span style={{ opacity: 0.3 }}>•</span>
                          <span>💰 ₹600 for two</span>
                        </div>

                        {/* Booking CTA */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', width: '100%' }}>
                          <button
                            onClick={(e) => handleBookTableClick(e, kitchen)}
                            style={{
                              flex: 1.2,
                              background: '#E6005C',
                              color: 'white',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '10px',
                              fontWeight: '800',
                              fontSize: '12.5px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              boxShadow: '0 4px 12px rgba(230, 0, 92, 0.2)'
                            }}
                          >
                            <i className="fa-regular fa-calendar-check"></i> Book Table 🍽
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedKitchenId(kitchen.id);
                              setDetailSubTab('menu');
                            }}
                            style={{
                              flex: 1,
                              background: '#F3F4F6',
                              color: '#1C1C1E',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '10px',
                              fontWeight: '800',
                              fontSize: '12.5px',
                              cursor: 'pointer'
                            }}
                          >
                            Browse Menu
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        // RESTAURANT DETAILS & MENU VIEW
        <div 
          className="kitchen-details-view dineout-details-view" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px', 
            width: '100%', 
            boxSizing: 'border-box', 
            background: 'white',
            padding: '20px 16px 100px 16px'
          }}
        >
          <button 
            className="kitchen-back-btn" 
            onClick={() => setSelectedKitchenId(null)} 
            style={{ 
              background: '#F3F4F6', 
              color: '#1C1C1E', 
              padding: '8px 16px', 
              borderRadius: '30px', 
              border: '1px solid rgba(0,0,0,0.06)', 
              width: 'fit-content',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Dineout Spots
          </button>
          
          <div className="kitchen-details-header-card" style={{ position: 'relative', overflow: 'hidden', padding: '16px', background: 'white', borderRadius: '28px', border: '1px solid rgba(0,0,0,0.06)', width: '100%', boxSizing: 'border-box' }}>
            <img src={selectedKitchen.img} alt={selectedKitchen.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '20px', marginBottom: '14px' }} />
            <div className="kitchen-detail-info-block" style={{ width: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1C1C1E', fontFamily: 'Fredoka, sans-serif', flex: 1 }}>{selectedKitchen.name}</h3>
                <div className="swiggy-card-star-badge" style={{ background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', gap: '3px', borderRadius: '8px', padding: '3px 8px', fontSize: '12px', fontWeight: '800', flexShrink: 0 }}>
                  <span>{selectedKitchen.rating}</span>
                  <i className="fa-solid fa-star" style={{ fontSize: '9px' }}></i>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '4px', margin: 0 }}>
                {selectedKitchen.cuisines}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', fontSize: '12px', color: '#555', marginTop: '8px', fontWeight: '700' }}>
                <span>📍 {selectedKitchen.distance}</span>
                <span style={{ opacity: 0.3 }}>•</span>
                <span>💰 ₹600 for two</span>
                <span style={{ opacity: 0.3 }}>•</span>
                <span style={{ color: '#E6005C' }}>Open 11 AM - 11 PM</span>
              </div>
            </div>
          </div>

          {/* Sub-Tab Selector */}
          <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: '16px', padding: '4px', gap: '4px', border: '1px solid rgba(0,0,0,0.05)', width: '100%', boxSizing: 'border-box' }}>
            <button 
              onClick={() => setDetailSubTab('dineout')}
              style={{
                flex: 1,
                background: detailSubTab === 'dineout' ? 'white' : 'transparent',
                color: detailSubTab === 'dineout' ? '#E6005C' : '#6F6F6F',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontWeight: '800',
                fontSize: '13.5px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🍽️ Dineout Booking
            </button>
            <button 
              onClick={() => setDetailSubTab('menu')}
              style={{
                flex: 1,
                background: detailSubTab === 'menu' ? 'white' : 'transparent',
                color: detailSubTab === 'menu' ? '#E6005C' : '#6F6F6F',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontWeight: '800',
                fontSize: '13.5px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🥡 Delivery Menu
            </button>
          </div>

          {/* SubTab 1: Dineout Booking */}
          {detailSubTab === 'dineout' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
              
              <div style={{
                background: 'linear-gradient(135deg, #1E1B4B, #312E81)',
                borderRadius: '24px',
                padding: '16px',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <span style={{ fontSize: '10px', background: '#E6005C', color: 'white', padding: '3px 8px', borderRadius: '20px', fontWeight: '800', letterSpacing: '0.5px' }}>DINEOUT DEALS</span>
                <h4 style={{ margin: '6px 0 4px 0', fontSize: '16px', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>Flat 25% Off on Bill Payment</h4>
                <p style={{ margin: 0, fontSize: '11.5px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.4' }}>
                  Pay your dining bill using Cravlings Pay to redeem this instant discount. Valid all days!
                </p>
              </div>

              {/* Table Booking Form */}
              <div style={{ background: 'white', borderRadius: '24px', padding: '20px', border: '1px solid rgba(0,0,0,0.06)', width: '100%', boxSizing: 'border-box' }}>
                <h4 style={{ margin: '0 0 14px 0', fontSize: '16px', fontWeight: '800', color: '#1C1C1E', fontFamily: 'Fredoka, sans-serif' }}>Reserve a Table Instantly</h4>
                
                {/* Guests */}
                <div style={{ marginBottom: '16px', width: '100%' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#888', display: 'block', marginBottom: '8px' }}>NUMBER OF GUESTS</span>
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', width: '100%', boxSizing: 'border-box' }}>
                    {[1, 2, 4, 6, 8, 10].map(n => (
                      <button
                        key={n}
                        onClick={() => setBookingGuests(n)}
                        style={{
                          flex: '0 0 auto',
                          background: bookingGuests === n ? '#E6005C' : '#F3F4F6',
                          color: bookingGuests === n ? 'white' : '#1C1C1E',
                          border: 'none',
                          borderRadius: '30px',
                          padding: '6px 16px',
                          fontSize: '12.5px',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        {n} Guest{n > 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div style={{ marginBottom: '16px', width: '100%' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#888', display: 'block', marginBottom: '8px' }}>SELECT DATE</span>
                  <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                    {['Today', 'Tomorrow', '18 Jul', '19 Jul'].map(d => (
                      <button
                        key={d}
                        onClick={() => setBookingDate(d)}
                        style={{
                          flex: 1,
                          background: bookingDate === d ? '#E6005C' : '#F3F4F6',
                          color: bookingDate === d ? 'white' : '#1C1C1E',
                          border: 'none',
                          borderRadius: '30px',
                          padding: '8px 0',
                          fontSize: '12.5px',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time */}
                <div style={{ marginBottom: '20px', width: '100%' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#888', display: 'block', marginBottom: '8px' }}>SELECT TIME SLOT</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', width: '100%' }}>
                    {['12:30 PM', '1:30 PM', '7:30 PM', '8:30 PM', '9:30 PM', '10:00 PM'].map(t => (
                      <button
                        key={t}
                        onClick={() => setBookingTime(t)}
                        style={{
                          background: bookingTime === t ? '#E6005C' : '#F3F4F6',
                          color: bookingTime === t ? 'white' : '#1C1C1E',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '8px 4px',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setBookingKitchen(selectedKitchen);
                    submitTableBooking();
                  }}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(90deg, #E6005C, #FF4D88)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '14px',
                    fontWeight: '800',
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 6px 18px rgba(230, 0, 92, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxSizing: 'border-box'
                  }}
                >
                  <i className="fa-regular fa-calendar-check"></i> Book Table for Free (+150 XP)
                </button>
              </div>

              {/* Ambience Gallery */}
              <div style={{ background: 'white', borderRadius: '24px', padding: '20px', border: '1px solid rgba(0,0,0,0.06)', width: '100%', boxSizing: 'border-box' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '800', color: '#1C1C1E', fontFamily: 'Fredoka, sans-serif' }}>Ambience & Food Photos</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', width: '100%' }}>
                  <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200" alt="Interior" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '12px' }} />
                  <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200" alt="Chef Special" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '12px' }} />
                  <img src="https://images.unsplash.com/photo-1559314809-0d155014e29e?w=200" alt="Vibe" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '12px' }} />
                </div>
              </div>
            </div>
          )}

          {/* SubTab 2: Delivery Menu */}
          {detailSubTab === 'menu' && (
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              <div className="section-headline-bar" style={{ marginTop: '10px', marginBottom: '14px' }}>
                <h3 style={{ color: '#1C1C1E', fontFamily: 'Fredoka, sans-serif', fontSize: '18px', fontWeight: '800', margin: 0 }}>Menu Items ({kitchenDishes.length})</h3>
              </div>

              {/* Menu items listing */}
              <div className="dineout-menu-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', gap: '14px', width: '100%', boxSizing: 'border-box' }}>
                {kitchenDishes.map(dish => (
                  <div 
                    className="swiggy-restaurant-card" 
                    key={dish.id}
                    onClick={() => onOpenDishDetails(dish)}
                    style={{ width: '100%', margin: '0', background: 'white', borderRadius: '20px', border: '1px solid #EAEAEA', boxSizing: 'border-box', cursor: 'pointer' }}
                  >
                    <div className="swiggy-card-img-frame" style={{ height: '110px' }}>
                      <img src={dish.img} className="swiggy-card-img" alt={dish.name} />
                      {dish.badge && <div className="swiggy-card-one-badge" style={{ background: '#FF5E7E' }}>{dish.badge}</div>}
                      
                      {/* Plus Add Button */}
                      <button 
                        className="swiggy-card-heart-btn"
                        style={{ background: 'white', color: '#E6005C', border: '1px solid rgba(230, 0, 92, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddDish(dish);
                        }}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>

                    <div className="swiggy-card-details" style={{ padding: '10px' }}>
                      <h4 className="swiggy-card-restaurant-name" style={{ fontSize: '13px', color: '#1c1c1e', margin: '0 0 4px 0' }}>{dish.name}</h4>
                      <div className="swiggy-card-rating-row" style={{ marginTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="swiggy-card-star-badge" style={{ padding: '2px 6px', fontSize: '9px', background: '#10B981', color: 'white', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <i className="fa-solid fa-star" style={{ fontSize: '8px' }}></i>
                          <span>{dish.rating}</span>
                        </div>
                        <span className="swiggy-card-price" style={{ fontSize: '13px', fontWeight: '800' }}>₹{dish.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Advanced Advanced Filter Dialog Modal */}
      {showFilterDialog && (
        <>
          <div className="drawer-backdrop" onClick={() => setShowFilterDialog(false)} style={{ zIndex: 9999 }}></div>
          <div className="cart-slide-drawer" style={{ zIndex: 10000, background: '#F9FAFB', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', padding: '24px 20px', boxSizing: 'border-box' }}>
            <div className="cart-drawer-header" style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>Advanced Filters</h3>
              <div className="cart-close-btn" onClick={() => setShowFilterDialog(false)}>
                <i className="fa-solid fa-xmark"></i>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Mascot Approved toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#1C1C1E', display: 'block' }}>Mascot Approved spots only</span>
                  <span style={{ fontSize: '11px', color: '#8E8E93' }}>Shows kitchens highly rated by Blobby.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={filterApprovedOnly}
                  onChange={(e) => setFilterApprovedOnly(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              {/* Discount Offer toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#1C1C1E', display: 'block' }}>Offers: Flat 30% OFF Deals</span>
                  <span style={{ fontSize: '11px', color: '#8E8E93' }}>Only show kitchens offering bill discount.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={filterDiscountOnly}
                  onChange={(e) => setFilterDiscountOnly(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              {/* Cuisine type dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#8E8E93' }}>CUISINE SELECTION</label>
                <select 
                  value={filterCuisineType}
                  onChange={(e) => setFilterCuisineType(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #D1D5DB', fontSize: '13px', fontWeight: '700' }}
                >
                  <option value="All">All Cuisines</option>
                  <option value="Pizza">Pizzas & Pastas</option>
                  <option value="Biryani">Biryani & Kebabs</option>
                  <option value="Ramen">Pan-Asian & Noodles</option>
                  <option value="Salad">Healthy Bowls</option>
                  <option value="Cake">Cakes & Sweet Treats</option>
                </select>
              </div>

              {/* Cost selector range */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '800', color: '#8E8E93' }}>
                  <span>MAX AVERAGE COST FOR TWO</span>
                  <span style={{ color: '#E6005C' }}>₹{filterMaxPrice}</span>
                </div>
                <input 
                  type="range" 
                  min="200" 
                  max="1000" 
                  step="100" 
                  value={filterMaxPrice}
                  onChange={(e) => setFilterMaxPrice(parseInt(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer', accentColor: '#E6005C' }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  onClick={resetFilters}
                  style={{ flex: 1, padding: '12px', border: '1px solid #E5E7EB', borderRadius: '14px', background: 'white', color: '#3A3A3C', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    onTriggerNotification("Applied advanced filters!");
                    setShowFilterDialog(false);
                  }}
                  style={{ flex: 1.5, padding: '12px', border: 'none', borderRadius: '14px', background: '#E6005C', color: 'white', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Table Booking Drawer */}
      {bookingKitchen && (
        <>
          <div className="drawer-backdrop" onClick={() => setBookingKitchen(null)} style={{ zIndex: 999 }}></div>
          <div className="cart-slide-drawer booking-drawer" style={{ zIndex: 1000, background: '#F9FAFB', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', padding: '24px 20px', boxSizing: 'border-box' }}>
            <div className="cart-drawer-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={bookingKitchen.img} alt={bookingKitchen.name} style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>Book a Table</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>at {bookingKitchen.name}</span>
                </div>
              </div>
              <div className="cart-close-btn" onClick={() => setBookingKitchen(null)}>
                <i className="fa-solid fa-xmark"></i>
              </div>
            </div>

            <div style={{ marginTop: '20px', boxSizing: 'border-box' }}>
              <div style={{ background: 'rgba(230,0,92,0.06)', borderRadius: '16px', padding: '12px', border: '1px solid rgba(230,0,92,0.1)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '20px' }}>🎟️</span>
                <span style={{ fontSize: '11.5px', color: '#E6005C', fontWeight: '800' }}>Includes: Flat 30% Off on total bill</span>
              </div>

              {/* Number of guests */}
              <div style={{ marginBottom: '16px', width: '100%' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#888', display: 'block', marginBottom: '8px' }}>NUMBER OF GUESTS</span>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', width: '100%', boxSizing: 'border-box' }}>
                  {[1, 2, 4, 6, 8, 10].map(n => (
                    <button
                      key={n}
                      onClick={() => setBookingGuests(n)}
                      style={{
                        flex: '0 0 auto',
                        background: bookingGuests === n ? '#E6005C' : 'white',
                        color: bookingGuests === n ? 'white' : '#1C1C1E',
                        border: bookingGuests === n ? 'none' : '1px solid rgba(0,0,0,0.08)',
                        borderRadius: '30px',
                        padding: '6px 16px',
                        fontSize: '12.5px',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      {n} Guest{n > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div style={{ marginBottom: '16px', width: '100%' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#888', display: 'block', marginBottom: '8px' }}>SELECT DATE</span>
                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  {['Today', 'Tomorrow', '18 Jul', '19 Jul'].map(d => (
                    <button
                      key={d}
                      onClick={() => setBookingDate(d)}
                      style={{
                        flex: 1,
                        background: bookingDate === d ? '#E6005C' : 'white',
                        color: bookingDate === d ? 'white' : '#1C1C1E',
                        border: bookingDate === d ? 'none' : '1px solid rgba(0,0,0,0.08)',
                        borderRadius: '30px',
                        padding: '8px 0',
                        fontSize: '12.5px',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time */}
              <div style={{ marginBottom: '24px', width: '100%' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#888', display: 'block', marginBottom: '8px' }}>SELECT TIME SLOT</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', width: '100%' }}>
                  {['12:30 PM', '1:30 PM', '7:30 PM', '8:30 PM', '9:30 PM', '10:00 PM'].map(t => (
                    <button
                      key={t}
                      onClick={() => setBookingTime(t)}
                      style={{
                        background: bookingTime === t ? '#E6005C' : 'white',
                        color: bookingTime === t ? 'white' : '#1C1C1E',
                        border: bookingTime === t ? 'none' : '1px solid rgba(0,0,0,0.08)',
                        borderRadius: '12px',
                        padding: '10px 0',
                        fontSize: '12.5px',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={submitTableBooking}
                style={{
                  width: '100%',
                  background: 'linear-gradient(90deg, #E6005C, #FF4D88)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '14px',
                  fontWeight: '800',
                  fontSize: '14.5px',
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(230, 0, 92, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxSizing: 'border-box'
                }}
              >
                <i className="fa-regular fa-calendar-check"></i> Secure My Free Table (+150 XP)
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
