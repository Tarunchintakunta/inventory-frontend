import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState({ total_sales: 0, count: 0 });
    const [customers, setCustomers] = useState([]);
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [analyticsRes, customersRes, salesRes] = await Promise.all([
                api.get('/customers/analytics'),
                api.get('/customers/'),
                api.get('/sales/'),
            ]);
            setAnalytics(analyticsRes.data);
            setCustomers(customersRes.data);
            setSales(salesRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            {/* Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Sales Revenue</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">${analytics.total_sales.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Transactions</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.count}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Sales */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Recent Sales</h3>
                    </div>
                    <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                        {sales.map((sale) => (
                            <li key={sale.id} className="px-6 py-4">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {sale.customer_name || 'Walk-in Customer'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(sale.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-900">${sale.total_amount.toFixed(2)}</p>
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sale.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {sale.status}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Customers */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Customers</h3>
                    </div>
                    <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                        {customers.map((customer) => (
                            <li key={customer.id} className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                                        <p className="text-sm text-gray-500">{customer.email}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
