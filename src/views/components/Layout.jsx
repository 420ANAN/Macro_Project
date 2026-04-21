import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({ userType = 'admin' }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="app-layout">
            <button className="mobile-toggle" onClick={toggleSidebar}>
                {isSidebarOpen ? '✕' : '☰'}
            </button>
            <div className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`} onClick={closeSidebar}></div>
            <Sidebar userType={userType} isOpen={isSidebarOpen} onClose={closeSidebar} />
            <div className="main-content">
                <div className="page-content">
                    <Outlet />
                </div>
                <Footer />
            </div>
        </div>
    );
}
