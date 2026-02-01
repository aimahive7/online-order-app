import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, DollarSign } from 'lucide-react';
import { bakeryAPI, productAPI } from '../utils/api';
import { toast } from 'react-toastify';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [topBakeries, setTopBakeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Products', icon: '🧁' },
    { id: 'cake', name: 'Cakes', icon: '🎂' },
    { id: 'pastry', name: 'Pastries', icon: '🥐' },
    { id: 'cookie', name: 'Cookies', icon: '🍪' },
    { id: 'custom', name: 'Custom', icon: '🎨' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const city = localStorage.getItem('selectedCity') || '';
      
      const [productsRes, bakeriesRes] = await Promise.all([
        productAPI.getProducts({ city, limit: 8 }),
        bakeryAPI.getBakeries({ city, limit: 6 })
      ]);

      setFeaturedProducts(productsRes.data.products);
      setTopBakeries(bakeriesRes.data.bakeries);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term');
      return;
    }
    window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`;
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    const url = category === 'all' ? '/products' : `/products?category=${category}`;
    window.location.href = url;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-chocolate">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Fresh Bakery Delights
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Discover local bakeries and order fresh cakes, pastries, and more
          </p>
          
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for cakes, pastries, bakeries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <button onClick={handleSearch} className="btn-primary bg-white text-primary hover:bg-gray-100">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-chocolate">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.id)}
                className={`p-6 rounded-lg text-center transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-cream hover:bg-gray-100'
                }`}
              >
                <div className="text-4xl mb-2">{category.icon}</div>
                <div className="font-semibold">{category.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-chocolate">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product._id} className="card hover:scale-105 transition-transform duration-200">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">${product.price}</span>
                    <span className="text-sm bg-cream px-2 py-1 rounded">{product.category}</span>
                  </div>
                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <MapPin size={14} className="mr-1" />
                    {product.bakery_id.city}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Bakeries */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-chocolate">
            Top Bakeries in Your Area
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topBakeries.map((bakery) => (
              <div key={bakery._id} className="card">
                <div className="flex items-start space-x-4">
                  <img
                    src={bakery.image_url || 'https://via.placeholder.com/80'}
                    alt={bakery.bakery_name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{bakery.bakery_name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin size={14} className="mr-1" />
                      {bakery.city}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm">{bakery.rating || 4.5}</span>
                      </div>
                      <button className="text-primary text-sm font-medium hover:underline">
                        View Menu
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={32} />
              </div>
              <h3 className="font-semibold text-xl mb-2">Same Day Delivery</h3>
              <p className="text-gray-600">Order now and get fresh bakery items delivered today</p>
            </div>
            <div>
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} />
              </div>
              <h3 className="font-semibold text-xl mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">All our bakeries are verified for quality and hygiene</p>
            </div>
            <div>
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign size={32} />
              </div>
              <h3 className="font-semibold text-xl mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive prices from local bakeries near you</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;