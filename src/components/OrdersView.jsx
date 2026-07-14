import React, { useState, useEffect } from 'react';
import { dishes } from '../data/dishes';

export default function OrdersView({ 
  activeOrder, 
  pastOrders, 
  onReorder, 
  location, 
  trackingStep, 
  setTrackingStep, 
  onTriggerNotification, 
  setSpeechText,
  bookings,
  onCancelBooking
}) {
  const [activeTab, setActiveTab] = useState(activeOrder ? 'active' : 'past');

  // Modals state
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedDirections, setSelectedDirections] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

  // Star rating input state
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  // 4 Default Live/Active Orders + User Checked out order
  const [activeOrdersList, setActiveOrdersList] = useState([
    { id: 'CR-9901', dish: 'Comfort Chicken Ramen', time: '15-20 mins', trackingStep: 2, status: 'Preparing', kitchen: 'Noodle Bowl Co.', total: 219 },
    { id: 'CR-9902', dish: 'Loaded Garlic Cheese Bread', time: '20-25 mins', trackingStep: 1, status: 'Confirmed', kitchen: "La Pino'z Cloud Kitchen", total: 119 },
    { id: 'CR-9903', dish: 'Tropical Acai Power Bowl', time: '5-10 mins', trackingStep: 3, status: 'On The Way', kitchen: 'Green & Lean Kitchen', total: 199 },
    { id: 'CR-9904', dish: 'Warm Chocolate Lava Cake', time: 'Delivered', trackingStep: 4, status: 'Delivered', kitchen: 'Dessert Heaven', total: 129 }
  ]);

  // Sync user checkout order into our list
  useEffect(() => {
    if (activeOrder) {
      const exists = activeOrdersList.some(o => o.id === activeOrder.id);
      if (!exists) {
        setActiveOrdersList([
          { 
            id: activeOrder.id, 
            dish: activeOrder.dish, 
            time: '15-20 mins', 
            trackingStep: trackingStep, 
            status: trackingStep === 1 ? 'Confirmed' : trackingStep === 2 ? 'Preparing' : trackingStep === 3 ? 'On The Way' : 'Delivered', 
            kitchen: 'Cravlings Cloud Hub', 
            total: activeOrder.total || 249 
          },
          ...activeOrdersList
        ]);
      } else {
        // Sync active status progress
        setActiveOrdersList(prev => prev.map(o => {
          if (o.id === activeOrder.id) {
            return {
              ...o,
              trackingStep,
              status: trackingStep === 1 ? 'Confirmed' : trackingStep === 2 ? 'Preparing' : trackingStep === 3 ? 'On The Way' : 'Delivered'
            };
          }
          return o;
        }));
      }
    }
  }, [activeOrder, trackingStep]);

  // Active step simulation
  useEffect(() => {
    if (activeOrder && trackingStep < 4) {
      const timer = setInterval(() => {
        const nextStep = trackingStep + 1;
        setTrackingStep(nextStep);
        if (nextStep === 2) {
          setSpeechText("Chef is assembling your dum-fresh cravings in the kitchen! 🧑‍🍳");
          onTriggerNotification("🧑‍🍳 Chef has started preparing your order!");
        } else if (nextStep === 3) {
          setSpeechText("Rider Vikram has picked up your cravings! ETA: 10 mins 🛵");
          onTriggerNotification("🛵 Rider Vikram picked up your order!");
        } else if (nextStep === 4) {
          setSpeechText(`Vikram has arrived right outside your door in ${location.split(',')[0]}! Enjoy! 😋`);
          onTriggerNotification("✅ Order Delivered successfully!");
        }
      }, 7000);

      return () => clearInterval(timer);
    }
  }, [activeOrder, trackingStep, location, setTrackingStep, setSpeechText, onTriggerNotification]);

  const handleDownloadInvoice = (order) => {
    setSelectedInvoice(order);
    onTriggerNotification(`📄 Opened invoice detail for Order #${order.id}`);
  };

  const handleOpenRating = (order) => {
    setSelectedRating(order);
    setRatingStars(5);
    setRatingComment('');
  };

  const submitRating = (e) => {
    e.preventDefault();
    onTriggerNotification(`⭐ Rated ${ratingStars} stars for ${selectedRating.dish || selectedRating.kitchenName}! Feedback recorded.`);
    setSelectedRating(null);
  };

  const showDirections = (booking) => {
    setSelectedDirections(booking);
    onTriggerNotification(`🗺️ Loaded navigation directions for ${booking.kitchenName}`);
  };

  return (
    <div className="viewport-content-panel" style={{ padding: '16px 16px 100px 16px', background: '#F8F9FA', boxSizing: 'border-box' }}>
      
      {/* Dynamic Header Top Bar */}
      <div className="orders-header-top-bar" style={{
        background: 'linear-gradient(135deg, #1E0B36 0%, #3D0C5A 100%)',
        padding: '20px 24px',
        borderRadius: '24px',
        color: 'white',
        marginBottom: '20px',
        boxShadow: '0 8px 24px rgba(61, 12, 90, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '800', color: '#B5FF38', letterSpacing: '1px' }}>Gamified Appetite Tracker</span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: '950', fontFamily: 'Fredoka, sans-serif' }}>My Cravings Activity</h3>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '14px', padding: '8px 12px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <i className="fa-solid fa-pizza-slice" style={{ color: '#B5FF38' }}></i>
          <span>{pastOrders.length + activeOrdersList.filter(o => o.trackingStep < 4).length + (bookings ? bookings.length : 0)} Total</span>
        </div>
      </div>

      <div className="order-tracking-layout" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Toggle Segment Tabs */}
        <div className="orders-tab-switcher-row">
          <button 
            className={`orders-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            <span>Live Tracker</span>
            <span className="active-order-badge-count" style={{ background: 'var(--primary-coral)' }}>
              {activeOrdersList.filter(o => o.trackingStep < 4).length}
            </span>
          </button>
          
          <button 
            className={`orders-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <span>Bookings 🍽️</span>
            {bookings && bookings.length > 0 && (
              <span className="active-order-badge-count" style={{ background: '#10B981' }}>{bookings.length}</span>
            )}
          </button>

          <button 
            className={`orders-tab-btn ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            <span>Past Orders</span>
            <span className="past-order-badge-count">{pastOrders.length}</span>
          </button>
        </div>

        {/* Tab content 1: Active Orders Tracker */}
        {activeTab === 'active' && (
          <div className="active-orders-pane" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeOrdersList.length > 0 ? (
              activeOrdersList.map(order => {
                const dishData = dishes.find(d => d.name.toLowerCase() === order.dish.toLowerCase());
                const dishImg = dishData ? dishData.img : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150';
                
                return (
                  <div 
                    key={order.id} 
                    className="tracker-active-panel" 
                    style={{ background: 'white', borderRadius: '24px', padding: '16px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', cursor: 'pointer' }}
                    onClick={() => setSelectedOrderDetail(order)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ 
                            fontSize: '9px', 
                            fontWeight: '800', 
                            padding: '2px 8px', 
                            borderRadius: '10px', 
                            background: order.trackingStep === 4 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(230, 0, 92, 0.1)', 
                            color: order.trackingStep === 4 ? '#10B981' : '#E6005C' 
                          }}>
                            {order.status.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '11px', color: '#8E8E93', fontWeight: '700' }}>#{order.id}</span>
                        </div>
                        <h4 style={{ margin: '4px 0 2px 0', fontSize: '14.5px', fontWeight: '800', color: '#1C1C1E', fontFamily: 'Fredoka, sans-serif' }}>{order.dish}</h4>
                        <p style={{ margin: 0, fontSize: '11.5px', color: '#8E8E93' }}>From: <b>{order.kitchen}</b></p>
                      </div>
                      <img src={dishImg} alt={order.dish} style={{ width: '46px', height: '46px', borderRadius: '12px', objectFit: 'cover' }} />
                    </div>

                    {/* Stepper Node Line */}
                    <div className="tracker-stepper-line" style={{ margin: '14px 0 6px 0' }}>
                      <div className={`tracker-stepper-node ${order.trackingStep >= 1 ? 'done' : ''}`}>
                        {order.trackingStep >= 1 ? '✓' : '1'}
                      </div>
                      <div className={`tracker-stepper-node ${order.trackingStep > 2 ? 'done' : order.trackingStep === 2 ? 'active' : ''}`}>
                        🍳
                      </div>
                      <div className={`tracker-stepper-node ${order.trackingStep > 3 ? 'done' : order.trackingStep === 3 ? 'active' : ''}`}>
                        🛵
                      </div>
                      <div className={`tracker-stepper-node ${order.trackingStep === 4 ? 'active' : ''}`}>
                        🎁
                      </div>
                    </div>

                    <div className="tracker-stepper-labels" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#8E8E93', fontWeight: '700' }}>
                      <span className={order.trackingStep >= 1 ? 'label-highlight' : ''}>Confirmed</span>
                      <span className={order.trackingStep >= 2 ? 'label-highlight' : ''}>Cooking</span>
                      <span className={order.trackingStep >= 3 ? 'label-highlight' : ''}>Enroute</span>
                      <span className={order.trackingStep === 4 ? 'label-highlight' : ''}>Arrived</span>
                    </div>

                    {/* Map Simulation Panel for active orders */}
                    {order.trackingStep < 4 && (
                      <div style={{ marginTop: '16px', background: '#F9FAFB', borderRadius: '16px', padding: '12px', border: '1px solid #F3F4F6' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', fontWeight: '800', marginBottom: '8px' }}>
                          <span style={{ color: '#1C1C1E' }}>🛵 Live Delivery Partner Vikram</span>
                          <span style={{ color: '#E6005C' }}>ETA: {order.time}</span>
                        </div>
                        <div className="map-visual-placeholder" style={{ height: '90px', borderRadius: '12px', position: 'relative', overflow: 'hidden', background: '#E3F2FD' }}>
                          <div className="map-destination-node" style={{ right: '15px', bottom: '15px' }}>🏠</div>
                          <div className="map-rider-node" style={{ 
                            position: 'absolute', 
                            left: order.trackingStep === 1 ? '15%' : order.trackingStep === 2 ? '40%' : '70%', 
                            top: '40%', 
                            transition: 'left 1.5s ease' 
                          }}>
                            <span className="rider-emoji">🛵</span>
                            <div className="rider-sonar-wave"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="empty-active-orders-box">
                <i className="fa-solid fa-pizza-slice empty-pizza-icon"></i>
                <h4>No live updates cooking</h4>
                <p>Satisfy your appetite via Cravings Wizard or discover dishes!</p>
              </div>
            )}
          </div>
        )}

        {/* Tab content 2: Dineout Reservations */}
        {activeTab === 'bookings' && (
          <div className="bookings-pane" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bookings && bookings.length > 0 ? (
              bookings.map(booking => (
                <div 
                  className="booking-card-item" 
                  key={booking.id}
                  style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '16px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <img 
                      src={booking.img} 
                      alt={booking.kitchenName} 
                      style={{ width: '70px', height: '70px', borderRadius: '16px', objectFit: 'cover' }} 
                    />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '9px', fontWeight: '800', padding: '2px 8px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                          ✓ RESERVED
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>#{booking.id}</span>
                      </div>
                      <h4 style={{ margin: '4px 0 2px 0', fontSize: '14.5px', fontWeight: '800', color: '#1C1C1E', fontFamily: 'Fredoka, sans-serif' }}>{booking.kitchenName}</h4>
                      <p style={{ margin: 0, fontSize: '12px', color: '#555', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="fa-regular fa-calendar" style={{ color: '#E6005C' }}></i> {booking.date}
                        <span style={{ opacity: 0.3 }}>|</span>
                        <i className="fa-regular fa-clock" style={{ color: '#E6005C' }}></i> {booking.time}
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#555', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
                        <i className="fa-solid fa-users" style={{ color: '#E6005C' }}></i> {booking.guests} Guests Table
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '12px' }}>
                    <button 
                      onClick={() => showDirections(booking)}
                      style={{
                        flex: 1,
                        background: '#FFF0F5',
                        color: '#E6005C',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '10px',
                        fontSize: '12.5px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <i className="fa-solid fa-location-arrow"></i> Directions
                    </button>
                    <button 
                      onClick={() => handleOpenRating(booking)}
                      style={{
                        background: 'white',
                        color: '#E6005C',
                        border: '1px solid #E6005C',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        fontSize: '12.5px',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      Rate Host
                    </button>
                    <button 
                      onClick={() => onCancelBooking(booking.id)}
                      style={{
                        background: 'transparent',
                        color: '#8E8E93',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '12px',
                        padding: '10px 12px',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-bookings-box" style={{ textAlign: 'center', padding: '40px 20px', background: 'white', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🍽️</div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '800', color: '#1C1C1E', fontFamily: 'Fredoka, sans-serif' }}>No active bookings</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Book tables at premium cloud kitchens / dining hubs using the Dineout tab!</p>
              </div>
            )}
          </div>
        )}

        {/* Tab content 3: Past Orders */}
        {activeTab === 'past' && (
          <div className="past-orders-pane">
            <div className="order-history-list" id="lbl-past-orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {pastOrders.length === 0 ? (
                <div className="empty-past-orders-box">
                  No past order history found.
                </div>
              ) : (
                pastOrders.map(order => {
                  const dishData = dishes.find(d => d.name.toLowerCase() === order.dish.toLowerCase());
                  const dishImg = dishData ? dishData.img : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150';
                  
                  return (
                    <div 
                      className="order-history-card" 
                      key={order.id} 
                      style={{ background: 'white', borderRadius: '24px', padding: '16px', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer' }}
                      onClick={() => setSelectedOrderDetail(order)}
                    >
                      <div className="history-card-header" style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        <img src={dishImg} className="history-dish-thumbnail" alt={order.dish} style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'cover' }} />
                        <div className="history-dish-details" style={{ flex: 1 }}>
                          <h5 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1C1C1E' }}>{order.dish}</h5>
                          <p className="history-order-meta" style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#8E8E93' }}>
                            Order #{order.id} • {order.date}
                          </p>
                        </div>
                        <span className="history-order-price" style={{ fontSize: '15px', fontWeight: '900', color: '#1C1C1E' }}>
                          ₹{order.total}
                        </span>
                      </div>

                      <div className="history-card-actions" style={{ display: 'flex', gap: '8px', borderTop: '1px solid #F3F4F6', marginTop: '12px', paddingTop: '10px' }} onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => handleDownloadInvoice(order)}
                          className="history-action-btn invoice-btn"
                          style={{ flex: 1, padding: '10px', background: '#F3F4F6', border: 'none', borderRadius: '12px', fontSize: '12px', fontWeight: '800', color: '#3A3A3C', cursor: 'pointer' }}
                        >
                          <i className="fa-solid fa-file-invoice" style={{ marginRight: '4px' }}></i> Receipt
                        </button>
                        <button 
                          onClick={() => handleOpenRating(order)}
                          className="history-action-btn rate-btn"
                          style={{ flex: 1, padding: '10px', background: '#FFF0F5', border: 'none', borderRadius: '12px', fontSize: '12px', fontWeight: '800', color: '#E6005C', cursor: 'pointer' }}
                        >
                          <i className="fa-solid fa-star" style={{ marginRight: '4px' }}></i> Rate
                        </button>
                        <button 
                          className="history-reorder-btn" 
                          onClick={() => onReorder(order)}
                          style={{ flex: 1.2, padding: '10px', background: '#E6005C', border: 'none', borderRadius: '12px', fontSize: '12px', fontWeight: '800', color: 'white', cursor: 'pointer' }}
                        >
                          <i className="fa-solid fa-rotate-right" style={{ marginRight: '4px' }}></i> Reorder
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

      </div>

      {/* Invoice Receipt Modal */}
      {selectedInvoice && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '28px', padding: '24px', width: '100%', maxWidth: '380px', border: '1px solid #E5E7EB', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px dashed #E5E7EB', paddingBottom: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '32px', marginBottom: '6px' }}>🧾</div>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '900', fontFamily: 'Fredoka, sans-serif' }}>CRAVLINGS RECEIPT</h4>
              <span style={{ fontSize: '11px', color: '#8E8E93' }}>Order ID: #{selectedInvoice.id}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#3A3A3C' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600' }}>{selectedInvoice.dish}</span>
                <span style={{ fontWeight: '800' }}>₹{selectedInvoice.total - 40}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.8 }}>
                <span>Delivery Partner Fee</span>
                <span>₹35.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.8 }}>
                <span>Cravings Platform Fee</span>
                <span>₹5.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: '700' }}>
                <span>DNA Companion Discount</span>
                <span>- ₹10.00</span>
              </div>
              <div style={{ borderTop: '1px dashed #E5E7EB', marginTop: '6px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '14.5px', fontWeight: '950', color: '#E6005C' }}>
                <span>Total Amount Paid</span>
                <span>₹{selectedInvoice.total}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#8E8E93', marginTop: '12px', textAlign: 'center' }}>
                Payment Status: SUCCESS (GPay Wallet)<br />
                Thank you for training Chef Blobby! 🦖
              </div>
            </div>

            <button 
              onClick={() => setSelectedInvoice(null)} 
              style={{ width: '100%', marginTop: '20px', padding: '12px', border: 'none', borderRadius: '14px', background: '#E6005C', color: 'white', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
            >
              Close Invoice
            </button>
          </div>
        </div>
      )}

      {/* Rate Host/Kitchen Modal */}
      {selectedRating && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={submitRating} style={{ background: 'white', borderRadius: '28px', padding: '24px', width: '100%', maxWidth: '380px', border: '1px solid #E5E7EB' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '32px' }}>⭐</div>
              <h4 style={{ margin: '6px 0 0 0', fontSize: '16px', fontWeight: '900', fontFamily: 'Fredoka, sans-serif' }}>Rate Experience</h4>
              <span style={{ fontSize: '11.5px', color: '#8E8E93' }}>For {selectedRating.dish || selectedRating.kitchenName}</span>
            </div>

            {/* Star Selector */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <i 
                  key={star} 
                  className={`fa-solid fa-star`} 
                  onClick={() => setRatingStars(star)}
                  style={{ fontSize: '26px', color: star <= ratingStars ? '#F59E0B' : '#E5E7EB', cursor: 'pointer' }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#8E8E93', textTransform: 'uppercase' }}>Comments</label>
              <textarea 
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="How was the food flavor, heat level, and presentation?"
                rows="3"
                style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                type="button"
                onClick={() => setSelectedRating(null)} 
                style={{ flex: 1, padding: '12px', border: '1px solid #E5E7EB', borderRadius: '14px', background: 'white', color: '#3A3A3C', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                style={{ flex: 1.5, padding: '12px', border: 'none', borderRadius: '14px', background: '#E6005C', color: 'white', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Directions Navigation Radar Modal */}
      {selectedDirections && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '28px', padding: '24px', width: '100%', maxWidth: '380px', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', borderBottom: '1px solid #E5E7EB', paddingBottom: '14px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FFF0F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-location-arrow" style={{ color: '#E6005C', fontSize: '16px' }}></i>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '900', fontFamily: 'Fredoka, sans-serif' }}>HOST LIVE RADER</h4>
                <span style={{ fontSize: '11px', color: '#8E8E93' }}>Booking Reference #{selectedDirections.id}</span>
              </div>
            </div>

            {/* Radar Navigation Map simulation */}
            <div className="map-visual-placeholder" style={{ height: '140px', borderRadius: '16px', position: 'relative', overflow: 'hidden', background: '#E8F5E9', marginBottom: '16px' }}>
              <div className="map-destination-node" style={{ right: '15px', bottom: '15px' }}>🍽️</div>
              <div className="map-destination-node" style={{ left: '15px', top: '15px' }}>👤</div>
              {/* Route line */}
              <svg width="100%" height="100%" opacity="0.6">
                <path d="M 35,35 Q 150,110 320,110" fill="none" stroke="#E6005C" strokeWidth="4" strokeDasharray="6,6" />
              </svg>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '12.5px' }}>
                <i className="fa-solid fa-circle" style={{ fontSize: '8px', color: '#E6005C', marginTop: '5px' }}></i>
                <span><b>Destination:</b> {selectedDirections.kitchenName}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '12.5px' }}>
                <i className="fa-solid fa-circle" style={{ fontSize: '8px', color: '#8E8E93', marginTop: '5px' }}></i>
                <span><b>Distance:</b> 2.4 km • Est. travel time: 10 mins</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '12.5px' }}>
                <i className="fa-solid fa-circle" style={{ fontSize: '8px', color: '#8E8E93', marginTop: '5px' }}></i>
                <span><b>Table Status:</b> Table for {selectedDirections.guests} hosts has been reserved under name "Shivani"</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedDirections(null)} 
              style={{ width: '100%', marginTop: '20px', padding: '12px', border: 'none', borderRadius: '14px', background: '#E6005C', color: 'white', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
            >
              Close Navigation
            </button>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrderDetail && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '28px', padding: '24px', width: '100%', maxWidth: '380px', border: '1px solid #E5E7EB' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E5E7EB', paddingBottom: '14px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#8E8E93', fontWeight: '800' }}>CRAVLINGS DISPATCH</span>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '900', fontFamily: 'Fredoka, sans-serif' }}>Order Details</h4>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#3A3A3C' }}>#{selectedOrderDetail.id}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#3A3A3C' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><b>Dish Ordered:</b></span>
                <span>{selectedOrderDetail.dish}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><b>Kitchen Host:</b></span>
                <span>{selectedOrderDetail.kitchen || 'Cravlings Cloud Kitchen'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><b>Date Ordered:</b></span>
                <span>{selectedOrderDetail.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><b>Total Cost:</b></span>
                <span style={{ fontWeight: '800' }}>₹{selectedOrderDetail.total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><b>Delivery Address:</b></span>
                <span style={{ fontSize: '12px', color: '#8E8E93', textAlign: 'right', flex: 1, marginLeft: '12px' }}>{location}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button 
                onClick={() => setSelectedOrderDetail(null)} 
                style={{ flex: 1, padding: '12px', border: '1px solid #E5E7EB', borderRadius: '14px', background: 'white', color: '#3A3A3C', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
              >
                Close
              </button>
              <button 
                onClick={() => {
                  onReorder(selectedOrderDetail);
                  setSelectedOrderDetail(null);
                }} 
                style={{ flex: 1.5, padding: '12px', border: 'none', borderRadius: '14px', background: '#E6005C', color: 'white', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
              >
                Reorder Item
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
