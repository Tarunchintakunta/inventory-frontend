import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, lowStockRes, topProductsRes] = await Promise.all([
                api.get('/analytics/dashboard'),
                api.get('/analytics/products/low-stock'),
                api.get('/analytics/products/top-selling?limit=5')
            ]);
            setStats(statsRes.data);
            setLowStockProducts(lowStockRes.data);
            setTopProducts(topProductsRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mb-4">
                <h1 className="text-custom mb-2">Dashboard</h1>
                <p className="text-muted-custom">Welcome back, {user?.name}!</p>
            </div>

            {/* Statistics Cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-6 col-lg-3">
                    <div className="card card-dark border-custom">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted-custom text-uppercase small mb-2">Total Products</h6>
                                    <h3 className="text-custom mb-0">{stats?.total_products || 0}</h3>
                                </div>
                                <div className="text-primary" style={{ fontSize: '2.5rem' }}>
                                    <i className="bi bi-box-seam"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3">
                    <div className="card card-dark border-custom">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted-custom text-uppercase small mb-2">Total Revenue</h6>
                                    <h3 className="text-custom mb-0">${(stats?.total_revenue || 0).toFixed(2)}</h3>
                                </div>
                                <div className="text-success" style={{ fontSize: '2.5rem' }}>
                                    <i className="bi bi-currency-dollar"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3">
                    <div className="card card-dark border-custom">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted-custom text-uppercase small mb-2">Total Sales</h6>
                                    <h3 className="text-custom mb-0">{stats?.total_sales || 0}</h3>
                                </div>
                                <div className="text-info" style={{ fontSize: '2.5rem' }}>
                                    <i className="bi bi-graph-up"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3">
                    <div className={`card border-custom ${stats?.low_stock_count > 0 ? 'border-warning' : 'card-dark'}`}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted-custom text-uppercase small mb-2">Low Stock</h6>
                                    <h3 className={`mb-0 ${stats?.low_stock_count > 0 ? 'text-warning' : 'text-custom'}`}>
                                        {stats?.low_stock_count || 0}
                                    </h3>
                                </div>
                                <div className={stats?.low_stock_count > 0 ? 'text-warning' : 'text-muted-custom'} style={{ fontSize: '2.5rem' }}>
                                    <i className="bi bi-exclamation-triangle"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Today's Performance */}
            <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <div className="card card-dark border-custom">
                        <div className="card-header border-bottom border-custom">
                            <h5 className="text-custom mb-0">Today's Performance</h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-6">
                                    <div className="text-center">
                                        <h4 className="text-primary mb-1">{stats?.today_sales || 0}</h4>
                                        <small className="text-muted-custom">Sales</small>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="text-center">
                                        <h4 className="text-success mb-1">${(stats?.today_revenue || 0).toFixed(2)}</h4>
                                        <small className="text-muted-custom">Revenue</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card card-dark border-custom">
                        <div className="card-header border-bottom border-custom">
                            <h5 className="text-custom mb-0">This Week & Month</h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-6">
                                    <div className="text-center">
                                        <h4 className="text-info mb-1">{stats?.week_sales || 0}</h4>
                                        <small className="text-muted-custom">This Week</small>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="text-center">
                                        <h4 className="text-primary mb-1">{stats?.month_sales || 0}</h4>
                                        <small className="text-muted-custom">This Month</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3">
                {/* Low Stock Alerts */}
                <div className="col-lg-6">
                    <div className="card card-dark border-custom">
                        <div className="card-header border-bottom border-custom d-flex justify-content-between align-items-center">
                            <h5 className="text-custom mb-0">Low Stock Alerts</h5>
                            {lowStockProducts.length > 0 && (
                                <span className="badge bg-warning text-dark">{lowStockProducts.length}</span>
                            )}
                        </div>
                        <div className="card-body p-0" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {lowStockProducts.length === 0 ? (
                                <div className="text-center py-4 text-muted-custom">
                                    <p className="mb-0">All products are well stocked!</p>
                                </div>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {lowStockProducts.map((product) => (
                                        <li key={product.id} className="list-group-item bg-surface border-custom">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="text-custom mb-1">{product.name}</h6>
                                                    <small className="text-muted-custom">{product.category}</small>
                                                </div>
                                                <div className="text-end">
                                                    <span className="badge bg-warning text-dark mb-1">
                                                        Stock: {product.stock_quantity}
                                                    </span>
                                                    <br />
                                                    <small className="text-muted-custom">
                                                        Threshold: {product.low_stock_threshold}
                                                    </small>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Top Selling Products */}
                <div className="col-lg-6">
                    <div className="card card-dark border-custom">
                        <div className="card-header border-bottom border-custom">
                            <h5 className="text-custom mb-0">Top Selling Products</h5>
                        </div>
                        <div className="card-body p-0" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {topProducts.length === 0 ? (
                                <div className="text-center py-4 text-muted-custom">
                                    <p className="mb-0">No sales data available</p>
                                </div>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {topProducts.map((product, index) => (
                                        <li key={product.id} className="list-group-item bg-surface border-custom">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center">
                                                    <span className="badge bg-primary me-2">#{index + 1}</span>
                                                    <div>
                                                        <h6 className="text-custom mb-1">{product.name}</h6>
                                                        <small className="text-muted-custom">{product.category}</small>
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <div className="text-success fw-bold">
                                                        {product.total_quantity_sold} sold
                                                    </div>
                                                    <small className="text-muted-custom">
                                                        ${product.total_revenue.toFixed(2)}
                                                    </small>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
