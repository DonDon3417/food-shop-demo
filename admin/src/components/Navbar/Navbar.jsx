import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className="navbar-left">
        <div className="logo">
          <span className="logo-text">Tomato.</span>
          <span className="admin-text">Admin Panel</span>
        </div>
      </div>
      <div className="navbar-right">
        <div className="profile">
          <img src="https://via.placeholder.com/40" alt="Profile" className="profile-img" />
        </div>
      </div>
    </div>
  )
}

export default Navbar
