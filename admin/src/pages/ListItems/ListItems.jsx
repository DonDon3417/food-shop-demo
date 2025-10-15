import React, { useState, useEffect } from 'react'
import './ListItems.css'
import axios from 'axios'

const ListItems = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch items from API
  const fetchItems = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:5001/api/products')
      setItems(response.data)
    } catch (error) {
      console.error('Error fetching items:', error)
      // Show empty state if API fails
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  // Delete item with confirmation
  const handleDeleteItem = async (itemId, itemName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${itemName}"?\nThis action cannot be undone.`
    )
    
    if (!confirmDelete) return

    try {
      await axios.delete(`http://localhost:5001/api/products/${itemId}`)
      setItems(prev => prev.filter(item => item.id !== itemId && item._id !== itemId))
      alert(`"${itemName}" has been deleted successfully.`)
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete item. Please try again.')
    }
  }

  // Clear all items
  const handleClearAllItems = () => {
    const confirmClear = window.confirm(
      'Are you sure you want to delete ALL items?\nThis will remove all food items from the system.\nThis action cannot be undone.'
    )
    
    if (!confirmClear) return

    const doubleConfirm = window.confirm(
      'This is your final warning!\nDeleting all items will affect the entire system.\nAre you absolutely sure?'
    )

    if (doubleConfirm) {
      setItems([])
      alert('All items have been cleared.')
    }
  }

  return (
    <div className="list-items">
      <div className="list-items-header">
        <h2>Food Items Management</h2>
        <div className="header-actions">
          <button className="refresh-btn" onClick={fetchItems}>
            🔄 Refresh
          </button>
          <button className="clear-all-btn" onClick={handleClearAllItems}>
            🗑️ Clear All Items
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <p>Loading items...</p>
        </div>
      ) : (
        <div className="items-grid">
          {items.length === 0 ? (
            <div className="no-items">
              <p>No food items found.</p>
              <p>Add some items to get started!</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id || item._id} className="item-card">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-info">
                    <span className="item-price">${item.price}</span>
                    <span className="item-category">{item.category}</span>
                  </div>
                </div>
                <div className="item-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => alert('Edit functionality coming soon!')}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteItem(item.id || item._id, item.name)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default ListItems
