import { useState, useEffect } from 'react';
import { apiUrl } from '../config/api'; // ✅ NEW

export const useProductController = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('maco_po_cart');
        return saved ? JSON.parse(saved) : [];
    });

    const fetchProducts = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('maco_user'))?.token;

            const [pRes, cRes] = await Promise.all([
                fetch(apiUrl('/api/products'), {   // ✅ CHANGED
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(apiUrl('/api/categories'), { // ✅ CHANGED
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            // ✅ NEW: better error visibility
            if (!pRes.ok || !cRes.ok) {
                throw new Error(
                    `Products status: ${pRes.status}, Categories status: ${cRes.status}`
                );
            }

            // ✅ NEW: check content type before parsing JSON
            const pType = pRes.headers.get('content-type');
            const cType = cRes.headers.get('content-type');

            if (!pType?.includes('application/json')) {
                const text = await pRes.text();
                throw new Error(`Products API returned non-JSON response: ${text.slice(0, 100)}`);
            }

            if (!cType?.includes('application/json')) {
                const text = await cRes.text();
                throw new Error(`Categories API returned non-JSON response: ${text.slice(0, 100)}`);
            }

            const pData = await pRes.json();
            const cData = await cRes.json();

            setProducts(pData);
            setCategories(cData);
        } catch (err) {
            console.error('Failed to fetch product data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        localStorage.setItem('maco_po_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, selections) => {
        const newItems = selections
            .filter(sh => sh.qty > 0)
            .map(sh => ({
                id: product.id,
                name: product.name,
                category: product.category,
                size: sh.size,
                qty: parseInt(sh.qty),
                price: product.rate,
                uom: product.uom,
                total: parseInt(sh.qty) * product.rate,
                cartId: `${product.id}-${sh.size}-${Date.now()}`
            }));

        setCart(prev => [...prev, ...newItems]);
    };

    const removeFromCart = (cartId) => {
        setCart(prev => prev.filter(item => item.cartId !== cartId));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('maco_po_cart');
    };

    return {
        products,
        categories,
        loading,
        cart,
        addToCart,
        removeFromCart,
        clearCart
    };
};