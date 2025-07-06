import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import AccessoriesFilter from '../components/AccessoriesFilter';
import Navbar from '../components/Navbar';
import { FaFilter } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

// Import images
import bag1 from '../assets/Accessories/1.webp';
import bag2 from '../assets/Accessories/2.webp';
import bag3 from '../assets/Accessories/3.jpg';
import hat1 from '../assets/Accessories/4.webp';
import hat2 from '../assets/Accessories/5.webp';
import hat3 from '../assets/Accessories/6.webp';
import slide1 from '../assets/Accessories/7.webp';
import slide2 from '../assets/Accessories/8.webp';
import slide3 from '../assets/Accessories/9.webp';
import bottle1 from '../assets/Accessories/10.webp';
import bottle2 from '../assets/Accessories/11.webp';
import bottle3 from '../assets/Accessories/12.webp';
import bottle4 from '../assets/Accessories/13.webp';

const AccessoriesPage = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    availability: 'all',
    priceRange: [0, 200],
    sizes: [],
    colors: [],
    categories: [],
    sortBy: 'default'
  });

  const [showFilters, setShowFilters] = useState(false);

  // Check URL parameters for auto-filtering
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setFilters(prev => ({
        ...prev,
        categories: [category]
      }));
    }
  }, [searchParams]);

  // Product data with imported images
  const products = [
    // Bags
    { id: 1, name: "Gym Duffel Bag", price: 45.99, category: "Bags", size: ["One Size"], color: "black", availability: "in-stock", image: bag1 },
    { id: 2, name: "Sports Backpack", price: 35.99, category: "Bags", size: ["One Size"], color: "gray", availability: "in-stock", image: bag2 },
    { id: 3, name: "Crossbody Bag", price: 25.99, category: "Bags", size: ["One Size"], color: "brown", availability: "out-of-stock", image: bag3 },
    
    // Hats
    { id: 4, name: "Baseball Cap", price: 20.99, category: "Hats", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: hat1 },
    { id: 5, name: "Beanie Hat", price: 15.99, category: "Hats", size: ["One Size"], color: "gray", availability: "in-stock", image: hat2 },
    { id: 6, name: "Bucket Hat", price: 18.99, category: "Hats", size: ["One Size"], color: "white", availability: "in-stock", image: hat3 },
    
    // Slides
    { id: 7, name: "Comfort Slides", price: 30.99, category: "Slides", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: slide1 },
    { id: 8, name: "Athletic Slides", price: 25.99, category: "Slides", size: ["S", "M", "L"], color: "blue", availability: "out-of-stock", image: slide2 },
    { id: 9, name: "Premium Slides", price: 40.99, category: "Slides", size: ["M", "L"], color: "brown", availability: "in-stock", image: slide3 },
    { id: 10, name: "Insulated Water Bottle", price: 35.99, category: "Slides", size: ["One Size"], color: "black", availability: "in-stock", image: bottle1 },
    { id: 11, name: "Sports Bottle", price: 20.99, category: "Slides", size: ["One Size"], color: "white", availability: "in-stock", image: bottle2 },
    { id: 12, name: "Premium Bottle", price: 50.99, category: "Slides", size: ["One Size"], color: "blue", availability: "in-stock", image: bottle3 },
    
    // Bottles
    
    { id: 13, name: "Premium Bottle", price: 50.99, category: "Bottle", size: ["One Size"], color: "black", availability: "in-stock", image: bottle4 },
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }

      // Availability filter
      if (filters.availability !== 'all' && product.availability !== filters.availability) {
        return false;
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Size filter
      if (filters.sizes.length > 0 && !filters.sizes.some(size => product.size.includes(size))) {
        return false;
      }

      // Color filter
      if (filters.colors.length > 0 && !filters.colors.includes(product.color)) {
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
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      availability: 'all',
      priceRange: [0, 200],
      sizes: [],
      colors: [],
      categories: [],
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
          />

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    image={product.image}
                    title={product.name}
                    price={`$${product.price}`}
                    color={product.color}
                    availability={product.availability}
                    sizes={product.size}
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