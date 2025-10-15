import React, { useContext, useState } from 'react'
import './Payment.css'
import { StoreContext } from '../../context/StoreContext'
import { useAuth } from '../../context/AuthContext'
import { useOrders } from '../../context/OrderContext'
import { useNavigate } from 'react-router-dom'

const Payment = () => {
  const { getTotalCartAmount, food_list, cartItems, clearCart } = useContext(StoreContext)
  const { user } = useAuth()
  const { addOrder } = useOrders()
  const navigate = useNavigate()
  
  const [paymentData, setPaymentData] = useState({
    email: user?.email || '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: user?.name || '',
    country: 'Vietnam'
  })

  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    setPaymentData(prev => ({
      ...prev,
      cardNumber: formatted
    }))
  }

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4)
    }
    setPaymentData(prev => ({
      ...prev,
      expiryDate: value
    }))
  }

  const getOrderItems = () => {
    return food_list.filter(item => cartItems[item._id] > 0).map(item => ({
      ...item,
      quantity: cartItems[item._id]
    }))
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create order data
      const orderItems = getOrderItems()
      const nameParts = (user?.name || paymentData.cardholderName).split(' ')
      const firstName = nameParts[0] || 'Guest'
      const lastName = nameParts.slice(1).join(' ') || 'Customer'
      
      const orderData = {
        firstName: firstName,
        lastName: lastName,
        customerName: user?.name || paymentData.cardholderName,
        customerEmail: paymentData.email,
        customerPhone: user?.phone || '0000000000',
        phone: user?.phone || '0000000000',
        street: user?.address || 'Not specified',
        city: user?.city || 'Not specified',
        state: user?.state || 'Not specified',
        country: paymentData.country || 'Vietnam',
        zipCode: user?.zipCode || '00000',
        items: orderItems,
        totalAmount: total,
        deliveryFee: deliveryFee,
        subtotal: subtotal
      }
      
      // Add order to context
      await addOrder(orderData)
      
      // Clear cart
      clearCart()
      
      // Navigate to my orders page
      navigate('/myorders')
    } catch (error) {
      console.error('Payment error:', error)
      // Still redirect even on error
      clearCart()
      navigate('/myorders')
    } finally {
      setIsProcessing(false)
    }
  }

  const orderItems = getOrderItems()
  const subtotal = getTotalCartAmount()
  const deliveryFee = subtotal > 0 ? 5 : 0
  const total = subtotal + deliveryFee

  return (
    <div className='payment-page'>
      <div className="payment-container">
        <div className="payment-left">
          <div className="back-header">
            <button onClick={() => navigate('/order')} className="back-btn">
              ← Back
            </button>
            <span className="test-mode">TEST MODE</span>
          </div>
          
          <div className="order-summary">
            <h2>Pay Order</h2>
            <div className="total-amount">${total.toFixed(2)}</div>
            
            <div className="order-items">
              {orderItems.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-details">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">Qty {item.quantity}</span>
                  </div>
                  <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                  <div className="item-unit-price">${item.price.toFixed(2)} each</div>
                </div>
              ))}
              
              <div className="order-item">
                <div className="item-details">
                  <span className="item-name">Delivery Charge</span>
                  <span className="item-qty">Qty 1</span>
                </div>
                <div className="item-price">${deliveryFee.toFixed(2)}</div>
                <div className="item-unit-price">${deliveryFee.toFixed(2)} each</div>
              </div>
            </div>
          </div>
          
          <div className="powered-by">
            <span>Powered by Stripe</span>
            <span>Terms</span>
            <span>Privacy</span>
          </div>
        </div>

        <div className="payment-right">
          <h2>Pay with card</h2>
          
          <form onSubmit={handlePayment} className="payment-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={paymentData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Card information</label>
              <div className="card-input-group">
                <input
                  type="text"
                  placeholder="1234 1234 1234 1234"
                  value={paymentData.cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength="19"
                />
                <div className="card-icons">
                  <span className="card-icon">💳</span>
                  <span className="card-icon">💳</span>
                  <span className="card-icon">💳</span>
                </div>
              </div>
              <div className="card-details">
                <input
                  type="text"
                  placeholder="MM / YY"
                  value={paymentData.expiryDate}
                  onChange={handleExpiryChange}
                  maxLength="5"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  name="cvc"
                  value={paymentData.cvc}
                  onChange={handleInputChange}
                  maxLength="4"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Cardholder name</label>
              <input
                type="text"
                placeholder="Full name on card"
                name="cardholderName"
                value={paymentData.cardholderName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Country or region</label>
              <select
                name="country"
                value={paymentData.country}
                onChange={handleInputChange}
              >
                <option value="India">India</option>
                <option value="Vietnam">Vietnam</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="pay-btn"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Pay'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Payment
