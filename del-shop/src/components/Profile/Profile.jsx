import React, { useState } from 'react'
import './Profile.css'
import { useAuth } from '../../context/AuthContext'

const Profile = ({ setShowProfile }) => {
    const { user, updateProfile } = useAuth()
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || ''
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            updateProfile(formData)
            
            // Show success message
            const toast = document.createElement('div')
            toast.className = 'profile-success-toast'
            toast.textContent = 'Cập nhật thông tin thành công!'
            document.body.appendChild(toast)
            
            setTimeout(() => {
                document.body.removeChild(toast)
                setShowProfile(false)
            }, 2000)
        } catch (error) {
            alert('Có lỗi xảy ra khi cập nhật thông tin')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='profile-popup'>
            <div className="profile-popup-container">
                <div className="profile-popup-title">
                    <h2>Thông tin cá nhân</h2>
                    <button 
                        className="close-btn"
                        onClick={() => setShowProfile(false)}
                    >
                        ×
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label>Họ và tên</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nhập họ và tên"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Nhập email"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Địa chỉ</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Nhập địa chỉ"
                            rows="3"
                        />
                    </div>
                    
                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={() => setShowProfile(false)}
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit" 
                            className="save-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Profile
