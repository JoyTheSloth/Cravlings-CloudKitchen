import React, { useState, useEffect } from 'react';
import { dishes } from '../data/dishes';

export default function WizardView({ 
  location, 
  weather, 
  dietTags, 
  onAddDish, 
  onNavigate, 
  onOpenDishDetails, 
  searchQuery,
  onTriggerNotification,
  setSpeechText 
}) {
  const [step, setStep] = useState(1);
  const [hunger, setHunger] = useState('hungry');
  const [budget, setBudget] = useState('standard');
  const [flavor, setFlavor] = useState('spicy');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  // If search query is passed from search bar, we immediately match
  useEffect(() => {
    if (searchQuery) {
      setLoading(true);
      setStep(4); // Loader screen
      
      const timer = setTimeout(() => {
        setLoading(false);
        setStep(5); // Result screen
        calculateRecommendation(searchQuery);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else if (step === 3) {
      setStep(4);
      setLoading(true);
      
      const timer = setTimeout(() => {
        setLoading(false);
        setStep(5);
        calculateRecommendation();
      }, 2000);
    }
  };

  const handlePrev = () => {
    if (step > 1 && step !== 5) {
      setStep(step - 1);
    } else {
      onNavigate('home');
    }
  };

  const calculateRecommendation = (query = '') => {
    let matched = dishes[0];
    let reasonText = '';

    const isVegan = dietTags.includes('Vegan');

    if (query) {
      const q = query.toLowerCase();
      // Direct query match
      matched = dishes.find(d => 
        d.name.toLowerCase().includes(q) || 
        d.tags.some(t => t.toLowerCase().includes(q))
      ) || dishes[0];
      
      reasonText = `Blobby matched your prompt "${query}" with this special order of ${matched.name} from ${matched.kitchen}!`;
    } else if (weather === 'rainy') {
      matched = dishes.find(d => d.id === 'comfort-ramen') || dishes[0];
      reasonText = `It is raining outside in ${location.split(',')[0]}. Blobby recommends a bowl of warm, soothing Comfort Chicken Ramen 🍲.`;
    } else if (isVegan) {
      matched = dishes.find(d => d.id === 'healthy-salad') || dishes[0];
      reasonText = `Since your diet profile has Vegan checked, we matched you with our fresh, crunchy Quinoa Avocado Salad!`;
    } else if (flavor === 'sweet') {
      matched = dishes.find(d => d.id === 'lava-cake') || dishes[0];
      reasonText = `Got a sweet tooth? Blobby suggests a warm Chocolate Lava Cake 🍩!`;
    } else if (hunger === 'starving') {
      matched = dishes.find(d => d.id === 'biryani') || dishes[0];
      reasonText = `You specified starving! Let's fill up on Chef's dum-cooked Hyderabadi Chicken Biryani.`;
    } else if (hunger === 'nibblish') {
      matched = dishes.find(d => d.id === 'healthy-salad') || dishes[0];
      reasonText = `Looking for a light, delicious starter bite? We matched you with our signature Quinoa Avocado Salad.`;
    } else {
      matched = dishes.find(d => d.id === 'pizza') || dishes[0];
      reasonText = `Perfect savory choice! Pizza Hub's Cheesy Chicken Pizza is hot and ready.`;
    }

    setRecommendation(matched);
    setSpeechText(reasonText);
  };

  // Face SVG path changes based on hunger level
  const getFacePaths = () => {
    if (hunger === 'nibblish') {
      return {
        mouth: "M 70,105 Q 80,95 90,105",
        mouthFill: "none",
        eyes: (
          <>
            <circle cx="56" cy="80" r="5" fill="#232323" />
            <circle cx="104" cy="80" r="5" fill="#232323" />
          </>
        )
      };
    } else if (hunger === 'starving') {
      return {
        mouth: "M 65,108 Q 80,125 95,108 Z",
        mouthFill: "#FF8D7F",
        eyes: (
          <>
            <ellipse cx="56" cy="80" rx="7" ry="7" fill="#232323" />
            <ellipse cx="104" cy="80" rx="7" ry="7" fill="#232323" />
          </>
        )
      };
    } else {
      // Hungry
      return {
        mouth: "M 70,102 Q 80,115 90,102",
        mouthFill: "none",
        eyes: (
          <>
            <circle cx="56" cy="80" r="5" fill="#232323" />
            <circle cx="104" cy="80" r="5" fill="#232323" />
          </>
        )
      };
    }
  };

  const face = getFacePaths();

  return (
    <div className="viewport-content-panel">
      <div className="wizard-portal-view">
        <div className="wizard-bar-steps">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
              src="/blobbyimg.png" 
              alt="Chef Blobby" 
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'contain',
                animation: 'floatMascot 2.5s ease-in-out infinite alternate'
              }}
            />
            <h4 id="lbl-wiz-nav-title">Feed Your Cravling</h4>
          </div>
          {step <= 3 && (
            <span className="wizard-step-tag" id="lbl-wiz-step-pill">
              Step {step} of 3
            </span>
          )}
          {step === 5 && (
            <span className="wizard-step-tag" id="lbl-wiz-step-pill" style={{ background: '#5FD38D', color: 'white' }}>
              Matches Found
            </span>
          )}
        </div>

        {/* Step 1: Hunger */}
        {step === 1 && (
          <div className="wizard-step-block">
            <h3 className="wizard-prompt-text">How hungry are we feeling?</h3>
            <div className="wizard-companion-wink-interactive" style={{
              width: '130px',
              height: '130px',
              margin: '0 auto 20px auto',
              position: 'relative',
              background: 'radial-gradient(circle, rgba(255, 222, 203, 0.5) 0%, rgba(255, 222, 203, 0) 70%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%'
            }}>
              <img 
                src="/blobbyimg.png" 
                alt="Chef Blobby" 
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'contain',
                  animation: 'floatMascot 3s ease-in-out infinite',
                  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))'
                }} 
              />
            </div>
            <div className="wizard-options-list">
              {[
                { id: 'hungry', emoji: '😋', title: 'Hungry', desc: 'Ready for a standard delicious meal' },
                { id: 'nibblish', emoji: '🤏', title: 'Nibblish', desc: 'Just looking for a light snack' },
                { id: 'starving', emoji: '🤤', title: 'Starving', desc: 'Need a massive filling portion meal now!' }
              ].map(opt => (
                <div 
                  key={opt.id} 
                  className={`wizard-option-card-square ${hunger === opt.id ? 'selected' : ''}`}
                  onClick={() => setHunger(opt.id)}
                >
                  <div className="wiz-square-emoji-container">
                    <span>{opt.emoji}</span>
                  </div>
                  <h5 className="wiz-square-title">{opt.title}</h5>
                  <p className="wiz-square-desc">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Budget */}
        {step === 2 && (
          <div className="wizard-step-block">
            <h3 className="wizard-prompt-text">What is your target budget scale?</h3>
            <div className="wizard-options-list">
              {[
                { id: 'budget', emoji: '🪙', title: 'Budget Friendly', desc: 'Affordable quick meals under ₹150' },
                { id: 'standard', emoji: '💸', title: 'Standard Choice', desc: 'Regular dining meals ₹150 - ₹300' },
                { id: 'premium', emoji: '💎', title: 'Gourmet Splurge', desc: 'Premium quality meals above ₹300' }
              ].map(opt => (
                <div 
                  key={opt.id} 
                  className={`wizard-option-card-square ${budget === opt.id ? 'selected' : ''}`}
                  onClick={() => setBudget(opt.id)}
                >
                  <div className="wiz-square-emoji-container">
                    <span>{opt.emoji}</span>
                  </div>
                  <h5 className="wiz-square-title">{opt.title}</h5>
                  <p className="wiz-square-desc">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Flavor Note */}
        {step === 3 && (
          <div className="wizard-step-block">
            <h3 className="wizard-prompt-text">Pick your desired flavor tone</h3>
            <div className="wizard-options-list four-cols">
              {[
                { id: 'spicy', emoji: '🌶️', title: 'Spicy & Savory', desc: 'Hot peppers and local spices' },
                { id: 'sweet', emoji: '🍩', title: 'Sweet Cravings', desc: 'Cakes and sweet delights' },
                { id: 'cheesy', emoji: '🍕', title: 'Cheesy & Rich', desc: 'Melted cheese & warm carbs' },
                { id: 'healthy', emoji: '🥗', title: 'Healthy & Light', desc: 'Salads & low-calorie portions' }
              ].map(opt => (
                <div 
                  key={opt.id} 
                  className={`wizard-option-card-square ${flavor === opt.id ? 'selected' : ''}`}
                  onClick={() => setFlavor(opt.id)}
                >
                  <div className="wiz-square-emoji-container">
                    <span>{opt.emoji}</span>
                  </div>
                  <h5 className="wiz-square-title">{opt.title}</h5>
                  <p className="wiz-square-desc">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Loading Pulse */}
        {step === 4 && loading && (
          <div className="wizard-matching-loader-frame" id="wiz-step-loader">
            <div className="wizard-match-circle-pulse">🍲</div>
            <h3 style={{ fontFamily: 'Fredoka, sans-serif' }}>Matching Cravings...</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Finding the best local kitchens matching your profile preferences
            </p>
          </div>
        )}

        {/* Step 5: Result Screen */}
        {step === 5 && recommendation && (
          <div className="wizard-step-block" id="wiz-step-result">
            <div className="wizard-match-box-result">
              <span className="wiz-match-badge">Recommended Match</span>
              
              {/* Mascot dialogue bubble above image */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '22px' }}>
                <div className="mascot-dialogue-bubble" style={{ position: 'relative', margin: '0 auto 16px auto', width: 'fit-content', animation: 'none' }}>
                  <span id="lbl-wiz-dialogue-result">
                    Blobby matched your preferences with this delicious <b>{recommendation.name}</b> from <b>{recommendation.kitchen}</b>!
                  </span>
                </div>
                <div className="wizard-companion-wink-interactive" style={{ width: '110px', height: '110px', margin: '0 auto', position: 'relative' }}>
                  <img 
                    src="/blobbyimg.png" 
                    alt="Chef Blobby" 
                    style={{
                      width: '90px',
                      height: '90px',
                      objectFit: 'contain',
                      animation: 'floatMascot 3s ease-in-out infinite',
                      filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.12))'
                    }} 
                  />
                </div>
              </div>

              <div 
                className="wiz-result-dish-card" 
                onClick={() => onOpenDishDetails(recommendation)}
              >
                <img src={recommendation.img} className="wiz-result-dish-img" alt={recommendation.name} />
                <div className="wiz-result-dish-info">
                  <h4>{recommendation.name}</h4>
                  <p>{recommendation.kitchen} • ⭐ {recommendation.rating}</p>
                  <span className="wiz-result-dish-price">₹{recommendation.price}</span>
                </div>
                <i className="fa-solid fa-chevron-right" style={{ color: 'var(--text-muted)' }}></i>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Footer */}
        {step !== 4 && (
          <div className="wizard-actions-footer" id="wiz-footer-nav-bar">
            <button className="wizard-btn-prev" onClick={handlePrev}>
              {step === 1 ? 'Exit' : 'Back'}
            </button>
            <button 
              className="wizard-btn-next" 
              id="wiz-btn-action-continue"
              onClick={step === 5 ? () => {
                onAddDish(recommendation);
                onNavigate('home');
              } : handleNext}
            >
              {step === 3 ? 'Match Me' : step === 5 ? 'Order suggestions now' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
