import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export default function ProtectedRoute({ allowedRole }) {
    const { user } = useAuth();

    if (!user) {
        // Not logged in, redirect to root
        return <Navigate to="/" replace />;
    }

    if (user.role !== allowedRole) {
        // Logged in but wrong role, redirect to their own dashboard
        const homePath = user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard';
        return <Navigate to={homePath} replace />;
    }

    return <Outlet />;
}
