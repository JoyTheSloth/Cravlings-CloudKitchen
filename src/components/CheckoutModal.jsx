import React, { useState, useRef, useEffect } from 'react';

export default function CheckoutModal({ isOpen, onClose, cart, location, onCheckoutSuccess }) {
  const [sliderPosition, setSliderPosition] = useState(3);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const trackRef = useRef(null);
  const handleRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setSliderPosition(3);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.priceOverride * item.quantity), 0);
  const delivery = subtotal > 0 ? 40 : 0;
  const discount = Math.round(subtotal * 0.2);
  const grandtotal = subtotal + delivery - discount;

  const handleStart = (clientX) => {
    isDragging.current = true;
    startX.current = clientX - sliderPosition;
  };

  const handleMove = (clientX) => {
    if (!isDragging.current || !trackRef.current || !handleRef.current) return;
    
    const maxTravel = trackRef.current.clientWidth - handleRef.current.clientWidth - 6;
    let newPos = clientX - startX.current;
    newPos = Math.max(3, Math.min(maxTravel + 3, newPos));
    
    setSliderPosition(newPos);

    if (newPos >= maxTravel + 2) {
      // Trigger success!
      isDragging.current = false;
      onCheckoutSuccess({
        id: `CR-${Math.floor(1000 + Math.random() * 9000)}`,
        dish: cart[0]?.dish?.name || 'Cravings Meal',
        total: grandtotal,
        date: 'Just Now'
      });
      onClose();
    }
  };

  const handleEnd = () => {
    if (isDragging.current) {
      isDragging.current = false;
      setSliderPosition(3); // Snap back
    }
  };

  return (
    <div className="modal-overlay-backdrop" onClick={onClose}>
      <div className="modal-body-container" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
        
        <div className="modal-title-row" style={{ marginBottom: '15px' }}>
          <h3 style={{ fontFamily: 'Fredoka, sans-serif' }}>Secure Checkout</h3>
          <div className="modal-close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>

        {/* Delivery Destination */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'var(--bg-cream)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1.5px solid rgba(229, 213, 197, 0.4)', marginBottom: '15px' }}>
          <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary-coral)', fontSize: '18px' }}></i>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: '700' }}>DELIVERING TO</span>
            <span id="lbl-checkout-address" style={{ fontSize: '13px', fontWeight: '800' }}>{location}, India</span>
          </div>
        </div>

        {/* Bill Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', borderBottom: '1.5px dashed rgba(229, 213, 197, 0.4)', paddingBottom: '15px', marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Delivery Charge</span>
            <span>₹{delivery}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary-coral)', fontWeight: 'bold' }}>
            <span>Flat 20% Discount</span>
            <span>-₹{discount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '900', marginTop: '6px' }}>
            <span>Grand Total</span>
            <span style={{ color: 'var(--primary-coral)' }}>₹{grandtotal}</span>
          </div>
        </div>

        <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', textAlign: 'center', fontWeight: '500' }}>
          Slide the button to confirm order placement and start cooking! 🧑‍🍳
        </p>

        {/* Slide-to-Pay Track */}
        <div 
          className="slider-checkout-track" 
          ref={trackRef}
          onMouseMove={(e) => handleMove(e.clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onMouseLeave={handleEnd}
          onMouseUp={handleEnd}
          onTouchEnd={handleEnd}
        >
          <span>SLIDE TO PAY ORDER</span>
          
          <div 
            className="slider-checkout-handle" 
            ref={handleRef}
            style={{ left: `${sliderPosition}px` }}
            onMouseDown={(e) => handleStart(e.clientX)}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          >
            <i className="fa-solid fa-angles-right"></i>
          </div>
        </div>

      </div>
    </div>
  );
}
