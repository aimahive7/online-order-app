import React, { useState, useEffect } from 'react';
import { orderAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Package, Clock, CheckCircle, Truck, MapPin, Calendar, DollarSign } from 'lucide-react';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const statusColors = {
    ordered: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-purple-100 text-purple-800',
    baking: 'bg-yellow-100 text-yellow-800',
    ready: 'bg-green-100 text-green-800',
    out_for_delivery: 'bg-orange-100 text-orange-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusIcons = {
    ordered: Package,
    confirmed: CheckCircle,
    baking: Clock,
    ready: CheckCircle,
    out_for_delivery: Truck,
    delivered: CheckCircle,
    cancelled: Package
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await orderAPI.getMyOrders(params);
      setOrders(response.data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const loadOrderDetails = async (orderId) => {
    try {
      const response = await orderAPI.getOrderDetails(orderId);
      setSelectedOrder(response.data);
    } catch (error) {
      toast.error('Failed to load order details');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateOrderStatus(orderId, status);
      toast.success('Order status updated successfully');
      loadOrders();
      if (selectedOrder) {
        loadOrderDetails(orderId);
      }
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-chocolate">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-chocolate mb-8">My Orders</h1>

      {/* Status Filter */}
      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-full md:w-64"
        >
          <option value="">All Orders</option>
          <option value="ordered">Ordered</option>
          <option value="confirmed">Confirmed</option>
          <option value="baking">Baking</option>
          <option value="ready">Ready</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
          <p className="text-gray-500">You haven't placed any orders yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-4">
            {orders.map((order) => {
              const StatusIcon = statusIcons[order.status];
              return (
                <div key={order._id} className="card hover:shadow-lg transition-shadow cursor-pointer"
                     onClick={() => loadOrderDetails(order._id)}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Order #{order._id.slice(-8)}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${statusColors[order.status]}`}>
                      <StatusIcon size={14} />
                      <span>{order.status.replace('_', ' ')}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{order.delivery_address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span>{new Date(order.delivery_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign size={16} className="text-gray-400" />
                      <span className="font-semibold">${order.total_amount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">{order.bakery_id?.bakery_name}</span>
                    </div>
                  </div>

                  {user?.role === 'baker' && order.status === 'confirmed' && (
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateOrderStatus(order._id, 'baking');
                        }}
                        className="btn-primary text-sm py-1 px-3"
                      >
                        Start Baking
                      </button>
                    </div>
                  )}

                  {user?.role === 'baker' && order.status === 'baking' && (
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateOrderStatus(order._id, 'ready');
                        }}
                        className="btn-primary text-sm py-1 px-3"
                      >
                        Mark as Ready
                      </button>
                    </div>
                  )}

                  {user?.role === 'delivery' && order.status === 'out_for_delivery' && (
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateOrderStatus(order._id, 'delivered');
                        }}
                        className="btn-primary text-sm py-1 px-3"
                      >
                        Mark as Delivered
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Order Details */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="card sticky top-4">
                <h3 className="font-semibold text-xl mb-4">Order Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Order Information</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>ID:</strong> #{selectedOrder.order._id.slice(-8)}</p>
                      <p><strong>Date:</strong> {new Date(selectedOrder.order.createdAt).toLocaleString()}</p>
                      <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-xs ${statusColors[selectedOrder.order.status]}`}>
                        {selectedOrder.order.status.replace('_', ' ')}
                      </span></p>
                      <p><strong>Total:</strong> ${selectedOrder.order.total_amount}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Items</h4>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="text-sm border-b pb-2">
                          <p className="font-medium">{item.product_id?.name}</p>
                          <p className="text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-gray-600">Weight: {item.weight}</p>
                          <p className="text-gray-600">Type: {item.egg_type}</p>
                          {item.custom_message && (
                            <p className="text-gray-600">Message: "{item.custom_message}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Delivery Information</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Address:</strong> {selectedOrder.order.delivery_address}</p>
                      <p><strong>Date:</strong> {new Date(selectedOrder.order.delivery_date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {selectedOrder.order.delivery_time}</p>
                      <p><strong>Phone:</strong> {selectedOrder.order.customer_phone}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Bakery</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Name:</strong> {selectedOrder.order.bakery_id?.bakery_name}</p>
                      <p><strong>Address:</strong> {selectedOrder.order.bakery_id?.address}</p>
                    </div>
                  </div>

                  {selectedOrder.order.special_instructions && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Special Instructions</h4>
                      <p className="text-sm text-gray-600">{selectedOrder.order.special_instructions}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card text-center text-gray-500">
                <Package size={48} className="mx-auto mb-3" />
                <p>Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;