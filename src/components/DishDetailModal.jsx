import React, { useState, useEffect } from 'react';

export default function DishDetailModal({ dish, onClose, onAddToCart }) {
  const [extraCheese, setExtraCheese] = useState(false);
  const [spicyJalapenos, setSpicyJalapenos] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  // Recalculate price when selection changes
  useEffect(() => {
    if (dish) {
      let total = dish.price;
      if (extraCheese) total += 40;
      if (spicyJalapenos) total += 20;
      setTotalPrice(total);
    }
  }, [dish, extraCheese, spicyJalapenos]);

  if (!dish) return null;

  const handleAddClick = () => {
    const extras = [];
    if (extraCheese) extras.push('Extra Cheese');
    if (spicyJalapenos) extras.push('Spicy Jalapeños');

    onAddToCart(dish, extras, totalPrice);
    onClose();
  };

  return (
    <div className="modal-overlay-backdrop" onClick={onClose}>
      <div className="modal-body-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Banner image */}
        <img src={dish.img} className="modal-img-top" alt={dish.name} />

        {/* Header content */}
        <div className="modal-content-area" style={{ paddingBottom: '10px' }}>
          <div className="modal-title-row">
            <div>
              <h3>{dish.name}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Prepared by: <b>{dish.kitchen}</b>
              </p>
            </div>
            <div className="modal-close-btn" onClick={onClose}>
              <i className="fa-solid fa-xmark"></i>
            </div>
          </div>

          {/* Nutritional metrics */}
          <div className="modal-nutritional-metrics">
            <div className="nutri-node">
              <span className="val">{dish.nutrition.cal}</span>
              <span className="lbl">kcal</span>
            </div>
            <div className="nutri-node">
              <span className="val">{dish.nutrition.prot}</span>
              <span className="lbl">protein</span>
            </div>
            <div className="nutri-node">
              <span className="val">{dish.nutrition.fat}</span>
              <span className="lbl">fats</span>
            </div>
            <div className="nutri-node">
              <span className="val">{dish.nutrition.carb}</span>
              <span className="lbl">carbs</span>
            </div>
          </div>

          {/* Customization checkboxes */}
          <div className="modal-customization-options">
            <h5>Customize Cravings</h5>
            
            <div className="custom-item-row" onClick={() => setExtraCheese(!extraCheese)}>
              <div className="custom-item-left">
                <input 
                  type="checkbox" 
                  checked={extraCheese} 
                  onChange={() => {}} // Click is handled by row
                  style={{ pointerEvents: 'none' }}
                />
                <span>Extra Cheese Melt</span>
              </div>
              <span style={{ color: 'var(--primary-coral)' }}>+₹40</span>
            </div>

            <div className="custom-item-row" onClick={() => setSpicyJalapenos(!spicyJalapenos)}>
              <div className="custom-item-left">
                <input 
                  type="checkbox" 
                  checked={spicyJalapenos} 
                  onChange={() => {}}
                  style={{ pointerEvents: 'none' }}
                />
                <span>Spicy Jalapeños Heat</span>
              </div>
              <span style={{ color: 'var(--primary-coral)' }}>+₹20</span>
            </div>
          </div>
        </div>

        {/* Sticky footer action */}
        <div className="modal-footer-sticky">
          <span className="modal-price-calc">₹{totalPrice}</span>
          <button className="modal-add-action-btn" onClick={handleAddClick}>
            Add Cravings
          </button>
        </div>

      </div>
    </div>
  );
}
