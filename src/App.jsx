import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomeView from './components/HomeView';
import WizardView from './components/WizardView';
import KitchensView from './components/KitchensView';
import OrdersView from './components/OrdersView';
import ProfileView from './components/ProfileView';
import CravDNAView from './components/CravDNAView';
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
  const [priceFilter, setPriceFilter] = useState(null);

  // Diet Preferences
  const [dietTags, setDietTags] = useState(['HighProtein']);

  // Cart & Order State
  const [cart, setCart] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [trackingStep, setTrackingStep] = useState(1);
  const [pastOrders, setPastOrders] = useState([
    { id: 'CR-4821', dish: 'Signature Sushi Roll', total: 349, date: 'Yesterday' },
    { id: 'CR-1049', dish: 'Warm Chocolate Lava Cake', total: 129, date: '3 days ago' },
    { id: 'CR-9021', dish: 'Cheesy Chicken Pizza', total: 249, date: '5 days ago' },
    { id: 'CR-3042', dish: 'Hyderabadi Chicken Biryani', total: 199, date: 'Last week' },
    { id: 'CR-7740', dish: 'Double Smash Burger', total: 269, date: '2 weeks ago' }
  ]);

  // Dineout Table Bookings State
  const [bookings, setBookings] = useState([
    { id: 'CB-1042', kitchenName: 'Spice Route Kitchen', guests: 2, date: 'Today', time: '8:30 PM', status: 'Confirmed', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop' },
    { id: 'CB-2039', kitchenName: "La Pino'z Cloud Kitchen", guests: 4, date: 'Tomorrow', time: '1:00 PM', status: 'Confirmed', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop' },
    { id: 'CB-4830', kitchenName: 'Noodle Bowl Co.', guests: 3, date: '18 Jul', time: '7:45 PM', status: 'Confirmed', img: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=crop' },
    { id: 'CB-9302', kitchenName: 'Green & Lean Kitchen', guests: 2, date: '20 Jul', time: '12:30 PM', status: 'Confirmed', img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop' },
    { id: 'CB-7731', kitchenName: 'Burger Lab', guests: 5, date: '22 Jul', time: '9:00 PM', status: 'Confirmed', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop' }
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
  const [unlockedCouponOpen, setUnlockedCouponOpen] = useState(false);

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
        <div className="confetti-canvas-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 999999,
          overflow: 'hidden'
        }}>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes fallConfetti {
              0% {
                transform: translateY(0) rotate(0deg) translateX(0);
                opacity: 1;
              }
              50% {
                transform: translateY(50vh) rotate(180deg) translateX(25px);
              }
              100% {
                transform: translateY(105vh) rotate(360deg) translateX(-25px);
                opacity: 0;
              }
            }
          `}} />
          {Array.from({ length: 60 }).map((_, idx) => {
            const colors = ['#FF5E7E', '#FFA62B', '#FFD54F', '#5FD38D', '#3B82F6', '#8B5CF6', '#EC4899'];
            const symbols = ['🎉', '✨', '🍬', '🎂', '🥳', '🎈', '⚡'];
            const left = Math.random() * 100;
            const delay = Math.random() * 2.5;
            const duration = 2 + Math.random() * 2.5;
            const size = 12 + Math.floor(Math.random() * 22);
            const color = colors[idx % colors.length];
            const isSymbol = idx % 5 === 0;
            const symbol = symbols[idx % symbols.length];
            
            return (
              <div 
                key={idx} 
                style={{
                  position: 'absolute',
                  top: '-40px',
                  left: `${left}%`,
                  fontSize: `${size}px`,
                  color: isSymbol ? undefined : color,
                  pointerEvents: 'none',
                  animation: `fallConfetti ${duration}s linear ${delay}s infinite`,
                  zIndex: 999999
                }}
              >
                {isSymbol ? symbol : '■'}
              </div>
            );
          })}
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
              priceFilter={priceFilter}
              setPriceFilter={setPriceFilter}
              onChangeLocation={handleLocationChange}
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
              onChangeLocation={handleLocationChange}
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
              bookings={bookings}
              onAddBooking={(newBooking) => {
                setBookings([newBooking, ...bookings]);
                handleAwardXP(150);
                triggerNotification(`Table Reservation Confirmed at ${newBooking.kitchenName}! 🍽️`);
                triggerConfetti();
              }}
              onChangeLocation={handleLocationChange}
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
              bookings={bookings}
              onCancelBooking={(id) => {
                setBookings(bookings.filter(b => b.id !== id));
                triggerNotification("Reservation cancelled successfully");
              }}
            />
          )}

          {currentTab === 'cravdna' && (
            <CravDNAView 
              dietTags={dietTags}
              setDietTags={setDietTags}
              onTriggerNotification={triggerNotification}
              cravingDNA={cravingDNA}
              level={level}
              xp={xp}
              xpMax={xpMax}
              coins={coins}
              setCoins={setCoins}
              purchasedAccessories={purchasedAccessories}
              setPurchasedAccessories={setPurchasedAccessories}
              equippedAccessories={equippedAccessories}
              setEquippedAccessories={setEquippedAccessories}
              setSpeechText={setSpeechText}
              location={location}
              onNavigate={handleNavigate}
              onChangeLocation={handleLocationChange}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView 
              onTriggerNotification={triggerNotification}
              level={level}
              xp={xp}
              xpMax={xpMax}
              location={location}
              onNavigate={handleNavigate}
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
            <i className="fa-solid fa-user swiggy-nav-icon"></i>
          </div>
          <span>Profile</span>
        </div>
      </nav>

      {/* Crav DNA half-pill floating shortcut on the right side */}
      <div 
        className={`crav-dna-side-pill ${currentTab === 'cravdna' ? 'active' : ''}`}
        onClick={() => handleNavigate('cravdna')}
        title="View Crav DNA"
      >
        <img src="/logoa.png" className="crav-dna-side-pill-img" alt="Crav DNA Mascot Logo" />
      </div>

      {/* Floating GET 75 Coupon Tag on bottom right */}
      <div 
        className="swiggy-floating-coupon-btn" 
        onClick={() => {
          triggerConfetti();
          setUnlockedCouponOpen(true);
        }}
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
        coins={coins}
        setCoins={setCoins}
      />

      {/* K. Coupon Unlock Birthday Modal */}
      {unlockedCouponOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setUnlockedCouponOpen(false)} style={{ zIndex: 99999 }}></div>
          <div 
            style={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '380px',
              background: '#FFFFFF',
              color: '#1C1C1E',
              borderRadius: '28px',
              padding: '24px',
              boxSizing: 'border-box',
              zIndex: 100000,
              boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
              border: '1.5px solid #FF5E7E',
              animation: 'scalePop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              textAlign: 'center'
            }}
          >
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes giftBounce {
                0%, 100% { transform: scale(1) translateY(0); }
                50% { transform: scale(1.1) translateY(-10px); }
              }
              @keyframes scalePop {
                from { transform: translate(-55%, -55%) scale(0.9); opacity: 0; }
                to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
              }
            `}} />

            <div style={{ fontSize: '60px', animation: 'giftBounce 2s infinite ease-in-out', marginBottom: '15px' }}>
              🎁
            </div>

            <h3 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '22px', color: '#FF5E7E', margin: '0 0 10px 0' }}>
              Congratulations! 🎉
            </h3>
            
            <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-charcoal)', margin: '0 0 16px 0' }}>
              You have unlocked a ₹75 Birthday Discount Coupon!
            </p>

            {/* Glowing ticket display */}
            <div 
              style={{
                background: '#FFF5ED',
                border: '2px dashed #FF5E7E',
                borderRadius: '16px',
                padding: '14px 20px',
                marginBottom: '20px',
                cursor: 'pointer'
              }}
              onClick={() => {
                navigator.clipboard.writeText('BDAY75');
                triggerNotification("📋 Copied code: BDAY75!");
              }}
              title="Click to copy coupon code"
            >
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>PROMO CODE</span>
              <span style={{ fontSize: '24px', fontWeight: '900', color: '#FF5E7E', letterSpacing: '2px' }}>BDAY75</span>
              <span style={{ fontSize: '11px', color: '#10B981', display: 'block', marginTop: '4px', fontWeight: '700' }}>✓ Click to copy code</span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4', margin: '0 0 20px 0' }}>
              Redeem this flat ₹75 OFF discount coupon during secure checkout. No minimum order limit!
            </p>

            <button 
              onClick={() => {
                navigator.clipboard.writeText('BDAY75');
                triggerNotification("📋 Copied code: BDAY75!");
                setUnlockedCouponOpen(false);
              }}
              style={{
                width: '100%',
                background: 'var(--grad-coral)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '12px',
                fontWeight: '800',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(255, 94, 126, 0.3)'
              }}
            >
              Got it, Chef! 🧑‍🍳
            </button>
          </div>
        </>
      )}
    </>
  );
}
