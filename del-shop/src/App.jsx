import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Payment from './pages/Payment/Payment'
import MyOrders from './pages/MyOrders/MyOrders'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Profile from './components/Profile/Profile'
import { AuthProvider } from './context/AuthContext'
import { OrderProvider } from './context/OrderContext'

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  return (
    <AuthProvider>
      <OrderProvider>
        {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
        {showProfile ? <Profile setShowProfile={setShowProfile} /> : <></>}
        <div className='app'>
          <Navbar setShowLogin={setShowLogin} setShowProfile={setShowProfile} />
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/cart' element={<Cart/>} />
            <Route path='/order' element={<PlaceOrder/>} />
            <Route path='/payment' element={<Payment/>} />
            <Route path='/orders' element={<MyOrders/>} />
            <Route path='/myorders' element={<MyOrders/>} />
          </Routes>
        </div>
        <Footer/>
      </OrderProvider>
    </AuthProvider>
  )
}

export default App
