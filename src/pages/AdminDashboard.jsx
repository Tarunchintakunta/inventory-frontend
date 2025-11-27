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
            <h1 className="text-custom mb-4 fade-in">Admin Dashboard</h1>

            {/* Analytics */}
            <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <div className="card card-dark border-custom">
                        <div className="card-body">
                            <h6 className="text-primary text-uppercase small mb-2">Total Sales Revenue</h6>
                            <h3 className="text-custom mb-0">${analytics.total_sales.toFixed(2)}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card card-dark border-custom">
                        <div className="card-body">
                            <h6 className="text-primary text-uppercase small mb-2">Total Transactions</h6>
                            <h3 className="text-custom mb-0">{analytics.count}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Recent Sales */}
                <div className="col-lg-6">
                    <div className="card card-dark border-custom fade-in">
                        <div className="card-header border-bottom border-custom">
                            <h5 className="text-custom mb-0">Recent Sales</h5>
                        </div>
                        <div className="card-body p-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <ul className="list-group list-group-flush">
                                {sales.map((sale) => (
                                    <li key={sale.id} className="list-group-item bg-surface border-custom">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <p className="mb-1 text-custom fw-medium">
                                                    {sale.customer_name || 'Walk-in Customer'}
                                                </p>
                                                <p className="mb-0 text-muted-custom small">
                                                    {new Date(sale.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-end">
                                                <p className="mb-1 text-custom fw-bold">${sale.total_amount.toFixed(2)}</p>
                                                <span className={`badge ${sale.status === 'completed' ? 'bg-success' : 'bg-danger'}`}>
                                                    {sale.status}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Customers */}
                <div className="col-lg-6">
                    <div className="card card-dark border-custom fade-in">
                        <div className="card-header border-bottom border-custom">
                            <h5 className="text-custom mb-0">Customers</h5>
                        </div>
                        <div className="card-body p-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <ul className="list-group list-group-flush">
                                {customers.map((customer) => (
                                    <li key={customer.id} className="list-group-item bg-surface border-custom">
                                        <div>
                                            <p className="mb-1 text-custom fw-medium">{customer.name}</p>
                                            <p className="mb-0 text-muted-custom small">{customer.email}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
