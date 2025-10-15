import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import { useAuth } from '../../context/AuthContext'
const Navbar = ({ setShowLogin, setShowProfile }) => {

    const [menu, setMenu] = useState("menu");
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const { getTotalCartAmount, getTotalItemsCount } = useContext(StoreContext);
    const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className='navbar'>
      <img src= {assets.logo} alt="" className='logo'/>
      <ul className='navbar-menu'>
        <Link to='/' onClick={()=>setMenu("home")} className= {menu==="home"?"active":""}>Home</Link> 
        <a href='#explore-menu' onClick={()=>setMenu("menu")} className= {menu==="menu"?"active":""}>Menu</a>
        <Link to='/myorders' onClick={()=>setMenu("myorders")} className= {menu==="myorders"?"active":""}>My Orders</Link>
        <a href='#app-download' onClick={()=>setMenu("mobile-app")} className= {menu==="mobile-app"?"active":""}>Mobile-app</a>
        <a href='#footer' onClick={()=>setMenu("contact-us")} className= {menu==="contact-us"?"active":""}>Contact us</a>
      </ul>
      <div className='navbar-right'>
        <img src= {assets.search_icon} alt="" />
        <div className='navbar-search-icon'>
          <Link to='/cart'><img src= {assets.basket_icon} alt="" /></Link>
          <div className={getTotalItemsCount() === 0 ? "" : "dot"}></div>
        </div>
        {isAuthenticated ? (
          <div className='navbar-profile'>
            <div className='profile-icon' onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
              <span>{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            {showProfileDropdown && (
              <div className='profile-dropdown'>
                <p className='profile-name'>Xin chào, {user?.name}!</p>
                <hr />
                <p onClick={() => {setShowProfile(true); setShowProfileDropdown(false)}}>Thông tin cá nhân</p>
                <Link to="/orders" onClick={() => setShowProfileDropdown(false)} style={{textDecoration: 'none', color: 'inherit'}}>
                  <p>Đơn hàng của tôi</p>
                </Link>
                <hr />
                <p onClick={() => {logout(); setShowProfileDropdown(false)}}>Đăng xuất</p>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)}>Đăng nhập</button>
        )}
      </div>
    </div>
  )
}

export default Navbar
