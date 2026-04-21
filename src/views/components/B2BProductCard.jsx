import React from 'react';

export default function B2BProductCard({ product, onViewDetails }) {
    return (
        <div className="b2b-product-card" onClick={() => onViewDetails(product)}>
            <div className="b2b-card-image-section">
                <img 
                    src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Product'} 
                    alt={product.name} 
                />
            </div>
            
            <div className="b2b-card-content">
                <h3 className="b2b-product-title">{product.name}</h3>
                <p className="b2b-product-price">
                    <span className="price-label">Price: </span>
                    <span className="price-value">₹{product.rate}</span>
                    <span className="price-uom"> / {product.uom}</span>
                </p>
                
                <div className="b2b-specs-list">
                    {product.description ? (
                        product.description.split('\n').slice(0, 3).map((line, i) => (
                            <div key={i} className="spec-line">• {line}</div>
                        ))
                    ) : (
                        <div className="spec-line">• High Quality Spare Part</div>
                    )}
                </div>

                <div className="b2b-supplier-info">
                    <div className="supplier-header">
                        <span className="company-name">{product.supplierName || 'Maco Automotive Pvt Ltd'}</span>
                    </div>
                    <div className="supplier-meta">
                        <span className="location-tag">📍 {product.location || 'New Delhi, India'}</span>
                        <span className="experience-tag">📅 {product.experienceYears || '15'}+ Years</span>
                    </div>
                </div>

                <div className="b2b-card-actions">
                    <button className="btn-contact-supplier">
                        <span className="icon">✉️</span> Contact Supplier
                    </button>
                    <button className="btn-call-now" onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `tel:${product.phone || '9876543210'}`;
                    }}>
                        <span className="icon">📞</span> Call Now
                    </button>
                </div>
            </div>
        </div>
    );
}
