import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import SearchForm from '../../components/SearchForm';
import DataTable from '../../components/DataTable';
import { useSupplyController } from '../../../controllers/SupplyController';

export default function TrackSupplyDetails() {
    const { supplies, companies, loading, searchSupplies } = useSupplyController();
    const [filters, setFilters] = useState({ companyId: '', fromDate: '', toDate: '' });

    const handleSearch = (e) => {
        e.preventDefault();
        searchSupplies(filters);
    };

    const columns = [
        { key: 'challanNo', header: 'Challan No' },
        { key: 'companyId', header: 'Company' },
        { key: 'challanDate', header: 'Challan Date' },
        { key: 'itemName', header: 'Item Name' },
        { key: 'quantity', header: 'Quantity' },
        { key: 'uom', header: 'UOM' }
    ];

    return (
        <div>
            <PageHeader title="Track Supply Details" />
            <div className="content-card">
                <div className="card-body">
                    <form onSubmit={handleSearch}>
                        <SearchForm title="Search Supply Criteria">
                            <div className="form-group">
                                <label>Company</label>
                                <select 
                                    className="login-input" 
                                    value={filters.companyId} 
                                    onChange={e => setFilters({...filters, companyId: e.target.value})}
                                >
                                    <option value="">--All Companies--</option>
                                    {companies.map(c => <option key={c.companyId} value={c.companyId}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>From Date</label>
                                <input 
                                    type="date" 
                                    className="login-input" 
                                    value={filters.fromDate} 
                                    onChange={e => setFilters({...filters, fromDate: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>To Date</label>
                                <input 
                                    type="date" 
                                    className="login-input" 
                                    value={filters.toDate} 
                                    onChange={e => setFilters({...filters, toDate: e.target.value})}
                                />
                            </div>
                            <div className="btn-group" style={{ margin: 0, justifyContent: 'flex-end', gridColumn: '1 / -1' }}>
                                <button type="submit" className="btn btn-primary">Search Supplies</button>
                            </div>
                        </SearchForm>
                    </form>

                    <div className="section-header-bar">Supply Records</div>
                    <div className="scrollable-area mt-10" style={{ minHeight: '300px' }}>
                        {loading ? (
                            <div className="text-center py-20">Loading...</div>
                        ) : (
                            <DataTable columns={columns} data={supplies} actions={[]} onAction={() => {}} />
                        )}
                    </div>

                    <div className="mt-10 text-center" style={{ color: '#666', fontStyle: 'italic', fontSize: '11px' }}>
                        Track and monitor all supply challans and item deliveries.
                    </div>
                </div>
            </div>
        </div>
    );
}
