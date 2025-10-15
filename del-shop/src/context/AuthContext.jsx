import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [sessionId, setSessionId] = useState('')

    useEffect(() => {
        // Generate or get session ID
        let storedSessionId = localStorage.getItem('sessionId')
        if (!storedSessionId) {
            storedSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
            localStorage.setItem('sessionId', storedSessionId)
        }
        setSessionId(storedSessionId)

        // Check if user is logged in
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setIsLoading(false)
    }, [])

    const login = async (email, password) => {
        try {
            // TODO: Replace with actual API call
            const mockUser = {
                id: 1,
                name: 'Người dùng',
                email: email,
                phone: '',
                address: ''
            }
            
            setUser(mockUser)
            localStorage.setItem('user', JSON.stringify(mockUser))
            return { success: true, user: mockUser }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const register = async (name, email, password) => {
        try {
            // TODO: Replace with actual API call
            const mockUser = {
                id: Date.now(),
                name: name,
                email: email,
                phone: '',
                address: ''
            }
            
            setUser(mockUser)
            localStorage.setItem('user', JSON.stringify(mockUser))
            return { success: true, user: mockUser }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
        // Keep sessionId for cart persistence
    }

    const updateProfile = (userData) => {
        const updatedUser = { ...user, ...userData }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
    }

    const value = {
        user,
        isLoading,
        sessionId,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
