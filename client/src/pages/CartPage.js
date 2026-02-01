import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { orderAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CartPage = () => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderData, setOrderData] = useState({
    delivery_address: '',
    delivery_date: new Date(),
    delivery_time: '',
    customer_phone: '',
    special_instructions: '',
    payment_method: 'cod'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    calculateTotal(savedCart);
  };

  const calculateTotal = (cartItems) => {
    const totalAmount = cartItems.reduce((sum, item) => {
      const price = item.selectedPrice || item.price;
      return sum + (price * item.quantity);
    }, 0);
    setTotal(totalAmount);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map((item, i) => 
      i === index ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
    setTotal(0);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      return;
    }
    setShowCheckout(true);
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderItems = cart.map(item => ({
        product_id: item._id,
        quantity: item.quantity,
        weight: item.selectedWeight || '1kg',
        egg_type: item.egg_type === 'eggless' ? 'eggless' : 'egg',
        custom_message: item.custom_message || ''
      }));

      const orderPayload = {
        bakery_id: cart[0].bakery_id._id,
        items: orderItems,
        delivery_address: orderData.delivery_address,
        delivery_date: orderData.delivery_date,
        delivery_time: orderData.delivery_time,
        customer_phone: orderData.customer_phone,
        special_instructions: orderData.special_instructions,
        payment_method: orderData.payment_method
      };

      await orderAPI.createOrder(orderPayload);
      
      toast.success('Order placed successfully!');
      clearCart();
      setShowCheckout(false);
      setOrderData({
        delivery_address: '',
        delivery_date: new Date(),
        delivery_time: '',
        customer_phone: '',
        special_instructions: '',
        payment_method: 'cod'
      });
      
      setTimeout(() => {
        window.location.href = '/orders';
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!showCheckout) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-chocolate mb-8">Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Your cart is empty</h3>
            <Link to="/products" className="btn-primary inline-flex items-center space-x-2">
              <span>Continue Shopping</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <div key={index} className="card">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.bakery_id?.bakery_name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-primary">
                            ${item.selectedPrice || item.price}
                          </span>
                          <span className="text-sm text-gray-500">
                            {item.selectedWeight || '1kg'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() => removeFromCart(index)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded ml-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-4">
                <h3 className="font-semibold text-xl mb-4">Order Summary</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>$2.99</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${(total + 2.99).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full btn-primary"
                >
                  Proceed to Checkout
                </button>
                
                <Link to="/products" className="w-full btn-secondary block text-center mt-2">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-chocolate mb-8">Checkout</h1>
      
      <form onSubmit={placeOrder} className="space-y-6">
        {/* Delivery Information */}
        <div className="card">
          <h3 className="font-semibold text-xl mb-4">Delivery Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address
              </label>
              <textarea
                required
                value={orderData.delivery_address}
                onChange={(e) => setOrderData(prev => ({ ...prev, delivery_address: e.target.value }))}
                className="input-field"
                rows="3"
                placeholder="Enter your complete delivery address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Date
                </label>
                <DatePicker
                  selected={orderData.delivery_date}
                  onChange={(date) => setOrderData(prev => ({ ...prev, delivery_date: date }))}
                  minDate={new Date()}
                  className="input-field w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Time
                </label>
                <input
                  type="text"
                  required
                  value={orderData.delivery_time}
                  onChange={(e) => setOrderData(prev => ({ ...prev, delivery_time: e.target.value }))}
                  className="input-field"
                  placeholder="e.g., 2:00 PM - 4:00 PM"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={orderData.customer_phone}
                onChange={(e) => setOrderData(prev => ({ ...prev, customer_phone: e.target.value }))}
                className="input-field"
                placeholder="Your contact number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                value={orderData.special_instructions}
                onChange={(e) => setOrderData(prev => ({ ...prev, special_instructions: e.target.value }))}
                className="input-field"
                rows="3"
                placeholder="Any special delivery instructions or cake messages"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={orderData.payment_method}
                onChange={(e) => setOrderData(prev => ({ ...prev, payment_method: e.target.value }))}
                className="input-field"
              >
                <option value="cod">Cash on Delivery</option>
                <option value="online">Online Payment</option>
              </select>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card">
          <h3 className="font-semibold text-xl mb-4">Order Summary</h3>
          
          <div className="space-y-2 mb-4">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.selectedPrice || item.price) * item.quantity}</span>
              </div>
            ))}
            <div className="border-t pt-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>$2.99</span>
              </div>
              <div className="flex justify-between font-semibold text-lg text-primary">
                <span>Total</span>
                <span>${(total + 2.99).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setShowCheckout(false)}
              className="flex-1 btn-secondary"
            >
              Back to Cart
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CartPage;