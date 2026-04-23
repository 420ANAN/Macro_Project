import React, { useState } from 'react';
import { useProductController } from '../../../controllers/ProductController';
import PageHeader from '../../components/PageHeader';
import ProductDetailModal from '../../components/ProductDetailModal';
import Product from '../../components/Product';
import { useNavigate } from 'react-router-dom';
import './product-catalog.css';

export default function ProductCatalog() {
    const { products, loading } = useProductController();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();


    const handleViewDetails = (product) => {
        const pathPrefix = window.location.pathname.startsWith('/admin') ? '/admin' : '/customer';
        navigate(`${pathPrefix}/product/${product.id}`);
    };

    if (loading) return <div className="text-center mt-20">Loading Product Catalog...</div>;

    return (
        <div className="product-catalog-container">
            <PageHeader title="Industrial Spare Parts Marketplace" />
            

            <div className="product-grid">
                {products.map(product => (
                    <Product 
                        key={product.id} 
                        product={product} 
                        onViewDetails={handleViewDetails} 
                    />
                ))}
                {products.length === 0 && (
                    <div className="no-products-msg">No products found in the marketplace.</div>
                )}
            </div>
        </div>
    );
}
