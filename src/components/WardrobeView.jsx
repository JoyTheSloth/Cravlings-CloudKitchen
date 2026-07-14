import React from 'react';

const SHOP_ITEMS = [
  { id: 'sunglasses', emoji: '🕶️', name: 'Cool Sunglasses', cost: 200 },
  { id: 'party_hat', emoji: '🥳', name: 'Party Cone Hat', cost: 350 },
  { id: 'pirate_hat', emoji: '🏴‍☠️', name: 'Bicorn Pirate Hat', cost: 500 },
  { id: 'crown', emoji: '👑', name: 'Golden King Crown', cost: 1000 }
];

export default function WardrobeView({ 
  level = 12,
  coins, 
  setCoins, 
  purchasedAccessories, 
  setPurchasedAccessories, 
  equippedAccessories, 
  setEquippedAccessories, 
  onTriggerNotification,
  setSpeechText 
}) {

  // Dynamic evolution calculation
  const getEvolutionStage = () => {
    if (level <= 5) return { stage: 'Egg', emoji: '🥚', desc: 'Blobby is incubating inside the flavor pod.' };
    if (level <= 10) return { stage: 'Baby Blob', emoji: '👶', desc: 'Blobby has hatched and is tasting starters.' };
    if (level <= 15) return { stage: 'Chef Blob', emoji: '🧑‍🍳', desc: 'Blobby is masterfully plating full meals.' };
    return { stage: 'Flavor God', emoji: '👑', desc: 'Blobby has transcended to chef divinity!' };
  };

  const evolution = getEvolutionStage();

  const handleAccessoryClick = (item) => {
    const isPurchased = purchasedAccessories.includes(item.id);
    const isEquipped = equippedAccessories.includes(item.id);

    if (!isPurchased) {
      // Try to purchase
      if (coins >= item.cost) {
        setCoins(coins - item.cost);
        setPurchasedAccessories([...purchasedAccessories, item.id]);
        onTriggerNotification(`🛍️ Purchased ${item.name}!`);
        setSpeechText(`Wow! Blobby looks so cool in the newly bought ${item.name}! Let's equip it! 😍`);
      } else {
        onTriggerNotification(`❌ Not enough coins! Need ${item.cost} coins.`);
        setSpeechText(`Oops! We need more coins to afford the ${item.name}. Try ordering more food! 🪙`);
      }
    } else {
      // Toggle equip
      if (isEquipped) {
        // Unequip
        setEquippedAccessories(equippedAccessories.filter(id => id !== item.id));
        onTriggerNotification(`Removed ${item.name}`);
        setSpeechText("Accessories removed. Clean Blobby is classic Blobby! 😋");
      } else {
        // Equip (support multiple accessories, or we can clear others first if desired. Let's allow stacking!)
        setEquippedAccessories([...equippedAccessories, item.id]);
        onTriggerNotification(`Equipped ${item.name}! 🌟`);
        setSpeechText(`Looking fresh! The ${item.name} is looking absolutely stunning on Chef Blobby! 🌟`);
      }
    }
  };

  return (
    <div className="viewport-content-panel">
      <div className="wardrobe-view-layout">
        
        {/* Wallet Balance Card */}
        <div className="wardrobe-balance-card">
          <div>
            <h4>Wardrobe Upgrade Shop 🛍️</h4>
            <p style={{ fontSize: '12.5px', marginTop: '4px', opacity: '0.9', fontWeight: '500' }}>
              Buy cute hats, sunglasses, and crown accessories for Chef Blobby using rewards coins.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-charcoal)' }}>{coins} 🪙</span>
            <span style={{ fontSize: '11px', fontWeight: '800', marginTop: '2px', color: 'var(--text-charcoal)' }}>Coins Available</span>
          </div>
        </div>

        {/* 14. Cravling Evolution Stage Tracker */}
        <div className="section-headline-bar" style={{ marginTop: '25px' }}>
          <h3>Companion Evolution Status</h3>
        </div>
        <div className="companion-evolution-card" style={{
          background: 'white',
          border: '1.5px solid rgba(0,0,0,0.05)',
          borderRadius: '20px',
          padding: '20px',
          display: 'flex',
          gap: '15px',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '42px' }}>{evolution.emoji}</span>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontFamily: 'Fredoka, sans-serif' }}>Stage: {evolution.stage}</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{evolution.desc}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '10px', fontWeight: '800', background: 'rgba(255, 94, 126, 0.1)', color: 'var(--primary-coral)', padding: '4px 10px', borderRadius: '10px' }}>
              Lvl {level}
            </span>
          </div>
        </div>

        {/* Evolution Milestones */}
        <div className="evolution-milestones-row" style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '12px',
          padding: '0 10px',
          fontSize: '11px',
          color: 'var(--text-muted)',
          fontWeight: '700'
        }}>
          <span style={{ color: level <= 5 ? 'var(--primary-coral)' : '' }}>🥚 Egg (Lvl 1)</span>
          <span style={{ color: (level > 5 && level <= 10) ? 'var(--primary-coral)' : '' }}>👶 Baby (Lvl 6)</span>
          <span style={{ color: (level > 10 && level <= 15) ? 'var(--primary-coral)' : '' }}>🧑‍🍳 Chef (Lvl 11)</span>
          <span style={{ color: level > 15 ? 'var(--primary-coral)' : '' }}>👑 God (Lvl 16+)</span>
        </div>

        <div className="section-headline-bar" style={{ marginTop: '30px' }}>
          <h3>Blobby's Accessories Closet</h3>
        </div>

        <div className="wardrobe-accessories-grid">
          {SHOP_ITEMS.map(item => {
            const isPurchased = purchasedAccessories.includes(item.id);
            const isEquipped = equippedAccessories.includes(item.id);

            return (
              <div 
                key={item.id} 
                className={`shop-accessory-card ${isEquipped ? 'equipped' : ''}`}
                onClick={() => handleAccessoryClick(item)}
              >
                <span className="shop-acc-emoji">{item.emoji}</span>
                <span className="shop-acc-name">{item.name}</span>
                
                <span className="shop-acc-btn">
                  {!isPurchased ? (
                    <span><i className="fa-solid fa-coins" style={{ color: 'var(--secondary-orange)', marginRight: '4px' }}></i>{item.cost}</span>
                  ) : isEquipped ? (
                    <span>Equipped ✅</span>
                  ) : (
                    <span>Equip 👕</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
