import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import AccessoriesFilter from '../components/AccessoriesFilter';
import Navbar from '../components/Navbar';
import { FaFilter } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const ACCESSORIES_SUBCATEGORIES = [
  'Bags', 'Hats', 'Slides', 'Bottle'
];

const AccessoriesPage = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    priceRange: [0, 200000],
    categories: [],
    sizes: [],
    colors: [],
    availability: 'all',
    sortBy: 'default'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setFilters(prev => ({
        ...prev,
        categories: [category]
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/admin/products/category/Accessories');
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setProducts([]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Subcategory filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.subcategory)) {
        return false;
      }
      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
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
      priceRange: [0, 200000],
      categories: [],
      sizes: [],
      colors: [],
      availability: 'all',
      sortBy: 'default'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Accessories Collection</h1>
            <p className="text-gray-600">{filteredProducts.length} products found</p>
          </div>
          {/* Mobile filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border"
          >
            <FaFilter />
            <span>Filters</span>
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <AccessoriesFilter
            filters={filters}
            setFilters={setFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            clearFilters={clearFilters}
            categories={ACCESSORIES_SUBCATEGORIES}
          />
          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading products...</div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    image={product.images && product.images[0]}
                    title={product.name}
                    price={`Rs ${product.price}`}
                    color={product.color}
                    availability={product.availability}
                    sizes={product.sizes}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
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
    </div>
  );
};

export default AccessoriesPage;