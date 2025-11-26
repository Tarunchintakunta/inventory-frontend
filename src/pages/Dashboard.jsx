import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <Layout>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <p className="text-gray-600">
                    Welcome to the Secure Inventory & Sales Management System.
                </p>
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-blue-500 truncate">
                                Role
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                {user?.role.toUpperCase()}
                            </dd>
                        </div>
                    </div>
                    {/* Add more widgets here */}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
