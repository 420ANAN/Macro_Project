import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import FormButtons from '../../components/FormButtons';
import DataTable from '../../components/DataTable';
import { useMasterDataController } from '../../../controllers/MasterDataController';

export default function ManageItemMaster() {
    const { data: products, loading: pLoading, handleSave, handleDelete } = useMasterDataController('Products');
    const { data: categories } = useMasterDataController('Categories');
    const { data: units } = useMasterDataController('Units');
    // We can fetch sizes if needed, but the form doesn't use it yet in a complex way
    
    const [formData, setFormData] = useState({
        itemCode: '', name: '', categoryId: '', description: '', uom: 'PCS', rate: '', mrp: ''
    });

    const onSave = async (e) => {
        e.preventDefault();
        const res = await handleSave(formData);
        if (res.success) {
            setFormData({ itemCode: '', name: '', categoryId: '', description: '', uom: 'PCS', rate: '', mrp: '' });
        } else alert(res.message);
    };

    const columns = [
        { key: 'itemCode', header: 'Item Code' },
        { key: 'name', header: 'Item Name' },
        { key: 'category', header: 'Category' },
        { key: 'uom', header: 'UOM' },
        { key: 'rate', header: 'Rate' },
        { key: 'mrp', header: 'MRP' }
    ];

    return (
        <div>
            <PageHeader title="Manage Item Master" />
            <div className="content-card">
                <div className="card-body">
                    <div className="section-header-bar" style={{ marginTop: 0 }}>Add New Item</div>
                    <form onSubmit={onSave} style={{ marginTop: '15px' }}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Item Code</label>
                                <input 
                                    className="login-input" 
                                    value={formData.itemCode} 
                                    onChange={e => setFormData({...formData, itemCode: e.target.value})} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Item Name</label>
                                <input 
                                    className="login-input" 
                                    required 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select 
                                    className="login-input" 
                                    value={formData.categoryId} 
                                    onChange={e => setFormData({...formData, categoryId: e.target.value})}
                                >
                                    <option value="">--Select Category--</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Unit (UOM)</label>
                                <select 
                                    className="login-input" 
                                    value={formData.uom} 
                                    onChange={e => setFormData({...formData, uom: e.target.value})}
                                >
                                    {units.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                                    {units.length === 0 && <option value="PCS">PCS</option>}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Rate</label>
                                <input 
                                    type="number" 
                                    className="login-input" 
                                    value={formData.rate} 
                                    onChange={e => setFormData({...formData, rate: e.target.value})} 
                                />
                            </div>
                            <div className="form-group">
                                <label>MRP</label>
                                <input 
                                    type="number" 
                                    className="login-input" 
                                    value={formData.mrp} 
                                    onChange={e => setFormData({...formData, mrp: e.target.value})} 
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea 
                                    className="login-input" 
                                    value={formData.description} 
                                    onChange={e => setFormData({...formData, description: e.target.value})} 
                                />
                            </div>
                        </div>
                        <div className="btn-group">
                            <button type="submit" className="btn btn-primary">Save Product</button>
                        </div>
                    </form>

                    <div className="section-header-bar">Existing Products</div>
                    {pLoading ? <p>Loading...</p> : (
                        <DataTable 
                            columns={columns} 
                            data={products} 
                            actions={['Delete']} 
                            onAction={(action, row) => action === 'Delete' && handleDelete(row.id)} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
