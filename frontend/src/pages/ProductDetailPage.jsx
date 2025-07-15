import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingBag, FaArrowLeft, FaStar, FaTruck, FaShieldAlt, FaUndo } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const getImageUrl = (img) => {
  if (!img) return '';
  if (img.startsWith('http')) return img;
  if (img.startsWith('/uploads/products/')) return `http://localhost:8080${img}`;
  return `http://localhost:8080/uploads/products/${img}`;
};

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/admin/products/${productId}`);
        setProduct(res.data);
        console.log('Fetched product for productId', productId, res.data);
      } catch (e) {
        setProduct(null);
        console.log('Failed to fetch product for productId', productId, e);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-16 text-center text-gray-500 text-lg">Loading product...</div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              <FaArrowLeft />
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }
    if (!selectedColor) {
      alert('Please select a color');
      return;
    }

    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity,
      image: images.length > 0 ? getImageUrl(images[safeSelectedImage]) : '',
    });

    alert('Product added to cart!');
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const calculateDiscount = () => {
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  const images = Array.isArray(product.images) ? product.images : [];
  const colors = Array.isArray(product.colors) ? product.colors : [];
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
  const features = Array.isArray(product.features) ? product.features : [];
  const specifications = product.specifications && typeof product.specifications === 'object' ? product.specifications : {};
  const safeSelectedImage =
    typeof selectedImage === 'number' && selectedImage >= 0 && selectedImage < images.length
      ? selectedImage
      : 0;
  const mainImage = images.length > 0 ? getImageUrl(images[safeSelectedImage]) : 'https://via.placeholder.com/400x400?text=No+Image';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaArrowLeft />
              Back
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-white rounded-xl overflow-hidden">
                <img
                  src={mainImage}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-5 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title and Rating */}
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span className="font-medium">{product.rating || '—'}</span>
                    <span className="text-gray-600">({product.reviews || 0} reviews)</span>
                  </div>
                  <span className="text-green-600 font-medium">{product.availability === 'out-of-stock' ? 'Out of Stock' : 'In Stock'}</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">{product.category}{product.subcategory ? ` / ${product.subcategory}` : ''}</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-800">Rs {product.price}</span>
                <span className="text-xl text-gray-500 line-through">Rs {product.originalPrice}</span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                  {calculateDiscount()}% OFF
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">{product.description}</p>

              {/* Color Selection */}
              {colors.length > 0 ? (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Color</h3>
                  <div className="flex gap-3">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          selectedColor === color
                            ? 'border-red-500 bg-red-50 text-red-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-sm mb-3">No colors available for this product.</div>
              )}
              {/* Size Selection */}
              {sizes.length > 0 ? (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Size</h3>
                  <div className="flex gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-medium transition-colors ${
                          selectedSize === size
                            ? 'border-red-500 bg-red-50 text-red-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-sm mb-3">No sizes available for this product.</div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Quantity</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-16 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-red-500 text-white py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <FaShoppingBag />
                  Add to Cart
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center transition-colors ${
                    isWishlisted
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>

              {/* Features */}
              {features.length > 0 ? (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Features</h3>
                  <ul className="list-disc pl-6 text-gray-700">
                    {features.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              ) : (
                <div className="text-gray-400 text-sm mb-3">No features listed for this product.</div>
              )}

              {/* Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                  <FaTruck className="text-red-500" />
                  <div>
                    <h4 className="font-semibold text-sm">Free Shipping</h4>
                    <p className="text-xs text-gray-600">On orders over Rs 5,000</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                  <FaShieldAlt className="text-red-500" />
                  <div>
                    <h4 className="font-semibold text-sm">Secure Payment</h4>
                    <p className="text-xs text-gray-600">100% secure checkout</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                  <FaUndo className="text-red-500" />
                  <div>
                    <h4 className="font-semibold text-sm">Easy Returns</h4>
                    <p className="text-xs text-gray-600">30 day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage; 