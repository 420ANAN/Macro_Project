// src/controllers/PrimaryItemController.js
import { useState, useEffect } from 'react';
import { PrimaryItemModel } from '../models/PrimaryItemModel';

export const usePrimaryItemController = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchItems = async (silent = false) => {
        if (!silent) setLoading(true);
        const data = await PrimaryItemModel.getItems();
        setItems(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleSaveItem = async (itemData) => {
        const response = await PrimaryItemModel.saveItem(itemData);
        if (response.success) {
            alert('Item saved successfully!');
            fetchItems(true);
        } else {
            alert('Error saving item');
        }
    };

    const handleDeleteItem = async (id) => {
        if (!id) return;
        if (window.confirm('Are you sure you want to delete this item?')) {
            await PrimaryItemModel.deleteItem(id);
            alert('Item deleted successfully!');
            fetchItems(true);
        }
    };

    return {
        items,
        loading,
        handleSaveItem,
        handleDeleteItem
    };
};
