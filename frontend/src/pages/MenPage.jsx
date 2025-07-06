import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import MenFilter from '../components/MenFilter';
import Navbar from '../components/Navbar';
import { FaFilter } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

// Import images
import tshirt1 from '../assets/T-shirts/Men/1.jpg';
import tshirt2 from '../assets/T-shirts/Men/2.jpg';
import tshirt3 from '../assets/T-shirts/Men/3.jpg';
import tshirt4 from '../assets/T-shirts/Men/4.jpg';
import tshirt5 from '../assets/T-shirts/Men/5.webp';
import tshirt6 from '../assets/T-shirts/Men/6.webp';
import tshirt7 from '../assets/T-shirts/Men/7.webp';
import tshirt8 from '../assets/T-shirts/Men/8.webp';
import tshirt9 from '../assets/T-shirts/Men/9.webp';
import tshirt10 from '../assets/T-shirts/Men/10.webp';

import shirt1 from '../assets/Shirts/1.webp';
import shirt2 from '../assets/Shirts/2.webp';
import shirt3 from '../assets/Shirts/3.webp';
import shirt4 from '../assets/Shirts/4.webp';
import shirt5 from '../assets/Shirts/5.webp';
import shirt6 from '../assets/Shirts/6.webp';
import shirt7 from '../assets/Shirts/7.webp';
import shirt8 from '../assets/Shirts/8.webp';

import shorts1 from '../assets/Shorts/1.webp';
import shorts2 from '../assets/Shorts/2.webp';
import shorts3 from '../assets/Shorts/3.webp';
import shorts4 from '../assets/Shorts/4.webp';
import shorts5 from '../assets/Shorts/5.webp';
import shorts6 from '../assets/Shorts/6.webp';

import pants1 from '../assets/Joggers & Pants/Men/4.webp';
import pants2 from '../assets/Joggers & Pants/Men/5.webp';
import pants3 from '../assets/Joggers & Pants/Men/6.webp';
import pants4 from '../assets/Joggers & Pants/Men/7.webp';
import pants5 from '../assets/Joggers & Pants/Men/8.webp';
import pants6 from '../assets/Joggers & Pants/Men/9.webp';

const MenPage = () => {
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
    // T-Shirts
    { id: 1, name: "Classic Cotton T-Shirt", price: 29.99, category: "T-Shirts", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: tshirt1 },
    { id: 2, name: "Premium Fit T-Shirt", price: 34.99, category: "T-Shirts", size: ["M", "L"], color: "blue", availability: "in-stock", image: tshirt2 },
    { id: 3, name: "Slim Fit T-Shirt", price: 39.99, category: "T-Shirts", size: ["S", "M"], color: "white", availability: "in-stock", image: tshirt3 },
    { id: 4, name: "Graphic Print T-Shirt", price: 44.99, category: "T-Shirts", size: ["L"], color: "red", availability: "out-of-stock", image: tshirt4 },
    { id: 5, name: "V-Neck T-Shirt", price: 27.99, category: "T-Shirts", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: tshirt5 },
    { id: 6, name: "Polo T-Shirt", price: 49.99, category: "T-Shirts", size: ["M", "L"], color: "blue", availability: "in-stock", image: tshirt6 },
    { id: 7, name: "Striped T-Shirt", price: 32.99, category: "T-Shirts", size: ["S", "L"], color: "white", availability: "in-stock", image: tshirt7 },
    { id: 8, name: "Crew Neck T-Shirt", price: 24.99, category: "T-Shirts", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: tshirt8 },
    { id: 9, name: "Long Sleeve T-Shirt", price: 54.99, category: "T-Shirts", size: ["M", "L"], color: "blue", availability: "in-stock", image: tshirt9 },
    { id: 10, name: "Henley T-Shirt", price: 37.99, category: "T-Shirts", size: ["S", "M"], color: "red", availability: "out-of-stock", image: tshirt10 },
    
    // Shirts
    { id: 11, name: "Classic Oxford Shirt", price: 79.99, category: "Shirts", size: ["S", "M", "L"], color: "white", availability: "in-stock", image: shirt1 },
    { id: 12, name: "Denim Shirt", price: 89.99, category: "Shirts", size: ["M", "L"], color: "blue", availability: "in-stock", image: shirt2 },
    { id: 13, name: "Plaid Flannel Shirt", price: 69.99, category: "Shirts", size: ["S", "M", "L"], color: "red", availability: "in-stock", image: shirt3 },
    { id: 14, name: "Chambray Shirt", price: 74.99, category: "Shirts", size: ["M", "L"], color: "blue", availability: "in-stock", image: shirt4 },
    { id: 15, name: "Linen Shirt", price: 84.99, category: "Shirts", size: ["S", "M"], color: "white", availability: "out-of-stock", image: shirt5 },
    { id: 16, name: "Poplin Shirt", price: 64.99, category: "Shirts", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: shirt6 },
    { id: 17, name: "Twill Shirt", price: 94.99, category: "Shirts", size: ["L"], color: "blue", availability: "in-stock", image: shirt7 },
    { id: 18, name: "Casual Shirt", price: 59.99, category: "Shirts", size: ["S", "M", "L"], color: "white", availability: "in-stock", image: shirt8 },
    
    // Shorts
    { id: 19, name: "Athletic Shorts", price: 39.99, category: "Shorts", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: shorts1 },
    { id: 20, name: "Cargo Shorts", price: 49.99, category: "Shorts", size: ["M", "L"], color: "blue", availability: "in-stock", image: shorts2 },
    { id: 21, name: "Denim Shorts", price: 44.99, category: "Shorts", size: ["S", "M", "L"], color: "blue", availability: "in-stock", image: shorts3 },
    { id: 22, name: "Linen Shorts", price: 54.99, category: "Shorts", size: ["M", "L"], color: "white", availability: "out-of-stock", image: shorts4 },
    { id: 23, name: "Chino Shorts", price: 34.99, category: "Shorts", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: shorts5 },
    { id: 24, name: "Swim Shorts", price: 29.99, category: "Shorts", size: ["M", "L"], color: "red", availability: "in-stock", image: shorts6 },
    
    // Joggers & Pants
    { id: 25, name: "Slim Fit Joggers", price: 59.99, category: "Joggers & Pants", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: pants1 },
    { id: 26, name: "Cargo Joggers", price: 69.99, category: "Joggers & Pants", size: ["M", "L"], color: "blue", availability: "in-stock", image: pants2 },
    { id: 27, name: "Cotton Joggers", price: 49.99, category: "Joggers & Pants", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: pants3 },
    { id: 28, name: "Fleece Joggers", price: 79.99, category: "Joggers & Pants", size: ["M", "L"], color: "blue", availability: "out-of-stock", image: pants4 },
    { id: 29, name: "Track Pants", price: 44.99, category: "Joggers & Pants", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: pants5 },
    { id: 30, name: "Athletic Pants", price: 54.99, category: "Joggers & Pants", size: ["M", "L"], color: "blue", availability: "in-stock", image: pants6 },
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Men's Collection</h1>
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
          <MenFilter
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

export default MenPage;