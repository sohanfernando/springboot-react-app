import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaFire, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import axios from 'axios';

const LatestSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/admin/products');
        // Filter products added in the last 7 days
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

  return (
    <section className="relative py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <FaFire className="text-white text-sm" />
            </div>
            <span className="text-red-400 text-sm font-semibold uppercase tracking-wider">New Arrivals</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Latest
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600"> Collection</span>
          </h2>
          
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover our freshest drops and trending styles that will elevate your fitness journey
          </p>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          {loading ? (
            <div className="text-center text-white py-12">Loading latest products...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-white py-12">No new products this week.</div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next-latest',
                prevEl: '.swiper-button-prev-latest',
              }}
              pagination={{ 
                clickable: true,
                el: '.swiper-pagination-latest',
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active'
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 24 },
                1024: { slidesPerView: 4, spaceBetween: 24 },
              }}
              className="latest-swiper"
            >
              {products.map((product, index) => (
                <SwiperSlide key={product.id || index} className="pb-12">
                  <div className="group">
                    <ProductCard
                      id={product.id}
                      image={product.images && product.images[0]}
                      title={product.name}
                      price={`Rs ${product.price}`}
                    />
                    <div className="mt-2 text-center">
                      <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                        {product.category} / {product.subcategory}
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-latest absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button className="swiper-button-next-latest absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Custom Pagination */}
          <div className="swiper-pagination-latest flex justify-center mt-8 space-x-2"></div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/latest"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span>View All Latest</span>
            <FaArrowRight className="text-sm" />
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default LatestSection;
