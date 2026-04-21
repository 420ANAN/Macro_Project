// src/models/OrderModel.js
import { apiUrl } from '../config/api';

const getToken = () => {
    const user = JSON.parse(localStorage.getItem('maco_user'));
    return user?.token ? `Bearer ${user.token}` : '';
};

export const OrderModel = {
    getDraftOrders: async () => {
        try {
            const response = await fetch(apiUrl('/api/orders'), {
                headers: { 'Authorization': getToken() }
            });
            if (response.ok) {
                return await response.json();
            }
            return [];
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            return [];
        }
    },
    approveOrder: async (orderNo) => {
        const response = await fetch(apiUrl(`/api/orders/${orderNo}/approve`), { 
            method: 'POST',
            headers: { 'Authorization': getToken() }
        });
        return await response.json();
    },
    rejectOrder: async (orderNo) => {
        const response = await fetch(apiUrl(`/api/orders/${orderNo}/reject`), { 
            method: 'POST',
            headers: { 'Authorization': getToken() }
        });
        return await response.json();
    },
    createOrder: async (orderData) => {
        const response = await fetch(apiUrl('/api/orders'), {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': getToken() 
            },
            body: JSON.stringify(orderData)
        });
        return await response.json();
    }
};
