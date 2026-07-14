import React, { useState } from 'react';

const SHOP_ITEMS = [
  {
    id: 'sunglasses',
    emoji: '🕶️',
    name: 'Cool Sunglasses',
    desc: 'Too cool for school vibes',
    cost: 200,
    rarity: 'Common',
    rarityColor: '#6B7280'
  },
  {
    id: 'party_hat',
    emoji: '🥳',
    name: 'Party Cone Hat',
    desc: 'Every meal is a celebration',
    cost: 350,
    rarity: 'Rare',
    rarityColor: '#3B82F6'
  },
  {
    id: 'pirate_hat',
    emoji: '🏴‍☠️',
    name: 'Bicorn Pirate Hat',
    desc: 'Sailing the seven flavors',
    cost: 500,
    rarity: 'Epic',
    rarityColor: '#8B5CF6'
  },
  {
    id: 'crown',
    emoji: '👑',
    name: 'Golden King Crown',
    desc: 'The ultimate flex. Peak Blobby.',
    cost: 1000,
    rarity: 'Legendary',
    rarityColor: '#F59E0B'
  },
  {
    id: 'chef_hat',
    emoji: '👨‍🍳',
    name: 'Chef Toque',
    desc: 'Gordon Ramsey would approve',
    cost: 300,
    rarity: 'Rare',
    rarityColor: '#3B82F6'
  },
  {
    id: 'rainbow',
    emoji: '🌈',
    name: 'Rainbow Aura',
    desc: 'Taste the whole spectrum',
    cost: 750,
    rarity: 'Epic',
    rarityColor: '#8B5CF6'
  },
  {
    id: 'ninja',
    emoji: '🥷',
    name: 'Ninja Headband',
    desc: 'Silent but delicious',
    cost: 450,
    rarity: 'Rare',
    rarityColor: '#3B82F6'
  },
  {
    id: 'alien',
    emoji: '👽',
    name: 'Alien Antenna',
    desc: 'Out-of-this-world hunger',
    cost: 650,
    rarity: 'Epic',
    rarityColor: '#8B5CF6'
  }
];

const EVOLUTION_STAGES = [
  { minLevel: 1,  maxLevel: 5,  stage: 'Egg',        emoji: '🥚', color: '#E5E7EB', textColor: '#6B7280', desc: 'Blobby is incubating inside the flavor pod.' },
  { minLevel: 6,  maxLevel: 10, stage: 'Baby Blob',  emoji: '🐣', color: '#FEF3C7', textColor: '#D97706', desc: 'Blobby has hatched and is tasting starters.' },
  { minLevel: 11, maxLevel: 15, stage: 'Chef Blob',  emoji: '🧑‍🍳', color: '#EDE9FE', textColor: '#7C3AED', desc: 'Blobby is masterfully plating full meals.' },
  { minLevel: 16, maxLevel: 99, stage: 'Flavor God', emoji: '👑', color: '#FEF3C7', textColor: '#B45309', desc: 'Blobby has transcended to chef divinity!' }
];

