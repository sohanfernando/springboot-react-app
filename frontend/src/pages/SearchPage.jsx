import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import { FaSearch, FaTimes } from 'react-icons/fa';

// Import all product images
import img1 from '../assets/Shirts/6.webp';
import img2 from '../assets/T-shirts/Women/1.webp';
import img3 from '../assets/T-shirts/Women/3.webp';
import img4 from '../assets/Shirts/13.webp';
import img5 from '../assets/Crop tops/1.webp';
import img6 from '../assets/T-shirts/Men/19.webp';
import img7 from '../assets/Joggers & Pants/Women/1.webp';
import img8 from '../assets/T-shirts/Women/5.webp';

// Import more images for comprehensive search
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

import womenTshirt1 from '../assets/T-shirts/Women/1.webp';
import womenTshirt2 from '../assets/T-shirts/Women/2.webp';
import womenTshirt3 from '../assets/T-shirts/Women/3.webp';
import womenTshirt4 from '../assets/T-shirts/Women/4.webp';
import womenTshirt5 from '../assets/T-shirts/Women/5.webp';
import womenTshirt6 from '../assets/T-shirts/Women/6.webp';
import womenTshirt7 from '../assets/T-shirts/Women/7.webp';
import womenTshirt8 from '../assets/T-shirts/Women/8.webp';

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

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // All products data with unique IDs
  const allProducts = [
    // Men's Products (IDs 1-30)
    { id: 1, name: "Classic Cotton T-Shirt", price: 29.99, category: "Men", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: tshirt1 },
    { id: 2, name: "Premium Fit T-Shirt", price: 34.99, category: "Men", size: ["M", "L"], color: "blue", availability: "in-stock", image: tshirt2 },
    { id: 3, name: "Slim Fit T-Shirt", price: 39.99, category: "Men", size: ["S", "M"], color: "white", availability: "in-stock", image: tshirt3 },
    { id: 4, name: "Graphic Print T-Shirt", price: 44.99, category: "Men", size: ["L"], color: "red", availability: "out-of-stock", image: tshirt4 },
    { id: 5, name: "V-Neck T-Shirt", price: 27.99, category: "Men", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: tshirt5 },
    { id: 6, name: "Polo T-Shirt", price: 49.99, category: "Men", size: ["M", "L"], color: "blue", availability: "in-stock", image: tshirt6 },
    { id: 7, name: "Striped T-Shirt", price: 32.99, category: "Men", size: ["S", "L"], color: "white", availability: "in-stock", image: tshirt7 },
    { id: 8, name: "Crew Neck T-Shirt", price: 24.99, category: "Men", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: tshirt8 },
    { id: 9, name: "Long Sleeve T-Shirt", price: 54.99, category: "Men", size: ["M", "L"], color: "blue", availability: "in-stock", image: tshirt9 },
    { id: 10, name: "Henley T-Shirt", price: 37.99, category: "Men", size: ["S", "M"], color: "red", availability: "out-of-stock", image: tshirt10 },
    
    { id: 11, name: "Classic Oxford Shirt", price: 79.99, category: "Men", size: ["S", "M", "L"], color: "white", availability: "in-stock", image: shirt1 },
    { id: 12, name: "Denim Shirt", price: 89.99, category: "Men", size: ["M", "L"], color: "blue", availability: "in-stock", image: shirt2 },
    { id: 13, name: "Plaid Flannel Shirt", price: 69.99, category: "Men", size: ["S", "M", "L"], color: "red", availability: "in-stock", image: shirt3 },
    { id: 14, name: "Chambray Shirt", price: 74.99, category: "Men", size: ["M", "L"], color: "blue", availability: "in-stock", image: shirt4 },
    { id: 15, name: "Linen Shirt", price: 84.99, category: "Men", size: ["S", "M"], color: "white", availability: "out-of-stock", image: shirt5 },
    { id: 16, name: "Poplin Shirt", price: 64.99, category: "Men", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: img1 },
    { id: 17, name: "Twill Shirt", price: 94.99, category: "Men", size: ["L"], color: "blue", availability: "in-stock", image: shirt7 },
    { id: 18, name: "Casual Shirt", price: 59.99, category: "Men", size: ["S", "M", "L"], color: "white", availability: "in-stock", image: shirt8 },
    { id: 19, name: "Long Sleeve Shirt", price: 4800, category: "Men", size: ["S", "M", "L"], color: "blue", availability: "in-stock", image: img4 },
    { id: 20, name: "Oversized Tee", price: 4200, category: "Men", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: img6 },
    
    { id: 21, name: "Athletic Shorts", price: 39.99, category: "Men", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: shorts1 },
    { id: 22, name: "Cargo Shorts", price: 49.99, category: "Men", size: ["M", "L"], color: "blue", availability: "in-stock", image: shorts2 },
    { id: 23, name: "Denim Shorts", price: 44.99, category: "Men", size: ["S", "M", "L"], color: "blue", availability: "in-stock", image: shorts3 },
    { id: 24, name: "Linen Shorts", price: 54.99, category: "Men", size: ["M", "L"], color: "white", availability: "out-of-stock", image: shorts4 },
    { id: 25, name: "Chino Shorts", price: 34.99, category: "Men", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: shorts5 },
    { id: 26, name: "Swim Shorts", price: 29.99, category: "Men", size: ["M", "L"], color: "red", availability: "in-stock", image: shorts6 },
    
    { id: 27, name: "Slim Fit Joggers", price: 59.99, category: "Men", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: pants1 },
    { id: 28, name: "Cargo Joggers", price: 69.99, category: "Men", size: ["M", "L"], color: "blue", availability: "in-stock", image: pants2 },
    { id: 29, name: "Cotton Joggers", price: 49.99, category: "Men", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: pants3 },
    { id: 30, name: "Fleece Joggers", price: 79.99, category: "Men", size: ["M", "L"], color: "blue", availability: "out-of-stock", image: pants4 },
    { id: 31, name: "Track Pants", price: 44.99, category: "Men", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: pants5 },
    { id: 32, name: "Athletic Pants", price: 54.99, category: "Men", size: ["M", "L"], color: "blue", availability: "in-stock", image: pants6 },
    
    // Women's Products (IDs 101-127)
    { id: 101, name: "Classic Crop Top", price: 34.99, category: "Women", size: ["XS", "S", "M", "L"], color: "black", availability: "in-stock", image: cropTop1 },
    { id: 102, name: "Ribbed Crop Top", price: 39.99, category: "Women", size: ["S", "M", "L"], color: "pink", availability: "in-stock", image: cropTop2 },
    { id: 103, name: "Lace Crop Top", price: 44.99, category: "Women", size: ["XS", "S", "M"], color: "white", availability: "out-of-stock", image: cropTop3 },
    { id: 104, name: "Summer Maxi Dress", price: 89.99, category: "Women", size: ["XS", "S", "M", "L", "XL"], color: "blue", availability: "in-stock", image: dress1 },
    { id: 105, name: "Cocktail Dress", price: 129.99, category: "Women", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: dress2 },
    { id: 106, name: "Floral Midi Dress", price: 79.99, category: "Women", size: ["XS", "S", "M", "L"], color: "pink", availability: "in-stock", image: dress3 },
    { id: 107, name: "Bodycon Dress", price: 69.99, category: "Women", size: ["S", "M", "L"], color: "red", availability: "out-of-stock", image: dress4 },
    { id: 108, name: "Wrap Dress", price: 94.99, category: "Women", size: ["M", "L", "XL"], color: "purple", availability: "in-stock", image: dress5 },
    { id: 109, name: "High-Waist Joggers", price: 64.99, category: "Women", size: ["XS", "S", "M", "L"], color: "black", availability: "in-stock", image: womenPants1 },
    { id: 110, name: "Athletic Leggings", price: 54.99, category: "Women", size: ["S", "M", "L", "XL"], color: "blue", availability: "in-stock", image: womenPants2 },
    { id: 111, name: "Wide Leg Pants", price: 74.99, category: "Women", size: ["S", "M", "L"], color: "white", availability: "in-stock", image: womenPants3 },
    { id: 112, name: "High-Waist Shorts", price: 44.99, category: "Women", size: ["XS", "S", "M", "L"], color: "black", availability: "in-stock", image: womenShorts1 },
    { id: 113, name: "Denim Shorts", price: 49.99, category: "Women", size: ["S", "M", "L"], color: "blue", availability: "in-stock", image: womenShorts2 },
    { id: 114, name: "Athletic Shorts", price: 39.99, category: "Women", size: ["XS", "S", "M", "L"], color: "pink", availability: "out-of-stock", image: womenShorts3 },
    { id: 115, name: "High-Impact Sports Bra", price: 49.99, category: "Women", size: ["XS", "S", "M", "L"], color: "black", availability: "in-stock", image: sportsBra1 },
    { id: 116, name: "Medium-Impact Sports Bra", price: 44.99, category: "Women", size: ["S", "M", "L"], color: "blue", availability: "in-stock", image: sportsBra2 },
    { id: 117, name: "Low-Impact Sports Bra", price: 39.99, category: "Women", size: ["XS", "S", "M", "L"], color: "pink", availability: "in-stock", image: sportsBra3 },
    { id: 118, name: "Wireless Sports Bra", price: 54.99, category: "Women", size: ["S", "M", "L", "XL"], color: "purple", availability: "out-of-stock", image: sportsBra4 },
    { id: 119, name: "Racerback Sports Bra", price: 47.99, category: "Women", size: ["XS", "S", "M", "L"], color: "red", availability: "in-stock", image: sportsBra5 },
    { id: 120, name: "Classic V-Neck Tee", price: 29.99, category: "Women", size: ["XS", "S", "M", "L", "XL"], color: "white", availability: "in-stock", image: womenTshirt1 },
    { id: 121, name: "Crop Top Tee", price: 34.99, category: "Women", size: ["XS", "S", "M", "L"], color: "black", availability: "in-stock", image: womenTshirt2 },
    { id: 122, name: "Graphic Print Tee", price: 39.99, category: "Women", size: ["S", "M", "L"], color: "pink", availability: "in-stock", image: womenTshirt3 },
    { id: 123, name: "Long Sleeve Tee", price: 44.99, category: "Women", size: ["XS", "S", "M", "L"], color: "blue", availability: "out-of-stock", image: womenTshirt4 },
    { id: 124, name: "Oversized Tee", price: 37.99, category: "Women", size: ["S", "M", "L", "XL"], color: "purple", availability: "in-stock", image: womenTshirt5 },
    { id: 125, name: "Striped Tee", price: 32.99, category: "Women", size: ["XS", "S", "M", "L"], color: "red", availability: "in-stock", image: womenTshirt6 },
    { id: 126, name: "Henley Tee", price: 41.99, category: "Women", size: ["S", "M", "L"], color: "white", availability: "in-stock", image: womenTshirt7 },
    { id: 127, name: "Crew Neck Tee", price: 27.99, category: "Women", size: ["XS", "S", "M", "L", "XL"], color: "black", availability: "in-stock", image: womenTshirt8 },
    
    // Accessories (IDs 201-213)
    { id: 201, name: "Gym Duffel Bag", price: 45.99, category: "Accessories", size: ["One Size"], color: "black", availability: "in-stock", image: bag1 },
    { id: 202, name: "Sports Backpack", price: 35.99, category: "Accessories", size: ["One Size"], color: "gray", availability: "in-stock", image: bag2 },
    { id: 203, name: "Crossbody Bag", price: 25.99, category: "Accessories", size: ["One Size"], color: "brown", availability: "out-of-stock", image: bag3 },
    { id: 204, name: "Baseball Cap", price: 20.99, category: "Accessories", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: hat1 },
    { id: 205, name: "Beanie Hat", price: 15.99, category: "Accessories", size: ["One Size"], color: "gray", availability: "in-stock", image: hat2 },
    { id: 206, name: "Bucket Hat", price: 18.99, category: "Accessories", size: ["One Size"], color: "white", availability: "in-stock", image: hat3 },
    { id: 207, name: "Comfort Slides", price: 30.99, category: "Accessories", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: slide1 },
    { id: 208, name: "Athletic Slides", price: 25.99, category: "Accessories", size: ["S", "M", "L"], color: "blue", availability: "out-of-stock", image: slide2 },
    { id: 209, name: "Premium Slides", price: 40.99, category: "Accessories", size: ["M", "L"], color: "brown", availability: "in-stock", image: slide3 },
    { id: 210, name: "Insulated Water Bottle", price: 35.99, category: "Accessories", size: ["One Size"], color: "black", availability: "in-stock", image: bottle1 },
    { id: 211, name: "Sports Bottle", price: 20.99, category: "Accessories", size: ["One Size"], color: "white", availability: "in-stock", image: bottle2 },
    { id: 212, name: "Premium Bottle", price: 50.99, category: "Accessories", size: ["One Size"], color: "blue", availability: "in-stock", image: bottle3 },
    
    // Latest products (IDs 301-308)
    { id: 301, name: "Premium Oxford Shirt", price: 4750, category: "Men", size: ["S", "M", "L"], color: "white", availability: "in-stock", image: img1 },
    { id: 302, name: "Classic V-Neck Tee", price: 3200, category: "Women", size: ["XS", "S", "M", "L"], color: "black", availability: "in-stock", image: img2 },
    { id: 303, name: "Graphic Print Tee", price: 5300, category: "Women", size: ["S", "M", "L"], color: "white", availability: "in-stock", image: img3 },
    { id: 304, name: "Long Sleeve Shirt", price: 4800, category: "Men", size: ["S", "M", "L"], color: "blue", availability: "in-stock", image: img4 },
    { id: 305, name: "Ribbed Crop Top", price: 2900, category: "Women", size: ["XS", "S", "M"], color: "pink", availability: "in-stock", image: img5 },
    { id: 306, name: "Oversized Tee", price: 4200, category: "Men", size: ["S", "M", "L"], color: "black", availability: "in-stock", image: img6 },
    { id: 307, name: "High-Waist Joggers", price: 3900, category: "Women", size: ["XS", "S", "M", "L"], color: "black", availability: "in-stock", image: img7 },
    { id: 308, name: "Basic Crew Tee", price: 3000, category: "Women", size: ["XS", "S", "M", "L"], color: "white", availability: "in-stock", image: img8 },
  ];

  // Filter products based on search query
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.color.toLowerCase().includes(searchTerm) ||
      product.size.some(size => size.toLowerCase().includes(searchTerm))
    );
  }, [query]);

  const formatPrice = (price) => {
    if (price >= 1000) {
      return `Rs ${price.toLocaleString()}`;
    }
    return `$${price}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-36">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaSearch className="text-red-500 text-xl" />
            <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
          </div>
          
          {query && (
            <div className="flex items-center gap-2 text-gray-600">
              <span>Searching for:</span>
              <span className="font-semibold text-gray-900">"{query}"</span>
              <span className="text-gray-400">•</span>
              <span>{searchResults.length} products found</span>
            </div>
          )}
        </div>

        {/* Results */}
        {query ? (
          searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.image}
                  title={product.name}
                  price={formatPrice(product.price)}
                  color={product.color}
                  availability={product.availability}
                  sizes={product.size}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaSearch className="text-gray-300 text-6xl mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No products found</h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any products matching "{query}"
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>Try searching for:</p>
                <ul className="space-y-1">
                  <li>• Different keywords or spelling</li>
                  <li>• Product categories (Men, Women, Accessories)</li>
                  <li>• Colors (Black, Blue, White, etc.)</li>
                  <li>• Sizes (S, M, L, etc.)</li>
                </ul>
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <FaSearch className="text-gray-300 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Search for products</h2>
            <p className="text-gray-600">
              Use the search bar above to find what you're looking for
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 