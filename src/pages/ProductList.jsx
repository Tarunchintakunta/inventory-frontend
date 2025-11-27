import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ 
        name: '', 
        price: 0, 
        stock_quantity: 0, 
        category: '',
        description: '',
        low_stock_threshold: 5
    });
    const [isEditing, setIsEditing] = useState(false);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [lowStockOnly, setLowStockOnly] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [products, searchTerm, selectedCategory, minPrice, maxPrice, lowStockOnly]);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products/');
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error('Error fetching products', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/products/categories');
            setCategories(response.data.categories || []);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const applyFilters = async () => {
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (selectedCategory) params.append('category', selectedCategory);
            if (minPrice) params.append('min_price', minPrice);
            if (maxPrice) params.append('max_price', maxPrice);
            if (lowStockOnly) params.append('low_stock_only', 'true');

            const response = await api.get(`/products/?${params.toString()}`);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error('Error filtering products', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (error) {
                alert('Failed to delete product');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/products/${currentProduct.id}`, currentProduct);
            } else {
                await api.post('/products/', currentProduct);
            }
            setIsModalOpen(false);
            setCurrentProduct({ 
                name: '', 
                price: 0, 
                stock_quantity: 0, 
                category: '',
                description: '',
                low_stock_threshold: 5
            });
            setIsEditing(false);
            fetchProducts();
            fetchCategories();
        } catch (error) {
            console.error('Error saving product', error);
            alert('Failed to save product');
        }
    };

    const openEditModal = (product) => {
        setCurrentProduct(product);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setMinPrice('');
        setMaxPrice('');
        setLowStockOnly(false);
    };

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="text-custom mb-2">Products</h1>
                    <p className="text-muted-custom">Manage your inventory</p>
                </div>
                {user?.role === 'admin' && (
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setCurrentProduct({ 
                                name: '', 
                                price: 0, 
                                stock_quantity: 0, 
                                category: '',
                                description: '',
                                low_stock_threshold: 5
                            });
                            setIsEditing(false);
                            setIsModalOpen(true);
                        }}
                    >
                        <i className="bi bi-plus-circle me-2"></i>Add Product
                    </button>
                )}
            </div>

            {/* Search and Filters */}
            <div className="card card-dark border-custom mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-2">
                            <select
                                className="form-select"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.name} value={cat.name}>
                                        {cat.name} ({cat.count})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Min Price"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                        </div>
                        <div className="col-md-2">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Max Price"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>
                        <div className="col-md-2">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="lowStockCheck"
                                    checked={lowStockOnly}
                                    onChange={(e) => setLowStockOnly(e.target.checked)}
                                />
                                <label className="form-check-label text-custom" htmlFor="lowStockCheck">
                                    Low Stock Only
                                </label>
                            </div>
                        </div>
                        <div className="col-md-1">
                            <button
                                className="btn btn-secondary w-100"
                                onClick={clearFilters}
                                title="Clear Filters"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="card card-dark border-custom">
                    <div className="card-header border-bottom border-custom d-flex justify-content-between align-items-center">
                        <h5 className="text-custom mb-0">Products ({filteredProducts.length})</h5>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-dark-custom table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    {user?.role === 'admin' && <th className="text-end">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={user?.role === 'admin' ? 6 : 5} className="text-center py-4 text-muted-custom">
                                            No products found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => {
                                        const isLowStock = product.stock_quantity <= product.low_stock_threshold;
                                        return (
                                            <tr key={product.id}>
                                                <td>
                                                    <div>
                                                        <strong className="text-custom">{product.name}</strong>
                                                        {product.description && (
                                                            <>
                                                                <br />
                                                                <small className="text-muted-custom">{product.description}</small>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="text-muted-custom">{product.category}</td>
                                                <td className="text-custom">${product.price.toFixed(2)}</td>
                                                <td>
                                                    <span className={`badge ${isLowStock ? 'bg-warning text-dark' : 'bg-success'}`}>
                                                        {product.stock_quantity}
                                                    </span>
                                                    {isLowStock && (
                                                        <>
                                                            <br />
                                                            <small className="text-warning">Threshold: {product.low_stock_threshold}</small>
                                                        </>
                                                    )}
                                                </td>
                                                <td>
                                                    {isLowStock ? (
                                                        <span className="badge bg-warning text-dark">Low Stock</span>
                                                    ) : (
                                                        <span className="badge bg-success">In Stock</span>
                                                    )}
                                                </td>
                                                {user?.role === 'admin' && (
                                                    <td className="text-end">
                                                        <button
                                                            className="btn btn-sm btn-link text-primary p-0 me-3"
                                                            onClick={() => openEditModal(product)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-link text-danger p-0"
                                                            onClick={() => handleDelete(product.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Product Modal */}
            {isModalOpen && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.75)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content card-dark border-custom">
                            <div className="modal-header border-bottom border-custom">
                                <h5 className="modal-title text-custom">{isEditing ? 'Edit Product' : 'Add Product'}</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setIsModalOpen(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label text-custom">Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={currentProduct.name}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-custom">Category *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={currentProduct.category}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                                list="categories"
                                                required
                                            />
                                            <datalist id="categories">
                                                {categories.map((cat) => (
                                                    <option key={cat.name} value={cat.name} />
                                                ))}
                                            </datalist>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-custom">Price *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control"
                                                value={currentProduct.price}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-custom">Stock Quantity *</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={currentProduct.stock_quantity}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, stock_quantity: parseInt(e.target.value) })}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-custom">Low Stock Threshold</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={currentProduct.low_stock_threshold}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, low_stock_threshold: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label text-custom">Description</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={currentProduct.description || ''}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-top border-custom">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {isEditing ? 'Update' : 'Create'} Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ProductList;