export default function WardrobeView({ 
  level = 1,
  coins, 
  setCoins, 
  purchasedAccessories, 
  setPurchasedAccessories, 
  equippedAccessories, 
  setEquippedAccessories, 
  onTriggerNotification,
  setSpeechText 
}) {
  const [activeTab, setActiveTab] = useState('shop'); // shop | equipped

  const evolution = EVOLUTION_STAGES.find(s => level >= s.minLevel && level <= s.maxLevel) || EVOLUTION_STAGES[3];
  const nextStage = EVOLUTION_STAGES.find(s => s.minLevel > level);
  const xpToNextStage = nextStage ? `Lvl ${nextStage.minLevel} to evolve` : 'MAX EVOLUTION';

  const handleAccessoryClick = (item) => {
    const isPurchased = purchasedAccessories.includes(item.id);
    const isEquipped = equippedAccessories.includes(item.id);

    if (!isPurchased) {
      if (coins >= item.cost) {
        setCoins(coins - item.cost);
        setPurchasedAccessories([...purchasedAccessories, item.id]);
        onTriggerNotification(`🛍️ Purchased ${item.name}!`);
        setSpeechText(`Wow! I look amazing in the ${item.name}! Let's equip it! 😍`);
      } else {
        onTriggerNotification(`❌ Need ${item.cost - coins} more coins!`);
        setSpeechText(`Oops! We need ${item.cost} coins for the ${item.name}. Keep ordering! 🪙`);
      }
    } else {
      if (isEquipped) {
        setEquippedAccessories(equippedAccessories.filter(id => id !== item.id));
        onTriggerNotification(`Removed ${item.name}`);
        setSpeechText('Classic Blobby look. Timeless! 😋');
      } else {
        setEquippedAccessories([...equippedAccessories, item.id]);
        onTriggerNotification(`Equipped ${item.name}! 🌟`);
        setSpeechText(`The ${item.name} is absolutely fire on me! 🌟`);
      }
    }
  };

  const equippedItems = SHOP_ITEMS.filter(i => equippedAccessories.includes(i.id));
  const progressPercent = Math.min(((level - evolution.minLevel) / ((evolution.maxLevel - evolution.minLevel) || 1)) * 100, 100);

  return (
    <div className="wardrobe-view-root">

      {/* ── TOP HERO: Blobby Avatar Stage ── */}
      <div className="wardrobe-hero-panel">
        {/* Left: Info */}
        <div className="wardrobe-hero-left">
          <div className="wardrobe-level-badge">LVL {level}</div>
          <h2 className="wardrobe-hero-title">Blobby's<br/>Wardrobe 👑</h2>
          <p className="wardrobe-hero-sub">Dress up Chef Blobby with accessories earned from your food journey.</p>
          
          {/* Coin balance */}
          <div className="wardrobe-coin-row">
            <span className="wardrobe-coin-icon">🪙</span>
            <span className="wardrobe-coin-amount">{coins}</span>
            <span className="wardrobe-coin-label">coins</span>
          </div>
        </div>

        {/* Right: Blobby Avatar */}
        <div className="wardrobe-avatar-stage">
          <div className="wardrobe-avatar-glow"></div>
          <div className="wardrobe-avatar-blob">
            {/* Stacked accessories on top */}
            {equippedItems.length > 0 && (
              <div className="wardrobe-avatar-accessories">
                {equippedItems.map(item => (
                  <span key={item.id} className="wardrobe-equipped-emoji">{item.emoji}</span>
                ))}
              </div>
            )}
            {/* Main blob character */}
            <span className="wardrobe-blob-emoji">{evolution.emoji}</span>
          </div>
          <div className="wardrobe-stage-label" style={{ background: evolution.color, color: evolution.textColor }}>
            {evolution.stage}
          </div>
          <p className="wardrobe-stage-desc">{evolution.desc}</p>
        </div>
      </div>

      {/* ── EVOLUTION PROGRESS TRACK ── */}
      <div className="wardrobe-evolution-track">
        <div className="wardrobe-track-header">
          <span className="wardrobe-track-title">Evolution Journey</span>
          <span className="wardrobe-track-next">{xpToNextStage}</span>
        </div>
        
        <div className="wardrobe-stage-steps">
          {EVOLUTION_STAGES.map((stage, idx) => {
            const isActive = level >= stage.minLevel && level <= stage.maxLevel;
            const isPast = level > stage.maxLevel;
            return (
              <div key={stage.stage} className={`wardrobe-stage-step ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}>
                <div className="wardrobe-step-bubble">
                  <span>{stage.emoji}</span>
                </div>
                <span className="wardrobe-step-name">{stage.stage}</span>
                <span className="wardrobe-step-lvl">Lvl {stage.minLevel}</span>
              </div>
            );
          })}
        </div>

        <div className="wardrobe-progress-bar-wrap">
          <div className="wardrobe-progress-bar-track">
            <div className="wardrobe-progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* ── SHOP TABS ── */}
      <div className="wardrobe-shop-section">
        <div className="wardrobe-tabs-row">
          <button 
            className={`wardrobe-tab-btn ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={() => setActiveTab('shop')}
          >
            <i className="fa-solid fa-store"></i> Shop
          </button>
          <button 
            className={`wardrobe-tab-btn ${activeTab === 'equipped' ? 'active' : ''}`}
            onClick={() => setActiveTab('equipped')}
          >
            <i className="fa-solid fa-shirt"></i> Equipped ({equippedItems.length})
          </button>
        </div>

        {activeTab === 'shop' && (
          <div className="wardrobe-accessories-grid">
            {SHOP_ITEMS.map(item => {
              const isPurchased = purchasedAccessories.includes(item.id);
              const isEquipped = equippedAccessories.includes(item.id);
              const canAfford = coins >= item.cost;

              return (
                <div
                  key={item.id}
                  className={`wardrobe-acc-card ${isEquipped ? 'is-equipped' : ''} ${isPurchased ? 'is-owned' : ''} ${!isPurchased && !canAfford ? 'is-locked' : ''}`}
                  onClick={() => handleAccessoryClick(item)}
                >
                  {/* Rarity badge */}
                  <div className="wardrobe-acc-rarity" style={{ color: item.rarityColor }}>
                    {item.rarity}
                  </div>

                  {/* Equipped checkmark */}
                  {isEquipped && (
                    <div className="wardrobe-acc-equipped-check">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  )}

                  {/* Emoji */}
                  <div className="wardrobe-acc-emoji-wrap">
                    <span className="wardrobe-acc-emoji">{item.emoji}</span>
                  </div>

                  {/* Info */}
                  <div className="wardrobe-acc-info">
                    <span className="wardrobe-acc-name">{item.name}</span>
                    <span className="wardrobe-acc-desc">{item.desc}</span>
                  </div>

                  {/* Action button */}
                  <div className={`wardrobe-acc-action ${isEquipped ? 'equipped' : isPurchased ? 'owned' : canAfford ? 'buy' : 'locked'}`}>
                    {!isPurchased ? (
                      canAfford ? (
                        <span><i className="fa-solid fa-coins"></i> {item.cost}</span>
                      ) : (
                        <span><i className="fa-solid fa-lock"></i> {item.cost}</span>
                      )
                    ) : isEquipped ? (
                      <span><i className="fa-solid fa-check"></i> Equipped</span>
                    ) : (
                      <span><i className="fa-solid fa-shirt"></i> Equip</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'equipped' && (
          <div className="wardrobe-equipped-panel">
            {equippedItems.length === 0 ? (
              <div className="wardrobe-empty-state">
                <span className="wardrobe-empty-icon">🧺</span>
                <h4>Nothing equipped yet!</h4>
                <p>Buy and equip accessories from the Shop tab to dress up Blobby.</p>
              </div>
            ) : (
              <div className="wardrobe-accessories-grid">
                {equippedItems.map(item => (
                  <div
                    key={item.id}
                    className="wardrobe-acc-card is-equipped is-owned"
                    onClick={() => handleAccessoryClick(item)}
                  >
                    <div className="wardrobe-acc-rarity" style={{ color: item.rarityColor }}>{item.rarity}</div>
                    <div className="wardrobe-acc-equipped-check"><i className="fa-solid fa-check"></i></div>
                    <div className="wardrobe-acc-emoji-wrap">
                      <span className="wardrobe-acc-emoji">{item.emoji}</span>
                    </div>
                    <div className="wardrobe-acc-info">
                      <span className="wardrobe-acc-name">{item.name}</span>
                      <span className="wardrobe-acc-desc">{item.desc}</span>
                    </div>
                    <div className="wardrobe-acc-action equipped">
                      <span><i className="fa-solid fa-check"></i> Equipped</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
