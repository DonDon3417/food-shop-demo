import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar/Sidebar'
import Navbar from './components/Navbar/Navbar'
import AddItem from './pages/Add/Add'
import ListItems from './pages/List/List'
import Orders from './pages/Orders/Orders'
import './App.css'

const App = () => {
  return (
    <div className='app'>
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/add" element={<AddItem />} />
            <Route path="/list" element={<ListItems />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/" element={<AddItem />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
