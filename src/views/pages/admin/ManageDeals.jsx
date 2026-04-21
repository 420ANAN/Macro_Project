// src/views/pages/admin/ManageDeals.jsx
import React from 'react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import { useCRMController } from '../../../controllers/CRMController';

export default function ManageDeals() {
    const { deals, loading } = useCRMController();

    const columns = [
        { key: 'name', header: 'Deal Name' },
        { key: 'amount', header: 'Expected Amount (₹)' },
        { key: 'stage', header: 'Current Stage' },
        { key: 'createdAt', header: 'Creation Date' }
    ];

    return (
        <div>
            <PageHeader title="Deal Management" />
            <div className="content-card">
                <div className="card-body">
                    <div className="section-header-bar" style={{ marginTop: 0 }}>Active Deals & Pipelines</div>
                    <div style={{ marginTop: '20px' }}>
                        {loading ? <p>Loading deals...</p> : (
                            <DataTable 
                                columns={columns} 
                                data={deals} 
                                actions={[]} 
                                onAction={() => {}} 
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
