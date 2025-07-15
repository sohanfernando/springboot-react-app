import React from 'react';
import { FaFilter } from 'react-icons/fa';

const WomenFilter = ({ 
  filters, 
  setFilters, 
  showFilters, 
  setShowFilters, 
  clearFilters,
  colors = ['black', 'blue', 'white', 'red', 'pink', 'purple'],
  sizes = ['XS', 'S', 'M', 'L', 'XL'],
  categories = ['Crop Tops', 'Dresses', 'Joggers & Pants', 'Shorts', 'Sports Bra', 'T-Shirts']
}) => {
  // Defensive: ensure filters.sizes, filters.colors, filters.categories are arrays
  const safeFilters = {
    ...filters,
    sizes: Array.isArray(filters.sizes) ? filters.sizes : [],
    colors: Array.isArray(filters.colors) ? filters.colors : [],
    categories: Array.isArray(filters.categories) ? filters.categories : [],
  };

  const handleSizeChange = (size) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleColorChange = (color) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  return (
    <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
      <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            onClick={clearFilters}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Clear All
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Category</h3>
          <div className="space-y-2">
            {categories.map(category => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  checked={safeFilters.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Availability</h3>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'All Products' },
              { value: 'in-stock', label: 'In Stock' },
              { value: 'out-of-stock', label: 'Out of Stock' }
            ].map(option => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="availability"
                  value={option.value}
                  checked={filters.availability === option.value}
                  onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="200"
              value={filters.priceRange[1]}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                priceRange: [prev.priceRange[0], parseInt(e.target.value)] 
              }))}
              className="w-full mb-2"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Size Filter */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Size</h3>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                  safeFilters.sizes.includes(size)
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-red-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Filter */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Color</h3>
          <div className="grid grid-cols-2 gap-2">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`px-3 py-2 text-sm border rounded-md transition-colors capitalize ${
                  safeFilters.colors.includes(color)
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-red-300'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Sort By</h3>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            <option value="default">Default</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default WomenFilter; 