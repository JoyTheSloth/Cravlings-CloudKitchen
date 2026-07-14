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
  pastOrders
}) {
  const [searchInput, setSearchInput] = useState('');
  
  // Custom timer states
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 18, seconds: 45 });
  const [mascotAnimationState, setMascotAnimationState] = useState('wave'); // wave, jump, idle
  const [mascotBubbleText, setMascotBubbleText] = useState("Let's find something cheesy! 🧀");

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 2, minutes: 18, seconds: 45 }; // Reset
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mascot waves on page load
  useEffect(() => {
    setMascotAnimationState('wave');
    const timer = setTimeout(() => {
      setMascotAnimationState('idle');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Change mascot speech bubble based on active mood tag
  const handleMoodChipSelect = (mood) => {
    setActiveMood(mood);
    const speechMap = {
      Cheesy: "Cheese pull incoming! Let's get something cheesy 🧀",
      Spicy: "Bring on the heat! Spicy basmati heat loading... 🌶️",
      Sweet: "Sugar rush! Chocolate cakes are calling us 🍩",
      Comfort: "Savory warmth. Hot ramen is perfect! 🍜",
      Healthy: "Keeping it clean and fresh! Salad vibes 🌱",
      Midnight: "Late night? I've got you covered with comforting snacks 🌙",
      Crunchy: "Crispy and crunchy starters! 🍗",
      Coffee: "Need caffeine energy? Warm beverages on the way ☕"
    };
    setMascotBubbleText(speechMap[mood] || "Let's feed our craving! 🍽️");
  };

  const handleMascotClick = () => {
    setMascotAnimationState('jump');
    onTriggerNotification("Blobby says: Yum! Feed me more! 😋");
    setMascotBubbleText("Yum! That feels amazing! Keep feeding me! 😋");
    setTimeout(() => {
      setMascotAnimationState('idle');
    }, 1200);
  };

  const handleSurpriseSpin = () => {
    const tags = ['Cheesy', 'Spicy', 'Sweet', 'Comfort', 'Healthy', 'Midnight', 'Crunchy', 'Coffee'];
    const randomTag = tags[Math.floor(Math.random() * tags.length)];
    handleMoodChipSelect(randomTag);
    onTriggerNotification(`🎲 Surprise Spin matched: ${randomTag}!`);
    
    // Choose a random dish matching the tag
    const matches = dishes.filter(d => d.tags.includes(randomTag));
    if (matches.length > 0) {
      const chosen = matches[Math.floor(Math.random() * matches.length)];
      setTimeout(() => {
        onOpenDishDetails(chosen);
      }, 500);
    }
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchInput.trim()) {
      onNavigate('wizard', searchInput.trim());
    }
  };

  return (
    <div className="viewport-content-panel home-mockup-layout">
      
      {/* 1. Mockup Hero Card Banner */}
      <div className="home-hero-banner-card">
        {/* Decorative background glow behind mascot */}
        <div className="hero-mascot-bg-glow"></div>

        <div className="hero-banner-left-side">
          <div className="hero-greeting-badge">
            <span style={{ marginRight: '6px' }}>👋</span>
            {getGreeting()}
          </div>

          <h1 className="hero-main-title">
            Hi <span className="highlight-text">Shivani!</span><br />
            What are you<br />
            <span className="highlight-text">craving</span> today? <span className="heart-sketch">🧡</span>
          </h1>

          <p className="hero-main-subtitle">
            Tell us your mood, we'll find the perfect meal for you. ✨
          </p>

          <form className="hero-search-speech-bubble" onSubmit={handleSearchSubmit}>
            <div className="speech-bubble-pointer"></div>
            <span className="search-sparkle-icon">✨</span>
            <input 
              type="text" 
              placeholder="I'm craving something..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="hero-search-input-box"
            />
            <button type="submit" className="hero-search-arrow-btn">
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </form>

          <div className="hero-search-ai-tip">
            <svg className="tip-arrow-sketch" viewBox="0 0 50 30" width="35" height="20">
              <path d="M 5,20 C 15,5 35,5 45,15 M 45,15 L 35,10 M 45,15 L 40,25" fill="none" stroke="var(--primary-coral)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>Try our AI magic ✨</span>
          </div>
        </div>

        <div className="hero-banner-right-side" onClick={handleMascotClick}>
          {/* Floating 3D Foods around mascot */}
          <div className="floating-food-item f-chili" style={{ animationDelay: '0.2s' }}>🌶️</div>
          <div className="floating-food-item f-choco" style={{ animationDelay: '0.6s' }}>🍫</div>
          <div className="floating-food-item f-burger" style={{ animationDelay: '1.2s' }}>🍔</div>
          <div className="floating-food-item f-boba" style={{ animationDelay: '0.8s' }}>🧋</div>
          <div className="floating-food-item f-donut" style={{ animationDelay: '1.5s' }}>🍩</div>
          <div className="floating-food-item f-bowl" style={{ animationDelay: '0.4s' }}>🍲</div>

          {/* Speech bubble above mascot */}
          <div className="mascot-interactive-speech-bubble">
            {mascotBubbleText}
          </div>

          {/* Mascot Image from cache */}
          <div className={`hero-3d-mascot-wrapper ${mascotAnimationState}`}>
            <img src="/chef_hero.png" className="hero-mascot-image-render" alt="Cravling Mascot" />
          </div>
        </div>
      </div>

      {/* 2. Bottom Actions Row (Moods + Main CTA) */}
      <div className="home-bottom-actions-row">
        
        {/* Left column: 6 Mood cards */}
        <div className="mood-cards-mockup-grid">
          {[
            { id: 'Cheesy', emoji: '🧀', label: 'Cheesy' },
            { id: 'Spicy', emoji: '🌶️', label: 'Spicy' },
            { id: 'Sweet', emoji: '🍫', label: 'Sweet' },
            { id: 'Comfort', emoji: '🍜', label: 'Comfort' },
            { id: 'Healthy', emoji: '🥗', label: 'Healthy' },
            { id: 'More', emoji: '⬜', label: 'More', isMore: true }
          ].map(mood => (
            <div 
              key={mood.id}
              className={`mood-card-badge-item ${activeMood === mood.id ? 'active' : ''}`}
              onClick={() => {
                if (mood.isMore) {
                  onNavigate('wizard');
                } else {
                  handleMoodChipSelect(mood.id);
                }
              }}
            >
              <div className="mood-badge-emoji-box">
                {mood.isMore ? (
                  <i className="fa-solid fa-ellipsis" style={{ fontSize: '20px', color: '#888' }}></i>
                ) : (
                  mood.emoji
                )}
              </div>
              <span className="mood-badge-label">{mood.label}</span>
            </div>
          ))}
        </div>

        {/* Right column: Large Feed My Craving primary gradient button */}
        <div className="feed-craving-large-gradient-cta" onClick={() => onNavigate('wizard')}>
          <div className="gradient-cta-inner">
            <div className="cta-left-icon">
              <svg className="serving-dome-svg-icon" viewBox="0 0 32 32" width="28" height="28">
                <path d="M 6,24 L 26,24 A 1,1 0 0,1 27,25 L 27,26 A 1,1 0 0,1 26,27 L 6,27 A 1,1 0 0,1 5,26 L 5,25 A 1,1 0 0,1 6,24 Z" fill="#FFFFFF" />
                <path d="M 16,7 A 2,2 0 0,1 18,9 A 2,2 0 0,1 16,11 A 2,2 0 0,1 14,9 A 2,2 0 0,1 16,7 Z" fill="#FFFFFF" />
                <path d="M 8,22 C 8,15.37 11.58,12 16,12 C 20.42,12 24,15.37 24,22 Z" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
              </svg>
            </div>
            <div className="cta-text-side">
              <span className="cta-primary-title">Feed My Craving</span>
              <span className="cta-secondary-desc">Let AI find your perfect meal</span>
            </div>
            <div className="cta-sparkle-effects">✨</div>
          </div>
        </div>

      </div>

      {/* 3. Today's Craving Signature Spotlight */}
      <div className="section-headline-bar">
        <h3>Today's Craving</h3>
      </div>
      <div 
        className="todays-craving-large-card"
        onClick={() => onOpenDishDetails(dishes.find(d => d.id === 'pizza'))}
      >
        <div className="card-left-info">
          <span className="todays-craving-tag">🔥 Signature Dish</span>
          <h2 className="todays-craving-title">Triple Cheese Pizza</h2>
          <span className="todays-craving-stats">
            <span style={{ color: '#FF6B57', marginRight: '4px' }}>🔥</span> 
            <strong>96% of Cravings</strong> loved this today
          </span>
        </div>
        
        {/* Overflowing Pizza Image */}
        <div className="card-pizza-image-holder">
          <img 
            src="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&auto=format&fit=crop" 
            alt="Triple Cheese Pizza Cheese Pull" 
          />
        </div>

        <button 
          className="todays-craving-add-btn-new"
          onClick={(e) => {
            e.stopPropagation();
            onAddDish(dishes.find(d => d.id === 'pizza'));
          }}
        >
          Add +
        </button>
      </div>

      {/* 6. Weather-Based Recommendation */}
      <div className="section-headline-bar" style={{ marginTop: '25px' }}>
        <h3>Climate Companion Match</h3>
      </div>
      <div className="weather-reco-box">
        {weather === 'rainy' ? (
          <div className="weather-reco-card-inner rainy">
            <div className="weather-bg-cloud cloud-1">☁️</div>
            <div className="weather-bg-cloud cloud-2">☁️</div>
            <div className="weather-card-left">
              <div className="weather-header-row">
                <div className="weather-icon-circle">☔</div>
                <div>
                  <span className="weather-title">RAINY MONSOON DAY</span>
                  <p className="weather-desc">Try warm, comforting bowls or custom sweet cocoa to keep cozy!</p>
                </div>
              </div>
              <div className="weather-pills-row">
                <button className="weather-pill-btn" onClick={() => onAddDish(dishes.find(d => d.id === 'comfort-ramen'))}>
                  🍜 Hot Ramen Vibes
                </button>
                <button className="weather-pill-btn" onClick={() => onAddDish(dishes.find(d => d.id === 'lava-cake'))}>
                  🍩 Sweet Lava Cake
                </button>
              </div>
            </div>
            {/* Chef Blobby Overlap */}
            <div className="weather-mascot-holder">
              <img src="/chef_hero.png" alt="Chef Blobby" />
            </div>
          </div>
        ) : (
          <div className="weather-reco-card-inner sunny">
            <div className="weather-bg-cloud cloud-1">☁️</div>
            <div className="weather-bg-cloud cloud-2">☁️</div>
            <div className="weather-card-left">
              <div className="weather-header-row">
                <div className="weather-icon-circle">☀️</div>
                <div>
                  <span className="weather-title">CLEAR SUNNY SKIES</span>
                  <p className="weather-desc">Perfect weather for a cheesy, hot and ultra-satisfying treat!</p>
                </div>
              </div>
              <div className="weather-pills-row">
                <button className="weather-pill-btn" onClick={() => onAddDish(dishes.find(d => d.id === 'pizza'))}>
                  🍕 Triple Cheese Vibes
                </button>
                <button className="weather-pill-btn" onClick={() => onAddDish(dishes.find(d => d.id === 'healthy-salad'))}>
                  🥑 Cheese Avocado Salad
                </button>
              </div>
            </div>
            {/* Chef Blobby Overlap */}
            <div className="weather-mascot-holder">
              <img src="/chef_hero.png" alt="Chef Blobby" />
            </div>
          </div>
        )}
      </div>

      {/* 7. Trending Cravings */}
      <div className="section-headline-bar" style={{ marginTop: '25px' }}>
        <h3>Trending Cravings</h3>
      </div>
      <div className="trending-cravings-list-new">
        {[
          { id: 'comfort-ramen', name: 'Korean Spicy Noodles', pct: '92%', count: '142 orders near you', emoji: '🍜', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop' },
          { id: 'pizza', name: 'Extra Cheesy Double Pizza', pct: '94%', count: '98 orders near you', emoji: '🍕', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop' },
          { id: 'lava-cake', name: 'Molten Chocolate Dessert', pct: '95%', count: '76 orders near you', emoji: '🍩', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop' }
        ].map((trend) => {
          const dishObj = dishes.find(d => d.id === trend.id) || dishes[0];
          const isFav = favorites.includes(trend.id);
          return (
            <div 
              key={trend.id} 
              className="trending-craving-card-new"
              onClick={() => onOpenDishDetails(dishObj)}
            >
              {/* Image Frame */}
              <div className="trend-image-frame">
                <img src={trend.img} alt={trend.name} />
                
                {/* Heart Overlay */}
                <button 
                  className={`trend-heart-btn ${isFav ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(trend.id);
                  }}
                >
                  <i className="fa-solid fa-heart"></i>
                </button>

                {/* Food Icon Overlay */}
                <div className="trend-food-icon-badge">
                  {trend.emoji}
                </div>

                {/* Hot/New Tag Overlay */}
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: 'rgba(255, 94, 126, 0.9)',
                  backdropFilter: 'blur(4px)',
                  color: '#FFFFFF',
                  fontSize: '9px',
                  fontWeight: '900',
                  padding: '3px 8px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  🔥 {dishObj.badge || 'Trending'}
                </span>
              </div>

              {/* Title & Info */}
              <h4 className="trend-card-title">{trend.name}</h4>
              
              {/* Source Kitchen & Rating details */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: '600' }}>
                  🏢 {dishObj.kitchen}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#FFA62B', fontWeight: '800' }}>
                  ⭐ {dishObj.rating}
                </span>
              </div>

              {/* Stats Row */}
              <div className="trend-card-stats-row">
                <span style={{ color: '#FF5E7E' }}>❤️</span>
                <span>{trend.pct} loved it</span>
                <span className="dot-divider">•</span>
                <span>⏱️ {dishObj.time}</span>
              </div>

              {/* Price & Add to Cart Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '14px',
                borderTop: '1px dashed rgba(229, 213, 197, 0.4)',
                paddingTop: '12px'
              }}>
                <span style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '17px', fontWeight: '800', color: 'var(--primary-coral)' }}>
                  ₹{dishObj.price}
                </span>
                <button 
                  className="trend-add-btn" 
                  style={{
                    background: 'var(--grad-coral)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(255, 94, 126, 0.15)',
                    transition: 'transform 0.2s',
                    fontFamily: 'Fredoka, sans-serif'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddDish(dishObj);
                  }}
                >
                  Add +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 8. Handpicked Dishes Grid */}
      <div className="section-headline-bar" style={{ marginTop: '30px' }}>
        <h3>Handpicked Cravings Near You</h3>
      </div>
      <div className="home-dishes-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '20px',
        marginTop: '15px',
        marginBottom: '30px'
      }}>
        {dishes.map((dish) => (
          <div 
            key={dish.id} 
            className="home-dish-card" 
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '1.5px solid #FDF0E9',
              padding: '12px',
              boxShadow: '0 8px 24px rgba(35, 35, 35, 0.02)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
            onClick={() => onOpenDishDetails && onOpenDishDetails(dish)}
          >
            {/* Dish Badge */}
            {dish.badge && (
              <span style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: 'var(--grad-orange)',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: '900',
                padding: '4px 10px',
                borderRadius: '30px',
                zIndex: 5,
                boxShadow: '0 4px 8px rgba(255, 166, 43, 0.2)'
              }}>
                {dish.badge}
              </span>
            )}

            {/* Dish Image */}
            <div style={{
              width: '100%',
              height: '140px',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
              background: '#FFF5F6'
            }}>
              <img 
                src={dish.img} 
                alt={dish.name} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
                className="home-dish-card-img"
              />
              {/* Rating Badge Overlay */}
              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(4px)',
                borderRadius: '30px',
                padding: '3px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '11px',
                fontWeight: '800',
                color: '#232323'
              }}>
                ⭐ {dish.rating}
              </div>
            </div>

            {/* Dish Details */}
            <div style={{ padding: '10px 4px 4px 4px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h4 style={{
                fontSize: '14.5px',
                fontWeight: '800',
                color: '#232323',
                margin: '0 0 4px 0',
                fontFamily: 'Fredoka, sans-serif'
              }}>{dish.name}</h4>
              
              <span style={{
                fontSize: '11.5px',
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: '10px'
              }}>{dish.kitchen}</span>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 'auto'
              }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: '800' }}>PRICE</span>
                  <span style={{ fontSize: '16px', fontWeight: '900', color: 'var(--primary-coral)' }}>🪙 {dish.price}</span>
                </div>
                
                <button 
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--grad-coral)',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(255, 94, 126, 0.3)',
                    transition: 'transform 0.2s ease'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddDish(dish);
                  }}
                  className="dish-add-to-cart-btn"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
