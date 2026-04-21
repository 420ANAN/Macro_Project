import React, { useState } from 'react';
import { useProductController } from '../../../controllers/ProductController';
import PageHeader from '../../components/PageHeader';
import ProductDetailModal from '../../components/ProductDetailModal';
import B2BProductCard from '../../components/B2BProductCard';
import { useNavigate } from 'react-router-dom';
import './b2b-catalog.css';

export default function ProductCatalog() {
    const { products, categories, loading, cart, addToCart } = useProductController();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();

    const filteredProducts = selectedCategory === 'All' 
        ? products 
        : products.filter(p => p.category === selectedCategory);

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
    };

    if (loading) return <div className="text-center mt-20">Loading B2B Catalog...</div>;

    return (
        <div className="b2b-catalog-container">
            <PageHeader title="Industrial Spare Parts Marketplace" />
            
            <div className="catalog-actions">
                <div className="category-filter-bar">
                    <button 
                        className={`filter-btn ${selectedCategory === 'All' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('All')}
                    >
                        All Categories
                    </button>
                    {categories.map(cat => (
                        <button 
                            key={cat.id}
                            className={`filter-btn ${selectedCategory === cat.name ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.name)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
                
                <div className="cart-summary-trigger" onClick={() => navigate('/customer/add-item-cart')}>
                    <span className="cart-icon">🛒</span>
                    <span className="cart-count">{cart.length}</span>
                    <span className="cart-label">Review Purchase Items</span>
                </div>
            </div>

            <div className="b2b-product-grid">
                {filteredProducts.map(product => (
                    <B2BProductCard 
                        key={product.id} 
                        product={product} 
                        onViewDetails={handleViewDetails} 
                    />
                ))}
                {filteredProducts.length === 0 && (
                    <div className="no-products-msg">No products found in this category.</div>
                )}
            </div>

            {selectedProduct && (
                <ProductDetailModal 
                    product={selectedProduct} 
                    onClose={() => setSelectedProduct(null)}
                    onAdd={addToCart}
                />
            )}
        </div>
    );
}
