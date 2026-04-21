import React from 'react';
import PageHeader from '../../components/PageHeader';
import FormButtons from '../../components/FormButtons';
import DataTable from '../../components/DataTable';

export default function ManageShippingType() {
    const columns = [
        { key: 'id', header: 'Shipping ID' },
        { key: 'name', header: 'Shipping Method Name' },
    ];

    const data = [
        { id: '1', name: 'SAI GOODS CARRIER' },
        { id: '2', name: 'ATUL CARRIER' },
        { id: '3', name: 'V-TRANS LTD.' },
        { id: '4', name: 'NITCO ROADWAYS' },
        { id: '5', name: 'SAURASHTRA ROADWAYS' },
    ];

    return (
        <div>
            <PageHeader title="Manage Shipping Type" />
            <div className="content-card">
                <div className="card-body">
                    <div className="section-header-bar" style={{ marginTop: 0 }}>Manage Shipping Type</div>
                    <form style={{ marginTop: '15px' }}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Enter the Shipping Type:</label>
                                <input type="text" className="responsive-input" />
                            </div>
                        </div>
                        <div className="btn-group">
                            <button type="button" className="btn btn-primary">Save</button>
                            <button type="button" className="btn btn-secondary">Reset</button>
                        </div>
                    </form>

                    <div className="section-header-bar">Shipping Details</div>
                    <DataTable columns={columns} data={data} actions={['Delete']} />

                    <div className="mt-10 text-center" style={{ color: '#555', fontStyle: 'italic' }}>
                        Manage Shipping Type Section is use to Add /Edit or Delete Shipping Type.
                    </div>
                </div>
            </div>
        </div>
    );
}
