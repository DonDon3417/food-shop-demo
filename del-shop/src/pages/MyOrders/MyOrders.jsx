import React, { useEffect } from 'react'
import './MyOrders.css'
import { useAuth } from '../../context/AuthContext'
import { useOrders } from '../../context/OrderContext'

const MyOrders = () => {
  const { user } = useAuth()
  const { orders, loading, clearOrders, refreshOrders } = useOrders()

  // Auto-refresh orders every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshOrders()
    }, 5000)
    return () => clearInterval(interval)
  }, [refreshOrders])

  const handleRefresh = () => {
    refreshOrders()
  }

  const handleClearOrders = () => {
    if (window.confirm('Are you sure you want to clear all orders?')) {
      clearOrders()
      localStorage.removeItem('orders')
    }
  }
  

  const getStatusColor = (status) => {
    if (!status) return '#6c757d'
    switch (status.toLowerCase()) {
      case 'food processing':
        return '#ffc107'
      case 'out for delivery':
        return '#17a2b8'
      case 'delivered':
        return '#28a745'
      default:
        return '#6c757d'
    }
  }

  const trackOrder = (orderId) => {
    alert(`Tracking order #${orderId}`)
  }

  return (
    <div className='my-orders'>
      <div className="orders-container">
        <div className="orders-header">
          <h2>My Orders</h2>
          <div className="header-buttons">
            <button className="refresh-btn" onClick={handleRefresh}>
              🔄 Refresh
            </button>
            <button className="clear-btn" onClick={handleClearOrders}>
              🗑️ Clear All
            </button>
          </div>
        </div>
        
        <div className="orders-list">
          {loading ? (
            <div className="loading">
              <p>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="no-orders">
              <p>You haven't placed any orders yet.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-icon">
                  <div className="package-icon">📦</div>
                </div>
                
                <div className="order-details">
                  <div className="order-customer">Customer: {order.customerName}</div>
                  <div className="order-items">
                    {order.items && order.items.length > 0 
                      ? order.items.map(item => `${item.name || item.productName} x ${item.quantity}`).join(', ')
                      : 'No items'}
                  </div>
                  <div className="order-info">
                    <span className="order-amount">${(order.totalAmount || 0).toFixed(2)}</span>
                    <span className="order-count">Items: {order.items ? order.items.length : 0}</span>
                  </div>
                </div>
                
                <div className="order-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    ● {order.status || 'Pending'}
                  </span>
                </div>
                
                <div className="order-actions">
                  <button 
                    className="track-btn"
                    onClick={() => trackOrder(order.id)}
                  >
                    Track Order
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default MyOrders
