// src/models/MasterModel.js
import { apiUrl } from '../config/api';

const getToken = () => {
    const user = JSON.parse(localStorage.getItem('maco_user'));
    return user?.token ? `Bearer ${user.token}` : '';
};

const createMasterEndpoints = (entity) => ({
    get: async () => {
        const response = await fetch(apiUrl(`/api/${entity}`), {
            headers: { 'Authorization': getToken() }
        });
        return await response.json();
    },
    create: async (data) => {
        const response = await fetch(apiUrl(`/api/${entity}`), {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': getToken() 
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    },
    delete: async (id) => {
        const response = await fetch(apiUrl(`/api/${entity}/${id}`), {
            method: 'DELETE',
            headers: { 'Authorization': getToken() }
        });
        return await response.json();
    }
});

export const MasterModel = {
    Categories: createMasterEndpoints('categories'),
    Units: createMasterEndpoints('units'),
    Sizes: createMasterEndpoints('sizes'),
    PrimaryItems: createMasterEndpoints('primary-items'),
    Products: {
        ...createMasterEndpoints('products'),
        get: async () => {
            const response = await fetch(apiUrl('/api/products'), {
                headers: { 'Authorization': getToken() }
            });
            return await response.json();
        }
    }
};
