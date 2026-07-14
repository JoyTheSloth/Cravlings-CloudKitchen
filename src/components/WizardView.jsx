import React, { useState, useEffect } from 'react';
import { dishes } from '../data/dishes';

const STEPS = [
  { id: 1, label: 'Hunger', icon: '🤤' },
  { id: 2, label: 'Budget', icon: '💰' },
  { id: 3, label: 'Flavor', icon: '🌶️' }
];

export default function WizardView({ 
  location, 
  weather, 
  dietTags, 
  onAddDish, 
  onNavigate, 
  onOpenDishDetails, 
  searchQuery,
  onTriggerNotification,
  setSpeechText,
  level
}) {
  const [step, setStep] = useState(1);
  const [hunger, setHunger] = useState('hungry');
  const [budget, setBudget] = useState('standard');
  const [flavor, setFlavor] = useState('spicy');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingDots, setLoadingDots] = useState('');

  // Animate loading dots
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingDots(d => d.length >= 3 ? '' : d + '.');
    }, 400);
    return () => clearInterval(interval);
  }, [loading]);

  // If search query is passed from search bar, skip to result
  useEffect(() => {
    if (searchQuery) {
      setLoading(true);
      setStep(4);
      const timer = setTimeout(() => {
        setLoading(false);
        setStep(5);
        calculateRecommendations(searchQuery);
      }, 2200);
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
        calculateRecommendations();
      }, 2200);
    }
  };

  const handlePrev = () => {
    if (step > 1 && step !== 5) setStep(step - 1);
    else onNavigate('home');
  };

  const calculateRecommendations = (query = '') => {
    const isVegan = dietTags?.includes('Vegan');
    let matched = [];

    if (query) {
      const q = query.toLowerCase();
      matched = dishes.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.kitchen.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      );
      if (matched.length === 0) matched = dishes.slice(0, 3);
      setSpeechText(`Found ${matched.length} match${matched.length !== 1 ? 'es' : ''} for "${query}"! 🎯`);
    } else if (weather === 'rainy') {
      matched = dishes.filter(d => ['comfort-ramen', 'biryani', 'butter-chicken'].includes(d.id));
      setSpeechText(`Rainy day in ${location?.split(',')[0]}? Blobby picked warm comfort foods! 🌧️`);
    } else if (isVegan) {
      matched = dishes.filter(d => d.tags.includes('Healthy'));
      setSpeechText('Matched your Vegan profile! Fresh & healthy picks just for you 🥗');
    } else if (flavor === 'sweet') {
      matched = dishes.filter(d => d.tags.includes('Sweet'));
      setSpeechText('Sweet tooth detected! Here are Blobby\'s dessert favourites 🍩');
    } else if (flavor === 'healthy') {
      matched = dishes.filter(d => d.tags.includes('Healthy'));
      setSpeechText('Keeping it clean! Your perfect healthy options 💪');
    } else if (flavor === 'cheesy') {
      matched = dishes.filter(d => d.tags.includes('Cheesy'));
      setSpeechText('Cheese overload incoming! These are dangerously good 🧀');
    } else if (hunger === 'starving') {
      matched = dishes.filter(d => d.nutrition.cal > 600);
      setSpeechText('You\'re STARVING! Blobby picked the most filling options 🤤');
    } else if (hunger === 'nibblish') {
      matched = dishes.filter(d => d.nutrition.cal < 400);
      setSpeechText('Light snack mode! Here are Blobby\'s favourite light bites 🤏');
    } else if (budget === 'budget') {
      matched = dishes.filter(d => d.price < 180).sort((a, b) => a.price - b.price);
      setSpeechText('Best value picks that don\'t compromise on taste! 🪙');
    } else if (budget === 'premium') {
      matched = dishes.filter(d => d.price >= 300).sort((a, b) => b.rating - a.rating);
      setSpeechText('Going premium! These are Blobby\'s most luxurious picks 💎');
    } else {
      matched = dishes.filter(d => d.tags.includes('Trending'));
      setSpeechText('Here\'s what\'s trending in your area right now! 🔥');
    }

    // Ensure at least 3 results
    if (matched.length === 0) matched = dishes.slice(0, 3);
    if (matched.length < 3) {
      const extras = dishes.filter(d => !matched.includes(d));
      matched = [...matched, ...extras.slice(0, 3 - matched.length)];
    }
    setRecommendations(matched.slice(0, 5));
  };

  const handleCategoryClick = (category) => {
    if (category === 'Food') onNavigate('home');
    else if (category === 'Dineout') onNavigate('kitchens');
    else if (category === 'Crav DNA') onNavigate('cravdna');
  };

  return (
    <div className="swiggy-home-container">
      {/* ── BLACK HEADER ── */}
      <div className="swiggy-purple-section">
        <div className="swiggy-black-location-picker">
          <div className="black-loc-left" onClick={() => onTriggerNotification('📍 Location options coming soon!')}>
            <div className="loc-title-row">
              <i className="fa-solid fa-location-dot location-pin-white"></i>
              <span className="loc-bold-title">Home</span>
              <i className="fa-solid fa-chevron-down location-arrow-white"></i>
            </div>
            <span className="black-location-text">{location}</span>
          </div>
          <div className="black-loc-right-tools">
            <div className="wallet-circle-btn" onClick={() => onTriggerNotification('💳 Wallet balance: ₹340.00')}>
              <i className="fa-solid fa-wallet"></i>
            </div>
          </div>
        </div>

        {/* Category carousel */}
        <div className="swiggy-categories-carousel">
          {[
            { id: 'Food', label: 'Food', emoji: '🍔' },
            { id: 'Wizard', label: 'Wizard', emoji: '🪄', badge: 'AI' },
            { id: 'Dineout', label: 'Dineout', emoji: '🍽️' },
            { id: 'Crav DNA', label: 'Crav DNA', emoji: '🧬', badge: `LVL ${level || 1}` }
          ].map(cat => (
            <div
              key={cat.id}
              className={`swiggy-category-card ${cat.id === 'Wizard' ? 'active' : ''}`}
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

      {/* ── WIZARD ORGANIC CONTAINER ── */}
      <div className="swiggy-organic-container wizard-organic-container" style={{ paddingBottom: '100px' }}>
        
        {/* ── WIZARD HEADER ── */}
        <div className="wiz-header-row">
          <div className="wiz-header-blobby">
            <img src="/blobbyimg.png" alt="Chef Blobby" className="wiz-header-blob-img" />
            <div>
              <h2 className="wiz-header-title">Cravings Wizard</h2>
              <p className="wiz-header-sub">AI-powered match engine 🪄</p>
            </div>
          </div>
          {step <= 3 && (
            <div className="wiz-step-pill">{step} / 3</div>
          )}
          {step === 5 && (
            <div className="wiz-step-pill" style={{ background: 'rgba(95, 211, 141, 0.25)', color: '#5FD38D', border: '1px solid rgba(95, 211, 141, 0.4)' }}>
              ✓ Matched!
            </div>
          )}
        </div>

        {/* ── STEP PROGRESS BAR (steps 1-3) ── */}
        {step <= 3 && (
          <div className="wiz-progress-steps">
            {STEPS.map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className={`wiz-step-dot ${step >= s.id ? 'active' : ''} ${step > s.id ? 'done' : ''}`}>
                  {step > s.id ? <i className="fa-solid fa-check"></i> : <span>{s.icon}</span>}
                  <span className="wiz-step-dot-label">{s.label}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`wiz-step-connector ${step > s.id ? 'done' : ''}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* ──────────────────────────────── */}
        {/* STEP 1: Hunger Level            */}
        {/* ──────────────────────────────── */}
        {step === 1 && (
          <div className="wiz-step-block">
            <div className="wiz-mascot-glow-wrap">
              <img src="/blobbyimg.png" alt="Chef Blobby" className="wiz-mascot-float" />
            </div>
            <h3 className="wiz-question">How hungry are we? 🤔</h3>
            <p className="wiz-question-sub">Tell Blobby your appetite level and we'll size your portion</p>
            <div className="wiz-options-grid">
              {[
                { id: 'nibblish', emoji: '🤏', title: 'Nibblish',   desc: 'Just a light snack',        color: '#E0F2FE', border: '#7DD3FC' },
                { id: 'hungry',   emoji: '😋', title: 'Hungry',     desc: 'Standard meal portion',     color: '#FEF3C7', border: '#FCD34D' },
                { id: 'starving', emoji: '🤤', title: 'Starving',   desc: 'Massive filling feast!',    color: '#FFE4E6', border: '#FCA5A5' }
              ].map(opt => (
                <div
                  key={opt.id}
                  className={`wiz-option-card ${hunger === opt.id ? 'selected' : ''}`}
                  onClick={() => setHunger(opt.id)}
                  style={hunger === opt.id ? { background: opt.color, borderColor: opt.border } : {}}
                >
                  <div className="wiz-option-emoji-ring" style={hunger === opt.id ? { background: 'white' } : {}}>
                    <span>{opt.emoji}</span>
                  </div>
                  <h5 className="wiz-option-title">{opt.title}</h5>
                  <p className="wiz-option-desc">{opt.desc}</p>
                  {hunger === opt.id && (
                    <div className="wiz-option-check"><i className="fa-solid fa-check"></i></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ──────────────────────────────── */}
        {/* STEP 2: Budget                  */}
        {/* ──────────────────────────────── */}
        {step === 2 && (
          <div className="wiz-step-block">
            <h3 className="wiz-question">What's your budget vibe? 💸</h3>
            <p className="wiz-question-sub">We'll filter kitchens within your comfort zone</p>
            <div className="wiz-options-grid">
              {[
                { id: 'budget',   emoji: '🪙', title: 'Budget',    desc: 'Great meals under ₹180',   color: '#DCFCE7', border: '#86EFAC' },
                { id: 'standard', emoji: '💸', title: 'Standard',  desc: 'Sweet spot ₹180–₹300',     color: '#EDE9FE', border: '#A78BFA' },
                { id: 'premium',  emoji: '💎', title: 'Premium',   desc: 'Luxury above ₹300',        color: '#FEF3C7', border: '#FCD34D' }
              ].map(opt => (
                <div
                  key={opt.id}
                  className={`wiz-option-card ${budget === opt.id ? 'selected' : ''}`}
                  onClick={() => setBudget(opt.id)}
                  style={budget === opt.id ? { background: opt.color, borderColor: opt.border } : {}}
                >
                  <div className="wiz-option-emoji-ring" style={budget === opt.id ? { background: 'white' } : {}}>
                    <span>{opt.emoji}</span>
                  </div>
                  <h5 className="wiz-option-title">{opt.title}</h5>
                  <p className="wiz-option-desc">{opt.desc}</p>
                  {budget === opt.id && (
                    <div className="wiz-option-check"><i className="fa-solid fa-check"></i></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ──────────────────────────────── */}
        {/* STEP 3: Flavor Tone             */}
        {/* ──────────────────────────────── */}
        {step === 3 && (
          <div className="wiz-step-block">
            <h3 className="wiz-question">Pick your flavor personality 🌶️</h3>
            <p className="wiz-question-sub">This determines the final taste profile match</p>
            <div className="wiz-options-grid wiz-options-grid-4">
              {[
                { id: 'spicy',   emoji: '🌶️', title: 'Spicy',    desc: 'Bold & fiery heat',       color: '#FFE4E6', border: '#FCA5A5' },
                { id: 'sweet',   emoji: '🍩', title: 'Sweet',    desc: 'Sugar rush mode',          color: '#FEF3C7', border: '#FCD34D' },
                { id: 'cheesy',  emoji: '🍕', title: 'Cheesy',   desc: 'Melted gooey carbs',       color: '#FFF7ED', border: '#FDBA74' },
                { id: 'healthy', emoji: '🥗', title: 'Healthy',  desc: 'Clean & nutritious',       color: '#DCFCE7', border: '#86EFAC' }
              ].map(opt => (
                <div
                  key={opt.id}
                  className={`wiz-option-card ${flavor === opt.id ? 'selected' : ''}`}
                  onClick={() => setFlavor(opt.id)}
                  style={flavor === opt.id ? { background: opt.color, borderColor: opt.border } : {}}
                >
                  <div className="wiz-option-emoji-ring" style={flavor === opt.id ? { background: 'white' } : {}}>
                    <span>{opt.emoji}</span>
                  </div>
                  <h5 className="wiz-option-title">{opt.title}</h5>
                  <p className="wiz-option-desc">{opt.desc}</p>
                  {flavor === opt.id && (
                    <div className="wiz-option-check"><i className="fa-solid fa-check"></i></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ──────────────────────────────── */}
        {/* STEP 4: Loading Screen          */}
        {/* ──────────────────────────────── */}
        {step === 4 && loading && (
          <div className="wiz-loader-frame">
            <div className="wiz-loader-rings">
              <div className="wiz-loader-ring ring-1"></div>
              <div className="wiz-loader-ring ring-2"></div>
              <div className="wiz-loader-ring ring-3"></div>
              <div className="wiz-loader-blob">
                <img src="/blobbyimg.png" alt="Loading" className="wiz-loader-blob-img" />
              </div>
            </div>
            <h3 className="wiz-loader-title">Matching Cravings{loadingDots}</h3>
            <p className="wiz-loader-sub">Blobby is scanning 50+ local kitchens for your perfect match</p>
            <div className="wiz-loader-tags">
              {['Taste Profile', 'Budget Check', 'Distance', 'Rating Score'].map((tag, i) => (
                <span key={i} className="wiz-loader-tag" style={{ animationDelay: `${i * 0.3}s` }}>{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* ──────────────────────────────── */}
        {/* STEP 5: Results Screen          */}
        {/* ──────────────────────────────── */}
        {step === 5 && recommendations.length > 0 && (
          <div className="wiz-results-block">

            {/* Blobby verdict banner */}
            <div className="wiz-result-banner">
              <div className="wiz-result-banner-left">
                <img src="/blobbyimg.png" alt="Blobby" className="wiz-result-blobby" />
              </div>
              <div className="wiz-result-banner-text">
                <span className="wiz-result-badge">🎯 Blobby's Top Picks</span>
                <p className="wiz-result-match-count">
                  Found <strong>{recommendations.length} perfect matches</strong> for your cravings
                </p>
              </div>
            </div>

            {/* Results list */}
            <div className="wiz-results-list">
              {recommendations.map((dish, idx) => (
                <div
                  key={dish.id}
                  className={`wiz-result-dish-row ${idx === 0 ? 'top-pick' : ''}`}
                  onClick={() => onOpenDishDetails(dish)}
                >
                  {idx === 0 && <div className="wiz-top-pick-ribbon">🥇 TOP PICK</div>}
                  <img src={dish.img} alt={dish.name} className="wiz-result-row-img" />
                  <div className="wiz-result-row-info">
                    <h4 className="wiz-result-row-name">{dish.name}</h4>
                    <p className="wiz-result-row-kitchen">{dish.kitchen}</p>
                    <div className="wiz-result-row-meta">
                      <span className="wiz-result-row-rating"><i className="fa-solid fa-star"></i> {dish.rating}</span>
                      <span className="wiz-result-row-time">⏱ {dish.time}</span>
                      {dish.badge && <span className="wiz-result-row-badge">{dish.badge}</span>}
                    </div>
                  </div>
                  <div className="wiz-result-row-right">
                    <span className="wiz-result-row-price">₹{dish.price}</span>
                    <button
                      className="wiz-result-add-btn"
                      onClick={e => {
                        e.stopPropagation();
                        onAddDish(dish);
                        onTriggerNotification(`🛒 Added ${dish.name}!`);
                      }}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Re-run button */}
            <button
              className="wiz-retry-btn"
              onClick={() => { setStep(1); setRecommendations([]); }}
            >
              <i className="fa-solid fa-rotate-left"></i> Try Different Preferences
            </button>
          </div>
        )}

        {/* ── ACTION FOOTER (steps 1–3 only) ── */}
        {step <= 3 && (
          <div className="wiz-footer-row">
            <button className="wiz-btn-back" onClick={handlePrev}>
              {step === 1 ? <><i className="fa-solid fa-xmark"></i> Exit</> : <><i className="fa-solid fa-arrow-left"></i> Back</>}
            </button>
            <button className="wiz-btn-next" onClick={handleNext}>
              {step === 3 ? <><i className="fa-solid fa-wand-magic-sparkles"></i> Match Me!</> : <>Continue <i className="fa-solid fa-arrow-right"></i></>}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
