import React, { useState, useRef, useEffect } from 'react';

const FAKE_COUPONS = [
  { code: 'CRAVE100', discount: 100, minOrder: 200, desc: 'Flat ₹100 Off on orders above ₹200' },
  { code: 'BLOBBY150', discount: 150, minOrder: 250, desc: 'Chef Special: Flat ₹150 Off on orders above ₹250' },
  { code: 'GOLDEN50', discount: 50, minOrder: 0, desc: 'Golden Voucher: Flat ₹50 Off (No Min Order)' },
  { code: 'BDAY75', discount: 75, minOrder: 0, desc: 'Birthday Reward: Flat ₹75 Off (No Min Order)' }
];

export default function CheckoutModal({ isOpen, onClose, cart, location, onCheckoutSuccess, coins = 1250, setCoins }) {
  const [sliderPosition, setSliderPosition] = useState(3);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const trackRef = useRef(null);
  const handleRef = useRef(null);

  // Wallet & Coupons State
  const [useWalletCoins, setUseWalletCoins] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isApplying, setIsApplying] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [successAnimation, setSuccessAnimation] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSliderPosition(3);
      setUseWalletCoins(false);
      setCouponCode('');
      setActiveCoupon(null);
      setCouponDiscount(0);
      setIsApplying(false);
      setCouponError('');
      setSuccessAnimation(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.priceOverride * item.quantity), 0);
  const delivery = subtotal > 0 ? 40 : 0;
  const flat20PercentDiscount = Math.round(subtotal * 0.2);

  // Compute values
  const coinDiscountVal = useWalletCoins ? Math.min(100, coins) : 0;
  
  // Grand total calculation
  const grandtotal = Math.max(0, subtotal + delivery - flat20PercentDiscount - couponDiscount - coinDiscountVal);

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
      isDragging.current = false;
      // Deduct coins if applied
      if (useWalletCoins && setCoins) {
        setCoins(prev => Math.max(0, prev - coinDiscountVal));
      }
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

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) return;

    setCouponError('');
    setIsApplying(true);

    // Simulate verified coupon API call
    setTimeout(() => {
      const match = FAKE_COUPONS.find(c => c.code === code);
      setIsApplying(false);

      if (!match) {
        setCouponError('❌ Invalid promo code. Try CRAVE100 or BLOBBY150!');
        return;
      }

      if (subtotal < match.minOrder) {
        setCouponError(`❌ Min order of ₹${match.minOrder} required for ${match.code}!`);
        return;
      }

      setActiveCoupon(match);
      setCouponDiscount(match.discount);
      setSuccessAnimation(true);
      setTimeout(() => setSuccessAnimation(false), 2000);
    }, 1200);
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    setCouponDiscount(0);
    setCouponCode('');
  };

  return (
    <div className="modal-overlay-backdrop" onClick={onClose} style={{ zIndex: 99999 }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes walletPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); filter: drop-shadow(0 0 10px #FF5E7E); }
        }
        @keyframes floatCoin {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
          50% { transform: translateY(-5px) rotate(180deg); opacity: 1; }
          100% { transform: translateY(0) rotate(360deg); opacity: 0.8; }
        }
        @keyframes couponShake {
          0%, 100% { transform: rotate(0); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes scalePop {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}} />

      <div className="modal-body-container" onClick={(e) => e.stopPropagation()} style={{ 
        padding: '24px', 
        maxWidth: '420px', 
        borderRadius: '28px',
        animation: 'scalePop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        
        {/* Header */}
        <div className="modal-title-row" style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🛒</span>
            <h3 style={{ fontFamily: 'Fredoka, sans-serif', margin: 0 }}>Secure Checkout</h3>
          </div>
          <div className="modal-close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>

        {/* Delivery Destination */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          alignItems: 'center', 
          background: 'var(--bg-cream)', 
          padding: '12px 16px', 
          borderRadius: '20px', 
          border: '1.5px solid rgba(229, 213, 197, 0.4)', 
          marginBottom: '15px' 
        }}>
          <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary-coral)', fontSize: '18px' }}></i>
          <div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', fontWeight: '700' }}>DELIVERING TO</span>
            <span id="lbl-checkout-address" style={{ fontSize: '12.5px', fontWeight: '800', color: '#232323' }}>{location}, India</span>
          </div>
        </div>

        {/* Practical Wallet Section (Crave Coins) */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1C0F35 0%, #341235 100%)', 
          borderRadius: '24px', 
          padding: '16px', 
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          border: '1.5px solid rgba(255, 94, 126, 0.25)',
          marginBottom: '15px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
        }}>
          {/* Decorative floating coin */}
          <span style={{ 
            position: 'absolute', 
            right: '20px', 
            top: '12px', 
            fontSize: '24px', 
            animation: 'floatCoin 3s ease-in-out infinite' 
          }}>🪙</span>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '50%', 
              background: 'rgba(255, 255, 255, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '22px',
              animation: 'walletPulse 2s infinite ease-in-out',
              cursor: 'pointer'
            }} onClick={() => setUseWalletCoins(!useWalletCoins)}>
              👛
            </div>
            
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '10px', background: '#FF5E7E', color: 'white', padding: '1px 6px', borderRadius: '8px', fontWeight: '800', textTransform: 'uppercase' }}>CRAVE WALLET</span>
              <h4 style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>
                🪙 {coins} Crave Coins
              </h4>
              <span style={{ fontSize: '10.5px', color: '#CECCD6', display: 'block' }}>1 Coin = ₹1 cash value</span>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={useWalletCoins} 
                onChange={(e) => setUseWalletCoins(e.target.checked)}
                style={{ 
                  width: '18px', 
                  height: '18px', 
                  accentColor: '#FF5E7E', 
                  cursor: 'pointer' 
                }} 
              />
            </label>
          </div>

          {useWalletCoins && (
            <div style={{ 
              marginTop: '12px', 
              background: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: '12px', 
              padding: '8px 12px', 
              fontSize: '11px',
              color: '#B5FF38',
              fontWeight: '700',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>Applied Wallet Discount:</span>
              <span>-₹{coinDiscountVal}</span>
            </div>
          )}
        </div>

        {/* Coupons / Vouchers Section */}
        <div style={{ marginBottom: '15px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase' }}>Apply Vouchers & Coupons</span>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input 
              type="text" 
              placeholder="Enter Coupon Code (e.g. CRAVE100)" 
              value={couponCode} 
              onChange={(e) => {
                setCouponCode(e.target.value);
                setCouponError('');
              }}
              disabled={isApplying || activeCoupon !== null}
              style={{
                flex: 1,
                border: '1.5px solid #E5E7EB',
                borderRadius: '16px',
                padding: '10px 14px',
                fontSize: '12.5px',
                fontWeight: '700',
                outline: 'none',
                background: activeCoupon ? '#F3F4F6' : '#FFFFFF'
              }}
            />
            {activeCoupon ? (
              <button 
                onClick={handleRemoveCoupon}
                style={{
                  background: '#FEE2E2',
                  color: '#EF4444',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '10px 16px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Remove
              </button>
            ) : (
              <button 
                onClick={() => handleApplyCoupon()}
                disabled={isApplying || !couponCode.trim()}
                style={{
                  background: 'var(--grad-coral)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '10px 20px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  opacity: (isApplying || !couponCode.trim()) ? 0.6 : 1
                }}
              >
                {isApplying ? 'Applying...' : 'Apply'}
              </button>
            )}
          </div>

          {couponError && (
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#EF4444', fontWeight: '700' }}>
              {couponError}
            </p>
          )}

          {/* Quick Select Fake Vouchers */}
          {!activeCoupon && (
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '4px 0' }}>
              {FAKE_COUPONS.map(c => {
                const disabled = subtotal < c.minOrder;
                return (
                  <button
                    key={c.code}
                    disabled={disabled}
                    onClick={() => {
                      setCouponCode(c.code);
                      handleApplyCoupon(c.code);
                    }}
                    style={{
                      flexShrink: 0,
                      background: disabled ? '#F3F4F6' : '#FFF5ED',
                      color: disabled ? '#A1A1AA' : '#FF5E7E',
                      border: disabled ? '1px dashed #E4E4E7' : '1px dashed #FFE3D5',
                      borderRadius: '12px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                    title={c.desc}
                  >
                    🏷️ {c.code} (₹{c.discount})
                  </button>
                );
              })}
            </div>
          )}

          {/* Loading Animation Card overlay when applying coupon */}
          {isApplying && (
            <div style={{
              background: '#FFF8F5',
              border: '1.5px dashed #FF5E7E',
              borderRadius: '20px',
              padding: '12px',
              textAlign: 'center',
              animation: 'couponShake 0.4s infinite ease-in-out',
              marginTop: '8px'
            }}>
              <span style={{ fontSize: '18px', display: 'block', marginBottom: '4px' }}>🎫</span>
              <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#FF5E7E' }}>Checking Chef's recipe verification...</span>
            </div>
          )}

          {/* Success apply animation alert */}
          {activeCoupon && (
            <div style={{
              background: '#F0FDF4',
              border: '1.5px solid #10B981',
              borderRadius: '20px',
              padding: '12px 14px',
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              animation: successAnimation ? 'couponShake 0.4s 2 ease-in-out' : 'none'
            }}>
              <span style={{ fontSize: '20px' }}>🎉</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#10B981', display: 'block' }}>Coupon {activeCoupon.code} applied!</span>
                <span style={{ fontSize: '10.5px', color: '#047857', display: 'block' }}>Successfully saved ₹{activeCoupon.discount} on this meal!</span>
              </div>
            </div>
          )}
        </div>

        {/* Bill Details */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px', 
          fontSize: '12.5px', 
          borderBottom: '1.5px dashed rgba(229, 213, 197, 0.4)', 
          paddingBottom: '14px', 
          marginBottom: '14px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#3A3A3C' }}>
            <span>Subtotal</span>
            <span style={{ fontWeight: '700' }}>₹{subtotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#3A3A3C' }}>
            <span>Delivery Charge</span>
            <span style={{ fontWeight: '700' }}>₹{delivery}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#FF5E7E', fontWeight: '700' }}>
            <span>Flat 20% Discount</span>
            <span>-₹{flat20PercentDiscount}</span>
          </div>
          {activeCoupon && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: '700' }}>
              <span>Coupon Discount ({activeCoupon.code})</span>
              <span>-₹{couponDiscount}</span>
            </div>
          )}
          {useWalletCoins && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8B5CF6', fontWeight: '700' }}>
              <span>Coins Applied (🪙 {coinDiscountVal})</span>
              <span>-₹{coinDiscountVal}</span>
            </div>
          )}
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '16px', 
            fontWeight: '900', 
            color: '#232323',
            borderTop: '1.5px solid #F3F4F6', 
            paddingTop: '8px', 
            marginTop: '4px' 
          }}>
            <span>Grand Total</span>
            <span style={{ color: 'var(--primary-coral)', fontSize: '18px' }}>₹{grandtotal}</span>
          </div>
        </div>

        {/* Order Call to Action text */}
        <div style={{ 
          background: 'rgba(16, 185, 129, 0.08)', 
          border: '1px dashed #10B981', 
          borderRadius: '16px', 
          padding: '10px 12px', 
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#047857', fontWeight: '800', lineHeight: '1.4' }}>
            🎉 You have a discounted price of ₹{grandtotal}. You can order now!
          </p>
        </div>

        <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', fontWeight: '500', marginBottom: '10px' }}>
          Slide the handle to confirm order placement and start cooking! 🧑‍🍳
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
          <span>SLIDE TO PAY ₹{grandtotal}</span>
          
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
