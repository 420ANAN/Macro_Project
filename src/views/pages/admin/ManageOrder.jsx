import React from 'react';
import PageHeader from '../../components/PageHeader';
import SearchForm from '../../components/SearchForm';
import DataTable from '../../components/DataTable';
import { useOrderController } from '../../../controllers/OrderController';

export default function ManageOrder() {
    const { orders, loading, companies, approveOrders, rejectOrders } = useOrderController();

    const columns = [
        { key: 'orderNo', header: 'OrderNo' },
        { key: 'customer', header: 'Customer Name' },
        { key: 'requisition', header: 'Requisition No' },
        { key: 'poDate', header: 'PO Date' },
        { key: 'destination', header: 'Destination' },
        { key: 'amount', header: 'NetAmount' },
        { key: 'status', header: 'Order Status' },
        { key: 'acceptDate', header: 'Reject/Accept Date' },
        { key: 'pdf', header: 'Download PDF' },
    ];

    const handleAction = (action, row) => {
        if (action === 'Approve') approveOrders(row.orderNo);
        if (action === 'Reject') rejectOrders(row.orderNo);
    };

    return (
        <div>
            <PageHeader title="Manage Order" />
            <div className="content-card">
                <div className="card-body">
                    <SearchForm title="Search Order Criteria">
                        <div className="form-group">
                            <label>Customer Name</label>
                            <select defaultValue="--Select--">
                                <option disabled>--Select--</option>
                                {companies.map(c => <option key={c.companyId} value={c.companyId}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Order No</label>
                            <input type="text" />
                        </div>
                        <div className="form-group">
                            <label>From Date</label>
                            <input type="text" placeholder="dd-mm-yyyy" />
                        </div>
                        <div className="form-group">
                            <label>To Date</label>
                            <input type="text" placeholder="dd-mm-yyyy" />
                        </div>
                        <div className="form-group">
                            <label>Order Type</label>
                            <select defaultValue="--Select--">
                                <option disabled>--Select--</option>
                            </select>
                        </div>
                    </SearchForm>

                    <div className="total-record">Total Record: {loading ? '...' : orders.length}</div>

                    <div className="section-header-bar">Order Details</div>
                    {loading ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
                    ) : (
                        <DataTable 
                            columns={columns} 
                            data={orders} 
                            actions={['Approve', 'Reject']} 
                            onAction={handleAction} 
                        />
                    )}

                    <div className="mt-10 text-center" style={{ color: '#555', fontStyle: 'italic' }}>
                        Manage Order section is used to manage order like accept and reject and delete order which is place by customer.
                    </div>
                </div>
            </div>
        </div>
    );
}
