import React from 'react';
import PageHeader from '../../components/PageHeader';
import { useDashboardController } from '../../../controllers/DashboardController';

export default function AdminDashboard() {
    const { stats, companies, loading } = useDashboardController();

    return (
        <div>
            <PageHeader title="Admin Dashboard Section" />
            <div className="content-card" style={{ background: 'transparent', border: 'none' }}>
                <div className="card-body" style={{ padding: 0 }}>
                    <div className="section-header-bar" style={{ marginTop: 0, borderRadius: '8px 8px 0 0' }}>
                        System Overview & Quick Stats
                    </div>

                    <div className="stat-grid">
                        <div className="glass-card" style={{ borderLeft: '4px solid #ffc107' }}>
                            <div className="stat-label">Pending Approvals</div>
                            <div className="stat-value" style={{ color: stats.pendingUsers > 0 ? '#856404' : 'inherit' }}>
                                {stats.pendingUsers}
                            </div>
                            <div style={{ fontSize: '11px', color: '#666' }}>Users awaiting access</div>
                        </div>

                        <div className="glass-card" style={{ borderLeft: '4px solid var(--orange-primary)' }}>
                            <div className="stat-label">Pending Orders</div>
                            <div className="stat-value">{stats.pending}</div>
                            <div style={{ fontSize: '11px', color: '#666' }}>Orders awaiting review</div>
                        </div>

                        <div className="glass-card" style={{ borderLeft: '4px solid #198754' }}>
                            <div className="stat-label">Accepted Orders</div>
                            <div className="stat-value" style={{ color: '#198754' }}>{stats.accepted}</div>
                            <div style={{ fontSize: '11px', color: '#666' }}>Successful transactions</div>
                        </div>

                        <div className="glass-card" style={{ borderLeft: '4px solid #0dcaf0' }}>
                            <div className="stat-label">Total Revenue</div>
                            <div className="stat-value" style={{ color: '#0dcaf0' }}>₹{stats.revenue.toLocaleString()}</div>
                            <div style={{ fontSize: '11px', color: '#666' }}>From accepted orders</div>
                        </div>

                        <div className="glass-card" style={{ borderLeft: '4px solid #dc3545' }}>
                            <div className="stat-label">Rejected Orders</div>
                            <div className="stat-value" style={{ color: '#dc3545' }}>{stats.rejected}</div>
                            <div style={{ fontSize: '11px', color: '#666' }}>Cancelled/Rejected items</div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ marginTop: '20px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ minWidth: '150px' }}>Quick Filter by Customer</label>
                            <select 
                                className="login-input" 
                                style={{ maxWidth: '300px' }}
                                defaultValue="--Select--"
                            >
                                <option disabled>--Select Customer--</option>
                                {companies.map(c => (
                                    <option key={c.companyId} value={c.companyId}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-20 text-center" style={{ color: '#666', fontStyle: 'italic', fontSize: '12px' }}>
                        Real-time system health monitor. Use the sidebar to manage specific modules.
                    </div>
                </div>
            </div>
        </div>
    );
}
