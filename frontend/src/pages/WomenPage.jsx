import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import WomenFilter from '../components/WomenFilter';
import Navbar from '../components/Navbar';
import { FaFilter } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

// Import images for women's clothing
import cropTop1 from '../assets/Crop tops/1.webp';
import cropTop2 from '../assets/Crop tops/2.webp';
import cropTop3 from '../assets/Crop tops/3.webp';

import dress1 from '../assets/Dresses/1.webp';
import dress2 from '../assets/Dresses/2.webp';
import dress3 from '../assets/Dresses/3.webp';
import dress4 from '../assets/Dresses/4.webp';
import dress5 from '../assets/Dresses/5.webp';

import womenPants1 from '../assets/Joggers & Pants/Women/1.webp';
import womenPants2 from '../assets/Joggers & Pants/Women/2.webp';
import womenPants3 from '../assets/Joggers & Pants/Women/3.webp';

import womenShorts1 from '../assets/Shorts/Women/1.webp';
import womenShorts2 from '../assets/Shorts/Women/2.webp';
import womenShorts3 from '../assets/Shorts/Women/3.webp';

import sportsBra1 from '../assets/Sports bra/1.webp';
import sportsBra2 from '../assets/Sports bra/2.webp';
import sportsBra3 from '../assets/Sports bra/3.webp';
import sportsBra4 from '../assets/Sports bra/4.webp';
import sportsBra5 from '../assets/Sports bra/5.webp';

import womenTshirt1 from '../assets/T-shirts/Women/1.webp';
import womenTshirt2 from '../assets/T-shirts/Women/2.webp';
import womenTshirt3 from '../assets/T-shirts/Women/3.webp';
import womenTshirt4 from '../assets/T-shirts/Women/4.webp';
import womenTshirt5 from '../assets/T-shirts/Women/5.webp';
import womenTshirt6 from '../assets/T-shirts/Women/6.webp';
import womenTshirt7 from '../assets/T-shirts/Women/7.webp';
import womenTshirt8 from '../assets/T-shirts/Women/8.webp';

const WomenPage = () => {
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

  // Product data with imported images for women's clothing
  const products = [
    // Crop Tops
    { id: 1, name: "Classic Crop Top", price: 34.99, category: "Crop Tops", size: ["XS", "S", "M", "L"], color: "black", availability: "in-stock", image: cropTop1 },
    { id: 2, name: "Ribbed Crop Top", price: 39.99, category: "Crop Tops", size: ["S", "M", "L"], color: "pink", availability: "in-stock", image: cropTop2 },
    { id: 3, name: "Lace Crop Top", price: 44.99, category: "Crop Tops", size: ["XS", "S", "M"], color: "white", availability: "out-of-stock", image: cropTop3 },
    
    // Dresses
    { id: 4, name: "Summer Maxi Dress", price: 89.99, category: "Dresses", size: ["XS", "S", "M", "L", "XL"], color: "blue", availability: "in-stock", image: dress1 },
    { id: 5, name: "Cocktail Dress", price: 129.99, category: "Dresses", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: dress2 },
    { id: 6, name: "Floral Midi Dress", price: 79.99, category: "Dresses", size: ["XS", "S", "M", "L"], color: "pink", availability: "in-stock", image: dress3 },
    { id: 7, name: "Bodycon Dress", price: 69.99, category: "Dresses", size: ["S", "M", "L"], color: "red", availability: "out-of-stock", image: dress4 },
    { id: 8, name: "Wrap Dress", price: 94.99, category: "Dresses", size: ["M", "L", "XL"], color: "purple", availability: "in-stock", image: dress5 },
    
    // Joggers & Pants (Women)
    { id: 9, name: "High-Waist Joggers", price: 64.99, category: "Joggers & Pants", size: ["XS", "S", "M", "L"], color: "black", availability: "in-stock", image: womenPants1 },
    { id: 10, name: "Athletic Leggings", price: 54.99, category: "Joggers & Pants", size: ["S", "M", "L", "XL"], color: "blue", availability: "in-stock", image: womenPants2 },
    { id: 11, name: "Wide Leg Pants", price: 74.99, category: "Joggers & Pants", size: ["S", "M", "L"], color: "white", availability: "in-stock", image: womenPants3 },
    
    // Shorts (Women)
    { id: 12, name: "High-Waist Shorts", price: 44.99, category: "Shorts", size: ["XS", "S", "M", "L"], color: "black", availability: "in-stock", image: womenShorts1 },
    { id: 13, name: "Denim Shorts", price: 49.99, category: "Shorts", size: ["S", "M", "L"], color: "blue", availability: "in-stock", image: womenShorts2 },
    { id: 14, name: "Athletic Shorts", price: 39.99, category: "Shorts", size: ["XS", "S", "M", "L"], color: "pink", availability: "out-of-stock", image: womenShorts3 },
    
    // Sports Bra
    { id: 15, name: "High-Impact Sports Bra", price: 49.99, category: "Sports Bra", size: ["XS", "S", "M", "L"], color: "black", availability: "in-stock", image: sportsBra1 },
    { id: 16, name: "Medium-Impact Sports Bra", price: 44.99, category: "Sports Bra", size: ["S", "M", "L"], color: "blue", availability: "in-stock", image: sportsBra2 },
    { id: 17, name: "Low-Impact Sports Bra", price: 39.99, category: "Sports Bra", size: ["XS", "S", "M", "L"], color: "pink", availability: "in-stock", image: sportsBra3 },
    { id: 18, name: "Wireless Sports Bra", price: 54.99, category: "Sports Bra", size: ["S", "M", "L", "XL"], color: "purple", availability: "out-of-stock", image: sportsBra4 },
    { id: 19, name: "Racerback Sports Bra", price: 47.99, category: "Sports Bra", size: ["XS", "S", "M", "L"], color: "red", availability: "in-stock", image: sportsBra5 },
    
    // T-Shirts (Women)
    { id: 20, name: "Classic V-Neck Tee", price: 29.99, category: "T-Shirts", size: ["XS", "S", "M", "L", "XL"], color: "white", availability: "in-stock", image: womenTshirt1 },
    { id: 21, name: "Crop Top Tee", price: 34.99, category: "T-Shirts", size: ["XS", "S", "M", "L"], color: "black", availability: "in-stock", image: womenTshirt2 },
    { id: 22, name: "Graphic Print Tee", price: 39.99, category: "T-Shirts", size: ["S", "M", "L"], color: "pink", availability: "in-stock", image: womenTshirt3 },
    { id: 23, name: "Long Sleeve Tee", price: 44.99, category: "T-Shirts", size: ["XS", "S", "M", "L"], color: "blue", availability: "out-of-stock", image: womenTshirt4 },
    { id: 24, name: "Oversized Tee", price: 37.99, category: "T-Shirts", size: ["S", "M", "L", "XL"], color: "purple", availability: "in-stock", image: womenTshirt5 },
    { id: 25, name: "Striped Tee", price: 32.99, category: "T-Shirts", size: ["XS", "S", "M", "L"], color: "red", availability: "in-stock", image: womenTshirt6 },
    { id: 26, name: "Henley Tee", price: 41.99, category: "T-Shirts", size: ["S", "M", "L"], color: "white", availability: "in-stock", image: womenTshirt7 },
    { id: 27, name: "Crew Neck Tee", price: 27.99, category: "T-Shirts", size: ["XS", "S", "M", "L", "XL"], color: "black", availability: "in-stock", image: womenTshirt8 },
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Women's Collection</h1>
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
          <WomenFilter
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

export default WomenPage;