import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Crown, 
  Users, 
  Store, 
  ShoppingBag, 
  TrendingUp,
  Settings,
  LogOut,
  CheckCircle,
  XCircle,
  Ban,
  DollarSign
} from 'lucide-react';

const AdminDashboard = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBakeries: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { path: '/admin', name: 'Dashboard', icon: TrendingUp },
    { path: '/admin/users', name: 'Users', icon: Users },
    { path: '/admin/bakeries', name: 'Bakeries', icon: Store },
    { path: '/admin/orders', name: 'Orders', icon: ShoppingBag },
    { path: '/admin/settings', name: 'Settings', icon: Settings },
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
                <Crown className="text-white" size={24} />
              </div>
              <div>
                <h2 className="font-bold text-lg">Admin Hub</h2>
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
            <Route path="/" element={<AdminHome stats={stats} />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/bakeries" element={<AdminBakeries />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const AdminHome = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Bakeries',
      value: stats.totalBakeries,
      icon: Store,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-chocolate mb-8">Admin Dashboard</h1>
      
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
          <h3 className="font-semibold text-xl mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {stats.recentOrders?.length > 0 ? (
              stats.recentOrders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Order #{order._id.slice(-8)}</p>
                    <p className="text-sm text-gray-600">{order.customer_id?.name}</p>
                  </div>
                  <span className="text-sm font-semibold">${order.total_amount}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent orders</p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-xl mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/admin/users" className="flex items-center justify-between p-3 bg-cream rounded-lg hover:bg-gray-100">
              <span>Manage Users</span>
              <Users size={20} className="text-primary" />
            </Link>
            <Link to="/admin/bakeries" className="flex items-center justify-between p-3 bg-cream rounded-lg hover:bg-gray-100">
              <span>Approve Bakeries</span>
              <Store size={20} className="text-primary" />
            </Link>
            <Link to="/admin/orders" className="flex items-center justify-between p-3 bg-cream rounded-lg hover:bg-gray-100">
              <span>View Orders</span>
              <ShoppingBag size={20} className="text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const loadUsers = async () => {
    try {
      const params = roleFilter ? { role: roleFilter } : {};
      const response = await adminAPI.getUsers(params);
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await adminAPI.blockUser(userId);
      toast.success('User status updated successfully');
      loadUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-chocolate mb-8">User Management</h1>
      
      <div className="mb-6">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="input-field w-full md:w-64"
        >
          <option value="">All Users</option>
          <option value="customer">Customers</option>
          <option value="baker">Bakers</option>
          <option value="delivery">Delivery Boys</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Role</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 capitalize">
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    user.isApproved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isApproved ? 'Active' : 'Blocked'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => toggleUserStatus(user._id)}
                    className={`p-2 rounded ${
                      user.isApproved 
                        ? 'text-red-500 hover:bg-red-50' 
                        : 'text-green-500 hover:bg-green-50'
                    }`}
                  >
                    {user.isApproved ? <Ban size={16} /> : <CheckCircle size={16} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminBakeries = () => {
  const [bakeries, setBakeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvalFilter, setApprovalFilter] = useState('');

  useEffect(() => {
    loadBakeries();
  }, [approvalFilter]);

  const loadBakeries = async () => {
    try {
      const params = approvalFilter !== '' ? { is_approved: approvalFilter === 'true' } : {};
      const response = await adminAPI.getBakeries(params);
      setBakeries(response.data.bakeries);
    } catch (error) {
      toast.error('Failed to load bakeries');
    } finally {
      setLoading(false);
    }
  };

  const approveBakery = async (bakeryId) => {
    try {
      await adminAPI.approveBakery(bakeryId);
      toast.success('Bakery approved successfully');
      loadBakeries();
    } catch (error) {
      toast.error('Failed to approve bakery');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading bakeries...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-chocolate mb-8">Bakery Management</h1>
      
      <div className="mb-6">
        <select
          value={approvalFilter}
          onChange={(e) => setApprovalFilter(e.target.value)}
          className="input-field w-full md:w-64"
        >
          <option value="">All Bakeries</option>
          <option value="false">Pending Approval</option>
          <option value="true">Approved</option>
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Bakery Name</th>
              <th className="text-left py-3 px-4">Owner</th>
              <th className="text-left py-3 px-4">City</th>
              <th className="text-left py-3 px-4">Rating</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bakeries.map((bakery) => (
              <tr key={bakery._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{bakery.bakery_name}</td>
                <td className="py-3 px-4">{bakery.owner_id?.name}</td>
                <td className="py-3 px-4">{bakery.city}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <span>{bakery.rating || 0}</span>
                    <span className="text-yellow-400 ml-1">★</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    bakery.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {bakery.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {!bakery.is_approved && (
                    <button
                      onClick={() => approveBakery(bakery._id)}
                      className="p-2 text-green-500 hover:bg-green-50 rounded"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await adminAPI.getAllOrders(params);
      setOrders(response.data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-chocolate mb-8">Order Management</h1>
      
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

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Order ID</th>
              <th className="text-left py-3 px-4">Customer</th>
              <th className="text-left py-3 px-4">Bakery</th>
              <th className="text-left py-3 px-4">Amount</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">#{order._id.slice(-8)}</td>
                <td className="py-3 px-4">{order.customer_id?.name}</td>
                <td className="py-3 px-4">{order.bakery_id?.bakery_name}</td>
                <td className="py-3 px-4 font-semibold">${order.total_amount}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                    {order.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminSettings = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-chocolate mb-8">Admin Settings</h1>
      
      <div className="card max-w-2xl">
        <h3 className="font-semibold text-xl mb-4">System Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Commission Rate
            </label>
            <input
              type="number"
              defaultValue="10"
              className="input-field"
              placeholder="Enter commission percentage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Order Amount
            </label>
            <input
              type="number"
              defaultValue="5"
              className="input-field"
              placeholder="Enter minimum order amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Fee
            </label>
            <input
              type="number"
              defaultValue="2.99"
              className="input-field"
              placeholder="Enter delivery fee"
            />
          </div>
          <button className="btn-primary">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;