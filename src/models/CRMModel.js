// src/models/CRMModel.js
import { apiUrl } from '../config/api';

const getToken = () => {
    const user = JSON.parse(localStorage.getItem('maco_user'));
    return user?.token ? `Bearer ${user.token}` : '';
};

export const CRMModel = {
    // LEADS
    getLeads: async () => {
        const response = await fetch(apiUrl('/api/leads'), {
            headers: { 'Authorization': getToken() }
        });
        return await response.json();
    },
    createLead: async (leadData) => {
        const response = await fetch(apiUrl('/api/leads'), {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': getToken() 
            },
            body: JSON.stringify(leadData)
        });
        return await response.json();
    },
    convertLead: async (id, conversionData) => {
        const response = await fetch(apiUrl(`/api/leads/${id}/convert`), {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': getToken() 
            },
            body: JSON.stringify(conversionData)
        });
        return await response.json();
    },

    // DEALS
    getDeals: async () => {
        const response = await fetch(apiUrl('/api/deals'), {
            headers: { 'Authorization': getToken() }
        });
        return await response.json();
    },
    createDeal: async (dealData) => {
        const response = await fetch(apiUrl('/api/deals'), {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': getToken() 
            },
            body: JSON.stringify(dealData)
        });
        return await response.json();
    },

    // TASKS
    getTasks: async () => {
        const response = await fetch(apiUrl('/api/tasks'), {
            headers: { 'Authorization': getToken() }
        });
        return await response.json();
    },
    createTask: async (taskData) => {
        const response = await fetch(apiUrl('/api/tasks'), {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': getToken() 
            },
            body: JSON.stringify(taskData)
        });
        return await response.json();
    }
};
