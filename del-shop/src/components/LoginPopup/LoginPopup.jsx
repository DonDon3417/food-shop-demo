import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { useAuth } from '../../context/AuthContext'

const LoginPopup = ({ setShowLogin }) => {
    const [currState, setCurrState] = useState("Login")
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const { login, register } = useAuth()

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
        setError("") // Clear error when user types
    }

    const onLogin = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        setError("")
        
        try {
            let result
            if (currState === "Login") {
                result = await login(data.email, data.password)
            } else {
                result = await register(data.name, data.email, data.password)
            }
            
            if (result.success) {
                setShowLogin(false)
                // Show success toast
                const toast = document.createElement('div')
                toast.className = 'login-success-toast'
                toast.textContent = currState === "Login" ? 
                    `Chào mừng ${result.user.name}!` : 
                    'Đăng ký thành công!'
                document.body.appendChild(toast)
                
                setTimeout(() => {
                    document.body.removeChild(toast)
                }, 3000)
            } else {
                setError(result.error || "Có lỗi xảy ra")
            }
        } catch (err) {
            setError("Có lỗi xảy ra, vui lòng thử lại")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Login" ? <></> : 
                        <input 
                            name='name' 
                            onChange={onChangeHandler} 
                            value={data.name} 
                            type="text" 
                            placeholder='Họ và tên' 
                            required 
                        />
                    }
                    <input 
                        name='email' 
                        onChange={onChangeHandler} 
                        value={data.email} 
                        type="email" 
                        placeholder='Email' 
                        required 
                    />
                    <input 
                        name='password' 
                        onChange={onChangeHandler} 
                        value={data.password} 
                        type="password" 
                        placeholder='Mật khẩu' 
                        required 
                    />
                </div>
                {error && <div className="login-error">{error}</div>}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <div className="login-loading">
                            <div className="spinner"></div>
                            {currState === "Sign Up" ? "Đang tạo tài khoản..." : "Đang đăng nhập..."}
                        </div>
                    ) : (
                        currState === "Sign Up" ? "Tạo tài khoản" : "Đăng nhập"
                    )}
                </button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>Tôi đồng ý với các điều khoản sử dụng và chính sách bảo mật.</p>
                </div>
                {currState === "Login"
                    ? <p>Tạo tài khoản mới? <span onClick={() => setCurrState("Sign Up")}>Nhấn vào đây</span></p>
                    : <p>Đã có tài khoản? <span onClick={() => setCurrState("Login")}>Đăng nhập ngay</span></p>
                }
            </form>
        </div>
    )
}

export default LoginPopup
