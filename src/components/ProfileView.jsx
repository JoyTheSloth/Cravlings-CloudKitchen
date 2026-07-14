import React from 'react';

const DIET_TAGS = [
  { id: 'Vegan', emoji: '🌱', label: 'Vegan' },
  { id: 'GlutenFree', emoji: '🌾', label: 'Gluten-Free' },
  { id: 'HighProtein', emoji: '🥩', label: 'High Protein' },
  { id: 'LowCarb', emoji: '🥦', label: 'Low Carb' }
];

export default function ProfileView({ 
  dietTags, 
  setDietTags, 
  onTriggerNotification, 
  cravingDNA,
  level,
  xp,
  xpMax = 300,
}) {

  const handleDietToggle = (tagId) => {
    if (dietTags.includes(tagId)) {
      setDietTags(dietTags.filter(t => t !== tagId));
    } else {
      setDietTags([...dietTags, tagId]);
    }
  };

  const handleSavePreferences = () => {
    onTriggerNotification("💾 Preferences saved successfully!");
  };

  // Helper color map for DNA legends
  const dnaColors = {
    Cheesy: '#FFB100',
    Spicy: '#FF3E3E',
    Sweet: '#FF6EB4',
    Comfort: '#8A2BE2',
    Healthy: '#00CD66'
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'Poppins, sans-serif' }}>
      
      {/* 1. Sleek Profile Header & Level Progress */}
      <div style={{ 
        background: '#E6005C', 
        borderRadius: '24px', 
        padding: '20px', 
        color: 'white',
        boxShadow: '0 8px 24px rgba(230, 0, 92, 0.15)'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #FFE2E2 0%, #F5CBA7 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '22px', 
            fontWeight: '800',
            color: '#A04000',
            border: '2px solid white'
          }}>
            S
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>Shivani Kumari</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', opacity: 0.8 }}>shivani.kumari@email.com</p>
          </div>
        </div>
        
        {/* XP Level Bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '700' }}>
            <span style={{ color: '#E6005C' }}>LVL {level} Companion Trainer</span>
            <span style={{ opacity: 0.9 }}>{xp} / {xpMax} XP</span>
          </div>
          <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.15)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(100, (xp / xpMax) * 100)}%`, background: '#E6005C', borderRadius: '3px', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      </div>

      {/* 2. Dietary Preferences Section */}
      <div>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1C1C1E', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>Dietary Filter</h4>
        <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: '#8E8E93' }}>Blobby filters recipe options according to your choices.</p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {DIET_TAGS.map(tag => {
            const isActive = dietTags.includes(tag.id);
            return (
              <button 
                key={tag.id}
                onClick={() => handleDietToggle(tag.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  border: isActive ? '1.5px solid #E6005C' : '1.5px solid #E5E7EB',
                  background: isActive ? 'rgba(230, 0, 92, 0.06)' : '#F8F9FA',
                  color: isActive ? '#E6005C' : '#3A3A3C',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
              >
                <span>{tag.emoji}</span>
                <span>{tag.label}</span>
                {isActive && <i className="fa-solid fa-circle-check" style={{ fontSize: '11px', marginLeft: '2px' }}></i>}
              </button>
            );
          })}
        </div>
        
        <button 
          onClick={handleSavePreferences}
          style={{
            marginTop: '12px',
            background: '#E6005C',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(230, 0, 92, 0.15)',
            transition: 'background 0.2s'
          }}
        >
          Save Preferences
        </button>
      </div>

      {/* 3. Craving DNA Card */}
      <div>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1C1C1E', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>Your Craving DNA</h4>
        <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: '#8E8E93' }}>Updates dynamically based on your companion meals.</p>
        
        <div style={{ 
          background: '#F8F9FA', 
          borderRadius: '20px', 
          padding: '16px', 
          border: '1px solid #E5E7EB'
        }}>
          {/* Stacked DNA Progress Bar */}
          <div style={{ 
            height: '10px', 
            width: '100%', 
            display: 'flex', 
            borderRadius: '5px', 
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
            fontSize: '11px',
            fontWeight: '700',
            color: '#3A3A3C'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: dnaColors.Cheesy }} />
              <span>Cheesy: {cravingDNA.Cheesy}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: dnaColors.Spicy }} />
              <span>Spicy: {cravingDNA.Spicy}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: dnaColors.Sweet }} />
              <span>Sweet: {cravingDNA.Sweet}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: dnaColors.Comfort }} />
              <span>Comfort: {cravingDNA.Comfort}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', gridColumn: 'span 2' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: dnaColors.Healthy }} />
              <span>Healthy: {cravingDNA.Healthy}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Unlocked Badges */}
      <div>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#1C1C1E', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>Unlocked Badges</h4>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          {[
            { emoji: '🍕', title: 'Pizza Lover' },
            { emoji: '🍜', title: 'Ramen Expert' },
            { emoji: '🍩', title: 'Dessert Addict' }
          ].map((badge, idx) => (
            <div 
              key={idx}
              style={{
                flex: 1,
                background: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '16px',
                padding: '12px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}
            >
              <span style={{ fontSize: '24px', marginBottom: '4px' }}>{badge.emoji}</span>
              <span style={{ fontSize: '9px', fontWeight: '800', color: '#3A3A3C', textAlign: 'center' }}>{badge.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Account & Settings Card */}
      <div>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#1C1C1E', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>Account & Settings</h4>
        
        <div style={{ 
          background: '#F8F9FA', 
          border: '1px solid #E5E7EB', 
          borderRadius: '20px', 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {[
            { icon: 'fa-clock-rotate-left', label: 'Previous Transactions' },
            { icon: 'fa-headset', label: 'Help & Support' },
            { icon: 'fa-gear', label: 'Settings & Help Center' }
          ].map((item, idx) => (
            <div 
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderBottom: idx < 2 ? '1px solid #E5E7EB' : 'none',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onClick={() => onTriggerNotification(`⚙️ Opening ${item.label}...`)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <i className={`fa-solid ${item.icon}`} style={{ fontSize: '14px', color: '#E6005C', width: '20px', textAlign: 'center' }}></i>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#3A3A3C' }}>{item.label}</span>
              </div>
              <i className="fa-solid fa-chevron-right" style={{ fontSize: '11px', color: '#8E8E93' }}></i>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
