import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomeView from './components/HomeView';
import WizardView from './components/WizardView';
import KitchensView from './components/KitchensView';
import OrdersView from './components/OrdersView';
import WardrobeView from './components/WardrobeView';
import ProfileView from './components/ProfileView';
import DishDetailModal from './components/DishDetailModal';
import CheckoutModal from './components/CheckoutModal';

export default function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Core Game State
  const [coins, setCoins] = useState(1250);
  const [xp, setXp] = useState(240);
  const [xpMax, setXpMax] = useState(300);
  const [level, setLevel] = useState(12);
  const [streak, setStreak] = useState(7);
  const [purchasedAccessories, setPurchasedAccessories] = useState(['sunglasses']);
  const [equippedAccessories, setEquippedAccessories] = useState(['sunglasses']);
  const [speechText, setSpeechText] = useState("Let's find something cheesy! 🧀");
  
  // Craving DNA State
  const [cravingDNA, setCravingDNA] = useState({
    Cheesy: 42,
    Spicy: 28,
    Sweet: 15,
    Comfort: 10,
    Healthy: 5
  });

  // Navigation & Location
  const [currentTab, setCurrentTab] = useState('home');
  const [activeMood, setActiveMood] = useState('all');
  const [wizardQuery, setWizardQuery] = useState('');
  const [location, setLocation] = useState('Salt Lake, Kolkata');
  const [weather, setWeather] = useState('sunny');

  // Diet Preferences
  const [dietTags, setDietTags] = useState(['HighProtein']);

  // Cart & Order State
  const [cart, setCart] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [trackingStep, setTrackingStep] = useState(1);
  const [pastOrders, setPastOrders] = useState([
    { id: 'CR-4821', dish: 'Signature Sushi Roll', total: 349, date: 'Yesterday' },
    { id: 'CR-1049', dish: 'Warm Chocolate Lava Cake', total: 129, date: '3 days ago' }
  ]);

  // Gamified Missions
  const [missions, setMissions] = useState([
    { id: 'mission-1', task: '🌶 Try something spicy', reward: 100, completed: false },
    { id: 'mission-2', task: '🧀 Feed your Cravling Pizza', reward: 250, completed: false },
    { id: 'mission-3', task: '🍪 Gift a dessert sweet to Chef Blobby', reward: 300, completed: false }
  ]);

  // Saved Favorites (Heart list)
  const [favorites, setFavorites] = useState(['pizza', 'comfort-ramen']);

  // Modals & Drawers Toggles
  const [selectedDishDetails, setSelectedDishDetails] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  // Confetti / Notification animation states
  const [notificationText, setNotificationText] = useState('');
  const [notificationActive, setNotificationActive] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  // Fade out splash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const triggerNotification = (text) => {
    setNotificationText(text);
    setNotificationActive(true);
    setTimeout(() => {
      setNotificationActive(false);
    }, 3000);
  };

  const triggerConfetti = () => {
    setConfettiActive(true);
    setTimeout(() => {
      setConfettiActive(false);
    }, 3500);
  };

  // Helper to dynamically update DNA on clicks/orders
  const updateCravingDNA = (moodKey) => {
    const capitalizedMood = moodKey.charAt(0).toUpperCase() + moodKey.slice(1).toLowerCase();
    
    // Check if the mood matches one of the DNA keys
    if (cravingDNA.hasOwnProperty(capitalizedMood)) {
      setCravingDNA(prev => {
        const next = { ...prev };
        // Add weight
        next[capitalizedMood] = Math.min(100, next[capitalizedMood] + 6);
        
        // Normalize other keys to ensure sum = 100
        const otherKeys = Object.keys(next).filter(k => k !== capitalizedMood);
        const sumOthers = otherKeys.reduce((s, k) => s + next[k], 0);
        const targetOthers = 100 - next[capitalizedMood];

        if (sumOthers > 0) {
          otherKeys.forEach(k => {
            next[k] = Math.max(0, Math.round((next[k] / sumOthers) * targetOthers));
          });
        } else {
          // If all others were 0, distribute evenly
          const portion = Math.round(targetOthers / otherKeys.length);
          otherKeys.forEach(k => { next[k] = portion; });
        }
        
        // Final correction for rounding errors
        const finalSum = Object.values(next).reduce((s, v) => s + v, 0);
        if (finalSum !== 100) {
          const diff = 100 - finalSum;
          next[capitalizedMood] += diff;
        }

        return next;
      });
    }
  };

  // Switch location and trigger climate dialogue update
  const handleLocationChange = (newLoc, newWeather) => {
    setLocation(newLoc);
    setWeather(newWeather);

    if (newWeather === 'rainy') {
      setSpeechText("Rainy day? Let's stay in and grab a cozy bowl of Hot Ramen! 🍜");
      setActiveMood('Comfort');
      triggerNotification(`☔ Rainy climate in ${newLoc.split(',')[0]}!`);
    } else {
      setSpeechText("Nice sunny day! Let's get something cheesy! 🧀");
      setActiveMood('all');
      triggerNotification(`☀️ Sunny skies in ${newLoc.split(',')[0]}!`);
    }
    triggerConfetti();
  };

  // Toggle favorite dish
  const handleToggleFavorite = (dishId) => {
    if (favorites.includes(dishId)) {
      setFavorites(favorites.filter(id => id !== dishId));
      triggerNotification('Removed from Favorites');
    } else {
      setFavorites([...favorites, dishId]);
      triggerNotification('Added to Favorites! ❤️');
      triggerConfetti();
    }
  };

  // Add item directly to cart (no custom options)
  const handleAddDishDirectly = (dish) => {
    const existing = cart.find(item => item.dish.id === dish.id && item.extras.length === 0);
    if (existing) {
      setCart(cart.map(item => 
        (item.dish.id === dish.id && item.extras.length === 0) 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { dish, extras: [], quantity: 1, priceOverride: dish.price }]);
    }
    
    // Update Craving DNA on order
    const moodMap = { Pizza: 'Cheesy', Ramen: 'Comfort', Burger: 'Comfort', Salad: 'Healthy', Cake: 'Sweet', Biryani: 'Spicy' };
    const matchingMood = moodMap[dish.name.split(' ').pop()] || dish.tags[0];
    if (matchingMood) updateCravingDNA(matchingMood);

    triggerNotification(`Added ${dish.name} to cart! 🛒`);
    triggerConfetti();
  };

  // Add item customized from modal
  const handleAddCustomizedDish = (dish, extras, totalPrice) => {
    const existing = cart.find(item => 
      item.dish.id === dish.id && 
      item.extras.join('|') === extras.join('|')
    );

    if (existing) {
      setCart(cart.map(item => 
        (item.dish.id === dish.id && item.extras.join('|') === extras.join('|'))
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { dish, extras, quantity: 1, priceOverride: totalPrice }]);
    }

    // Update Craving DNA on customized order
    const moodMap = { Pizza: 'Cheesy', Ramen: 'Comfort', Burger: 'Comfort', Salad: 'Healthy', Cake: 'Sweet', Biryani: 'Spicy' };
    const matchingMood = moodMap[dish.name.split(' ').pop()] || dish.tags[0];
    if (matchingMood) updateCravingDNA(matchingMood);

    triggerNotification(`Added customized ${dish.name}! 🛒`);
    triggerConfetti();
  };

  // Alter cart item quantity
  const handleCartQtyChange = (dishId, extras, delta) => {
    const extrasJoined = extras.join('|');
    const existing = cart.find(item => item.dish.id === dishId && item.extras.join('|') === extrasJoined);
    if (!existing) return;

    if (existing.quantity + delta <= 0) {
      setCart(cart.filter(item => !(item.dish.id === dishId && item.extras.join('|') === extrasJoined)));
    } else {
      setCart(cart.map(item => 
        (item.dish.id === dishId && item.extras.join('|') === extrasJoined)
          ? { ...item, quantity: item.quantity + delta }
          : item
      ));
    }
  };

  // Checkout order placement success
  const handleCheckoutSuccess = (orderObject) => {
    setPastOrders([orderObject, ...pastOrders]);
    setActiveOrder(orderObject);
    setTrackingStep(1);
    setCart([]);
    setMobileCartOpen(false);
    
    // Award level rewards XP
    handleAwardXP(100);
    
    // Auto navigation to active tracking tab
    setCurrentTab('orders');
    triggerNotification("🚀 Order Placed Successfully!");
    triggerConfetti();
  };

  // Level XP increments
  const handleAwardXP = (amount) => {
    let newXp = xp + amount;
    let newLevel = level;
    let newCoins = coins + Math.round(amount / 2);

    if (newXp >= xpMax) {
      newLevel += 1;
      newXp -= xpMax;
      triggerConfetti();
      alert(`EVOLUTION LEVEL UP! 🌟 Your companion grew to Lvl ${newLevel}!`);
    }

    setXp(newXp);
    setLevel(newLevel);
    setCoins(newCoins);
  };

  // App routing navigate tab switcher
  const handleNavigate = (tabName, query = '') => {
    setCurrentTab(tabName);
    setWizardQuery(query);
    if (tabName === 'wizard' && !query) {
      setSpeechText("Let's narrow down your craving! Choose a step option below. 🪄");
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* A. Splash Loading Screen */}
      {showSplash && (
        <div className="app-screen-splash">
          <img src="/logo.png" className="splash-logo-img" alt="Cravlings Logo" style={{ width: '120px', height: '120px', objectFit: 'contain', borderRadius: '16px', marginBottom: '15px' }} />
          <p className="splash-tagline">Build Your Cravling. Feed Your Craving.</p>
        </div>
      )}

      {/* B. Confetti Overlay */}
      {confettiActive && (
        <div className="confetti-canvas-overlay">
          {/* Simple CSS simulated particle canvas overlay */}
          <div style={{ position: 'absolute', top: '10%', left: '20%', fontSize: '24px', animation: 'loaderPulse 2.5s ease infinite' }}>✨</div>
          <div style={{ position: 'absolute', top: '25%', left: '80%', fontSize: '28px', animation: 'loaderPulse 1.8s ease infinite' }}>🎉</div>
          <div style={{ position: 'absolute', top: '70%', left: '15%', fontSize: '22px', animation: 'loaderPulse 2.2s ease infinite' }}>🍿</div>
          <div style={{ position: 'absolute', top: '80%', left: '75%', fontSize: '26px', animation: 'loaderPulse 2.0s ease infinite' }}>🍪</div>
        </div>
      )}

      {/* C. Island Notifications Popup */}
      {notificationActive && (
        <div className="island-notification-popup" id="app-island-notification">
          <i className="fa-solid fa-circle-check" style={{ color: 'var(--primary-coral)' }}></i>
          <span id="notification-island-text">{notificationText}</span>
        </div>
      )}

      {/* D. Main Header Row */}
      {currentTab !== 'home' && currentTab !== 'wizard' && currentTab !== 'kitchens' && (
        <Header 
          coins={coins} 
          cartCount={totalCartCount} 
          location={location} 
          weather={weather}
          onLocationChange={handleLocationChange} 
          currentTab={currentTab}
          onNavigate={handleNavigate}
          onCartToggle={() => setMobileCartOpen(true)}
        />
      )}

      {/* E. Mobile Mascot Widget header drawer */}
      {currentTab === 'wardrobe' && (
        <div className="mobile-companion-evolution-widget-holder">
          <div style={{ padding: '10px 0' }}>
            <span style={{ fontSize: '13px', fontWeight: '800' }}>Blobby Evolution Preview</span>
          </div>
        </div>
      )}

      {/* F. Main Grid Frame */}
      <div className={`main-portal-wrapper ${currentTab === 'home' ? 'is-home-view' : ''} ${currentTab === 'kitchens' ? 'is-kitchens-view' : ''}`}>
        <main className={`portal-active-viewport ${currentTab === 'home' ? 'is-home-view' : ''} ${currentTab === 'kitchens' ? 'is-kitchens-view' : ''}`}>
          
          {currentTab === 'home' && (
            <HomeView 
              weather={weather}
              location={location}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onAddDish={handleAddDishDirectly}
              onNavigate={handleNavigate}
              onOpenDishDetails={setSelectedDishDetails}
              onTriggerNotification={triggerNotification}
              setSpeechText={setSpeechText}
              activeMood={activeMood}
              setActiveMood={setActiveMood}
              cravingDNA={cravingDNA}
              streak={streak}
              xp={xp}
              xpMax={xpMax}
              level={level}
              missions={missions}
              setMissions={setMissions}
              onAwardXP={handleAwardXP}
              pastOrders={pastOrders}
            />
          )}

          {currentTab === 'wizard' && (
            <WizardView 
              location={location}
              weather={weather}
              dietTags={dietTags}
              onAddDish={handleAddDishDirectly}
              onNavigate={handleNavigate}
              onOpenDishDetails={setSelectedDishDetails}
              searchQuery={wizardQuery}
              onTriggerNotification={triggerNotification}
              setSpeechText={setSpeechText}
              level={level}
            />
          )}

          {currentTab === 'kitchens' && (
            <KitchensView 
              location={location}
              level={level}
              onAddDish={handleAddDishDirectly}
              onOpenDishDetails={setSelectedDishDetails}
              onNavigate={handleNavigate}
              onTriggerNotification={triggerNotification}
            />
          )}

          {currentTab === 'orders' && (
            <OrdersView 
              activeOrder={activeOrder}
              pastOrders={pastOrders}
              onReorder={handleAddDishDirectly}
              location={location}
              trackingStep={trackingStep}
              setTrackingStep={setTrackingStep}
              onTriggerNotification={triggerNotification}
              setSpeechText={setSpeechText}
            />
          )}

          {currentTab === 'wardrobe' && (
            <WardrobeView 
              level={level}
              coins={coins}
              setCoins={setCoins}
              purchasedAccessories={purchasedAccessories}
              setPurchasedAccessories={setPurchasedAccessories}
              equippedAccessories={equippedAccessories}
              setEquippedAccessories={setEquippedAccessories}
              onTriggerNotification={triggerNotification}
              setSpeechText={setSpeechText}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView 
              dietTags={dietTags}
              setDietTags={setDietTags}
              missions={missions}
              setMissions={setMissions}
              onTriggerNotification={triggerNotification}
              onAwardXP={handleAwardXP}
              setSpeechText={setSpeechText}
              cravingDNA={cravingDNA}
              level={level}
              xp={xp}
              xpMax={xpMax}
              pastOrders={pastOrders}
              onAddDish={handleAddDishDirectly}
              location={location}
              onOpenDishDetails={setSelectedDishDetails}
            />
          )}

        </main>

        {/* Desktop sidebar - only on kitchens view */}
        {currentTab === 'kitchens' && (
          <Sidebar 
            level={level}
            xp={xp}
            xpMax={xpMax}
            equippedAccessories={equippedAccessories}
            speechText={speechText}
            cart={cart}
            onQuantityChange={handleCartQtyChange}
            onCheckout={() => setCheckoutOpen(true)}
            onNavigate={handleNavigate}
          />
        )}
      </div>

      {/* G. Mobile Slide-Up Cart Drawer */}
      {mobileCartOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setMobileCartOpen(false)}></div>
          <div className="cart-slide-drawer">
            <div className="cart-drawer-header">
              <h3>Cravings Cart 🛒</h3>
              <div className="cart-close-btn" onClick={() => setMobileCartOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </div>
            </div>
            
            <div className="cart-items-scroll">
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  Cart is empty. Discover dishes to load them.
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div className="sidebar-cart-item-row" key={`${item.dish.id}-${idx}`} style={{ marginBottom: '12px' }}>
                    <div>
                      <span className="sidebar-cart-item-name">{item.dish.name}</span>
                      <span className="sidebar-cart-item-price">₹{item.priceOverride}</span>
                    </div>
                    <div className="sidebar-cart-qty-ctrls">
                      <button className="sidebar-cart-qty-btn" onClick={() => handleCartQtyChange(item.dish.id, item.extras, -1)}>-</button>
                      <span className="sidebar-cart-qty-val">{item.quantity}</span>
                      <button className="sidebar-cart-qty-btn" onClick={() => handleCartQtyChange(item.dish.id, item.extras, 1)}>+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '900', marginBottom: '15px' }}>
                  <span>Estimated Total</span>
                  <span style={{ color: 'var(--primary-coral)' }}>
                    ₹{cart.reduce((sum, item) => sum + (item.priceOverride * item.quantity), 0) + 40 - Math.round(cart.reduce((sum, item) => sum + (item.priceOverride * item.quantity), 0) * 0.2)}
                  </span>
                </div>
                <button 
                  className="sidebar-cart-checkout-btn" 
                  style={{ width: '100%' }}
                  onClick={() => {
                    setCheckoutOpen(true);
                    setMobileCartOpen(false);
                  }}
                >
                  Confirm Order Checkout
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* H. Mobile Bottom Navigation Sticky Bar */}
      <nav className="app-sticky-bottom-nav swiggy-bottom-nav">
        <div 
          className={`bottom-nav-item-btn swiggy-nav-item ${currentTab === 'home' ? 'active' : ''}`}
          onClick={() => handleNavigate('home')}
        >
          <div className="swiggy-nav-icon-container">
            <i className="fa-solid fa-bowl-food swiggy-nav-icon"></i>
          </div>
          <span>Cravings</span>
        </div>
        
        <div 
          className={`bottom-nav-item-btn swiggy-nav-item ${mobileCartOpen ? 'active' : ''}`}
          onClick={() => setMobileCartOpen(true)}
        >
          <div className="swiggy-nav-icon-container">
            {totalCartCount > 0 && <span className="nav-badge-gear">{totalCartCount}</span>}
            <i className="fa-solid fa-cart-shopping swiggy-nav-icon"></i>
          </div>
          <span>Cart</span>
        </div>
        
        <div 
          className={`bottom-nav-item-btn swiggy-nav-item ${currentTab === 'orders' ? 'active' : ''}`}
          onClick={() => handleNavigate('orders')}
        >
          <div className="swiggy-nav-icon-container">
            <i className="fa-solid fa-receipt swiggy-nav-icon"></i>
          </div>
          <span>Orders</span>
        </div>
        
        <div 
          className={`bottom-nav-item-btn swiggy-nav-item ${currentTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleNavigate('profile')}
        >
          <div className="swiggy-nav-icon-container">
            <span className="nav-badge-lvl">LVL {level}</span>
            <i className="fa-solid fa-user swiggy-nav-icon"></i>
          </div>
          <span>Profile</span>
        </div>
      </nav>

      {/* Floating GET 75 Coupon Tag on bottom right */}
      <div 
        className="swiggy-floating-coupon-btn" 
        onClick={() => triggerNotification("🎟️ Promo Coupon Applied: GET ₹75 OFF on next checkout!")}
      >
        <span className="coupon-get">GET</span>
        <span className="coupon-value">₹75</span>
      </div>

      {/* I. Custom Dish Customize Detail Modal */}
      {selectedDishDetails && (
        <DishDetailModal 
          dish={selectedDishDetails}
          onClose={() => setSelectedDishDetails(null)}
          onAddToCart={handleAddCustomizedDish}
        />
      )}

      {/* J. Checkout Slide Modal */}
      <CheckoutModal 
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        location={location}
        onCheckoutSuccess={handleCheckoutSuccess}
      />
    </>
  );
}
