import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

const Sales = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [customerName, setCustomerName] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products/');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        const existingItem = cart.find((item) => item.product_id === product.id);
        if (existingItem) {
            if (existingItem.quantity + 1 > product.stock_quantity) {
                alert('Not enough stock');
                return;
            }
            setCart(
                cart.map((item) =>
                    item.product_id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            if (product.stock_quantity < 1) {
                alert('Out of stock');
                return;
            }
            setCart([
                ...cart,
                {
                    product_id: product.id,
                    name: product.name,
                    price_at_sale: product.price,
                    quantity: 1,
                    max_stock: product.stock_quantity,
                },
            ]);
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter((item) => item.product_id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        const item = cart.find((i) => i.product_id === productId);
        if (newQuantity > item.max_stock) {
            alert('Not enough stock');
            return;
        }
        setCart(
            cart.map((item) =>
                item.product_id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        try {
            const saleData = {
                items: cart.map(({ product_id, quantity, price_at_sale }) => ({
                    product_id,
                    quantity,
                    price_at_sale,
                })),
                customer_name: customerName,
            };
            await api.post('/sales/', saleData);
            alert('Sale completed successfully!');
            setCart([]);
            setCustomerName('');
            fetchProducts();
        } catch (error) {
            console.error('Error creating sale', error);
            alert('Failed to complete sale');
        }
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalAmount = cart.reduce(
        (sum, item) => sum + item.price_at_sale * item.quantity,
        0
    );

    return (
        <Layout>
            <div className="row g-3 fade-in" style={{ height: 'calc(100vh - 150px)' }}>
                {/* Product Selection */}
                <div className="col-lg-8" style={{ maxHeight: '100%', overflowY: 'auto' }}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="row g-3">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="col-md-4">
                                <div
                                    className="card card-dark border-custom cursor-pointer"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => addToCart(product)}
                                >
                                    <div className="card-body">
                                        <h6 className="card-title text-custom mb-2">{product.name}</h6>
                                        <p className="text-primary fw-bold mb-1">${product.price}</p>
                                        <p className={`small mb-0 ${product.stock_quantity < 5 ? 'text-danger' : 'text-success'}`}>
                                            Stock: {product.stock_quantity}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cart */}
                <div className="col-lg-4">
                    <div className="card card-dark border-custom h-100 d-flex flex-column">
                        <div className="card-header border-bottom border-custom">
                            <h5 className="text-custom mb-0">Current Sale</h5>
                        </div>
                        <div className="card-body flex-grow-1 overflow-auto">
                            {cart.length === 0 ? (
                                <p className="text-muted-custom text-center mt-4">Cart is empty</p>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.product_id} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-custom">
                                        <div>
                                            <h6 className="text-custom mb-1">{item.name}</h6>
                                            <p className="text-muted-custom small mb-0">${item.price_at_sale} x {item.quantity}</p>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <button
                                                className="btn btn-sm btn-outline-secondary me-2"
                                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                            >
                                                -
                                            </button>
                                            <span className="text-custom me-2">{item.quantity}</span>
                                            <button
                                                className="btn btn-sm btn-outline-secondary me-2"
                                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                            <button
                                                className="btn btn-sm btn-link text-danger p-0"
                                                onClick={() => removeFromCart(item.product_id)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="card-footer border-top border-custom">
                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-custom fw-bold">Total:</span>
                                <span className="text-primary fw-bold">${totalAmount.toFixed(2)}</span>
                            </div>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Customer Name (Optional)"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                            <button
                                className="btn btn-primary w-100"
                                onClick={handleCheckout}
                                disabled={cart.length === 0}
                            >
                                Complete Sale
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Sales;
