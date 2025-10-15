import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const OrderContext = createContext();

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
};

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5001/api/Orders');
            const apiOrders = response.data.map(order => ({
                id: order.id,
                customerName: order.customerName,
                customerEmail: order.customerEmail,
                items: order.orderItems || [],
                totalAmount: order.totalAmount,
                status: order.status || 'Food Processing',
                orderDate: order.orderDate
            }));
            setOrders(apiOrders);
            if (apiOrders.length > 0) {
                localStorage.setItem('orders', JSON.stringify(apiOrders));
            }
        } catch (error) {
            const savedOrders = localStorage.getItem('orders');
            if (savedOrders) {
                setOrders(JSON.parse(savedOrders));
            }
        } finally {
            setLoading(false);
        }
    };

    const addOrder = async (orderData) => {
        try {
            const response = await axios.post('http://localhost:5001/api/Orders', orderData);
            const newOrder = {
                id: response.data.orderId || response.data.id,
                ...orderData,
                orderDate: new Date().toISOString()
            };
            setOrders(prev => [newOrder, ...prev]);
            // Refresh from backend to sync
            setTimeout(() => fetchOrders(), 500);
            return newOrder;
        } catch (error) {
            console.error('❌ Backend error:', error);
            console.error('Error response:', error.response);
            console.error('Error data:', error.response?.data);
            throw error;
        }
    };

    const clearOrders = () => {
        setOrders([]);
        localStorage.removeItem('orders');
    };

    const refreshOrders = () => {
        fetchOrders();
    };

    return (
        <OrderContext.Provider value={{ orders, loading, addOrder, clearOrders, refreshOrders }}>
            {children}
        </OrderContext.Provider>
    );
};

export default OrderProvider;
