// src/models/SupplyModel.js
import { apiUrl } from '../config/api';

const getToken = () => {
    const user = JSON.parse(localStorage.getItem('maco_user'));
    return user?.token ? `Bearer ${user.token}` : '';
};

export const SupplyModel = {
    getSupplies: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(apiUrl(`/api/supplies?${queryParams}`), {
            headers: { 'Authorization': getToken() }
        });
        return await response.json();
    },
    uploadChallan: async (challanData) => {
        const response = await fetch(apiUrl('/api/challans'), {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': getToken() 
            },
            body: JSON.stringify(challanData)
        });
        return await response.json();
    }
};
