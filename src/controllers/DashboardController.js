import { useState, useEffect } from 'react';
import { AuthModel } from '../models/AuthModel';
import { useAuth } from '../context/useAuth';
import { OrderModel } from '../models/OrderModel';
import { CompanyModel } from '../models/CompanyModel';

export const useDashboardController = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ pending: 0, accepted: 0, rejected: 0, pendingUsers: 0 });
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [orders, companyData, users] = await Promise.all([
                OrderModel.getDraftOrders(),
                CompanyModel.getCompanies(),
                AuthModel.getPendingUsers(user?.token).catch(() => [])
            ]);

            const newStats = orders.reduce((acc, order) => {
                const status = (order.status || '').toLowerCase();
                if (status === 'pending') acc.pending++;
                if (status === 'accepted') acc.accepted++;
                if (status === 'rejected') acc.rejected++;
                return acc;
            }, { pending: 0, accepted: 0, rejected: 0, pendingUsers: 0 });

            newStats.pendingUsers = users.filter(u => u.status === 'pending').length;

            setStats(newStats);
            setCompanies(companyData);
        } catch (err) {
            console.error('Dashboard Fetch Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return { stats, companies, loading };
};
