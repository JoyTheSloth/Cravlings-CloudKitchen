import React, { useState } from 'react';
import WardrobeView from './WardrobeView';

const DIET_TAGS = [
  { id: 'Vegan', emoji: '🌱', label: 'Vegan' },
  { id: 'Vegetarian', emoji: '🥗', label: 'Pure Veg' },
  { id: 'NonVeg', emoji: '🍗', label: 'Non-Veg' },
  { id: 'GlutenFree', emoji: '🌾', label: 'Gluten-Free' },
  { id: 'HighProtein', emoji: '🥩', label: 'High Protein' },
  { id: 'LowCarb', emoji: '🥦', label: 'Low Carb' },
  { id: 'DairyFree', emoji: '🥛', label: 'Dairy-Free' },
  { id: 'Keto', emoji: '🥑', label: 'Keto' }
];

const SHOP_ITEMS = [
  { id: 'sunglasses', emoji: '🕶️', name: 'Cool Sunglasses', cost: 200 },
  { id: 'party_hat', emoji: '🥳', name: 'Party Cone Hat', cost: 350 },
  { id: 'pirate_hat', emoji: '🏴‍☠️', name: 'Bicorn Pirate Hat', cost: 500 },
  { id: 'crown', emoji: '👑', name: 'Golden King Crown', cost: 1000 },
  { id: 'chef_hat', emoji: '👨‍🍳', name: 'Chef Toque', cost: 300 },
  { id: 'rainbow', emoji: '🌈', name: 'Rainbow Aura', cost: 750 },
  { id: 'ninja', emoji: '🥷', name: 'Ninja Headband', cost: 450 },
  { id: 'alien', emoji: '👽', name: 'Alien Antenna', cost: 650 }
];

const EVOLUTION_STAGES = [
  { minLevel: 1,  maxLevel: 5,  stage: 'Egg',        emoji: '🥚', color: '#E5E7EB', textColor: '#6B7280', desc: 'Blobby is incubating inside the flavor pod.' },
  { minLevel: 6,  maxLevel: 10, stage: 'Baby Blob',  emoji: '🐣', color: '#FEF3C7', textColor: '#D97706', desc: 'Blobby has hatched and is tasting starters.' },
  { minLevel: 11, maxLevel: 15, stage: 'Chef Blob',  emoji: '🧑‍🍳', color: '#EDE9FE', textColor: '#7C3AED', desc: 'Blobby is masterfully plating full meals.' },
  { minLevel: 16, maxLevel: 99, stage: 'Flavor God', emoji: '👑', color: '#FEF3C7', textColor: '#B45309', desc: 'Blobby has transcended to chef divinity!' }
];

const CRAVING_BADGES = [
  { emoji: '🍕', title: 'Pizza Lover', desc: 'Ordered 5 Pizzas', iconColor: '#FFA500', unlocked: true },
  { emoji: '🍜', title: 'Ramen Expert', desc: 'Comfort hot slurps', iconColor: '#9370DB', unlocked: true },
  { emoji: '🍩', title: 'Dessert Addict', desc: 'Sweet tooth master', iconColor: '#FF69B4', unlocked: true },
  { emoji: '🍗', title: 'Biryani Buff', desc: 'Spiced rice devotee', iconColor: '#FFA07A', unlocked: true },
  { emoji: '🥗', title: 'Salad Saint', desc: 'Fitness bowls 3x', iconColor: '#32CD32', unlocked: false },
  { emoji: '🌶️', title: 'Spicy Legend', desc: 'Max heat tier 3', iconColor: '#FF0000', unlocked: false }
];

