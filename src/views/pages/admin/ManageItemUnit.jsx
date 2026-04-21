import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import { useMasterDataController } from '../../../controllers/MasterDataController';

export default function ManageItemUnit() {
    const { data: units, loading, handleSave, handleDelete } = useMasterDataController('Units');
    const [name, setName] = useState('');

    const onSave = async (e) => {
        e.preventDefault();
        const res = await handleSave({ name });
        if (res.success) setName('');
        else alert(res.message);
    };

    const columns = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Unit Name' }
    ];

    return (
        <div>
            <PageHeader title="Manage Item Unit" />
            <div className="content-card">
                <div className="card-body">
                    <div className="section-header-bar" style={{ marginTop: 0 }}>Add New Item Unit</div>
                    <form onSubmit={onSave} style={{ marginTop: '15px' }}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="required-label">Item Unit Name <span className="required">*</span></label>
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
                            <button type="submit" className="btn btn-primary">Save Unit</button>
                        </div>
                    </form>

                    <div className="section-header-bar">Existing Units</div>
                    {loading ? <p>Loading...</p> : (
                        <DataTable 
                            columns={columns} 
                            data={units} 
                            actions={['Delete']} 
                            onAction={(action, row) => action === 'Delete' && handleDelete(row.id)} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
