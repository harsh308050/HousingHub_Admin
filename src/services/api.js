// API base URL from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// API endpoints
export const API_ENDPOINTS = {
    // Authentication
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',

    // Properties
    properties: '/properties',
    propertyById: (id) => `/properties/${id}`,

    // Users
    users: '/users',
    userById: (id) => `/users/${id}`,

    // Bookings
    bookings: '/bookings',
    bookingById: (id) => `/bookings/${id}`,

    // Dashboard
    dashboardStats: '/dashboard/stats',
    recentActivities: '/dashboard/activities'
}

// HTTP methods helper
export const fetchAPI = async (endpoint, options = {}) => {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            // Add auth token from localStorage if available
            ...(localStorage.getItem('auth_token') && {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            })
        }
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error('API Error:', error)
        throw error
    }
}

export default { API_BASE_URL, API_ENDPOINTS, fetchAPI }