export default function CravDNAView({ 
  dietTags, 
  setDietTags, 
  onTriggerNotification, 
  cravingDNA,
  level,
  xp,
  xpMax = 300,
  coins,
  setCoins,
  purchasedAccessories = [],
  setPurchasedAccessories,
  equippedAccessories = [],
  setEquippedAccessories,
  setSpeechText,
  location,
  onNavigate,
  onChangeLocation
}) {
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [explainerCardId, setExplainerCardId] = useState(null);
  const [chefGender, setChefGender] = useState(
    () => localStorage.getItem('cravlings_chef_gender') || 'male'
  );
  const [showWalletDetails, setShowWalletDetails] = useState(false);

  const handleDietToggle = (tagId) => {
    if (dietTags.includes(tagId)) {
      setDietTags(dietTags.filter(t => t !== tagId));
    } else {
      setDietTags([...dietTags, tagId]);
    }
  };

  const handleSavePreferences = () => {
    onTriggerNotification("💾 Cravings profile & diet saved!");
  };

  const handleCategoryClick = (category) => {
    if (category === 'Food') {
      onNavigate('home');
    } else if (category === 'Wizard') {
      onNavigate('wizard');
    } else if (category === 'Dineout') {
      onNavigate('kitchens');
    }
  };

  const handleLocationClick = () => {
    const suggestions = [
      "Salt Lake, Sector V, Kolkata",
      "Indiranagar, 12th Main, Bengaluru",
      "Bandra West, Hill Road, Mumbai",
      "Connaught Place, Block E, New Delhi"
    ];
    const val = prompt(
      `Change delivery address:\n\nSuggestions:\n1. ${suggestions[0]}\n2. ${suggestions[1]}\n3. ${suggestions[2]}\n4. ${suggestions[3]}\n\nOr type your custom address below:`,
      location
    );
    if (val) {
      let selected = val.trim();
      if (selected === "1") selected = suggestions[0];
      else if (selected === "2") selected = suggestions[1];
      else if (selected === "3") selected = suggestions[2];
      else if (selected === "4") selected = suggestions[3];

      const weathers = ["sunny", "rainy"];
      const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
      if (onChangeLocation) {
        onChangeLocation(selected, randomWeather);
      }
    }
  };

  // Helper color map for DNA legends
  const dnaColors = {
    Cheesy: '#FFB100',
    Spicy: '#FF3E3E',
    Sweet: '#FF6EB4',
    Comfort: '#8A2BE2',
    Healthy: '#00CD66'
  };

  // Determine dynamic Taste Archetype based on highest DNA percentage
  const dnaScores = [
    { type: 'Cheesy', val: cravingDNA.Cheesy, title: 'Cheese Overlord 🧀', desc: 'You believe everything is better with melted gooey goodness.' },
    { type: 'Spicy', val: cravingDNA.Spicy, title: 'Spicy Fire-Breather 🌶️', desc: 'No level of spice can scare you. You live on the edge!' },
    { type: 'Sweet', val: cravingDNA.Sweet, title: 'Dessert Royalty 🍩', desc: 'Life is short, eat dessert first. You have a massive sweet tooth.' },
    { type: 'Comfort', val: cravingDNA.Comfort, title: 'Comfort Food Fanatic 🍜', desc: 'Warm broths, carbs, and cozy bites are your go-to cure.' },
    { type: 'Healthy', val: cravingDNA.Healthy, title: 'Clean-Eating Champion 🥗', desc: 'Nutritious, fresh, and high-protein fuels your active lifestyle.' }
  ];
  const archetype = [...dnaScores].sort((a, b) => b.val - a.val)[0] || dnaScores[0];

  const evolution = EVOLUTION_STAGES.find(s => level >= s.minLevel && level <= s.maxLevel) || EVOLUTION_STAGES[3];

  // Dialog Explainer Content dictionary
  const getExplainerContent = (id) => {
    switch (id) {
      case 'general':
        return {
          title: "What is Crav DNA? 🧬",
          desc: "Crav DNA is your unique visual flavor profile! Instead of filling out boring surveys, your flavor preferences are automatically computed by analyzing your cloud kitchen orders, searches, and selected diets.",
          proTip: "Try ordering new cuisines to dynamically evolve your profile bars!",
          arrowDirection: "up"
        };
      case 'archetype':
        return {
          title: "Taste Archetype 👑",
          desc: "Calculated based on your highest DNA percentage. It gives you a gamified title (e.g. Cheese Overlord, Dessert Royalty) that unlocks custom discounts matching your current craving!",
          proTip: "Your companion trainer levels up as you order, granting higher coin multiplier boosts.",
          arrowDirection: "up"
        };
      case 'mascot':
        return {
          title: "Companion Mascot (Blobby) 🥚",
          desc: "Chef Blobby is your virtual foodie companion! Blobby hatches from an Egg and evolves into a Flavor God as you gain XP from orders and ratings.",
          proTip: "Click 'Customize' to dress up Blobby in the Shop with unlocked accessories!",
          arrowDirection: "up"
        };
      case 'bar':
        return {
          title: "Crav DNA Taste Bar 📊",
          desc: "A live color-coded stack bar representing your preference ratios. Red is Spicy, Orange is Cheesy, Pink is Sweet, Purple is Comfort, and Green is Healthy.",
          proTip: "Order a fresh Green Salad right now to boost your Healthy DNA bar!",
          arrowDirection: "down"
        };
      case 'stats':
        return {
          title: "Companion Stats 💖",
          desc: "Monitors Blobby's current metrics. Happiness is kept high by outfitting him, Appetite tells you what he wants to eat next, and Streak triggers active coin bonuses.",
          proTip: "Maintain a 7-day order streak to activate a massive 1.5x Coin Multiplier!",
          arrowDirection: "down"
        };
      case 'diet':
        return {
          title: "Dietary Preferences 🌾",
          desc: "Selecting these tags helps Blobby automatically filter searches. Restaurants matching these parameters get pinned to the top of your discovery feed.",
          proTip: "Check 'Pure Veg' and watch the App immediately highlight organic food joints!",
          arrowDirection: "down"
        };
      case 'badges':
        return {
          title: "Unlocked Badges 🎖️",
          desc: "Milestone achievements celebrating your food journey! Completing badges awards Mascot Coins and boosts your leveling speed.",
          proTip: "Order 5 pizzas to unlock the master Pizza Lover badge and get +100 Coins!",
          arrowDirection: "down"
        };
      default:
        return null;
    }
  };

  const currentExplainer = getExplainerContent(explainerCardId);

  // Helper ChefAvatar Visual Component for profile header
  const renderChefAvatar = (isLarge = false) => {
    const headItems = ['chef_hat', 'party_hat', 'pirate_hat', 'crown', 'alien', 'ninja'];
    const equippedHead = SHOP_ITEMS.find(i => equippedAccessories.includes(i.id) && headItems.includes(i.id));
    const equippedEyes = SHOP_ITEMS.find(i => equippedAccessories.includes(i.id) && i.id === 'sunglasses');
    const equippedAura = SHOP_ITEMS.find(i => equippedAccessories.includes(i.id) && i.id === 'rainbow');
    const baseFace = chefGender === 'male' ? '👨' : '👩';
    const boxSize = isLarge ? '90px' : '70px';
    const faceSize = isLarge ? '52px' : '38px';
    const bodySize = isLarge ? '32px' : '24px';
    const hatSize = isLarge ? '46px' : '34px';
    const hatTop = isLarge ? '-24px' : '-18px';
    const eyesSize = isLarge ? '28px' : '20px';
    const eyesTop = isLarge ? '28px' : '20px';
    const auraSize = isLarge ? '85px' : '64px';

    return (
      <div style={{
        position: 'relative',
        width: boxSize,
        height: boxSize,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #FFE2E2 0%, #F5CBA7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
        margin: '0 auto',
        zIndex: 2,
        border: '2.5px solid white'
      }}>
        {/* 1. Aura background */}
        {equippedAura && (
          <span style={{
            position: 'absolute',
            fontSize: auraSize,
            opacity: 0.7,
            zIndex: 1,
            animation: 'spinAura 12s linear infinite',
            pointerEvents: 'none'
          }}>
            {equippedAura.emoji}
          </span>
        )}

        {/* 2. Character Face base */}
        <span style={{
          fontSize: faceSize,
          zIndex: 5,
          userSelect: 'none',
          marginTop: isLarge ? '6px' : '4px'
        }}>
          {baseFace}
        </span>

        {/* 3. Tunic Body at bottom */}
        <span style={{
          position: 'absolute',
          bottom: isLarge ? '2px' : '0px',
          fontSize: bodySize,
          zIndex: 4,
          opacity: 0.95
        }}>
          🧑‍🍳
        </span>

        {/* 4. Head Hat positioned absolute top */}
        {equippedHead && (
          <span style={{
            position: 'absolute',
            top: hatTop,
            fontSize: hatSize,
            zIndex: 10,
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))',
            pointerEvents: 'none'
          }}>
            {equippedHead.emoji}
          </span>
        )}

        {/* 5. Sunglasses positioned absolute middle */}
        {equippedEyes && (
          <span style={{
            position: 'absolute',
            top: eyesTop,
            fontSize: eyesSize,
            zIndex: 8,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))',
            pointerEvents: 'none'
          }}>
            {equippedEyes.emoji}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="swiggy-home-container dineout-portal-root" style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden', background: 'white' }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spinAura {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounceArrow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: translate(-50%, -45%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}} />

      {/* 1. Header */}
      <div className="swiggy-purple-section" style={{ width: '100%', boxSizing: 'border-box' }}>
        
        {/* Dynamic Location Picker */}
        <div className="swiggy-black-location-picker" style={{ width: '100%', boxSizing: 'border-box' }}>
          <div className="black-loc-left" onClick={handleLocationClick}>
            <div className="loc-title-row">
              <i className="fa-solid fa-location-dot location-pin-white"></i>
              <span className="loc-bold-title">Home</span>
              <i className="fa-solid fa-chevron-down location-arrow-white"></i>
            </div>
            <span className="black-location-text">{location}</span>
          </div>
          
          <div className="black-loc-right-tools">
            <div className="wallet-circle-btn" onClick={() => setShowWalletDetails(true)}>
              <i className="fa-solid fa-wallet"></i>
            </div>
          </div>
        </div>

        {/* Category Switcher Tabs */}
        <div className="swiggy-categories-carousel" style={{ width: '100%', boxSizing: 'border-box' }}>
          {[
            { id: 'Food', label: 'Food', emoji: '🍔' },
            { id: 'Wizard', label: 'Wizard', emoji: '🪄', badge: 'AI' },
            { id: 'Dineout', label: 'Dineout', emoji: '🍽️' },
            { id: 'Crav DNA', label: 'Crav DNA', emoji: '🧬', badge: `LVL ${level || 1}` }
          ].map(cat => (
            <div 
              key={cat.id} 
              className={`swiggy-category-card ${cat.id === 'Crav DNA' ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              <div className="swiggy-category-icon-wrapper">
                <span className="swiggy-category-emoji">{cat.emoji}</span>
                {cat.badge && <span className="swiggy-category-badge-pill">{cat.badge}</span>}
              </div>
              <span className="swiggy-category-label">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Top Organic Container (Violet section) */}
      <div 
        className="swiggy-organic-container profile-organic-container" 
        style={{ 
          paddingBottom: '24px', 
          width: '100%', 
          maxWidth: '100%', 
          boxSizing: 'border-box', 
          overflowX: 'hidden',
          borderBottomLeftRadius: '40px',
          borderBottomRightRadius: '40px'
        }}
      >
        {/* Dynamic Cravings Archetype Header */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.12)', 
          borderRadius: '24px', 
          padding: '16px 20px', 
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxSizing: 'border-box',
          width: '100%',
          position: 'relative'
        }}>
          {/* Question/Info badge */}
          <button 
            onClick={() => setExplainerCardId('archetype')}
            style={{ position: 'absolute', right: '16px', top: '16px', border: 'none', background: 'rgba(255,255,255,0.15)', color: 'white', cursor: 'pointer', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800' }}
          >
            <i className="fa-solid fa-question"></i>
          </button>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ 
              width: '52px', 
              height: '52px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #FFE2E2 0%, #F5CBA7 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '22px', 
              fontWeight: '800',
              border: '2px solid white',
              flexShrink: 0
            }}>
              🧬
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: '10px', background: '#B5FF38', color: '#1C1C1E', padding: '2px 8px', borderRadius: '12px', fontWeight: '800', textTransform: 'uppercase' }}>CRAV ARCHETYPE</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: '800', fontFamily: 'Fredoka, sans-serif', color: 'white' }}>
                {archetype.title}
              </h3>
            </div>
          </div>
          <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.4' }}>
            {archetype.desc}
          </p>
          
          {/* XP Level Bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '700' }}>
              <span style={{ color: '#B5FF38' }}><i className="fa-solid fa-graduation-cap"></i> LVL {level} Companion Trainer</span>
              <span style={{ opacity: 0.9 }}>{xp} / {xpMax} XP</span>
            </div>
            <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, (xp / xpMax) * 100)}%`, background: '#B5FF38', borderRadius: '3px', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        </div>

        {/* Evolving Companion Mascot Widget */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '24px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginTop: '16px',
          width: '100%',
          boxSizing: 'border-box',
          position: 'relative'
        }}>
          {/* Info trigger */}
          <button 
            onClick={() => setExplainerCardId('mascot')}
            style={{ position: 'absolute', right: '16px', top: '16px', border: 'none', background: 'rgba(255,255,255,0.15)', color: 'white', cursor: 'pointer', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800' }}
          >
            <i className="fa-solid fa-question"></i>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
            {/* Avatar stage (Chef Character) */}
            <div className="wardrobe-avatar-stage" style={{ minWidth: '70px' }}>
              {renderChefAvatar(false)}
            </div>

            <div style={{ flex: 1, minWidth: 0, color: 'white' }}>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>
                Chef {chefGender === 'male' ? 'Blobby' : 'Blobina'} ({evolution.stage})
              </h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: '1.3' }}>
                Companion outfitted with unlocked gear.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowWardrobe(true)}
            style={{
              background: '#B5FF38',
              color: '#1C1C1E',
              border: 'none',
              borderRadius: '16px',
              padding: '10px 14px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(181, 255, 56, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0
            }}
          >
            <i className="fa-solid fa-shirt"></i> Customize
          </button>
        </div>
      </div>

      {/* 3. White Container Below */}
      <div 
        className="dineout-listings-white-container" 
        style={{ 
          background: 'white', 
          padding: '24px 16px 100px 16px', 
          width: '100%', 
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {/* Craving DNA Section Card */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '16px', color: '#1C1C1E', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>Your Craving DNA</h4>
              <button 
                onClick={() => setExplainerCardId('bar')}
                style={{ border: 'none', background: '#F3F4F6', color: '#8E8E93', cursor: 'pointer', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}
              >
                <i className="fa-solid fa-question"></i>
              </button>
            </div>
            <span 
              onClick={() => setExplainerCardId('general')}
              style={{ fontSize: '11px', background: 'rgba(230,0,92,0.06)', color: '#E6005C', padding: '2px 8px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
            >
              🧬 HOW IT WORKS?
            </span>
          </div>
          <p style={{ margin: '0 0 12px 0', fontSize: '11.5px', color: '#8E8E93' }}>Updates dynamically based on companion meals and search habits.</p>
          
          <div style={{ 
            background: '#F8F9FA', 
            borderRadius: '20px', 
            padding: '16px', 
            border: '1px solid #E5E7EB',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {/* Stacked DNA Progress Bar */}
            <div style={{ 
              height: '12px', 
              width: '100%', 
              display: 'flex', 
              borderRadius: '6px', 
              overflow: 'hidden', 
              background: '#E5E7EB',
              marginBottom: '16px'
            }}>
              <div style={{ width: `${cravingDNA.Cheesy}%`, background: dnaColors.Cheesy }} />
              <div style={{ width: `${cravingDNA.Spicy}%`, background: dnaColors.Spicy }} />
              <div style={{ width: `${cravingDNA.Sweet}%`, background: dnaColors.Sweet }} />
              <div style={{ width: `${cravingDNA.Comfort}%`, background: dnaColors.Comfort }} />
              <div style={{ width: `${cravingDNA.Healthy}%`, background: dnaColors.Healthy }} />
            </div>
            
            {/* Legend Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '8px 16px',
              fontSize: '12px',
              fontWeight: '800',
              color: '#3A3A3C'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: dnaColors.Cheesy }} />
                <span>🧀 Cheesy: {cravingDNA.Cheesy}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: dnaColors.Spicy }} />
                <span>🌶️ Spicy: {cravingDNA.Spicy}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: dnaColors.Sweet }} />
                <span>🍩 Sweet: {cravingDNA.Sweet}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: dnaColors.Comfort }} />
                <span>🍜 Comfort: {cravingDNA.Comfort}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', gridColumn: 'span 2' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: dnaColors.Healthy }} />
                <span>🥗 Healthy: {cravingDNA.Healthy}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Companion Status & Care Panel */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h4 style={{ margin: 0, fontSize: '16px', color: '#1C1C1E', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>Blobby's Companion Stats</h4>
            <button 
              onClick={() => setExplainerCardId('stats')}
              style={{ border: 'none', background: '#F3F4F6', color: '#8E8E93', cursor: 'pointer', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}
            >
              <i className="fa-solid fa-question"></i>
            </button>
          </div>
          <p style={{ margin: '0 0 12px 0', fontSize: '11.5px', color: '#8E8E93' }}>Care metrics mapping back to active ordering habits.</p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {[
              { label: 'Happiness 💖', val: '98%', desc: 'Outfit boost active', color: '#FF4D88', icon: 'fa-heart' },
              { label: 'Appetite 🍽️', val: archetype.type.split(' ')[0], desc: 'Craving match code', color: '#3B82F6', icon: 'fa-utensils' },
              { label: 'Active Streak 🔥', val: '7 Days', desc: '1.2x coin multiplier', color: '#F59E0B', icon: 'fa-fire' },
              { label: 'Total Coins 🪙', val: `${coins} g`, desc: 'Spendable gold coins', color: '#10B981', icon: 'fa-coins' }
            ].map((stat, i) => (
              <div key={i} style={{ background: '#F9FAFB', border: '1px solid #EAEAEA', borderRadius: '20px', padding: '12px 14px', boxSizing: 'border-box', position: 'relative' }}>
                <i className={`fa-solid ${stat.icon}`} style={{ position: 'absolute', right: '14px', top: '14px', color: stat.color, opacity: 0.25, fontSize: '20px' }}></i>
                <span style={{ fontSize: '12.5px', fontWeight: '800', color: stat.color, display: 'block' }}>{stat.label}</span>
                <span style={{ fontSize: '18px', fontWeight: '800', display: 'block', margin: '4px 0 2px 0', color: '#1C1C1E' }}>{stat.val}</span>
                <span style={{ fontSize: '9px', color: '#8E8E93', lineHeight: '1.2', display: 'block' }}>{stat.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dietary Preferences Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h4 style={{ margin: 0, fontSize: '16px', color: '#1C1C1E', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>Dietary Filter</h4>
            <button 
              onClick={() => setExplainerCardId('diet')}
              style={{ border: 'none', background: '#F3F4F6', color: '#8E8E93', cursor: 'pointer', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}
            >
              <i className="fa-solid fa-question"></i>
            </button>
          </div>
          <p style={{ margin: '0 0 16px 0', fontSize: '11.5px', color: '#8E8E93' }}>Blobby filters recipe options according to your choices.</p>
          
          {/* Structured Grid Layout for Diet Tags */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
            {DIET_TAGS.map(tag => {
              const isActive = dietTags.includes(tag.id);
              return (
                <button 
                  key={tag.id}
                  onClick={() => {
                    handleDietToggle(tag.id);
                    onTriggerNotification(`${isActive ? 'Removed' : 'Added'} filter: ${tag.label}`);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    border: isActive ? '2px solid #E6005C' : '1px solid #E5E7EB',
                    background: isActive ? 'linear-gradient(135deg, rgba(230,0,92,0.06), rgba(230,0,92,0.12))' : '#F9FAFB',
                    color: isActive ? '#E6005C' : '#3A3A3C',
                    boxShadow: isActive ? '0 4px 10px rgba(230, 0, 92, 0.1)' : 'none',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    justifyContent: 'flex-start'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{tag.emoji}</span>
                  <span style={{ flex: 1, textAlign: 'left' }}>{tag.label}</span>
                  {isActive && <i className="fa-solid fa-circle-check" style={{ fontSize: '12px', color: '#E6005C' }}></i>}
                </button>
              );
            })}
          </div>
          
          <button 
            onClick={handleSavePreferences}
            style={{
              marginTop: '16px',
              background: '#E6005C',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '12px 20px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(230, 0, 92, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className="fa-solid fa-floppy-disk"></i> Save Preferences
          </button>
        </div>

        {/* Unlocked Badges Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <h4 style={{ margin: 0, fontSize: '16px', color: '#1C1C1E', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>Unlocked Cravings Badges</h4>
            <button 
              onClick={() => setExplainerCardId('badges')}
              style={{ border: 'none', background: '#F3F4F6', color: '#8E8E93', cursor: 'pointer', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}
            >
              <i className="fa-solid fa-question"></i>
            </button>
          </div>
          
          {/* Gamified Grayscale locked/unlocked grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
            {CRAVING_BADGES.map((badge, idx) => (
              <div 
                key={idx}
                onClick={() => onTriggerNotification(badge.unlocked ? `🏆 Unlocked: ${badge.title} (${badge.desc})` : `🔒 Locked: Order more matching food to unlock!`)}
                style={{
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '20px',
                  padding: '14px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
                  position: 'relative',
                  cursor: 'pointer',
                  filter: badge.unlocked ? 'none' : 'grayscale(100%)',
                  opacity: badge.unlocked ? 1 : 0.5,
                  transition: 'all 0.2s ease',
                  transform: badge.unlocked ? 'scale(1)' : 'scale(0.96)'
                }}
              >
                {badge.unlocked ? (
                  <i className="fa-solid fa-award" style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '12px', color: badge.iconColor }}></i>
                ) : (
                  <i className="fa-solid fa-lock" style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '10px', color: '#8E8E93' }}></i>
                )}
                <span style={{ fontSize: '28px', marginBottom: '6px' }}>{badge.emoji}</span>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#3A3A3C', textAlign: 'center', wordBreak: 'break-word' }}>{badge.title}</span>
                <span style={{ fontSize: '9px', color: '#8E8E93', textAlign: 'center', marginTop: '4px', lineHeight: '1.2' }}>{badge.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Slide-up Wardrobe Customization Sheet */}
      {showWardrobe && (
        <>
          <div className="drawer-backdrop" onClick={() => setShowWardrobe(false)} style={{ zIndex: 999 }}></div>
          <div className="cart-slide-drawer" style={{ 
            zIndex: 1000, 
            background: 'white', 
            borderTopLeftRadius: '32px', 
            borderTopRightRadius: '32px', 
            padding: '24px 16px', 
            boxSizing: 'border-box',
            height: '85vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div className="cart-drawer-header" style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '12px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>👑</span>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>Blobby's Outfit Shop</h3>
              </div>
              <div className="cart-close-btn" onClick={() => setShowWardrobe(false)} style={{ cursor: 'pointer', padding: '4px' }}>
                <i className="fa-solid fa-xmark" style={{ fontSize: '20px' }}></i>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
              <WardrobeView 
                level={level}
                coins={coins}
                setCoins={setCoins}
                purchasedAccessories={purchasedAccessories}
                setPurchasedAccessories={setPurchasedAccessories}
                equippedAccessories={equippedAccessories}
                setEquippedAccessories={setEquippedAccessories}
                onTriggerNotification={onTriggerNotification}
                setSpeechText={setSpeechText}
                chefGender={chefGender}
                setChefGender={setChefGender}
              />
            </div>
          </div>
        </>
      )}

      {/* 5. DNA Interactive Pop-up Explainer Modal */}
      {explainerCardId && currentExplainer && (
        <>
          <div className="drawer-backdrop" onClick={() => setExplainerCardId(null)} style={{ zIndex: 99999 }}></div>
          <div 
            style={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '350px',
              background: '#1A0E2E',
              color: 'white',
              borderRadius: '28px',
              padding: '24px',
              boxSizing: 'border-box',
              zIndex: 100000,
              boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
              border: '2px solid #E6005C',
              animation: 'scaleUp 0.25s ease-out'
            }}
          >
            {/* Visual Arrow Pointer indicator */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              fontSize: '28px',
              color: '#B5FF38',
              marginBottom: '10px',
              animation: 'bounceArrow 1.5s infinite ease-in-out'
            }}>
              {currentExplainer.arrowDirection === 'up' ? (
                <i className="fa-solid fa-arrow-up-long"></i>
              ) : (
                <i className="fa-solid fa-arrow-down-long"></i>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', fontFamily: 'Fredoka, sans-serif', color: '#B5FF38' }}>
                {currentExplainer.title}
              </h3>
              <button 
                onClick={() => setExplainerCardId(null)}
                style={{ background: 'transparent', border: 'none', color: '#8E8E93', cursor: 'pointer', fontSize: '18px' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#EAEAEA', margin: '0 0 16px 0' }}>
              {currentExplainer.desc}
            </p>

            {/* Blobby Pro Tip block */}
            <div style={{ background: 'rgba(181, 255, 56, 0.08)', border: '1px dashed #B5FF38', borderRadius: '16px', padding: '12px' }}>
              <span style={{ fontSize: '10px', fontWeight: '800', color: '#B5FF38', display: 'block', marginBottom: '4px' }}>💡 BLOBBY'S PRO TIP:</span>
              <p style={{ margin: 0, fontSize: '11px', color: '#B5FF38', lineHeight: '1.4' }}>
                "{currentExplainer.proTip}"
              </p>
            </div>

            <button 
              onClick={() => setExplainerCardId(null)}
              style={{
                width: '100%',
                background: '#E6005C',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '12px',
                fontWeight: '800',
                fontSize: '13px',
                marginTop: '16px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(230,0,92,0.3)'
              }}
            >
              Got it, Chef! 👍
            </button>
          </div>
        </>
      )}

      {/* Crav Wallet Details Modal */}
      {showWalletDetails && (
        <>
          <div className="drawer-backdrop" onClick={() => setShowWalletDetails(false)} style={{ zIndex: 99999 }}></div>
          <div 
            style={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '95%',
              maxWidth: '380px',
              background: '#FFFFFF',
              color: '#1C1C1E',
              borderRadius: '28px',
              padding: '24px',
              boxSizing: 'border-box',
              zIndex: 100000,
              boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
              border: '1.5px solid #FF5E7E',
              animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', fontFamily: 'Fredoka, sans-serif', color: '#1C1C1E' }}>
                My Crave Coins Wallet 🪙
              </h3>
              <button 
                onClick={() => setShowWalletDetails(false)}
                style={{ background: 'transparent', border: 'none', color: '#8E8E93', cursor: 'pointer', fontSize: '18px' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Practical Wallet Digital Card Banner */}
            <div style={{ 
              background: 'linear-gradient(135deg, #1C0F35 0%, #341235 100%)', 
              borderRadius: '24px', 
              padding: '20px', 
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              border: '1.5px solid rgba(255, 94, 126, 0.3)',
              marginBottom: '16px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }}>
              {/* Spinning coin */}
              <span style={{ 
                position: 'absolute', 
                right: '24px', 
                top: '20px', 
                fontSize: '28px', 
                animation: 'floatCoin 3s ease-in-out infinite' 
              }}>🪙</span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '50%', 
                  background: 'rgba(255, 255, 255, 0.15)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '24px',
                  animation: 'walletPulse 2s infinite ease-in-out'
                }}>
                  👛
                </div>
                <div>
                  <span style={{ fontSize: '10px', background: '#FF5E7E', color: 'white', padding: '1px 6px', borderRadius: '8px', fontWeight: '800', textTransform: 'uppercase' }}>CRAVE WALLET</span>
                  <span style={{ fontSize: '11px', color: '#CECCD6', display: 'block', marginTop: '2px' }}>Verified Member</span>
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <span style={{ fontSize: '11px', color: '#CECCD6', display: 'block' }}>Wallet Balance</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '26px', fontWeight: '900', fontFamily: 'Fredoka, sans-serif' }}>🪙 {coins}</span>
                  <span style={{ fontSize: '14px', color: '#B5FF38', fontWeight: '700' }}>(₹{coins})</span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '12.5px', color: '#555', lineHeight: '1.4', margin: '0 0 16px 0', textAlign: 'center' }}>
              Redeem these Crave Coins at order checkout to save money! You can also apply vouchers for extra flat discounts.
            </p>

            {/* Fake Vouchers Section */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', color: '#8E8E93', display: 'block', fontWeight: '800', marginBottom: '8px', textTransform: 'uppercase' }}>
                Active Promo Coupons (Click to Copy)
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { code: 'CRAVE100', desc: 'Flat ₹100 Off (Min order ₹200)' },
                  { code: 'BLOBBY150', desc: 'Flat ₹150 Off (Min order ₹250)' },
                  { code: 'GOLDEN50', desc: 'Flat ₹50 Off (No Min order)' }
                ].map(voucher => (
                  <div 
                    key={voucher.code}
                    onClick={() => {
                      navigator.clipboard.writeText(voucher.code);
                      onTriggerNotification(`📋 Copied code: ${voucher.code}!`);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: '#FFF5ED',
                      border: '1px dashed #FFE3D5',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#FF5E7E', display: 'block' }}>🏷️ {voucher.code}</span>
                      <span style={{ fontSize: '10.5px', color: '#8E8E93' }}>{voucher.desc}</span>
                    </div>
                    <i className="fa-solid fa-copy" style={{ color: '#FF5E7E', fontSize: '14px' }}></i>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setShowWalletDetails(false)}
              style={{
                width: '100%',
                background: '#E6005C',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '12px',
                fontWeight: '800',
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(230,0,92,0.2)'
              }}
            >
              Done 👍
            </button>
          </div>
        </>
      )}

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
      `}} />

    </div>
  );
}
