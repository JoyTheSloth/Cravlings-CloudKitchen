import React from 'react';

export function CompanionMascot({ level, xp, xpMax = 300, equippedAccessories = [], speechText }) {
  // Check if specific accessory is equipped
  const hasAccessory = (accId) => equippedAccessories.includes(accId);
  
  // Use the pink chef blob image in the sidebar companion card
  const mascotImg = '/chef_hero.png';

  return (
    <div className="sidebar-widget-mascot" style={{
      background: 'linear-gradient(135deg, #FFF8F5 0%, #FFFFFF 100%)',
      borderRadius: '28px',
      border: '1.5px solid #FDF0E9',
      padding: '24px',
      boxShadow: '0 12px 28px rgba(35, 35, 35, 0.03)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      transition: 'transform 0.3s ease'
    }}>
      {/* Speech bubble above mascot */}
      <div className="sidebar-mascot-dialogue" style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '12px 18px',
        fontSize: '13px',
        fontWeight: '700',
        color: '#232323',
        textAlign: 'center',
        border: '1px solid rgba(255, 94, 126, 0.1)',
        boxShadow: '0 6px 18px rgba(255, 94, 126, 0.04)',
        position: 'relative',
        marginBottom: '20px',
        alignSelf: 'center',
        maxWidth: '95%',
        minWidth: '160px',
        wordBreak: 'break-word'
      }}>
        <span>{speechText || "Let's find something cheesy! 🧀"}</span>
        <div style={{
          position: 'absolute',
          bottom: '-7px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '0',
          height: '0',
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '8px solid #FFFFFF'
        }}></div>
      </div>

      {/* Mascot circular portrait wrapper */}
      <div className="mascot-avatar-circle-container" style={{
        position: 'relative',
        alignSelf: 'center',
        marginBottom: '16px'
      }}>
        {/* Floating Sparks/Stars */}
        <span style={{ position: 'absolute', left: '-20px', top: '15px', fontSize: '18px', color: '#FFD54F', animation: 'floatSlow 3s ease-in-out infinite' }}>⭐</span>
        <span style={{ position: 'absolute', right: '-22px', top: '40px', fontSize: '16px', color: '#FF5E7E', animation: 'floatSlow 4s ease-in-out infinite' }}>✨</span>
        <span style={{ position: 'absolute', left: '-15px', bottom: '20px', fontSize: '12px', color: '#FFA62B' }}>🔸</span>

        {/* Circular portrait */}
        <div style={{
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: '#FFEADF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(255, 94, 126, 0.08)',
          overflow: 'visible',
          position: 'relative'
        }}>
          <img 
            src={mascotImg} 
            alt="Chef Blobby" 
            style={{ 
              width: '95%', 
              height: '95%', 
              objectFit: 'contain'
            }} 
          />

          {/* Accessory Overlays */}
          {hasAccessory('sunglasses') && (
            <span style={{ 
              position: 'absolute', 
              fontSize: '54px', 
              top: '42%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}>🕶️</span>
          )}
          {hasAccessory('pirate_hat') && (
            <span style={{ 
              position: 'absolute', 
              fontSize: '68px', 
              top: '-24px', 
              left: '50%', 
              transform: 'translateX(-50%)',
              pointerEvents: 'none'
            }}>🏴‍☠️</span>
          )}
          {hasAccessory('party_hat') && (
            <span style={{ 
              position: 'absolute', 
              fontSize: '68px', 
              top: '-32px', 
              left: '50%', 
              transform: 'translateX(-50%)',
              pointerEvents: 'none'
            }}>🥳</span>
          )}
          {hasAccessory('crown') && (
            <span style={{ 
              position: 'absolute', 
              fontSize: '62px', 
              top: '-32px', 
              left: '50%', 
              transform: 'translateX(-50%)',
              pointerEvents: 'none'
            }}>👑</span>
          )}
        </div>
      </div>

      {/* Info labels row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '8px'
      }}>
        <div>
          <h3 style={{ 
            fontFamily: 'Fredoka, sans-serif', 
            fontSize: '20px', 
            color: '#232323', 
            margin: 0,
            fontWeight: '700'
          }}>
            Chef Blobby
          </h3>
          <p style={{ 
            fontSize: '12px', 
            color: 'var(--text-muted)', 
            margin: '2px 0 0 0',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            Your Craving Legend <span style={{ color: 'var(--primary-coral)' }}>✨</span>
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
          <span style={{ 
            background: '#FF5E7E', 
            color: '#FFFFFF', 
            fontSize: '11px', 
            fontWeight: '800', 
            padding: '4px 10px', 
            borderRadius: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 4px 10px rgba(255, 94, 126, 0.15)'
          }}>
            Lvl {level} 👑
          </span>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: '700', 
            color: '#7E7F82',
            marginTop: '4px'
          }}>
            <span style={{ color: 'var(--primary-coral)', fontWeight: '800' }}>{xp}</span> / {xpMax} XP
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        height: '10px',
        background: '#F0E6DF',
        borderRadius: '5px',
        marginTop: '16px',
        overflow: 'hidden',
        width: '100%'
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(to right, #FF5E7E, #FFA62B)',
          width: `${(xp / xpMax) * 100}%`,
          borderRadius: '5px',
          transition: 'width 0.4s ease'
        }}></div>
      </div>
    </div>
  );
}

export function SidebarCart({ cart = [], onQuantityChange, onCheckout, onNavigate }) {
  const subtotal = cart.reduce((sum, item) => sum + (item.priceOverride * item.quantity), 0);
  const delivery = subtotal > 0 ? 40 : 0;
  const discount = Math.round(subtotal * 0.2); // flat 20% off
  const grandtotal = subtotal + delivery - discount;

  if (cart.length === 0) {
    return (
      <div className="sidebar-widget-cart" style={{
        background: '#FFFFFF',
        borderRadius: '28px',
        border: '1.5px solid #FDF0E9',
        padding: '20px 24px',
        boxShadow: '0 12px 28px rgba(35, 35, 35, 0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, border-color 0.2s'
      }} onClick={() => onNavigate && onNavigate('wizard')}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
          <img 
            src="/cart.png" 
            style={{ 
              width: '75px', 
              height: '75px', 
              objectFit: 'contain' 
            }} 
            alt="Cravings Cart" 
          />
          <div style={{ flex: 1 }}>
            <h4 style={{ 
              fontFamily: 'Fredoka, sans-serif', 
              fontSize: '18px', 
              color: '#232323', 
              margin: 0,
              fontWeight: '700'
            }}>
              Cravings Cart 🛒
            </h4>
            <p style={{ 
              fontSize: '12px', 
              color: 'var(--text-muted)', 
              marginTop: '4px', 
              lineHeight: '1.4',
              margin: '4px 0 0 0'
            }}>
              Your cart is empty!<br />Discover delicious dishes and add them here.
            </p>
          </div>
        </div>

        <button style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(255, 94, 126, 0.08)',
          border: 'none',
          color: 'var(--primary-coral)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontSize: '18px'
        }}>
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    );
  }

  // Active cart layout
  return (
    <div className="sidebar-widget-cart" style={{
      background: '#FFFFFF',
      borderRadius: '28px',
      border: '1.5px solid #FDF0E9',
      padding: '24px',
      boxShadow: '0 12px 28px rgba(35, 35, 35, 0.03)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ 
          fontFamily: 'Fredoka, sans-serif', 
          fontSize: '18px', 
          color: '#232323', 
          margin: 0,
          fontWeight: '700'
        }}>
          Cravings Cart 🛒
        </h4>
        <span style={{ 
          background: 'rgba(255, 94, 126, 0.1)', 
          color: 'var(--primary-coral)', 
          fontSize: '11px', 
          fontWeight: '800', 
          padding: '4px 10px', 
          borderRadius: '12px' 
        }}>
          {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
        </span>
      </div>

      <div style={{
        maxHeight: '220px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        paddingRight: '4px'
      }}>
        {cart.map((item, idx) => {
          const extraStr = item.extras.length > 0 ? ` (${item.extras.join(', ')})` : '';
          return (
            <div key={`${item.dish.id}-${idx}`} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 12px',
              background: '#FFFBF9',
              borderRadius: '16px',
              border: '1px solid #FFF3ED'
            }}>
              <div style={{ flex: 1, marginRight: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#232323', display: 'block' }}>
                  {item.dish.name}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  ₹{item.priceOverride}{extraStr}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                  onClick={() => onQuantityChange(item.dish.id, item.extras, -1)}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '1px solid #FFE3D5',
                    background: '#FFFFFF',
                    color: 'var(--primary-coral)',
                    fontSize: '14px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  -
                </button>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#232323', minWidth: '14px', textAlign: 'center' }}>
                  {item.quantity}
                </span>
                <button 
                  onClick={() => onQuantityChange(item.dish.id, item.extras, 1)}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '1px solid #FFE3D5',
                    background: '#FFFFFF',
                    color: 'var(--primary-coral)',
                    fontSize: '14px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        borderTop: '1px dashed #FFE3D5',
        paddingTop: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>Delivery Charge</span>
          <span>₹{delivery}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--primary-coral)', fontWeight: '700' }}>
          <span>Flat 20% Discount</span>
          <span>-₹{discount}</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '15px',
          fontWeight: '800',
          color: '#232323',
          borderTop: '1px solid #FFE3D5',
          paddingTop: '8px',
          marginTop: '4px'
        }}>
          <span>Grand Total</span>
          <span style={{ color: 'var(--primary-coral)' }}>₹{grandtotal}</span>
        </div>
      </div>

      <button 
        onClick={onCheckout}
        style={{
          width: '100%',
          padding: '14px',
          background: 'var(--grad-coral)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '16px',
          fontWeight: '800',
          fontSize: '14px',
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(255, 94, 126, 0.2)',
          transition: 'transform 0.2s ease, opacity 0.2s'
        }}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}

export default function Sidebar({ level, xp, xpMax, equippedAccessories, speechText, cart, onQuantityChange, onCheckout, onNavigate }) {
  return (
    <aside className="portal-sidebar-column">
      <CompanionMascot 
        level={level} 
        xp={xp} 
        xpMax={xpMax}
        equippedAccessories={equippedAccessories} 
        speechText={speechText} 
      />
      <SidebarCart 
        cart={cart} 
        onQuantityChange={onQuantityChange} 
        onCheckout={onCheckout} 
        onNavigate={onNavigate}
      />
    </aside>
  );
}
