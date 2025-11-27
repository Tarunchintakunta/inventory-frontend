import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

const Reports = () => {
    const [salesReport, setSalesReport] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [productAnalytics, setProductAnalytics] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const [salesRes, revenueRes, productsRes] = await Promise.all([
                api.get('/analytics/sales/report'),
                api.get('/analytics/revenue'),
                api.get('/analytics/products')
            ]);
            setSalesReport(salesRes.data);
            setRevenueData(revenueRes.data.daily_revenue || []);
            setProductAnalytics(productsRes.data);
        } catch (error) {
            console.error('Error fetching reports', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateFilter = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (startDate) params.append('start_date', startDate);
            if (endDate) params.append('end_date', endDate);

            const [salesRes, revenueRes] = await Promise.all([
                api.get(`/analytics/sales/report?${params.toString()}`),
                api.get(`/analytics/revenue?${params.toString()}`)
            ]);
            setSalesReport(salesRes.data);
            setRevenueData(revenueRes.data.daily_revenue || []);
        } catch (error) {
            console.error('Error filtering reports', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !salesReport) {
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
                <h1 className="text-custom mb-2">Reports & Analytics</h1>
                <p className="text-muted-custom">Comprehensive sales and product analytics</p>
            </div>

            {/* Date Filter */}
            <div className="card card-dark border-custom mb-4">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-4">
                            <label className="form-label text-custom">Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label text-custom">End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <button
                                className="btn btn-primary w-100"
                                onClick={handleDateFilter}
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Apply Filter'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales Report Summary */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card card-dark border-custom">
                        <div className="card-body text-center">
                            <h6 className="text-muted-custom text-uppercase small mb-2">Total Sales</h6>
                            <h3 className="text-primary mb-0">${(salesReport?.total_sales || 0).toFixed(2)}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card card-dark border-custom">
                        <div className="card-body text-center">
                            <h6 className="text-muted-custom text-uppercase small mb-2">Transaction Count</h6>
                            <h3 className="text-info mb-0">{salesReport?.count || 0}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card card-dark border-custom">
                        <div className="card-body text-center">
                            <h6 className="text-muted-custom text-uppercase small mb-2">Average Sale</h6>
                            <h3 className="text-success mb-0">${(salesReport?.average_sale || 0).toFixed(2)}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="row g-3 mb-4">
                <div className="col-12">
                    <div className="card card-dark border-custom">
                        <div className="card-header border-bottom border-custom">
                            <h5 className="text-custom mb-0">Daily Revenue</h5>
                        </div>
                        <div className="card-body">
                            {revenueData.length === 0 ? (
                                <div className="text-center py-4 text-muted-custom">
                                    <p className="mb-0">No revenue data available for the selected period</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-dark-custom">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Revenue</th>
                                                <th>Transactions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {revenueData.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{new Date(item.date).toLocaleDateString()}</td>
                                                    <td className="text-success fw-bold">${item.revenue.toFixed(2)}</td>
                                                    <td>{item.count}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Analytics by Category */}
            {productAnalytics && (
                <div className="row g-3">
                    <div className="col-12">
                        <div className="card card-dark border-custom">
                            <div className="card-header border-bottom border-custom">
                                <h5 className="text-custom mb-0">Product Analytics by Category</h5>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-dark-custom">
                                        <thead>
                                            <tr>
                                                <th>Category</th>
                                                <th>Product Count</th>
                                                <th>Total Stock</th>
                                                <th>Total Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productAnalytics.categories?.map((cat, index) => (
                                                <tr key={index}>
                                                    <td className="fw-bold text-custom">{cat.category}</td>
                                                    <td>{cat.count}</td>
                                                    <td>{cat.total_stock}</td>
                                                    <td className="text-success">${cat.total_value.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Reports;

