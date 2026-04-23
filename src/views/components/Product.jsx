import React from 'react';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Product({ product, onViewDetails }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const isAdmin = user?.role === 'admin';

    const handleEdit = (e) => {
        e.stopPropagation();
        navigate('/admin/manage-item-master');
    };

    return (
        <div className="product-card" onClick={() => onViewDetails(product)}>
            <div className="product-card-image-section">
                <img 
                    src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Industrial+Part'} 
                    alt={product.name} 
                    className="product-card-img"
                />
                <div className="product-card-overlay">
                    <span className="view-details-text">View Full Specifications</span>
                </div>
            </div>
            
            <div className="product-card-content">
                <h3 className="product-title">{product.name}</h3>
                
                <div className="product-card-footer" style={{ gridTemplateColumns: isAdmin ? '1fr 1fr' : '1fr' }}>
                    <button className="btn-action-primary">Contact supplier</button>
                    {isAdmin && (
                        <button className="btn-action-secondary" onClick={handleEdit}>
                            Edit Item
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
