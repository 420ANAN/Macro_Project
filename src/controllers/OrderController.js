import { useState, useEffect } from 'react';
import { OrderModel } from '../models/OrderModel';
import { CompanyModel } from '../models/CompanyModel';

export const useOrderController = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [companies, setCompanies] = useState([]);

    const fetchOrders = async (silent = false) => {
        if (!silent) setLoading(true);
        const [ordersData, companiesData] = await Promise.all([
            OrderModel.getDraftOrders(),
            CompanyModel.getCompanies()
        ]);
        setOrders(ordersData);
        setCompanies(companiesData);
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const approveOrders = async (orderNo) => {
        if (!orderNo) return alert('Select an order to approve');
        await OrderModel.approveOrder(orderNo);
        fetchOrders(true);
    };

    const rejectOrders = async (orderNo) => {
        if (!orderNo) return alert('Select an order to reject');
        await OrderModel.rejectOrder(orderNo);
        fetchOrders(true);
    };

    const updateOrder = async (orderNo, data) => {
        const res = await OrderModel.updateOrder(orderNo, data);
        if (res.success) fetchOrders(true);
        return res;
    };

    const fetchOrderDetails = async (orderNo) => {
        return await OrderModel.getOrderDetails(orderNo);
    };

    return {
        orders,
        loading,
        companies,
        approveOrders,
        rejectOrders,
        updateOrder,
        fetchOrderDetails
    };
};
