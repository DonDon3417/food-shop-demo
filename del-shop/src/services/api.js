import axios from 'axios'

const API_BASE_URL = '/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Orders API
export const ordersAPI = {
  // Get all orders
  getAll: () => api.get('/orders'),
  
  // Get order by id
  getById: (id) => api.get(`/orders/${id}`),
  
  // Get orders by user (you might need to implement this endpoint)
  getByUser: (userId) => api.get(`/orders/user/${userId}`),
  
  // Create new order
  create: (orderData) => api.post('/orders', orderData),
  
  // Update full order (customer info, address, items, status)
  update: (id, orderData) => api.put(`/orders/${id}`, orderData),
  
  // Update order status only
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  
  // Delete order
  delete: (id) => api.delete(`/orders/${id}`),
}

// Products API
export const productsAPI = {
  // Get all products
  getAll: () => api.get('/products'),
  
  // Get product by id
  getById: (id) => api.get(`/products/${id}`),
}

export default api
