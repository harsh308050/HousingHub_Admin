import { Dropdown } from 'react-bootstrap'
import { Menu, Bell, Search, User, Settings, LogOut } from 'lucide-react'
import './Header.css'

const Header = ({ toggleSidebar }) => {
    return (
        <header className="admin-header glass-card">
            <div className="header-left">
                <button className="menu-toggle" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>
                <div className="search-container">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search anything..."
                    />
                </div>
            </div>

            <div className="header-right">
                <button className="icon-button">
                    <Bell size={20} />
                    <span className="notification-badge">5</span>
                </button>

                <Dropdown align="end">
                    <Dropdown.Toggle as="button" className="user-dropdown">
                        <div className="user-info">
                            <div className="user-avatar">
                                <User size={18} />
                            </div>
                            <div className="user-details">
                                <span className="user-name">Admin User</span>
                                <span className="user-role">Super Admin</span>
                            </div>
                        </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="user-dropdown-menu">
                        <Dropdown.Item className="dropdown-item-custom">
                            <User size={16} />
                            <span>Profile</span>
                        </Dropdown.Item>
                        <Dropdown.Item className="dropdown-item-custom">
                            <Settings size={16} />
                            <span>Settings</span>
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item className="dropdown-item-custom danger">
                            <LogOut size={16} />
                            <span>Logout</span>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </header>
    )
}

export default Header
