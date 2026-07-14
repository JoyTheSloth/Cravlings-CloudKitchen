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
  setSpeechText 
}) {
  const [activeTab, setActiveTab] = useState(activeOrder ? 'active' : 'past');

  // Auto-progress tracking steps simulation
  useEffect(() => {
    if (activeOrder && trackingStep < 4) {
      const timer = setInterval(() => {
        const nextStep = trackingStep + 1;
        setTrackingStep(nextStep);

        // Feedback text updates
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
      }, 6000);

      return () => clearInterval(timer);
    }
  }, [activeOrder, trackingStep, location, setTrackingStep, setSpeechText, onTriggerNotification]);

  const handleDownloadInvoice = (orderId) => {
    onTriggerNotification(`📄 Invoice downloaded for Order #${orderId}`);
  };

  const handleRateKitchen = (kitchenName) => {
    onTriggerNotification(`⭐ Rated 5 stars for ${kitchenName}!`);
  };

  return (
    <div className="viewport-content-panel">
      <div className="order-tracking-layout">
        
        {/* Toggle Segment Tabs */}
        <div className="orders-tab-switcher-row">
          <button 
            className={`orders-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            <span>Active Orders</span>
            {activeOrder && <span className="active-order-badge-count">1</span>}
          </button>
          <button 
            className={`orders-tab-btn ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            <span>Past Orders</span>
            <span className="past-order-badge-count">{pastOrders.length}</span>
          </button>
        </div>

        {/* Tab content 1: Active Orders */}
        {activeTab === 'active' && (
          <div className="active-orders-pane">
            {activeOrder ? (
              <div className="tracker-active-panel">
                <div className="tracker-active-header">
                  <div className="tracker-active-title-row">
                    <span className="tracker-live-pulse-badge">Live Status</span>
                    <h4 id="lbl-tracker-title">Order #{activeOrder.id}</h4>
                  </div>
                  <p className="tracker-subtitle-details">
                    Crave Item: <b>{activeOrder.dish}</b> • Estimated arrival: {trackingStep === 4 ? 'Delivered' : '15-20 mins'}
                  </p>
                </div>

                {/* Step Indicators with Emojis */}
                <div className="tracker-stepper-line">
                  <div className={`tracker-stepper-node ${trackingStep >= 1 ? 'done' : ''}`} title="Confirmed">
                    {trackingStep >= 1 ? '✓' : '1'}
                  </div>
                  <div className={`tracker-stepper-node ${trackingStep > 2 ? 'done' : trackingStep === 2 ? 'active' : ''}`} title="Preparing">
                    🍳
                  </div>
                  <div className={`tracker-stepper-node ${trackingStep > 3 ? 'done' : trackingStep === 3 ? 'active' : ''}`} title="On The Way">
                    🛵
                  </div>
                  <div className={`tracker-stepper-node ${trackingStep === 4 ? 'active' : ''}`} title="Delivered">
                    🎁
                  </div>
                </div>

                <div className="tracker-stepper-labels">
                  <span className={trackingStep >= 1 ? 'label-highlight' : ''}>Confirmed</span>
                  <span className={trackingStep >= 2 ? 'label-highlight' : ''}>Preparing</span>
                  <span className={trackingStep >= 3 ? 'label-highlight' : ''}>On The Way</span>
                  <span className={trackingStep === 4 ? 'label-highlight' : ''}>Delivered</span>
                </div>

                {/* Live Delivery Map Simulation */}
                <div className="tracker-map-simulation-card">
                  <h5 id="lbl-tracker-map-text">🗺️ Real-time Delivery Radar ({location.split(',')[0]})</h5>
                  <div className="map-visual-placeholder">
                    {/* Live pulsing coordinate destination pin */}
                    <div className="map-destination-node">🏠</div>
                    
                    {/* Simulated Rider animating on map */}
                    {trackingStep < 4 && (
                      <div className="map-rider-node">
                        <span className="rider-emoji">🛵</span>
                        <div className="rider-sonar-wave"></div>
                      </div>
                    )}

                    {/* Simple simulated SVG map roads overlay */}
                    <svg width="100%" height="100%" opacity="0.25" style={{ pointerEvents: 'none' }}>
                      <path d="M -10,120 C 120,80 220,160 380,110 T 700,90" fill="none" stroke="#6C7A89" strokeWidth="6" strokeDasharray="5,5" />
                      <path d="M 120,-10 L 120,250" fill="none" stroke="#6C7A89" strokeWidth="4" />
                      <path d="M 280,-10 L 280,250" fill="none" stroke="#6C7A89" strokeWidth="4" />
                    </svg>
                    
                    <div className="map-live-status-toast">
                      <span className="toast-pulse-dot"></span>
                      {trackingStep === 1 && '🛒 Order Confirmed at Kitchen'}
                      {trackingStep === 2 && '🧑‍🍳 Food being cooked by chef'}
                      {trackingStep === 3 && '🛵 Rider Vikram is enroute to your location'}
                      {trackingStep === 4 && '✅ Vikram delivered your package! Enjoy!'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-active-orders-box">
                <i className="fa-solid fa-pizza-slice empty-pizza-icon"></i>
                <h4>No active cravings cooking</h4>
                <p>Satisfy your cravings using the Cravings Wizard or explore Cloud Kitchens!</p>
              </div>
            )}
          </div>
        )}

        {/* Tab content 2: Past Orders */}
        {activeTab === 'past' && (
          <div className="past-orders-pane">
            <div className="order-history-list" id="lbl-past-orders-list">
              {pastOrders.length === 0 ? (
                <div className="empty-past-orders-box">
                  No past order history.
                </div>
              ) : (
                pastOrders.map(order => {
                  const dishData = dishes.find(d => d.name.toLowerCase() === order.dish.toLowerCase());
                  const dishImg = dishData ? dishData.img : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150';
                  
                  return (
                    <div className="order-history-card" key={order.id}>
                      <div className="history-card-header">
                        <div className="history-card-left">
                          <img src={dishImg} className="history-dish-thumbnail" alt={order.dish} />
                          <div className="history-dish-details">
                            <h5>{order.dish}</h5>
                            <p className="history-order-meta">Order #{order.id} • {order.date}</p>
                          </div>
                        </div>
                        <div className="history-card-right">
                          <span className="history-order-price">₹{order.total}</span>
                        </div>
                      </div>

                      <div className="history-card-actions">
                        <button 
                          onClick={() => handleDownloadInvoice(order.id)}
                          className="history-action-btn invoice-btn"
                        >
                          <i className="fa-solid fa-file-invoice"></i> Invoice
                        </button>
                        <button 
                          onClick={() => handleRateKitchen(order.dish)}
                          className="history-action-btn rate-btn"
                        >
                          <i className="fa-solid fa-star"></i> Rate
                        </button>
                        <button 
                          className="history-reorder-btn" 
                          onClick={() => onReorder(order)}
                        >
                          <i className="fa-solid fa-rotate-right"></i> Reorder
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
    </div>
  );
}
