import React, { useState } from 'react';

export default function ProfileView({ 
  onTriggerNotification, 
  level,
  xp,
  xpMax = 300,
  location,
  onNavigate
}) {
  const [subPage, setSubPage] = useState(null);
  
  // Edit Profile fields state
  const [profileName, setProfileName] = useState('Shivani Kumari');
  const [profileEmail, setProfileEmail] = useState('shivani.kumari@email.com');
  const [profilePhone, setProfilePhone] = useState('+91 98765 43210');
  const [avatarGrad, setAvatarGrad] = useState('linear-gradient(135deg, #FFE2E2 0%, #F5CBA7 100%)');

  // Address fields state
  const [addressList, setAddressList] = useState([
    { id: 1, type: 'Home', address: 'Salt Lake City, Sector V, Block EP, Kolkata' },
    { id: 2, type: 'Work', address: 'Tech Park East Tower, Sector 3, Bengaluru' }
  ]);
  const [newType, setNewType] = useState('Home');
  const [newAddr, setNewAddr] = useState('');

  // Payment states
  const [walletBal, setWalletBal] = useState(340.00);
  const [topupVal, setTopupVal] = useState('');
  const [selectedCard, setSelectedCard] = useState('visa');

  // Notification states
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [evolutionSounds, setEvolutionSounds] = useState(true);
  const [dealReminders, setDealReminders] = useState(false);
  const [newsletter, setNewsletter] = useState(true);

  // FAQ accordion open index
  const [activeFaq, setActiveFaq] = useState(null);
  const [supportMessage, setSupportMessage] = useState('');

  // Privacy states
  const [locationPerm, setLocationPerm] = useState(true);
  const [appetitePerm, setAppetitePerm] = useState(true);
  const [rewardsPerm, setRewardsPerm] = useState(true);

  const handleAction = (label) => {
    if (label === 'Edit Profile Information') {
      setSubPage('profile-info');
    } else if (label === 'Manage Saved Addresses') {
      setSubPage('addresses');
    } else if (label === 'Payment Options & Wallet') {
      setSubPage('payments');
    } else if (label === 'Notification Preferences') {
      setSubPage('notifications');
    } else if (label === 'Previous Order History') {
      onNavigate('orders');
    } else if (label === 'Help & Customer Support') {
      setSubPage('support');
    } else if (label === 'Privacy & Security Policy') {
      setSubPage('privacy');
    } else {
      onTriggerNotification(`⚙️ Opening ${label}...`);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileName.trim()) {
      onTriggerNotification("⚠️ Name cannot be empty!");
      return;
    }
    onTriggerNotification("💾 Profile information updated successfully!");
    setSubPage(null);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddr.trim()) {
      onTriggerNotification("⚠️ Address details cannot be empty!");
      return;
    }
    const newId = addressList.length > 0 ? Math.max(...addressList.map(a => a.id)) + 1 : 1;
    setAddressList([...addressList, { id: newId, type: newType, address: newAddr.trim() }]);
    setNewAddr('');
    onTriggerNotification(`🏠 Added saved address tag: ${newType}!`);
  };

  const handleDeleteAddress = (id) => {
    setAddressList(addressList.filter(a => a.id !== id));
    onTriggerNotification("🗑️ Address removed.");
  };

  const handleTopup = (e) => {
    e.preventDefault();
    const amount = parseFloat(topupVal);
    if (isNaN(amount) || amount <= 0) {
      onTriggerNotification("⚠️ Please enter a valid top-up amount!");
      return;
    }
    setWalletBal(prev => prev + amount);
    setTopupVal('');
    onTriggerNotification(`💳 Wallet topped up with ₹${amount.toFixed(2)} successfully!`);
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportMessage.trim()) {
      onTriggerNotification("⚠️ Please enter a message for support!");
      return;
    }
    setSupportMessage('');
    onTriggerNotification("✉️ Support query submitted! Mascot companion will contact you soon.");
  };

  const gradientsList = [
    'linear-gradient(135deg, #FFE2E2 0%, #F5CBA7 100%)',
    'linear-gradient(135deg, #D4FC79 0%, #96E6A1 100%)',
    'linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)',
    'linear-gradient(135deg, #A1C4FD 0%, #C2E9FB 100%)',
    'linear-gradient(135deg, #F6D365 0%, #FDA085 100%)',
    'linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)'
  ];

  const faqs = [
    { q: "How do I earn XP and evolve my mascot?", a: "You earn XP for ordering meals, booking tables at cloud kitchens via Dineout, or completing weekly missions in the Crav DNA dashboard. Once you reach 300 XP, your mascot levels up and evolves!" },
    { q: "What can I do with Crav Coins?", a: "Crav Coins are rewarded along with XP. You can spend them in the Crav DNA customizer shop to purchase cute outfits, hats, eyewear, and companion badges for your mascot." },
    { q: "Is location tracking mandatory?", a: "No, location tracking is used to suggest nearby cloud kitchens and tailor Blobby's climate craving speech. You can disable this preference anytime in the privacy panel." }
  ];

  // SUB-PAGES RENDER LOGIC
  if (subPage) {
    return (
      <div className="swiggy-home-container" style={{ width: '100%', maxWidth: '100vw', minHeight: '100vh', background: '#F8F9FA', padding: '24px 16px 100px 16px', boxSizing: 'border-box' }}>
        
        {/* Back Button & Title Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
          <button 
            onClick={() => setSubPage(null)} 
            style={{ 
              background: 'white', 
              border: '1px solid #E5E7EB', 
              borderRadius: '50%', 
              width: '40px', 
              height: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)' 
            }}
          >
            <i className="fa-solid fa-arrow-left" style={{ color: '#1C1C1E', fontSize: '15px' }}></i>
          </button>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', fontFamily: 'Fredoka, sans-serif', color: '#1C1C1E' }}>
            {subPage === 'profile-info' && 'Edit Profile'}
            {subPage === 'addresses' && 'Manage Addresses'}
            {subPage === 'payments' && 'Payments & Wallet'}
            {subPage === 'notifications' && 'Notification Preference'}
            {subPage === 'support' && 'Help & Support'}
            {subPage === 'privacy' && 'Privacy Panel'}
          </h3>
        </div>

        {/* 1. Edit Profile Form */}
        {subPage === 'profile-info' && (
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'white', borderRadius: '24px', padding: '20px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              
              {/* Avatar Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ 
                  width: '74px', 
                  height: '74px', 
                  borderRadius: '50%', 
                  background: avatarGrad, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '28px', 
                  fontWeight: '800', 
                  color: '#A04000', 
                  border: '3px solid white', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                }}>
                  {profileName ? profileName.charAt(0).toUpperCase() : '?'}
                </div>
                <span style={{ fontSize: '12px', color: '#8E8E93', fontWeight: '600' }}>Choose Avatar Color Style</span>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {gradientsList.map((g, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setAvatarGrad(g)}
                      style={{ 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '50%', 
                        background: g, 
                        border: avatarGrad === g ? '2.5px solid #E6005C' : '1.5px solid #E5E7EB', 
                        cursor: 'pointer',
                        transform: avatarGrad === g ? 'scale(1.1)' : 'none',
                        transition: 'transform 0.2s'
                      }} 
                    />
                  ))}
                </div>
              </div>

              {/* Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#8E8E93', textTransform: 'uppercase' }}>Full Name</label>
                <input 
                  type="text" 
                  value={profileName} 
                  onChange={(e) => setProfileName(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', border: '1px solid #D1D5DB', fontSize: '13.5px', fontWeight: '700', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#8E8E93', textTransform: 'uppercase' }}>Email Address</label>
                <input 
                  type="email" 
                  value={profileEmail} 
                  onChange={(e) => setProfileEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', border: '1px solid #D1D5DB', fontSize: '13.5px', fontWeight: '700', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#8E8E93', textTransform: 'uppercase' }}>Phone Number</label>
                <input 
                  type="text" 
                  value={profilePhone} 
                  onChange={(e) => setProfilePhone(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', border: '1px solid #D1D5DB', fontSize: '13.5px', fontWeight: '700', boxSizing: 'border-box' }}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              style={{ width: '100%', padding: '14px', borderRadius: '16px', background: '#E6005C', color: 'white', border: 'none', fontSize: '14px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 15px rgba(230,0,92,0.2)' }}
            >
              Save Profile Changes
            </button>
          </form>
        )}

        {/* 2. Manage Saved Addresses */}
        {subPage === 'addresses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* List of existing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {addressList.map(a => (
                <div key={a.id} style={{ background: 'white', borderRadius: '20px', padding: '16px', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#FFF0F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`fa-solid ${a.type === 'Home' ? 'fa-house' : a.type === 'Work' ? 'fa-briefcase' : 'fa-location-dot'}`} style={{ color: '#E6005C', fontSize: '13px' }}></i>
                    </div>
                    <div>
                      <h5 style={{ margin: '0 0 4px 0', fontSize: '13.5px', fontWeight: '800', color: '#1C1C1E' }}>{a.type}</h5>
                      <p style={{ margin: 0, fontSize: '12px', color: '#8E8E93', lineHeight: '1.4' }}>{a.address}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteAddress(a.id)}
                    style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                  >
                    <i className="fa-solid fa-trash-can" style={{ fontSize: '14px' }}></i>
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Address Form */}
            <form onSubmit={handleAddAddress} style={{ background: 'white', borderRadius: '24px', padding: '20px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1C1C1E', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>Add New Address</h4>
              
              {/* Type Switcher Tag */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#8E8E93', textTransform: 'uppercase' }}>Address Type Tag</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['Home', 'Work', 'Other'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewType(type)}
                      style={{ 
                        flex: 1, 
                        padding: '10px', 
                        borderRadius: '12px', 
                        border: newType === type ? '2px solid #E6005C' : '1px solid #D1D5DB', 
                        background: newType === type ? '#FFF0F5' : 'white', 
                        color: newType === type ? '#E6005C' : '#3A3A3C', 
                        fontSize: '12px', 
                        fontWeight: '800', 
                        cursor: 'pointer' 
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Address details input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#8E8E93', textTransform: 'uppercase' }}>Detailed Address</label>
                <textarea 
                  value={newAddr} 
                  onChange={(e) => setNewAddr(e.target.value)}
                  placeholder="Enter complete building name, flat number, street name, and pincode..."
                  rows="3"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', border: '1px solid #D1D5DB', fontSize: '13px', fontWeight: '700', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'none' }}
                  required
                />
              </div>

              <button 
                type="submit" 
                style={{ width: '100%', padding: '12px', borderRadius: '14px', background: '#E6005C', color: 'white', border: 'none', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
              >
                Add Saved Address
              </button>
            </form>
          </div>
        )}

        {/* 3. Payments & Wallet */}
        {subPage === 'payments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Wallet Balance Card */}
            <div style={{ 
              background: 'linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)', 
              borderRadius: '24px', 
              padding: '24px 20px', 
              color: 'white', 
              boxShadow: '0 8px 24px rgba(233, 64, 87, 0.25)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div>
                <span style={{ fontSize: '12px', opacity: 0.85, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cravlings Wallet Balance</span>
                <h2 style={{ margin: '6px 0 0 0', fontSize: '32px', fontWeight: '900', fontFamily: 'Fredoka, sans-serif' }}>₹{walletBal.toFixed(2)}</h2>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-wallet" style={{ fontSize: '20px' }}></i>
              </div>
            </div>

            {/* Top Up Wallet form */}
            <form onSubmit={handleTopup} style={{ background: 'white', borderRadius: '24px', padding: '20px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1C1C1E', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>Quick Wallet Add Money</h4>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="number" 
                  value={topupVal} 
                  onChange={(e) => setTopupVal(e.target.value)}
                  placeholder="Enter amount (₹)"
                  style={{ flex: 1, padding: '12px 14px', borderRadius: '14px', border: '1px solid #D1D5DB', fontSize: '14px', fontWeight: '700', boxSizing: 'border-box' }}
                  required
                />
                <button 
                  type="submit" 
                  style={{ padding: '0 20px', borderRadius: '14px', background: '#E6005C', color: 'white', border: 'none', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
                >
                  Add Money
                </button>
              </div>

              {/* Quick selectors */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {[100, 250, 500].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopupVal(amt.toString())}
                    style={{ flex: 1, padding: '8px', borderRadius: '10px', border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '12px', fontWeight: '800', color: '#3A3A3C', cursor: 'pointer' }}
                  >
                    + ₹{amt}
                  </button>
                ))}
              </div>
            </form>

            {/* Saved Payment Cards selection */}
            <div style={{ background: 'white', borderRadius: '24px', padding: '20px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1C1C1E', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>Select Preferred Card</h4>
              
              {[
                { id: 'visa', icon: 'fa-cc-visa', label: 'HDFC Platinum Credit Card (•••• 4920)' },
                { id: 'master', icon: 'fa-cc-mastercard', label: 'SBI Cashback Debit Card (•••• 8820)' }
              ].map(card => (
                <div 
                  key={card.id} 
                  onClick={() => setSelectedCard(card.id)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '12px 14px', 
                    borderRadius: '16px', 
                    border: selectedCard === card.id ? '2px solid #E6005C' : '1px solid #E5E7EB', 
                    background: selectedCard === card.id ? '#FFF0F5' : 'white', 
                    cursor: 'pointer' 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <i className={`fa-brands ${card.icon}`} style={{ fontSize: '24px', color: card.id === 'visa' ? '#1A1F71' : '#EB001B' }}></i>
                    <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#3A3A3C' }}>{card.label}</span>
                  </div>
                  <div style={{ 
                    width: '18px', 
                    height: '18px', 
                    borderRadius: '50%', 
                    border: '2px solid #E6005C', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    {selectedCard === card.id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#E6005C' }}></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Notification Preferences */}
        {subPage === 'notifications' && (
          <div style={{ background: 'white', borderRadius: '24px', padding: '20px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1C1C1E', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>System Alert Preferences</h4>
            
            {[
              { id: 'alerts', state: orderAlerts, setter: setOrderAlerts, label: "Order Status SMS Alerts", desc: "Get real-time tracking updates when delivery starts." },
              { id: 'sounds', state: evolutionSounds, setter: setEvolutionSounds, label: "Mascot Level-up Sounds", desc: "Plays special music and sounds when companion levels up." },
              { id: 'deals', state: dealReminders, setter: setDealReminders, label: "Daily Hot Discount Reminders", desc: "Notify when under ₹250 deals pop up in your area." },
              { id: 'letter', state: newsletter, setter: setNewsletter, label: "Cravlings Weekly Digest", desc: "Recieve weekly appetite evolution and accessories recap emails." }
            ].map(pref => (
              <div key={pref.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', borderBottom: '1px solid #F3F4F6', paddingBottom: '14px' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#3A3A3C', display: 'block', marginBottom: '2px' }}>{pref.label}</span>
                  <span style={{ fontSize: '11px', color: '#8E8E93', lineHeight: '1.3', display: 'block' }}>{pref.desc}</span>
                </div>
                
                {/* Switch Button */}
                <div 
                  onClick={() => {
                    pref.setter(!pref.state);
                    onTriggerNotification(`${pref.state ? 'Disabled' : 'Enabled'} preference: ${pref.label}`);
                  }}
                  style={{
                    width: '46px',
                    height: '24px',
                    borderRadius: '12px',
                    background: pref.state ? '#B5FF38' : '#D1D5DB',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.25s',
                    flexShrink: 0
                  }}
                >
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'white',
                    position: 'absolute',
                    top: '3px',
                    left: pref.state ? '25px' : '3px',
                    transition: 'left 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. Help & Support */}
        {subPage === 'support' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* FAQs Accordion */}
            <div style={{ background: 'white', borderRadius: '24px', padding: '20px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1C1C1E', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>Frequently Asked Questions</h4>
              
              {faqs.map((faq, idx) => (
                <div key={idx} style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '10px' }}>
                  <div 
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '6px 0' }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#3A3A3C' }}>{faq.q}</span>
                    <i className={`fa-solid ${activeFaq === idx ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ fontSize: '11px', color: '#8E8E93' }}></i>
                  </div>
                  {activeFaq === idx && (
                    <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#636366', lineHeight: '1.4', paddingLeft: '2px' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Direct Message Form */}
            <form onSubmit={handleSupportSubmit} style={{ background: 'white', borderRadius: '24px', padding: '20px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h4 style={{ margin: '0 0 2px 0', fontSize: '15px', color: '#1C1C1E', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>Send customer tickets</h4>
              <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#8E8E93' }}>Our mascot blobby assistant will resolve issues instantly.</p>
              
              <textarea 
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                placeholder="Write your issue details here..."
                rows="4"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', border: '1px solid #D1D5DB', fontSize: '13px', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'none' }}
                required
              />

              <button 
                type="submit" 
                style={{ width: '100%', padding: '12px', borderRadius: '14px', background: '#E6005C', color: 'white', border: 'none', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
              >
                Submit Message
              </button>
            </form>
          </div>
        )}

        {/* 6. Privacy Panel */}
        {subPage === 'privacy' && (
          <div style={{ background: 'white', borderRadius: '24px', padding: '20px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h4 style={{ margin: '0 0 2px 0', fontSize: '15px', color: '#1C1C1E', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>Consent & Permissions</h4>
            <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: '#8E8E93', lineHeight: '1.4' }}>Manage what data Cravlings processes to enhance the gamified experience.</p>
            
            {[
              { state: locationPerm, setter: setLocationPerm, label: "Live Location Access", desc: "Used to track distance and suggest nearby cloud kitchen options." },
              { state: appetitePerm, setter: setAppetitePerm, label: "Appetite DNA Analytics", desc: "Analyzes items added to cart to update evolution chart weights." },
              { state: rewardsPerm, setter: setRewardsPerm, label: "Leaderboard & XP Tracking", desc: "Enables coin rewards and mascot accessory level-ups." }
            ].map((perm, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', borderBottom: '1px solid #F3F4F6', paddingBottom: '14px' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#3A3A3C', display: 'block', marginBottom: '2px' }}>{perm.label}</span>
                  <span style={{ fontSize: '11px', color: '#8E8E93', lineHeight: '1.3', display: 'block' }}>{perm.desc}</span>
                </div>
                
                {/* Switch Button */}
                <div 
                  onClick={() => {
                    perm.setter(!perm.state);
                    onTriggerNotification(`Privacy update: ${perm.label} is now ${!perm.state ? 'Allowed' : 'Revoked'}`);
                  }}
                  style={{
                    width: '46px',
                    height: '24px',
                    borderRadius: '12px',
                    background: perm.state ? '#B5FF38' : '#D1D5DB',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.25s',
                    flexShrink: 0
                  }}
                >
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'white',
                    position: 'absolute',
                    top: '3px',
                    left: perm.state ? '25px' : '3px',
                    transition: 'left 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    );
  }

  // MAIN PAGE RENDER
  const handleCategoryClick = (category) => {
    if (category === 'Food') {
      onNavigate('home');
    } else if (category === 'Wizard') {
      onNavigate('wizard');
    } else if (category === 'Dineout') {
      onNavigate('kitchens');
    } else if (category === 'Crav DNA') {
      onNavigate('cravdna');
    }
  };

  return (
    <div className="swiggy-home-container dineout-portal-root" style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden', background: 'white' }}>
      
      {/* 2. Brand red container: keeps Profile info inside */}
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
        {/* Profile Card Header */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.12)', 
          borderRadius: '24px', 
          padding: '16px 20px', 
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxSizing: 'border-box',
          width: '100%'
        }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ 
              width: '52px', 
              height: '52px', 
              borderRadius: '50%', 
              background: avatarGrad, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '20px', 
              fontWeight: '800',
              color: '#A04000',
              border: '2px solid white',
              flexShrink: 0
            }}>
              {profileName ? profileName.charAt(0).toUpperCase() : 'S'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', fontFamily: 'Fredoka, sans-serif', color: 'white' }}>{profileName}</h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.85)', wordBreak: 'break-all' }}>{profileEmail}</p>
            </div>
          </div>
          
          {/* XP Level Bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '700' }}>
              <span style={{ color: '#B5FF38' }}>LVL {level} Companion Trainer</span>
              <span style={{ opacity: 0.9 }}>{xp} / {xpMax} XP</span>
            </div>
            <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, (xp / xpMax) * 100)}%`, background: '#B5FF38', borderRadius: '3px', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Account Settings and details below in white section */}
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
        {/* Account Details & Settings */}
        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#1C1C1E', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>My Account</h4>
          
          <div style={{ 
            background: '#F8F9FA', 
            border: '1px solid #E5E7EB', 
            borderRadius: '20px', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {[
              { icon: 'fa-user-gear', label: 'Edit Profile Information' },
              { icon: 'fa-location-crosshairs', label: 'Manage Saved Addresses' },
              { icon: 'fa-credit-card', label: 'Payment Options & Wallet' },
              { icon: 'fa-bell', label: 'Notification Preferences' }
            ].map((item, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderBottom: idx < 3 ? '1px solid #E5E7EB' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                onClick={() => handleAction(item.label)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <i className={`fa-solid ${item.icon}`} style={{ fontSize: '14px', color: '#E6005C', width: '20px', textAlign: 'center' }}></i>
                  <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#3A3A3C' }}>{item.label}</span>
                </div>
                <i className="fa-solid fa-chevron-right" style={{ fontSize: '11px', color: '#8E8E93' }}></i>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions & Support */}
        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#1C1C1E', fontWeight: '800', fontFamily: 'Fredoka, sans-serif' }}>Transactions & Help</h4>
          
          <div style={{ 
            background: '#F8F9FA', 
            border: '1px solid #E5E7EB', 
            borderRadius: '20px', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {[
              { icon: 'fa-clock-rotate-left', label: 'Previous Order History' },
              { icon: 'fa-headset', label: 'Help & Customer Support' },
              { icon: 'fa-shield-halved', label: 'Privacy & Security Policy' }
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
                  transition: 'background 0.2s',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                onClick={() => handleAction(item.label)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <i className={`fa-solid ${item.icon}`} style={{ fontSize: '14px', color: '#E6005C', width: '20px', textAlign: 'center' }}></i>
                  <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#3A3A3C' }}>{item.label}</span>
                </div>
                <i className="fa-solid fa-chevron-right" style={{ fontSize: '11px', color: '#8E8E93' }}></i>
              </div>
            ))}
          </div>
        </div>

        {/* Logout button */}
        <button 
          onClick={() => onTriggerNotification("🚪 Logging out...")}
          style={{
            width: '100%',
            background: '#F3F4F6',
            color: '#EF4444',
            border: 'none',
            borderRadius: '16px',
            padding: '14px',
            fontSize: '14px',
            fontWeight: '800',
            cursor: 'pointer',
            textAlign: 'center',
            boxSizing: 'border-box',
            transition: 'background 0.2s'
          }}
        >
          Logout Account
        </button>

      </div>
    </div>
  );
}
