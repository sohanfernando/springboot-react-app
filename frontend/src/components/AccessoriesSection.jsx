import React from 'react';
import ProductCard from './ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaGem, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import img1 from '../assets/Accessories/1.webp';
import img2 from '../assets/Accessories/4.webp';
import img3 from '../assets/Accessories/7.webp';
import img4 from '../assets/Accessories/10.webp';
import img5 from '../assets/Accessories/13.webp';
import img6 from '../assets/Accessories/18.webp';
import img7 from '../assets/Accessories/19.webp';
import img8 from '../assets/Accessories/14.webp';

const products = [
  { id: 'accessories-1', image: img1, title: 'Premium Gym Bag', price: 'Rs 4,750', category: 'Bags' },
  { id: 'accessories-2', image: img2, title: 'Wireless Headphones', price: 'Rs 3,200', category: 'Electronics' },
  { id: 'accessories-3', image: img3, title: 'Fitness Tracker', price: 'Rs 5,300', category: 'Electronics' },
  { id: 'accessories-4', image: img4, title: 'Water Bottle', price: 'Rs 4,800', category: 'Hydration' },
  { id: 'accessories-5', image: img5, title: 'Resistance Bands', price: 'Rs 2,900', category: 'Equipment' },
  { id: 'accessories-6', image: img6, title: 'Yoga Mat', price: 'Rs 4,200', category: 'Equipment' },
  { id: 'accessories-7', image: img7, title: 'Gym Gloves', price: 'Rs 3,900', category: 'Protection' },
  { id: 'accessories-8', image: img8, title: 'Foam Roller', price: 'Rs 3,000', category: 'Recovery' },
];

const AccessoriesSection = () => {
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
            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
              <FaGem className="text-white text-sm" />
            </div>
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider">Premium Accessories</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Complete Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600"> Setup</span>
          </h2>
          
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Enhance your fitness journey with our premium accessories designed for performance and style
          </p>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next-accessories',
              prevEl: '.swiper-button-prev-accessories',
            }}
            pagination={{ 
              clickable: true,
              el: '.swiper-pagination-accessories',
              bulletClass: 'swiper-pagination-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active'
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="accessories-swiper"
          >
            {products.map((product, index) => (
              <SwiperSlide key={index} className="pb-12">
                <div className="group">
                  <ProductCard
                    id={product.id}
                    image={product.image}
                    title={product.title}
                    price={product.price}
                  />
                  <div className="mt-2 text-center">
                    <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-accessories absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button className="swiper-button-next-accessories absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Custom Pagination */}
          <div className="swiper-pagination-accessories flex justify-center mt-8 space-x-2"></div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/accessories"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span>Shop All Accessories</span>
            <FaArrowRight className="text-sm" />
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default AccessoriesSection;
