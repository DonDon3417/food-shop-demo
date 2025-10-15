import axios from 'axios'

const API_BASE_URL = 'http://localhost:5001/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Products API
export const productsAPI = {
  // Get all products
  getAll: () => api.get('/Products'),
  
  // Get product by id
  getById: (id) => api.get(`/Products/${id}`),
  
  // Create new product
  create: (productData) => api.post('/Products', productData),
  
  // Update product
  update: (id, productData) => api.put(`/Products/${id}`, productData),
  
  // Delete product
  delete: (id) => api.delete(`/Products/${id}`),
}

// Orders API
export const ordersAPI = {
  // Get all orders
  getAll: () => api.get('/Orders'),
  
  // Get order by id
  getById: (id) => api.get(`/Orders/${id}`),
  
  // Update full order (customer info, address, items, status)
  update: (id, orderData) => api.put(`/Orders/${id}`, orderData),
  
  // Update order status only
  updateStatus: (id, status) => api.put(`/Orders/${id}/status`, { status }),
  
  // Create new order
  create: (orderData) => api.post('/Orders', orderData),
  
  // Delete order
  delete: (id) => api.delete(`/Orders/${id}`),
}

export default api
