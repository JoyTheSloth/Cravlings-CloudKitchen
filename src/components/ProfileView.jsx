import React, { useState, useEffect } from 'react';
import { dishes } from '../data/dishes';

const DIET_TAGS = [
  { id: 'Vegan', emoji: '🌱', label: 'Vegan Diet', desc: 'No animal products or derivatives' },
  { id: 'GlutenFree', emoji: '🌾', label: 'Gluten-Free', desc: 'Wheat-free, stomach sensitive recipes' },
  { id: 'HighProtein', emoji: '🥩', label: 'High Protein', desc: 'Packed with lean meats, eggs or tofu' },
  { id: 'LowCarb', emoji: '🥦', label: 'Low Carb', desc: 'Keto-friendly vegetables & healthy fats' }
];

export default function ProfileView({ 
  dietTags, 
  setDietTags, 
  missions, 
  setMissions, 
  onTriggerNotification, 
  onAwardXP,
  setSpeechText,
  cravingDNA,
  level,
  xp,
  xpMax = 300,
  pastOrders,
  onAddDish,
  location,
  onOpenDishDetails
}) {
  // Custom timer state for Limited Time Offer (copied from HomeView)
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 18, seconds: 45 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 2, minutes: 18, seconds: 45 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDietToggle = (tagId) => {
    if (dietTags.includes(tagId)) {
      setDietTags(dietTags.filter(t => t !== tagId));
    } else {
      setDietTags([...dietTags, tagId]);
    }
  };

  const handleSavePreferences = () => {
    onTriggerNotification("💾 Preferences saved successfully!");
    if (setSpeechText) {
      setSpeechText("Preferences updated! Blobby will remember this for future cravings! 😋");
    }
  };

  const handleMissionCheck = (mission) => {
    if (mission.completed) return;

    // Mark completed
    setMissions(missions.map(m => m.id === mission.id ? { ...m, completed: true } : m));
    onAwardXP(mission.reward);
    onTriggerNotification(`Claimed Daily Mission! +${mission.reward} XP.`);
  };

  const handleSurpriseSpin = () => {
    const tags = ['Cheesy', 'Spicy', 'Sweet', 'Comfort', 'Healthy', 'Midnight', 'Crunchy', 'Coffee'];
    const randomTag = tags[Math.floor(Math.random() * tags.length)];
    onTriggerNotification(`🎲 Surprise Spin matched: ${randomTag}!`);
    
    // Choose a random dish matching the tag
    const matches = dishes.filter(d => d.tags.includes(randomTag));
    if (matches.length > 0) {
      const chosen = matches[Math.floor(Math.random() * matches.length)];
      if (onOpenDishDetails) {
        setTimeout(() => {
          onOpenDishDetails(chosen);
        }, 500);
      }
    }
  };

  return (
    <div className="viewport-content-panel profile-view-container" style={{ paddingBottom: '40px' }}>
      {/* Profile Info Card */}
      <div style={{ background: 'var(--bg-cream)', borderRadius: 'var(--radius-xl)', border: '1.5px solid rgba(229, 213, 197, 0.4)', padding: '24px', display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '25px' }}>
        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--grad-coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: 'white', fontWeight: '900', boxShadow: '0 4px 12px rgba(255, 94, 126, 0.2)' }}>
          S
        </div>
        <div>
          <h3 style={{ fontFamily: 'Fredoka, sans-serif' }}>Shivani Das</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>shivani.das@email.com • Level {level} Companion Trainer</p>
        </div>
      </div>

      {/* Dietary Profile Section */}
      <div className="section-headline-bar">
        <h3>Dietary Preference Profile 🥗</h3>
      </div>
      <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '15px' }}>
        Check tags to let Blobby filter recommendation algorithms according to your daily dietary needs.
      </p>

      <div className="profile-dietary-row">
        {DIET_TAGS.map(tag => {
          const isActive = dietTags.includes(tag.id);
          return (
            <div 
              key={tag.id}
              className={`diet-tag-card-button ${isActive ? 'active' : ''}`}
              onClick={() => handleDietToggle(tag.id)}
            >
              <div className="diet-card-icon-frame">{tag.emoji}</div>
              <div className="diet-card-meta">
                <h4>{tag.label}</h4>
                <p>{tag.desc}</p>
              </div>
              <div className="diet-card-checked-check">
                {isActive ? <i className="fa-solid fa-check"></i> : null}
              </div>
            </div>
          );
        })}
      </div>

      <button className="profile-save-btn" onClick={handleSavePreferences} style={{ marginBottom: '35px' }}>
        Save Cravings Profile
      </button>

      {/* 1. Craving DNA Section (Moved from HomeView) */}
      <div className="section-headline-bar">
        <h3>Your Craving DNA</h3>
      </div>
      <div className="craving-dna-container-card" style={{ marginBottom: '25px' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
          This data represents your companion profile, updating in real-time as you select moods or feed Chef Blobby!
        </p>

        {/* Stacked dynamic color bar */}
        <div className="craving-dna-bar-track">
          <div className="dna-bar-fill cheesy" style={{ width: `${cravingDNA.Cheesy}%` }} title={`Cheesy: ${cravingDNA.Cheesy}%`}></div>
          <div className="dna-bar-fill spicy" style={{ width: `${cravingDNA.Spicy}%` }} title={`Spicy: ${cravingDNA.Spicy}%`}></div>
          <div className="dna-bar-fill sweet" style={{ width: `${cravingDNA.Sweet}%` }} title={`Sweet: ${cravingDNA.Sweet}%`}></div>
          <div className="dna-bar-fill comfort" style={{ width: `${cravingDNA.Comfort}%` }} title={`Comfort: ${cravingDNA.Comfort}%`}></div>
          <div className="dna-bar-fill healthy" style={{ width: `${cravingDNA.Healthy}%` }} title={`Healthy: ${cravingDNA.Healthy}%`}></div>
        </div>

        {/* Legend */}
        <div className="craving-dna-legend-grid">
          <div className="legend-node"><span className="dot cheesy"></span> Cheesy {cravingDNA.Cheesy}%</div>
          <div className="legend-node"><span className="dot spicy"></span> Spicy {cravingDNA.Spicy}%</div>
          <div className="legend-node"><span className="dot sweet"></span> Sweet {cravingDNA.Sweet}%</div>
          <div className="legend-node"><span className="dot comfort"></span> Comfort {cravingDNA.Comfort}%</div>
          <div className="legend-node"><span className="dot healthy"></span> Healthy {cravingDNA.Healthy}%</div>
        </div>
      </div>

      {/* 2. Daily Mascot Missions (Combined with HomeView's Active Task) */}
      <div className="section-headline-bar">
        <h3>Daily Mascot Missions 🏆</h3>
      </div>
      <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '15px' }}>
        Complete daily interactive tasks with Chef Blobby to earn bonus coins and companion XP!
      </p>

      <div className="missions-checklist" style={{ marginBottom: '25px' }}>
        {/* Active Daily Mission Banner */}
        <div className="daily-mission-banner-card" style={{ marginBottom: '15px', border: '1.5px solid rgba(255, 94, 126, 0.15)' }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary-coral)', textTransform: 'uppercase' }}>Active Spotlight Task</span>
            <h4 style={{ marginTop: '2px', fontFamily: 'Fredoka, sans-serif' }}>🌶 Try something spicy today</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Reward: +100 XP / +50 Coins</p>
          </div>
          <button 
            className="mission-claim-btn"
            onClick={() => {
              onAwardXP(100);
              onTriggerNotification("Claimed Daily Mission! +100 XP / +50 Coins 🏆");
            }}
          >
            Claim
          </button>
        </div>

        {missions.map(m => (
          <div 
            className="mission-check-row" 
            key={m.id}
            style={{ opacity: m.completed ? 0.6 : 1 }}
            onClick={() => handleMissionCheck(m)}
          >
            <input 
              type="checkbox" 
              checked={m.completed} 
              disabled={m.completed}
              onChange={() => {}} // Controlled by row click
              style={{ width: '16px', height: '16px', accentColor: 'var(--primary-coral)', marginRight: '8px' }}
            />
            <div style={{ flex: 1 }}>
              <span className="mission-check-text">{m.task}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '10px' }}>
                (+{m.reward} XP / {Math.round(m.reward / 2)} Coins)
              </span>
            </div>
            {m.completed && <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--success-mint)' }}>Completed</span>}
          </div>
        ))}
      </div>

      {/* 3. XP & Level Card (Moved from HomeView) */}
      <div className="section-headline-bar">
        <h3>Trainer Levels & Companion Progress</h3>
      </div>
      <div className="trainer-xp-level-card" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '800', opacity: '0.8' }}>COMPANION PROGRESS</span>
            <h4 style={{ fontFamily: 'Fredoka, sans-serif', marginTop: '2px' }}>Level {level}</h4>
          </div>
          <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--primary-coral)' }}>{xp} / {xpMax} XP</span>
        </div>
        <div className="trainer-xp-bar-track">
          <div className="trainer-xp-bar-fill" style={{ width: `${(xp / xpMax) * 100}%` }}></div>
        </div>
      </div>

      {/* 4. Limited Time Offer Banner (Moved from HomeView) */}
      <div className="limited-time-craving-card" style={{ marginBottom: '25px' }}>
        <div style={{ flex: 1 }}>
          <span className="limited-badge">⚡ LIMITED TIME OFFER</span>
          <h4 style={{ marginTop: '6px', fontFamily: 'Fredoka, sans-serif' }}>Get 50% OFF your second order from Pizza Hub</h4>
          <span style={{ fontSize: '13px', fontWeight: '800', display: 'block', marginTop: '8px' }}>
            ⏰ Countdown: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s left
          </span>
        </div>
        <i className="fa-solid fa-gift" style={{ fontSize: '42px', color: '#FFA62B', opacity: '0.9' }}></i>
      </div>

      {/* 5. Recently Fed (Moved from HomeView) */}
      <div className="section-headline-bar">
        <h3>Recently Fed</h3>
      </div>
      <div className="recently-fed-list" style={{ marginBottom: '25px' }}>
        {pastOrders && pastOrders.length > 0 ? (
          pastOrders.map(order => (
            <div key={order.id} className="recently-fed-item-row">
              <div>
                <span className="fed-name">{order.dish}</span>
                <span className="fed-date">Last ordered {order.date}</span>
              </div>
              <button className="fed-reorder-btn" onClick={() => onAddDish(dishes.find(d => d.name === order.dish) || dishes[0])}>
                Reorder
              </button>
            </div>
          ))
        ) : (
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '15px' }}>No orders placed yet!</p>
        )}
      </div>

      {/* 6. Surprise Me (Roulette Spin) (Moved from HomeView) */}
      <div className="section-headline-bar">
        <h3>Can't Decide?</h3>
      </div>
      <div className="surprise-me-roulette-card" onClick={handleSurpriseSpin} style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ fontSize: '32px' }}>🎲</span>
          <div style={{ flex: 1 }}>
            <h4>Surprise Cravings Wheel</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Spin Chef Blobby's secret craving wheel to choose a random menu recommendation!
            </p>
          </div>
        </div>
        <button className="roulette-spin-btn">Spin</button>
      </div>

      {/* 7. Friends are Craving (Moved from HomeView) */}
      <div className="friends-craving-box" style={{ marginBottom: '25px' }}>
        <i className="fa-solid fa-users" style={{ color: 'var(--primary-coral)', marginRight: '8px' }}></i>
        <span>12 people near you in {location ? location.split(',')[0] : 'Kolkata'} ordered Biryani today!</span>
      </div>

      {/* 8. Seasonal Suggestions (Moved from HomeView) */}
      <div className="section-headline-bar">
        <h3>Seasonal Delights</h3>
      </div>
      <div className="seasonal-suggestions-row" style={{ marginBottom: '25px' }}>
        <div className="seasonal-item-card" style={{ flex: 1 }}>
          <span style={{ fontSize: '24px' }}>🎄</span>
          <span className="title">Christmas Special</span>
          <p>Warm Plum cakes & cocoa pudding cups</p>
        </div>
        <div className="seasonal-item-card" style={{ flex: 1 }}>
          <span style={{ fontSize: '24px' }}>🌧️</span>
          <span className="title">Rainy Monsoon</span>
          <p>Hot ginger chai & crunchy veggie treats</p>
        </div>
      </div>

      {/* 9. Unlocked Badges (Moved from HomeView) */}
      <div className="section-headline-bar">
        <h3>Unlocked Badges</h3>
      </div>
      <div className="unlocked-badges-row" style={{ marginBottom: '35px' }}>
        <div className="badge-bubble-node" title="Pizza Lover">
          <span style={{ fontSize: '22px' }}>🍕</span>
          <span style={{ fontSize: '9px', fontWeight: '800', marginTop: '4px' }}>Pizza Lover</span>
        </div>
        <div className="badge-bubble-node" title="Ramen Expert">
          <span style={{ fontSize: '22px' }}>🍜</span>
          <span style={{ fontSize: '9px', fontWeight: '800', marginTop: '4px' }}>Ramen Expert</span>
        </div>
        <div className="badge-bubble-node" title="Dessert Addict">
          <span style={{ fontSize: '22px' }}>🍩</span>
          <span style={{ fontSize: '9px', fontWeight: '800', marginTop: '4px' }}>Dessert Addict</span>
        </div>
      </div>

      {/* 10. Mood Quote (Moved from HomeView) */}
      <div className="mood-quote-container" style={{ marginTop: '25px', marginBottom: '10px' }}>
        <p className="quote-text">"Every craving tells a story."</p>
      </div>
    </div>
  );
}
