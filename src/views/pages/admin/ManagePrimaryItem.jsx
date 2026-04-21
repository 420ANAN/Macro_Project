import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import { useMasterDataController } from '../../../controllers/MasterDataController';

export default function ManagePrimaryItem() {
    // Note: We use 'PrimaryItems' as the key, though it requires a backend endpoint.
    // I'll ensure the backend has /api/primary-items.
    const { data: items, loading, handleSave, handleDelete } = useMasterDataController('PrimaryItems');
    const [formData, setFormData] = useState({ name: '', desc: '' });

    const onSave = async (e) => {
        e.preventDefault();
        const res = await handleSave(formData);
        if (res.success) setFormData({ name: '', desc: '' });
        else alert(res.message);
    };

    const columns = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Group Name' },
        { key: 'desc', header: 'Description' }
    ];

    return (
        <div>
            <PageHeader title="Manage Primary Item Master" />
            <div className="content-card">
                <div className="card-body">
                    <div className="section-header-bar" style={{ marginTop: 0 }}>Add New Primary Group</div>
                    <form onSubmit={onSave} style={{ marginTop: '15px' }}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="required-label">Primary Group Name <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    className="login-input" 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    className="login-input" 
                                    value={formData.desc}
                                    onChange={e => setFormData({...formData, desc: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="btn-group">
                            <button type="submit" className="btn btn-primary">Save Primary Group</button>
                        </div>
                    </form>

                    <div className="section-header-bar">Existing Primary Groups</div>
                    {loading ? <p>Loading...</p> : (
                        <DataTable 
                            columns={columns} 
                            data={items} 
                            actions={['Delete']} 
                            onAction={(action, row) => action === 'Delete' && handleDelete(row.id)} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
