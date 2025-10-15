import React, { useEffect, useState } from 'react'
import './Orders.css'
import { ordersAPI } from '../../services/api'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [previousCount, setPreviousCount] = useState(0)
  const [newOrderAlert, setNewOrderAlert] = useState(false)
  const [newOrderIds, setNewOrderIds] = useState(new Set())

  const fetchAllOrders = async () => {
    try {
      const response = await ordersAPI.getAll()
      console.log('📡 Admin Orders - Raw API Response:', response.data)
      
      if (!response.data || response.data.length === 0) {
        console.log('⚠️ No orders found in backend')
        setOrders([])
        return
      }
      
      const apiOrders = response.data.map(order => {
        console.log('Processing order:', order)
        
        // Format address from individual fields or address object
        let address = 'No address'
        if (order.street || order.city) {
          // Use individual fields
          const parts = [
            order.street,
            order.city,
            order.state,
            order.country,
            order.zipCode
          ].filter(part => part && part.trim() !== '')
          address = parts.length > 0 ? parts.join(', ') : 'No address'
        } else if (order.address) {
          // Fallback to address object
          const parts = [
            order.address.street,
            order.address.city,
            order.address.state,
            order.address.country,
            order.address.zipCode
          ].filter(part => part && part.trim() !== '')
          address = parts.length > 0 ? parts.join(', ') : 'No address'
        }
        
        return {
          _id: order.id.toString(),
          items: order.orderItems && order.orderItems.length > 0 
            ? order.orderItems.map(item => ({
                name: item.productName,
                quantity: item.quantity
              }))
            : [{ name: "No items", quantity: 0 }],
          amount: order.totalAmount,
          customer: order.customerName || `${order.firstName || ''} ${order.lastName || ''}`.trim() || 'Unknown Customer',
          address: address,
          phone: order.customerPhone || order.phone || "N/A",
          status: order.status || "Food Processing",
          date: order.orderDate,
          payment: true
        }
      })
      
      console.log('✅ Processed Orders for Admin:', apiOrders)
      
      // Check for new orders
      if (apiOrders.length > previousCount && previousCount > 0) {
        const newOrdersCount = apiOrders.length - previousCount
        console.log(`🔔 ${newOrdersCount} new order(s) received!`)
        setNewOrderAlert(true)
        
        // Mark new orders for highlighting
        const currentIds = new Set(orders.map(o => o._id))
        const newIds = apiOrders.filter(o => !currentIds.has(o._id)).map(o => o._id)
        setNewOrderIds(new Set(newIds))
        
        // Remove highlight after 10 seconds
        setTimeout(() => {
          setNewOrderIds(new Set())
        }, 10000)
        
        // Play notification sound (optional)
        try {
          // Simple beep sound for notification
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 800; // frequency in Hz
          oscillator.type = 'sine';
          gainNode.gain.value = 0.1; // volume
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1); // 100ms beep
        } catch (err) {
          console.log('Notification sound not available:', err);
        }
        
        // Clear alert after 3 seconds
        setTimeout(() => setNewOrderAlert(false), 3000)
      }
      
      setPreviousCount(apiOrders.length)
      setOrders(apiOrders)
    } catch (error) {
      console.error('❌ Error fetching orders:', error)
      console.error('Error details:', error.response?.data || error.message)
      setOrders([])
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const newStatus = event.target.value
      
      // Update API first
      await ordersAPI.updateStatus(orderId, newStatus)
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      )
      
      console.log(`Order ${orderId} status updated to: ${newStatus}`)
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Error updating order status')
    }
  }

  useEffect(() => {
    // Fetch orders immediately
    fetchAllOrders()
    
    // Auto-refresh every 3 seconds to get new orders quickly
    const interval = setInterval(() => {
      console.log('Auto-refreshing orders...')
      fetchAllOrders()
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='order add'>
      <div className="order-header">
        <h3 className="order-title">
          Order Page
          {orders.length > 0 && (
            <span style={{ 
              marginLeft: '10px', 
              background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {orders.length}
            </span>
          )}
        </h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {newOrderAlert && (
            <span style={{ 
              background: '#28a745',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              animation: 'pulse 1s ease-in-out'
            }}>
              🔔 New Order!
            </span>
          )}
          <button className="refresh-btn" onClick={fetchAllOrders}>
            🔄 Refresh Orders
          </button>
        </div>
      </div>
      <div className="order-table">
        <div className="order-table-header">
          <div>📦</div>
          <div>Order Details</div>
          <div>Customer</div>
          <div>Amount</div>
          <div>Status</div>
        </div>
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found. Orders will appear here when customers place them.</p>
            <button className="refresh-btn" onClick={fetchAllOrders}>
              🔄 Refresh Now
            </button>
          </div>
        ) : (
          orders.map((order, index) => {
            const isNew = newOrderIds.has(order._id)
            return (
          <div 
            key={index} 
            className='order-row'
            style={isNew ? {
              background: 'linear-gradient(90deg, #fff5e6 0%, #ffffff 100%)',
              border: '2px solid #ff6b35',
              animation: 'slideInRight 0.5s ease-out',
              boxShadow: '0 4px 15px rgba(255, 107, 53, 0.2)'
            } : {}}
          >
            <div className="order-icon-cell">
              <div className="parcel-icon">📦</div>
            </div>
            <div className="order-details-cell">
              <p className="order-items">
                {order.items.map((item, idx) => (
                  <span key={idx}>
                    {item.name} x{item.quantity}
                    {idx < order.items.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
              <p className="order-count">Items: {order.items.reduce((total, item) => total + item.quantity, 0)}</p>
            </div>
            <div className="customer-cell">
              <p className="customer-name">{order.customer}</p>
              <p className="customer-address">{order.address}</p>
              <p className="customer-phone">{order.phone}</p>
            </div>
            <div className="amount-cell">
              <p className="order-amount">${order.amount}</p>
            </div>
            <div className="status-cell">
              <select 
                onChange={(event) => statusHandler(event, order._id)} 
                value={order.status}
                className="status-select"
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
          )
          })
        )}
      </div>
    </div>
  )
}

export default Orders
