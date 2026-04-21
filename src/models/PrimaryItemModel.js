// src/models/PrimaryItemModel.js
import { apiUrl } from '../config/api';

const getToken = () => {
    const user = JSON.parse(localStorage.getItem('maco_user'));
    return user?.token ? `Bearer ${user.token}` : '';
};

export const PrimaryItemModel = {
    getItems: async () => {
        try {
            const response = await fetch(apiUrl('/api/primary-items'), {
                headers: { 'Authorization': getToken() }
            });
            if (response.ok) {
                return await response.json();
            }
            return [];
        } catch (error) {
            console.error('Failed to fetch items:', error);
            return [];
        }
    },
    saveItem: async (itemData) => {
        try {
            const response = await fetch(apiUrl('/api/primary-items'), {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': getToken()
                },
                body: JSON.stringify(itemData)
            });
            return await response.json();
        } catch (error) {
            console.error('Failed to save item:', error);
            return { success: false, message: 'Server error' };
        }
    },
    deleteItem: async (id) => {
        try {
            const response = await fetch(apiUrl(`/api/primary-items/${id}`), { 
                method: 'DELETE',
                headers: { 'Authorization': getToken() }
            });
            return await response.json();
        } catch {
            return { success: false };
        }
    }
};
