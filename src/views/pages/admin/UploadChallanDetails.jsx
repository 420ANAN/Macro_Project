import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { useSupplyController } from '../../../controllers/SupplyController';

export default function UploadChallanDetails() {
    const { companies, handleUploadChallan } = useSupplyController();
    const [formData, setFormData] = useState({
        challanNo: '',
        companyId: '',
        challanDate: new Date().toISOString().split('T')[0],
        items: [{ itemName: '', quantity: '', uom: '' }]
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index, e) => {
        const newItems = [...formData.items];
        newItems[index][e.target.name] = e.target.value;
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { itemName: '', quantity: '', uom: '' }]
        });
    };

    const removeItem = (index) => {
        if (formData.items.length === 1) return;
        setFormData({
            ...formData,
            items: formData.items.filter((_, i) => i !== index)
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!formData.companyId) return alert('Please select a company');
        
        const res = await handleUploadChallan(formData);
        if (res.success) {
            alert('Challan uploaded successfully!');
            setFormData({
                challanNo: '', companyId: '', challanDate: new Date().toISOString().split('T')[0],
                items: [{ itemName: '', quantity: '', uom: '' }]
            });
        } else {
            alert(res.message);
        }
    };

    return (
        <div>
            <PageHeader title="Upload Challan Details" />
            <div className="content-card">
                <div className="card-body">
                    <form onSubmit={onSubmit}>
                        <div className="section-header-bar" style={{ marginTop: 0 }}>Challan Basic Info</div>
                        <div className="form-grid" style={{ marginTop: '15px' }}>
                            <div className="form-group">
                                <label>Challan No</label>
                                <input name="challanNo" type="text" className="login-input" required value={formData.challanNo} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Company Name</label>
                                <select name="companyId" className="login-input" value={formData.companyId} onChange={handleChange} required>
                                    <option value="">--Select Company--</option>
                                    {companies.map(c => <option key={c.companyId} value={c.companyId}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Challan Date</label>
                                <input name="challanDate" type="date" className="login-input" required value={formData.challanDate} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="section-header-bar">Challan Items</div>
                        <div className="mt-10">
                            {formData.items.map((item, index) => (
                                <div key={index} className="form-grid" style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px', alignItems: 'flex-end' }}>
                                    <div className="form-group">
                                        <label>Item Name</label>
                                        <input name="itemName" type="text" className="login-input" value={item.itemName} onChange={(e) => handleItemChange(index, e)} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Quantity</label>
                                        <input name="quantity" type="number" className="login-input" value={item.quantity} onChange={(e) => handleItemChange(index, e)} required />
                                    </div>
                                    <div className="form-group">
                                        <label>UOM</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <input name="uom" type="text" className="login-input" value={item.uom} onChange={(e) => handleItemChange(index, e)} />
                                            {formData.items.length > 1 && (
                                                <button type="button" className="btn btn-danger" onClick={() => removeItem(index)} style={{ padding: '5px 10px' }}>✕</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button type="button" className="btn btn-secondary" onClick={addItem}>+ Add More Item</button>
                        </div>

                        <div className="btn-group mt-20">
                            <button type="submit" className="btn btn-primary">Upload Challan Details</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
