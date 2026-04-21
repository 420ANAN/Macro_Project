// src/controllers/CompanyController.js
import { useState, useEffect } from 'react';
import { CompanyModel } from '../models/CompanyModel';

export const useCompanyController = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCompanies = async (silent = false) => {
        if (!silent) setLoading(true);
        const data = await CompanyModel.getCompanies();
        setCompanies(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleSaveCompany = async (companyData) => {
        const response = await CompanyModel.saveCompany(companyData);
        if (response.success) {
            alert('Company saved successfully!');
            fetchCompanies(true);
        } else {
            alert('Error saving company');
        }
        return response.success;
    };

    return {
        companies,
        loading,
        handleSaveCompany
    };
};
