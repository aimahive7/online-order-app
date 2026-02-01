import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, ChefHat, Truck, Crown } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'baker':
        return '/baker';
      case 'delivery':
        return '/delivery';
      case 'admin':
        return '/admin';
      default:
        return '/orders';
    }
  };

  const getDashboardIcon = () => {
    switch (user?.role) {
      case 'baker':
        return <ChefHat size={20} />;
      case 'delivery':
        return <Truck size={20} />;
      case 'admin':
        return <Crown size={20} />;
      default:
        return <User size={20} />;
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold text-chocolate">BakeryHub</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'nav-link-active' : ''}`}>
              Home
            </Link>
            <Link to="/products" className={`nav-link ${location.pathname === '/products' ? 'nav-link-active' : ''}`}>
              Products
            </Link>
            {isAuthenticated && (
              <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'nav-link-active' : ''}`}>
                My Orders
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary">
                  <ShoppingCart size={24} />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                  >
                    {getDashboardIcon()}
                    <span className="text-sm font-medium">{user?.name}</span>
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
                      <Link
                        to={getDashboardLink()}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/products" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Products
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/orders" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    My Orders
                  </Link>
                  <Link to="/cart" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    Cart
                  </Link>
                  <Link to={getDashboardLink()} className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="nav-link text-left">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary text-center" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;