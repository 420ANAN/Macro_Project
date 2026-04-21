import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import { apiUrl } from '../../../config/api';

export default function Reporting() {
    const [salesData, setSalesData] = useState([]);
    const [supplyData, setSupplyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('maco_user'))?.token;
                const headers = { 'Authorization': `Bearer ${token}` };

                const [sRes, supRes] = await Promise.all([
                    fetch(apiUrl('/api/reports/sales'), { headers }),
                    fetch(apiUrl('/api/reports/supplies'), { headers })
                ]);

                if (sRes.ok && supRes.ok) {
                    setSalesData(await sRes.json());
                    setSupplyData(await supRes.json());
                }
            } catch (err) {
                console.error('Report Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (loading) return <div className="p-20 text-center">Crunching numbers...</div>;

    return (
        <div className="reporting-container">
            <PageHeader title="Advanced Analytics & Reporting" />
            
            <div className="content-card">
                <div className="card-body">
                    <div className="section-header-bar" style={{ marginTop: 0 }}>Sales Performance (Last 6 Months)</div>
                    <div className="report-grid">
                        {salesData.length === 0 ? (
                            <p className="no-data">No sales data available for this period.</p>
                        ) : (
                            salesData.map(item => (
                                <div key={item.month} className="glass-card stat-card">
                                    <div className="stat-label">{item.month}</div>
                                    <div className="stat-value">₹{parseFloat(item.totalRevenue || 0).toLocaleString()}</div>
                                    <div className="stat-desc">{item.orderCount} Orders</div>
                                    <div className="bar-container">
                                        <div 
                                            className="bar" 
                                            style={{ width: `${Math.min(100, (item.totalRevenue / 100000) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="section-header-bar" style={{ marginTop: '40px' }}>Logistics Activity (Last 6 Months)</div>
                    <div className="report-grid">
                        {supplyData.length === 0 ? (
                            <p className="no-data">No supply data recorded yet.</p>
                        ) : (
                            supplyData.map(item => (
                                <div key={item.month} className="glass-card stat-card color-green">
                                    <div className="stat-label">{item.month}</div>
                                    <div className="stat-value">{item.challanCount}</div>
                                    <div className="stat-desc">Challans Uploaded</div>
                                    <div className="bar-container">
                                        <div 
                                            className="bar bg-green" 
                                            style={{ width: `${Math.min(100, (item.challanCount / 20) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .report-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }
                .stat-card {
                    padding: 20px;
                    border-left: 4px solid var(--orange-primary);
                }
                .stat-card.color-green {
                    border-left-color: #198754;
                }
                .stat-desc {
                    font-size: 12px;
                    color: #666;
                    margin-bottom: 10px;
                }
                .bar-container {
                    height: 8px;
                    background: #eee;
                    border-radius: 4px;
                    overflow: hidden;
                }
                .bar {
                    height: 100%;
                    background: var(--orange-primary);
                    transition: width 1s ease-in-out;
                }
                .bar.bg-green {
                    background: #198754;
                }
                .no-data {
                    grid-column: 1 / -1;
                    padding: 40px;
                    text-align: center;
                    color: #999;
                    background: #fdfdfd;
                    border: 1px dashed #ccc;
                    border-radius: 8px;
                }
            `}} />
        </div>
    );
}
