// src/views/pages/admin/ManageTasks.jsx
import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { useCRMController } from '../../../controllers/CRMController';

export default function ManageTasks() {
    const { tasks, loading, handleCreateTask } = useCRMController();
    const [formData, setFormData] = useState({ title: '', description: '', dueDate: '' });

    const onSubmit = async (e) => {
        e.preventDefault();
        const res = await handleCreateTask(formData);
        if (res.success) {
            setFormData({ title: '', description: '', dueDate: '' });
        } else {
            alert(res.message);
        }
    };

    return (
        <div>
            <PageHeader title="Task Management" />
            <div className="content-card">
                <div className="card-body">
                    <div className="section-header-bar" style={{ marginTop: 0 }}>Add New Task</div>
                    <form onSubmit={onSubmit} style={{ marginTop: '20px' }}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Task Title</label>
                                <input 
                                    className="login-input" 
                                    value={formData.title} 
                                    onChange={e => setFormData({...formData, title: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Due Date</label>
                                <input 
                                    type="date" 
                                    className="login-input" 
                                    value={formData.dueDate} 
                                    onChange={e => setFormData({...formData, dueDate: e.target.value})} 
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea 
                                    className="login-input" 
                                    value={formData.description} 
                                    onChange={e => setFormData({...formData, description: e.target.value})} 
                                />
                            </div>
                        </div>
                        <div className="btn-group">
                            <button type="submit" className="btn btn-primary">Create Task</button>
                        </div>
                    </form>

                    <div className="section-header-bar">My Tasks</div>
                    <div style={{ marginTop: '20px' }}>
                        {loading ? <p>Loading tasks...</p> : tasks.length === 0 ? <p>No tasks found.</p> : (
                            <div className="task-list">
                                {tasks.map(task => (
                                    <div key={task.id} className="glass-card" style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: '700', fontSize: '15px' }}>{task.title}</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>{task.description}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div className="badge badge-pending">{task.status}</div>
                                            <div style={{ fontSize: '11px', marginTop: '5px', color: '#888' }}>
                                                Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
