/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is authenticated from localStorage
        const authStatus = localStorage.getItem('isAuthenticated')
        setIsAuthenticated(authStatus === 'true')
        setLoading(false)
    }, [])

    const login = () => {
        setIsAuthenticated(true)
    }

    const logout = () => {
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('adminEmail')
        localStorage.removeItem('adminId')
        setIsAuthenticated(false)
    }

    const value = {
        isAuthenticated,
        loading,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
