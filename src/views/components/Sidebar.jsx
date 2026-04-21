import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import macoLogo from '../../assets/maco logo white.png';
import { useAuth } from '../../context/useAuth';

const adminNavItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/user-approvals', label: 'User Approvals' }, // NEW
    { path: '/admin/manage-company', label: 'Manage Company' },
    { path: '/admin/manage-primary-item', label: 'Manage Primary Item Master' },
    { path: '/admin/manage-sub-item', label: 'Manage Sub Item Master' },
    { path: '/admin/manage-item-master', label: 'Manage Item Master' },
    { path: '/admin/manage-item-unit', label: 'Manage Item Unit' },
    { path: '/admin/manage-shipping', label: 'Manage Item Shipping' },
    { path: '/admin/manage-item-size', label: 'Manage Item Size' },
    { path: '/admin/manage-order', label: 'Manage Order Info' },
    { path: '/admin/upload-challan', label: 'Upload Challan Details' },
    { path: '/admin/track-supply', label: 'Track Supply Details' },
    { path: '/admin/manage-leads', label: 'Manage Leads' },
    { path: '/admin/manage-deals', label: 'Manage Deals' },
    { path: '/admin/manage-tasks', label: 'Tasks' },
    { path: '/admin/reports', label: 'Advanced Reporting' },
];

const customerNavItems = [
    { path: '/customer/dashboard', label: 'Dashboard' },
    { path: '/customer/add-item-cart', label: 'Add Item Cart' },
    { path: '/customer/manage-order', label: 'Manage Order' },
    { path: '/customer/track-supply', label: 'Track Supply Details' },
    { path: '/customer/manage-leads', label: 'My Leads' },
    { path: '/customer/manage-deals', label: 'My Deals' },
    { path: '/customer/manage-tasks', label: 'My Tasks' },
];

export default function Sidebar({ userType = 'admin', isOpen = false, onClose }) {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const navItems = userType === 'admin' ? adminNavItems : customerNavItems;
    const welcomeLabel = user?.username?.toUpperCase() || (userType === 'admin' ? 'ADMIN' : 'USER');

    const handleLogout = () => {
        logout();
        if (onClose) onClose();
        navigate('/');
    };

    const handleNavItemClick = () => {
        if (onClose) onClose();
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-logo">
                <img src={macoLogo} alt="MACO Logo" style={{ maxWidth: '160px', height: 'auto', display: 'block', margin: '0 auto' }} />
            </div>

            <div className="sidebar-welcome">
                <div>
                    Welcome, <span className="admin-label">{welcomeLabel}</span>
                </div>
                <div>
                    WS CMS | <a onClick={handleLogout}>Logout</a>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={handleNavItemClick}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}
