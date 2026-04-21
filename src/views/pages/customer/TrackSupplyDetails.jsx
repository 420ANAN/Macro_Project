import React from 'react';
import PageHeader from '../../components/PageHeader';
import SearchForm from '../../components/SearchForm';

export default function CustomerTrackSupply() {
    return (
        <div>
            <PageHeader title="Track Supply Details" />
            <div className="content-card">
                <div className="card-body">
                    <SearchForm title="Search Supply Criteria">
                        <div className="form-group">
                            <label>From Date</label>
                            <input type="text" />
                        </div>
                        <div className="form-group">
                            <label>To Date</label>
                            <input type="text" />
                        </div>
                    </SearchForm>

                    <div className="scrollable-area mt-20" style={{ minHeight: '300px' }}>
                        {/* Empty scrollable area matching PDF */}
                    </div>

                    <div className="btn-group mt-20">
                        <button type="button" className="btn btn-primary">Export List</button>
                    </div>

                    <div className="mt-10 text-center" style={{ color: '#555', fontStyle: 'italic' }}>
                        This section is use to track the supply details which is uploaded by admin.
                    </div>
                </div>
            </div>
        </div>
    );
}
