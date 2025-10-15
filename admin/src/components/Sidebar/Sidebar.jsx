import React from 'react'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to="/add" className="sidebar-option">
          <div className="option-icon">+</div>
          <p>Add Items</p>
        </NavLink>
        <NavLink to="/list" className="sidebar-option">
          <div className="option-icon">☰</div>
          <p>List Items</p>
        </NavLink>
        <NavLink to="/orders" className="sidebar-option">
          <div className="option-icon">☑</div>
          <p>Orders</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
