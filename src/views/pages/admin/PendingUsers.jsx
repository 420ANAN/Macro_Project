// NEW FILE: src/views/pages/admin/PendingUsers.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { AuthModel } from '../../../models/AuthModel';
import { useAuth } from '../../../context/useAuth';

// Status badge styling
const STATUS_STYLES = {
    pending:  { background: '#fff3cd', color: '#856404', border: '1px solid #ffc107' },
    approved: { background: '#d1e7dd', color: '#0a3622', border: '1px solid #198754' },
    rejected: { background: '#f8d7da', color: '#58151c', border: '1px solid #dc3545' },
};

export default function PendingUsers() {
    const { user } = useAuth();
    const [users, setUsers]       = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState('');
    const [actionMsg, setActionMsg] = useState('');
    // 'all' | 'pending' | 'approved' | 'rejected'
    const [filter, setFilter]     = useState('pending');

    // ── Fetch all customer registrations ──────────────────────────────────────
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await AuthModel.getPendingUsers(user?.token);
            setUsers(data);
        } catch (err) {
            setError(err.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [user?.token]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    // ── Approve ───────────────────────────────────────────────────────────────
    const handleApprove = async (id, email) => {
        setActionMsg('');
        try {
            await AuthModel.approveUser(id, user?.token);
            setActionMsg(`✅ ${email} approved successfully.`);
            // Refresh list
            setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'approved' } : u));
        } catch (err) {
            setActionMsg(`❌ ${err.message}`);
        }
    };

    // ── Reject ────────────────────────────────────────────────────────────────
    const handleReject = async (id, email) => {
        setActionMsg('');
        try {
            await AuthModel.rejectUser(id, user?.token);
            setActionMsg(`🚫 ${email} rejected.`);
            setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'rejected' } : u));
        } catch (err) {
            setActionMsg(`❌ ${err.message}`);
        }
    };

    // ── Filtered list ─────────────────────────────────────────────────────────
    const displayed = filter === 'all' ? users : users.filter(u => u.status === filter);

    // ── Counts for filter tabs ─────────────────────────────────────────────────
    const counts = {
        all:      users.length,
        pending:  users.filter(u => u.status === 'pending').length,
        approved: users.filter(u => u.status === 'approved').length,
        rejected: users.filter(u => u.status === 'rejected').length,
    };

    return (
        <div style={{ padding: '24px', fontFamily: 'inherit' }}>
            {/* ── Header ── */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>
                    User Registration Requests
                </h2>
                <p style={{ margin: '6px 0 0', color: '#666', fontSize: '14px' }}>
                    Approve or reject customer registration requests.
                </p>
            </div>

            {/* ── Action feedback ── */}
            {actionMsg && (
                <div style={{
                    padding: '10px 16px', borderRadius: '6px', marginBottom: '16px',
                    background: actionMsg.startsWith('✅') ? '#d1e7dd' : actionMsg.startsWith('🚫') ? '#fff3cd' : '#f8d7da',
                    color: '#333', fontSize: '14px', fontWeight: '600'
                }}>
                    {actionMsg}
                </div>
            )}

            {/* ── Error ── */}
            {error && (
                <div style={{ padding: '10px 16px', borderRadius: '6px', marginBottom: '16px', background: '#f8d7da', color: '#58151c', fontSize: '14px' }}>
                    {error}
                </div>
            )}

            {/* ── Filter tabs ── */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {['all', 'pending', 'approved', 'rejected'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        style={{
                            padding: '6px 18px', borderRadius: '20px', border: '1px solid #ccc',
                            cursor: 'pointer', fontSize: '13px', fontWeight: filter === tab ? 700 : 400,
                            background: filter === tab ? '#343a40' : '#fff',
                            color: filter === tab ? '#fff' : '#333',
                            textTransform: 'capitalize',
                        }}
                    >
                        {tab} ({counts[tab]})
                    </button>
                ))}
                <button
                    onClick={fetchUsers}
                    style={{
                        marginLeft: 'auto', padding: '6px 18px', borderRadius: '20px',
                        border: '1px solid #0d6efd', background: '#0d6efd', color: '#fff',
                        cursor: 'pointer', fontSize: '13px', fontWeight: 600
                    }}
                >
                    ↻ Refresh
                </button>
            </div>

            {/* ── Table ── */}
            {loading ? (
                <p style={{ color: '#666' }}>Loading...</p>
            ) : displayed.length === 0 ? (
                <p style={{ color: '#888', fontSize: '14px' }}>
                    No {filter === 'all' ? '' : filter} registrations found.
                </p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                                {['Full Name', 'Email', 'Role', 'Status', 'Registered On', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '10px 14px', borderBottom: '2px solid #dee2e6', whiteSpace: 'nowrap' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {displayed.map((u, idx) => (
                                <tr
                                    key={u.id}
                                    style={{ background: idx % 2 === 0 ? '#fff' : '#fafafa', verticalAlign: 'middle' }}
                                >
                                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #dee2e6' }}>
                                        {u.fullname || '—'}
                                    </td>
                                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #dee2e6' }}>
                                        {u.email || u.username}
                                    </td>
                                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #dee2e6', textTransform: 'capitalize' }}>
                                        {u.role}
                                    </td>
                                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #dee2e6' }}>
                                        <span style={{
                                            ...STATUS_STYLES[u.status],
                                            padding: '3px 10px', borderRadius: '12px',
                                            fontSize: '12px', fontWeight: 600, textTransform: 'capitalize'
                                        }}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #dee2e6', whiteSpace: 'nowrap', color: '#666' }}>
                                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', {
                                            day: '2-digit', month: 'short', year: 'numeric'
                                        }) : '—'}
                                    </td>
                                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #dee2e6' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {/* Approve button — only show if not already approved */}
                                            {u.status !== 'approved' && (
                                                <button
                                                    onClick={() => handleApprove(u.id, u.email || u.username)}
                                                    style={{
                                                        padding: '5px 14px', borderRadius: '5px', border: 'none',
                                                        background: '#198754', color: '#fff', cursor: 'pointer',
                                                        fontSize: '13px', fontWeight: 600
                                                    }}
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            {/* Reject button — only show if not already rejected */}
                                            {u.status !== 'rejected' && (
                                                <button
                                                    onClick={() => handleReject(u.id, u.email || u.username)}
                                                    style={{
                                                        padding: '5px 14px', borderRadius: '5px', border: 'none',
                                                        background: '#dc3545', color: '#fff', cursor: 'pointer',
                                                        fontSize: '13px', fontWeight: 600
                                                    }}
                                                >
                                                    Reject
                                                </button>
                                            )}
                                            {u.status === 'approved' && (
                                                <button
                                                    onClick={() => handleReject(u.id, u.email || u.username)}
                                                    style={{
                                                        padding: '5px 14px', borderRadius: '5px',
                                                        border: '1px solid #dc3545', background: '#fff',
                                                        color: '#dc3545', cursor: 'pointer',
                                                        fontSize: '13px', fontWeight: 600
                                                    }}
                                                >
                                                    Revoke
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
