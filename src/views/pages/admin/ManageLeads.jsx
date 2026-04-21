// src/views/pages/admin/ManageLeads.jsx
import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import { useCRMController } from '../../../controllers/CRMController';

export default function ManageLeads() {
    const { leads, loading, handleCreateLead, handleConvertLead } = useCRMController();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', status: 'New' });
    const [convertId, setConvertId] = useState(null);
    const [conversionData, setConversionData] = useState({ dealName: '', amount: '' });

    const columns = [
        { key: 'name', header: 'Lead Name' },
        { key: 'email', header: 'Email' },
        { key: 'phone', header: 'Phone' },
        { key: 'status', header: 'Status' },
        { key: 'createdAt', header: 'Date Added' }
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const res = await handleCreateLead(formData);
        if (res.success) {
            setFormData({ name: '', email: '', phone: '', status: 'New' });
            alert('Lead created successfully');
        } else {
            alert(res.message);
        }
    };

    const onAction = (action, row) => {
        if (action === 'Convert') {
            setConvertId(row.id);
            setConversionData({ dealName: `Deal for ${row.name}`, amount: '0' });
        }
    };

    const handleConvertSubmit = async (e) => {
        e.preventDefault();
        const res = await handleConvertLead(convertId, conversionData);
        if (res.success) {
            setConvertId(null);
            alert('Lead converted to Deal!');
        } else {
            alert(res.message);
        }
    };

    return (
        <div>
            <PageHeader title="Lead Management" />
            <div className="content-card">
                <div className="card-body">
                    <div className="section-header-bar" style={{ marginTop: 0 }}>Add New Lead</div>
                    <form style={{ marginTop: '20px' }} onSubmit={onSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="required-label">Lead Name <span className="required">*</span></label>
                                <input name="name" type="text" className="responsive-input" required value={formData.name} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input name="email" type="email" className="responsive-input" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input name="phone" type="text" className="responsive-input" value={formData.phone} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select name="status" className="responsive-input" value={formData.status} onChange={handleChange}>
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Qualified">Qualified</option>
                                    <option value="Lost">Lost</option>
                                </select>
                            </div>
                        </div>
                        <div className="btn-group">
                            <button type="submit" className="btn btn-primary">Save Lead</button>
                        </div>
                    </form>

                    {convertId && (
                        <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6', marginTop: '20px' }}>
                            <h4 style={{ margin: '0 0 15px' }}>Convert Lead to Deal</h4>
                            <form onSubmit={handleConvertSubmit}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Deal Name</label>
                                        <input type="text" value={conversionData.dealName} onChange={e => setConversionData({...conversionData, dealName: e.target.value})} required className="responsive-input" />
                                    </div>
                                    <div className="form-group">
                                        <label>Expected Amount</label>
                                        <input type="number" value={conversionData.amount} onChange={e => setConversionData({...conversionData, amount: e.target.value})} required className="responsive-input" />
                                    </div>
                                </div>
                                <div className="btn-group">
                                    <button type="submit" className="btn btn-primary">Proceed Conversion</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setConvertId(null)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="section-header-bar">Active Leads</div>
                    <div style={{ marginTop: '10px' }}>
                        {loading ? <p>Loading leads...</p> : (
                            <DataTable 
                                columns={columns} 
                                data={leads.filter(l => l.status !== 'Converted')} 
                                actions={['Convert']} 
                                onAction={onAction} 
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
