import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/Layout/MainLayout'
import Dashboard from './pages/Dashboard'
import UserManagement from './pages/UserManagement'
import Properties from './pages/Properties'
import Payments from './pages/Payments'
import Feedback from './pages/Feedback'
import Analytics from './pages/Analytics'
import Notifications from './pages/Notifications'
import BannerManagement from './pages/BannerManagement'
import Settings from './pages/Settings'
import Login from './pages/Login'
import './App.css'

function App() {
  // For now, we'll assume user is authenticated
  // You can implement proper authentication later with Firebase Auth
  const isAuthenticated = true

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

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
        <Route path="payments" element={<Payments />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="banners" element={<BannerManagement />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
