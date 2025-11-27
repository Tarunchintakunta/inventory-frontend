import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-vh-100 bg-dark-custom">
            <nav className="navbar navbar-expand-lg bg-surface border-bottom border-custom shadow">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand text-primary fw-bold">
                        Inventory System
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link to="/" className="nav-link text-muted-custom">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/products" className="nav-link text-muted-custom">Products</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/sales" className="nav-link text-muted-custom">Sales</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/reports" className="nav-link text-muted-custom">Reports</Link>
                            </li>
                            {user?.role === 'admin' && (
                                <li className="nav-item">
                                    <Link to="/admin" className="nav-link text-muted-custom">Admin</Link>
                                </li>
                            )}
                        </ul>
                        <div className="d-flex align-items-center">
                            <span className="text-custom me-3">Welcome, {user?.name}</span>
                            <button
                                onClick={handleLogout}
                                className="btn btn-danger btn-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="container-fluid py-4">
                {children}
            </main>
        </div>
    );
};

export default Layout;
