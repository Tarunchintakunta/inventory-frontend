import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark-custom fade-in">
            <div className="card card-dark shadow-lg p-4" style={{ width: '400px' }}>
                <div className="card-body">
                    <h2 className="card-title text-center text-custom mb-4">Login</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-custom">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label text-custom">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100 mb-3"
                        >
                            Login
                        </button>
                    </form>
                    <p className="text-center text-muted-custom mb-0">
                        Don't have an account? <Link to="/register" className="text-primary">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
