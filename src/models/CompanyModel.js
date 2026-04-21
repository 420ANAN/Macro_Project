// src/models/CompanyModel.js
import { apiUrl } from '../config/api';

const getToken = () => {
    const user = JSON.parse(localStorage.getItem('maco_user'));
    return user?.token ? `Bearer ${user.token}` : '';
};

export const CompanyModel = {
    getCompanies: async () => {
        try {
            const response = await fetch(apiUrl('/api/companies'), {
                headers: { 'Authorization': getToken() }
            });
            if (response.ok) {
                return await response.json();
            }
            return [];
        } catch (error) {
            console.error('Failed to fetch companies:', error);
            return [];
        }
    },
    saveCompany: async (companyData) => {
        try {
            const response = await fetch(apiUrl('/api/companies'), {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': getToken()
                },
                body: JSON.stringify(companyData)
            });
            return await response.json();
        } catch (error) {
            console.error('Failed to save company:', error);
            return { success: false, message: 'Server error' };
        }
    }
};
