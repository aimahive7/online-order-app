import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Star, MapPin, ShoppingCart, Heart } from 'lucide-react';
import { productAPI } from '../utils/api';
import { toast } from 'react-toastify';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    city: '',
    minPrice: '',
    maxPrice: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setFilters(prev => ({ ...prev, ...params }));
    loadProducts(params);
  }, [searchParams]);

  const loadProducts = async (params) => {
    try {
      setLoading(true);
      const response = await productAPI.getProducts(params);
      setProducts(response.data.products);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange('search', filters.search);
  };

  const addToCart = (product) => {
    const cartItem = {
      ...product,
      quantity: 1,
      selectedWeight: product.weight_options[0]?.weight || '1kg',
      selectedPrice: product.weight_options[0]?.price || product.price
    };
    
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = [...existingCart, cartItem];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    toast.success('Added to cart!');
    setCart(updatedCart);
  };

  const toggleFavorite = (productId) => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updatedFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    
    setProducts(products.map(p => 
      p._id === productId 
        ? { ...p, isFavorite: !p.isFavorite }
        : p
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-chocolate">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search and Filters */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for products..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </form>

        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Categories</option>
                  <option value="cake">Cakes</option>
                  <option value="pastry">Pastries</option>
                  <option value="cookie">Cookies</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Enter city"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price
                </label>
                <input
                  type="number"
                  placeholder="Min price"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder="Max price"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="card group">
            <div className="relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <button
                onClick={() => toggleFavorite(product._id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <Heart
                  size={18}
                  className={product.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}
                />
              </button>
              <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs font-medium">
                {product.category}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xl font-bold text-primary">${product.price}</span>
                  {product.weight_options.length > 1 && (
                    <span className="text-xs text-gray-500 ml-1">+ options</span>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Star size={14} className="text-yellow-400 fill-current mr-1" />
                  4.5
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <MapPin size={14} className="mr-1" />
                {product.bakery_id.city}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs bg-cream px-2 py-1 rounded">
                  {product.egg_type === 'eggless' ? 'Eggless' : 'With Egg'}
                </span>
                <button
                  onClick={() => addToCart(product)}
                  className="btn-primary text-sm py-1 px-3 flex items-center space-x-1"
                >
                  <ShoppingCart size={16} />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🧁</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;