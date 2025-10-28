import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import MainLayout from './components/Layout/MainLayout'
import Dashboard from './pages/Dashboard'
import UserManagement from './pages/UserManagement'
import Properties from './pages/Properties'
import Bookings from './pages/Bookings'
import Payments from './pages/Payments'
import BannerManagement from './pages/BannerManagement'
import Settings from './pages/Settings'
import Login from './pages/Login'
import './App.css'
import './styles/responsive.css'

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
      } />

      <Route
        path="/"
        element={
          isAuthenticated ? (
            <MainLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="properties" element={<Properties />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="payments" element={<Payments />} />
        <Route path="banners" element={<BannerManagement />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
