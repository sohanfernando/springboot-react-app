import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import LatestFilter from '../components/LatestFilter';
import Navbar from '../components/Navbar';
import { FaFilter } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const LatestPage = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    availability: 'all',
    priceRange: [0, 10000],
    sizes: [],
    colors: [],
    categories: [],
    sortBy: 'default'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch latest products from backend (added within last 7 days)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/admin/products');
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const latest = (Array.isArray(res.data) ? res.data : []).filter(p => {
          if (!p.createdAt) return false;
          const created = new Date(p.createdAt);
          return created >= weekAgo && created <= now;
        });
        setProducts(latest);
      } catch (e) {
        setProducts([]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }
      // Availability filter (not implemented in backend, so skip or add if you add this field)
      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
      // Size filter (not implemented in backend, so skip or add if you add this field)
      // Color filter (not implemented in backend, so skip or add if you add this field)
      return true;
    });
    // Sort products
    switch (filters.sortBy) {
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    return filtered;
  }, [products, filters]);

  const clearFilters = () => {
    setFilters({
      availability: 'all',
      priceRange: [0, 10000],
      sizes: [],
      colors: [],
      categories: [],
      sortBy: 'default'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-36">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaFilter className="text-red-500 text-xl" />
            <h1 className="text-3xl font-bold text-gray-900">Latest Products (This Week)</h1>
          </div>
        </div>
        {/* Filters */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 transition"
          >
            <FaFilter />
            <span>Filters</span>
          </button>
          {showFilters && (
            <LatestFilter filters={filters} setFilters={setFilters} />
          )}
        </div>
        {/* Results */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading latest products...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.images && product.images[0]}
                  title={product.name}
                  price={`Rs ${product.price}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No latest products found for this week.</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-red-500 hover:text-red-700"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestPage;