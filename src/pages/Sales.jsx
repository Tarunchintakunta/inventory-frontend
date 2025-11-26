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
            fetchProducts(); // Refresh stock
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
            <div className="flex h-[calc(100vh-100px)]">
                {/* Product Selection */}
                <div className="w-2/3 pr-6 overflow-y-auto">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full p-2 border rounded"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-md"
                                onClick={() => addToCart(product)}
                            >
                                <h3 className="font-bold">{product.name}</h3>
                                <p className="text-gray-600">${product.price}</p>
                                <p className={`text-sm ${product.stock_quantity < 5 ? 'text-red-500' : 'text-green-500'}`}>
                                    Stock: {product.stock_quantity}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cart */}
                <div className="w-1/3 bg-white p-6 rounded shadow flex flex-col">
                    <h2 className="text-xl font-bold mb-4">Current Sale</h2>
                    <div className="flex-1 overflow-y-auto">
                        {cart.map((item) => (
                            <div key={item.product_id} className="flex justify-between items-center mb-4 border-b pb-2">
                                <div>
                                    <h4 className="font-medium">{item.name}</h4>
                                    <p className="text-sm text-gray-500">${item.price_at_sale} x {item.quantity}</p>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                        className="px-2 py-1 bg-gray-200 rounded"
                                    >
                                        -
                                    </button>
                                    <span className="mx-2">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                        className="px-2 py-1 bg-gray-200 rounded"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => removeFromCart(item.product_id)}
                                        className="ml-4 text-red-500"
                                    >
                                        x
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 border-t pt-4">
                        <div className="flex justify-between text-xl font-bold mb-4">
                            <span>Total:</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Customer Name (Optional)"
                            className="w-full p-2 border rounded mb-4"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0}
                            className={`w-full py-3 rounded text-white font-bold ${cart.length === 0 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            Complete Sale
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Sales;
