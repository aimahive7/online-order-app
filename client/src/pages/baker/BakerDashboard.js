import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { bakeryAPI, productAPI, orderAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Store, 
  Package, 
  ShoppingBag, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';

const BakerDashboard = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        orderAPI.getMyOrders(),
        productAPI.getMyProducts()
      ]);

      const orders = ordersRes.data.orders;
      const products = productsRes.data;
      
      const totalRevenue = orders
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + order.total_amount, 0);

      const pendingOrders = orders.filter(order => 
        ['ordered', 'confirmed', 'baking'].includes(order.status)
      ).length;

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalProducts: products.length,
        pendingOrders
      });
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { path: '/baker', name: 'Dashboard', icon: TrendingUp },
    { path: '/baker/products', name: 'Products', icon: Package },
    { path: '/baker/orders', name: 'Orders', icon: ShoppingBag },
    { path: '/baker/bakery', name: 'Bakery Profile', icon: Store },
    { path: '/baker/settings', name: 'Settings', icon: Settings },
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
                <Store className="text-white" size={24} />
              </div>
              <div>
                <h2 className="font-bold text-lg">Baker Hub</h2>
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
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<BakerHome stats={stats} />} />
            <Route path="/products" element={<BakerProducts />} />
            <Route path="/orders" element={<BakerOrders />} />
            <Route path="/bakery" element={<BakerProfile />} />
            <Route path="/settings" element={<BakerSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const BakerHome = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Users,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-chocolate mb-8">Dashboard</h1>
      
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
            <Link to="/baker/products" className="flex items-center justify-between p-3 bg-cream rounded-lg hover:bg-gray-100">
              <span>Add New Product</span>
              <Plus size={20} className="text-primary" />
            </Link>
            <Link to="/baker/orders" className="flex items-center justify-between p-3 bg-cream rounded-lg hover:bg-gray-100">
              <span>View Orders</span>
              <Package size={20} className="text-primary" />
            </Link>
            <Link to="/baker/bakery" className="flex items-center justify-between p-3 bg-cream rounded-lg hover:bg-gray-100">
              <span>Update Bakery Info</span>
              <Edit size={20} className="text-primary" />
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-xl mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Welcome to your bakery dashboard!</span>
            </div>
            <p className="text-gray-500 text-sm">Your recent orders and activities will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const BakerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productAPI.getMyProducts();
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productAPI.deleteProduct(productId);
      toast.success('Product deleted successfully');
      loadProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-chocolate">Products</h1>
        <Link to="/baker/products/add" className="btn-primary">
          <Plus size={20} className="inline mr-2" />
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-4">No products yet</h3>
          <Link to="/baker/products/add" className="btn-primary">
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="card">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-primary">${product.price}</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    product.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Link to={`/baker/products/edit/${product._id}`} className="btn-secondary text-sm py-1 px-3 flex-1">
                    <Edit size={16} className="inline mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="text-red-500 hover:bg-red-50 text-sm py-1 px-3 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BakerOrders = () => {
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

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-chocolate mb-8">Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-4">No orders yet</h3>
          <p className="text-gray-500">Your orders will appear here once customers start ordering</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Order #{order._id.slice(-8)}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Customer: {order.customer_id?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total: ${order.total_amount}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {order.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BakerProfile = () => {
  const [bakery, setBakery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBakery();
  }, []);

  const loadBakery = async () => {
    try {
      const response = await bakeryAPI.getMyBakery();
      setBakery(response.data);
    } catch (error) {
      toast.error('Failed to load bakery information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading bakery information...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-chocolate mb-8">Bakery Profile</h1>
      
      {!bakery ? (
        <div className="text-center py-12">
          <Store className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-4">No bakery registered</h3>
          <Link to="/baker/bakery/register" className="btn-primary">
            Register Your Bakery
          </Link>
        </div>
      ) : (
        <div className="card max-w-2xl">
          <h3 className="font-semibold text-xl mb-4">Bakery Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Bakery Name</label>
              <p className="text-lg">{bakery.bakery_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <p>{bakery.address}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <p>{bakery.city}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <p>{bakery.rating || 0} / 5</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className={`px-3 py-1 rounded-full text-sm ${
                bakery.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {bakery.is_approved ? 'Approved' : 'Pending Approval'}
              </span>
            </div>
          </div>
          <div className="mt-6">
            <Link to="/baker/bakery/edit" className="btn-primary">
              <Edit size={20} className="inline mr-2" />
              Edit Bakery Information
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const BakerSettings = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-chocolate mb-8">Settings</h1>
      
      <div className="card max-w-2xl">
        <h3 className="font-semibold text-xl mb-4">Account Settings</h3>
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
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              value={user?.role || ''}
              disabled
              className="input-field"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BakerDashboard;