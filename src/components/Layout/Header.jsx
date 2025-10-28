import { Menu } from 'lucide-react'
import logo from '../../assets/Logo.png'
import './Header.css'

const Header = ({ toggleSidebar }) => {
    return (
        <header className="admin-header mobile-only">
            <div className="mobile-header-content">
                <button className="menu-toggle" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>

                <div className="mobile-logo-container">
                    <img src={logo} alt="HousingHub Logo" className="mobile-logo-image" />
                    <span className="mobile-logo-text">HousingHub</span>
                </div>
            </div>
        </header>
    )
}

export default Header
