import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import { useMasterDataController } from '../../../controllers/MasterDataController';

export default function ManageSubGroupItem() {
    const { data: categories, loading, handleSave, handleDelete } = useMasterDataController('Categories');
    const [name, setName] = useState('');

    const onSave = async (e) => {
        e.preventDefault();
        const res = await handleSave({ name });
        if (res.success) setName('');
        else alert(res.message);
    };

    const columns = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Sub Group Name' }
    ];

    return (
        <div>
            <PageHeader title="Manage Sub Group Item Master" />
            <div className="content-card">
                <div className="card-body">
                    <div className="section-header-bar" style={{ marginTop: 0 }}>Add New Sub Group</div>
                    <form onSubmit={onSave} style={{ marginTop: '15px' }}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="required-label">Sub Group Name <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    className="login-input" 
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>
                        <div className="btn-group">
                            <button type="submit" className="btn btn-primary">Save Sub Group</button>
                        </div>
                    </form>

                    <div className="section-header-bar">Existing Sub Groups</div>
                    {loading ? <p>Loading...</p> : (
                        <DataTable 
                            columns={columns} 
                            data={categories} 
                            actions={['Delete']} 
                            onAction={(action, row) => action === 'Delete' && handleDelete(row.id)} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
