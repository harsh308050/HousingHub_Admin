import { NavLink, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Users,
    Building2,
    Calendar,
    CreditCard,
    Settings,
    Image,
    LogOut
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/Logo.png'
import './Sidebar.css'

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate()
    const { logout } = useAuth()

    const handleLogout = () => {
        // Clear authentication using context
        logout()

        // Redirect to login page
        navigate('/login')
    }

    const menuItems = [
        {
            path: '/dashboard',
            icon: LayoutDashboard,
            label: 'Dashboard'
        },
        {
            path: '/users',
            icon: Users,
            label: 'User Management'
        },
        {
            path: '/properties',
            icon: Building2,
            label: 'Properties'
        },
        {
            path: '/bookings',
            icon: Calendar,
            label: 'Bookings'
        },
        {
            path: '/payments',
            icon: CreditCard,
            label: 'Payments'
        },
        {
            path: '/banners',
            icon: Image,
            label: 'Banner Management'
        },
        {
            path: '/settings',
            icon: Settings,
            label: 'Settings'
        }
    ]

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div className="sidebar-overlay" onClick={toggleSidebar}></div>
            )}

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-container">
                        <img src={logo} alt="HousingHub Logo" className="logo-image" />
                        <div>
                            <h3 className="logo-title">HousingHub</h3>
                            <p className="logo-subtitle">Admin Panel</p>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <ul className="nav-list">
                        {menuItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            isActive ? 'nav-link active' : 'nav-link'
                                        }
                                        onClick={() => window.innerWidth < 768 && toggleSidebar()}
                                    >
                                        <Icon className="nav-icon" size={20} />
                                        <span className="nav-label">{item.label}</span>
                                        <div className="nav-glow"></div>
                                    </NavLink>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <div className="admin-info glass-card">
                        <div className="admin-avatar">👤</div>
                        <div className="admin-details">
                            <p className="admin-name">{localStorage.getItem('adminEmail') || 'Admin User'}</p>
                            <p className="admin-role">Super Admin</p>
                        </div>
                    </div>
                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            marginTop: '1rem',
                            padding: '0.75rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(239, 68, 68, 0.2)'
                            e.target.style.borderColor = 'rgba(239, 68, 68, 0.5)'
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(239, 68, 68, 0.1)'
                            e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)'
                        }}
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Sidebar
