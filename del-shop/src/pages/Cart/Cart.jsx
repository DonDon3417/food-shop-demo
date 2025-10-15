import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, addToCart, removeFromCart, removeAllFromCart, getTotalCartAmount, getTotalItemsCount } = useContext(StoreContext)
  const navigate = useNavigate()
  const [promoCode, setPromoCode] = useState('')

  const handlePromoSubmit = () => {
    // TODO: Implement promo code logic
    console.log('Promo code:', promoCode)
  }

  const totalItems = getTotalItemsCount();
  const deliveryFee = 5.00;
  const subtotal = getTotalCartAmount();
  const total = subtotal > 0 ? subtotal + deliveryFee : 0;

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Cart Items Table */}
        <div className="cart-table-section">
          <div className="cart-table">
            <div className="table-header">
              <div className="header-cell">Items</div>
              <div className="header-cell">Title</div>
              <div className="header-cell">Price</div>
              <div className="header-cell">Quantity</div>
              <div className="header-cell">Total</div>
              <div className="header-cell">Remove</div>
            </div>
            
            <div className="table-body">
              {food_list.map((item) => {
                if (cartItems[item._id] > 0) {
                  return (
                    <div key={item._id} className="table-row">
                      <div className="cell item-image-cell">
                        <img src={item.image} alt={item.name} className="item-image" />
                      </div>
                      <div className="cell item-title-cell">
                        <span className="item-name">{item.name}</span>
                      </div>
                      <div className="cell item-price-cell">
                        <span>${item.price.toFixed(2)}</span>
                      </div>
                      <div className="cell item-quantity-cell">
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn minus" 
                            onClick={() => removeFromCart(item._id)}
                          >
                            -
                          </button>
                          <span className="quantity-display">{cartItems[item._id]}</span>
                          <button 
                            className="quantity-btn plus"
                            onClick={() => addToCart(item._id)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="cell item-total-cell">
                        <span>${(item.price * cartItems[item._id]).toFixed(2)}</span>
                      </div>
                      <div className="cell item-remove-cell">
                        <button 
                          className="remove-btn" 
                          onClick={() => removeAllFromCart(item._id)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>

        {/* Cart Totals Section */}
        <div className="cart-totals-section">
          <div className="cart-totals">
            <h3>Cart Totals</h3>
            
            <div className="totals-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="totals-row">
              <span>Delivery Fee</span>
              <span>${subtotal > 0 ? deliveryFee.toFixed(2) : '0.00'}</span>
            </div>
            
            <div className="totals-row total-row">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button 
              className="checkout-btn" 
              onClick={() => navigate('/order')}
              disabled={totalItems === 0}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>

          <div className="promo-code-section">
            <p>If you have a promo code, Enter it here</p>
            <div className="promo-input-group">
              <input 
                type="text" 
                placeholder="promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="promo-input"
              />
              <button 
                className="submit-btn"
                onClick={handlePromoSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
