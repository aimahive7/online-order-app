import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { orderAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Users,
  TrendingUp,
  LogOut
} from 'lucide-react';

const DeliveryDashboard = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    completedDeliveries: 0,
    pendingDeliveries: 0,
    todayDeliveries: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      const orders = response.data.orders;
      
      const today = new Date().toDateString();
      const todayOrders = orders.filter(order => 
        new Date(order.createdAt).toDateString() === today
      );
      
      const completedOrders = orders.filter(order => order.status === 'delivered');
      const pendingOrders = orders.filter(order => order.status === 'out_for_delivery');

      setStats({
        totalDeliveries: orders.length,
        completedDeliveries: completedOrders.length,
        pendingDeliveries: pendingOrders.length,
        todayDeliveries: todayOrders.length
      });
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { path: '/delivery', name: 'Dashboard', icon: TrendingUp },
    { path: '/delivery/orders', name: 'My Orders', icon: Package },
    { path: '/delivery/history', name: 'Delivery History', icon: Clock },
    { path: '/delivery/profile', name: 'Profile', icon: Users },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-chocolate">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Truck className="text-white" size={24} />
              </div>
              <div>
                <h2 className="font-bold text-lg">Delivery Hub</h2>
                <p className="text-sm text-gray-600">{user?.name}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 pt-8 border-t">
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<DeliveryHome stats={stats} />} />
            <Route path="/orders" element={<DeliveryOrders />} />
            <Route path="/history" element={<DeliveryHistory />} />
            <Route path="/profile" element={<DeliveryProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const DeliveryHome = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Deliveries',
      value: stats.totalDeliveries,
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Completed',
      value: stats.completedDeliveries,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Pending',
      value: stats.pendingDeliveries,
      icon: Clock,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    {
      title: "Today's Orders",
      value: stats.todayDeliveries,
      icon: TrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-chocolate mb-8">Delivery Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                  <Icon className={stat.textColor} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="font-semibold text-xl mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/delivery/orders" className="flex items-center justify-between p-3 bg-cream rounded-lg hover:bg-gray-100">
              <span>View Active Orders</span>
              <Package size={20} className="text-primary" />
            </Link>
            <Link to="/delivery/history" className="flex items-center justify-between p-3 bg-cream rounded-lg hover:bg-gray-100">
              <span>Delivery History</span>
              <Clock size={20} className="text-primary" />
            </Link>
            <Link to="/delivery/profile" className="flex items-center justify-between p-3 bg-cream rounded-lg hover:bg-gray-100">
              <span>Update Profile</span>
              <Users size={20} className="text-primary" />
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-xl mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Welcome to your delivery dashboard!</span>
            </div>
            <p className="text-gray-500 text-sm">Your recent deliveries and activities will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeliveryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      setOrders(response.data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateOrderStatus(orderId, status);
      toast.success('Order status updated successfully');
      loadOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  const activeOrders = orders.filter(order => order.status === 'out_for_delivery');

  return (
    <div>
      <h1 className="text-3xl font-bold text-chocolate mb-8">Active Orders</h1>
      
      {activeOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-4">No active deliveries</h3>
          <p className="text-gray-500">You have no orders to deliver at the moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeOrders.map((order) => (
            <div key={order._id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Order #{order._id.slice(-8)}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Customer: {order.customer_id?.name}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Out for Delivery
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-sm">{order.delivery_address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-sm">{order.delivery_time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package size={16} className="text-gray-400" />
                  <span className="text-sm font-semibold">${order.total_amount}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck size={16} className="text-gray-400" />
                  <span className="text-sm">{order.bakery_id?.bakery_name}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => updateOrderStatus(order._id, 'delivered')}
                  className="btn-primary"
                >
                  Mark as Delivered
                </button>
                <button
                  onClick={() => window.open(`tel:${order.customer_phone}`)}
                  className="btn-secondary"
                >
                  Call Customer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DeliveryHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      setOrders(response.data.orders.filter(order => order.status === 'delivered'));
    } catch (error) {
      toast.error('Failed to load delivery history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading delivery history...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-chocolate mb-8">Delivery History</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-4">No delivery history</h3>
          <p className="text-gray-500">Your completed deliveries will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Order #{order._id.slice(-8)}</h3>
                  <p className="text-sm text-gray-600">
                    Delivered on {new Date(order.updatedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Customer: {order.customer_id?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Address: {order.delivery_address}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Delivered
                  </span>
                  <p className="text-sm font-semibold text-primary mt-2">
                    ${order.total_amount}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DeliveryProfile = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-chocolate mb-8">Profile</h1>
      
      <div className="card max-w-2xl">
        <h3 className="font-semibold text-xl mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={user?.name || ''}
              disabled
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={user?.phone || ''}
              disabled
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              value={user?.role || ''}
              disabled
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Status</label>
            <span className={`px-3 py-1 rounded-full text-sm ${
              user?.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {user?.isApproved ? 'Approved' : 'Pending Approval'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;