import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    Users,
    Building2,
    CreditCard,
    MessageSquare,
    BarChart3,
    Bell,
    Settings,
    Image
} from 'lucide-react'
import logo from '../../assets/Logo.png'
import './Sidebar.css'

const Sidebar = ({ isOpen, toggleSidebar }) => {
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
            path: '/payments',
            icon: CreditCard,
            label: 'Payments'
        },
        {
            path: '/feedback',
            icon: MessageSquare,
            label: 'Feedback'
        },
        {
            path: '/analytics',
            icon: BarChart3,
            label: 'Analytics'
        },
        {
            path: '/notifications',
            icon: Bell,
            label: 'Notifications'
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
                            <p className="admin-name">Admin User</p>
                            <p className="admin-role">Super Admin</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar
