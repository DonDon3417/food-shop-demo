import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PlaceOrder = () => {
  const { getTotalCartAmount, food_list, cartItems, hasItems, clearCart } = useContext(StoreContext);
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  
  const [data, setData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    street: user?.address || '',
    city: '',
    state: '',
    zipcode: '',
    country: 'Vietnam',
    phone: user?.phone || ''
  });

  const [loading, setLoading] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    
    setLoading(true);

    try {
      // Prepare order items from cart
      const orderItems = [];
      let totalAmount = 0;
      
      // Convert cart items to order items
      food_list.forEach(item => {
        if (cartItems[item._id] > 0) {
          const productId = item.id; // Use the actual ID from the product
          if (!productId) {
            console.warn(`Skipping item with invalid ID:`, item);
            return;
          }
          
          orderItems.push({
            productId,
            productName: item.name,
            quantity: cartItems[item._id],
            price: item.price,
            image: item.image
          });
          totalAmount += item.price * cartItems[item._id];
        }
      });

      // Skip validation - allow empty orders for testing

      const orderData = {
        firstName: data.firstName,
        lastName: data.lastName,
        customerName: `${data.firstName} ${data.lastName}`.trim(),
        customerEmail: data.email,
        customerPhone: data.phone,
        phone: data.phone,
        street: data.street,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zipcode,
        items: orderItems,
        totalAmount: totalAmount,
        status: 'Food Processing'
      };

      console.log('🚀 Creating order with data:', orderData);
      
      // Use OrderContext to create order (triggers real-time sync with Admin)
      const result = await addOrder(orderData);

      console.log('✅ Order created successfully via OrderContext:', result);
      
      // Clear cart after successful order
      clearCart();

      // Redirect directly to My Orders page
      navigate('/myorders');
      
    } catch (error) {
      console.error('❌ Error creating order:', error);
      
      // Still redirect to My Orders even if there's an error
      // Order might have been created on backend
      clearCart();
      navigate('/myorders');
    } finally {
      setLoading(false);
    }
  };

  const totalItems = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal > 0 ? 5.00 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="place-order">
      <div className="place-order-container">
        <div className="place-order-left">
          <div className="delivery-info-card">
            <h2 className="section-title">Delivery Information</h2>
            
            
            <form onSubmit={placeOrder} className="delivery-form">
              <div className="form-group">
                <div className="form-row">
                  <input
                    name="firstName"
                    onChange={onChangeHandler}
                    value={data.firstName}
                    type="text"
                    placeholder="First Name"
                  />
                  <input
                    name="lastName"
                    onChange={onChangeHandler}
                    value={data.lastName}
                    type="text"
                    placeholder="Last Name"
                  />
                </div>
                
                <input
                  name="email"
                  onChange={onChangeHandler}
                  value={data.email}
                  type="email"
                  placeholder="Email Address"
                />
                
                <input
                  name="street"
                  onChange={onChangeHandler}
                  value={data.street}
                  type="text"
                  placeholder="Street Address"
                />
                
                <div className="form-row">
                  <input 
                    name="city" 
                    onChange={onChangeHandler} 
                    value={data.city} 
                    type="text" 
                    placeholder="City"
                  />
                  <input 
                    name="state" 
                    onChange={onChangeHandler} 
                    value={data.state} 
                    type="text" 
                    placeholder="State" 
                  />
                </div>
                
                <div className="form-row">
                  <input 
                    name="zipcode" 
                    onChange={onChangeHandler} 
                    value={data.zipcode} 
                    type="text" 
                    placeholder="Zip Code" 
                  />
                  <input 
                    name="phone"
                    onChange={onChangeHandler}
                    value={data.phone}
                    type="tel"
                    placeholder="Phone Number"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        
        <div className="place-order-right">
          <div className="order-summary-card">
            <h2 className="section-title">Order Summary</h2>
            
            <div className="order-items">
              {food_list.map((item, index) => {
                if (cartItems[item._id] > 0) {
                  return (
                    <div key={index} className="order-item">
                      <div className="item-info">
                        <span className="item-quantity">{cartItems[item._id]}×</span>
                        <span className="item-name">{item.name}</span>
                      </div>
                      <span className="item-price">${(item.price * cartItems[item._id]).toFixed(2)}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
            
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="payment-info">
              <button 
                type="button" 
                className="proceed-payment-btn"
                onClick={() => navigate('/payment')}
                disabled={loading || !hasItems()}
              >
                Proceed To Payment
              </button>
              
              <div className="secure-checkout">
                <span className="lock-icon">🔒</span>
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
