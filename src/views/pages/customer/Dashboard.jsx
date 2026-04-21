import React from 'react';
import PageHeader from '../../components/PageHeader';

export default function CustomerDashboard() {
    return (
        <div>
            <PageHeader title="MACO Customer Dashboard" />
            <div className="content-card">
                <div className="card-body">
                    <div className="section-header-bar" style={{ marginTop: 0 }}>Dashboard</div>

                    <table className="status-table">
                        <tbody>
                            <tr className="status-row">
                                <td>Pending Order</td>
                                <td>0</td>
                            </tr>
                            <tr className="status-row accepted">
                                <td>Accepted Order</td>
                                <td>0</td>
                            </tr>
                            <tr className="status-row">
                                <td>Rejected Order</td>
                                <td>0</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="mt-20 text-center" style={{ color: '#555', fontStyle: 'italic' }}>
                        Customer After login dashboard with complete order details
                    </div>
                </div>
            </div>
        </div>
    );
}
