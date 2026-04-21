import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import FormButtons from '../../components/FormButtons';
import DataTable from '../../components/DataTable';
import { useCompanyController } from '../../../controllers/CompanyController';

export default function ManageCompany() {
    const { companies, loading, handleSaveCompany } = useCompanyController();
    
    // Simple state to control the form for submission
    const [formData, setFormData] = useState({
        companyId: '', name: '', email: '', contact: '', isActive: true
    });

    const columns = [
        { key: 'companyId', header: 'Company Id' },
        { key: 'name', header: 'Company Name' },
        { key: 'email', header: 'Email ID' },
        { key: 'contact', header: 'Contact No' },
        { key: 'isActive', header: 'Status' }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleSaveCompany(formData);
        setFormData({ companyId: '', name: '', email: '', contact: '', isActive: true });
    };

    return (
        <div>
            <PageHeader title="Manage Company Section" />
            <div className="content-card">
                <div className="card-body">
                    <div className="section-header-bar" style={{ marginTop: 0 }}>Manage Company Account</div>

                    <form id="company-form" style={{ marginTop: '20px' }} onSubmit={onSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="required-label">Company Id <span className="required">*</span></label>
                                <input name="companyId" type="text" className="responsive-input" required value={formData.companyId} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Company Name</label>
                                <input name="name" type="text" className="responsive-input" value={formData.name} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label className="required-label">EMail ID <span className="required">*</span></label>
                                <input name="email" type="email" className="responsive-input" required value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="required-label">Contact No <span className="required">*</span></label>
                                <input name="contact" type="text" className="responsive-input" required value={formData.contact} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-checkbox">
                            <input name="isActive" type="checkbox" id="isActive" checked={formData.isActive} onChange={handleChange} />
                            <label htmlFor="isActive" style={{ fontWeight: 'bold' }}>Is Active</label>
                        </div>

                        <FormButtons 
                            onUpdate={() => {}}
                            onReset={() => setFormData({ companyId: '', name: '', email: '', contact: '', isActive: true })}
                        />
                    </form>

                    <div className="section-header-bar">Company Data</div>
                    <fieldset style={{ marginTop: '5px' }}>
                        <legend>Companies Details</legend>
                        {loading ? <p>Loading companies...</p> : <DataTable columns={columns} data={companies} actions={[]} onAction={() => {}} />}
                    </fieldset>

                    <div className="mt-10 text-center" style={{ color: '#555', fontStyle: 'italic' }}>
                        Manage Company Section is use to Add / Edit or Delete Company.
                    </div>
                </div>
            </div>
        </div>
    );
}
