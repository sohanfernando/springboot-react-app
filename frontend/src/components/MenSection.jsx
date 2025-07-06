import React from 'react';
import ProductCard from './ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaMale, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import img1 from '../assets/Shirts/6.webp';
import img2 from '../assets/T-shirts/Men/5.webp';
import img3 from '../assets/Shorts/8.webp';
import img4 from '../assets/Shirts/13.webp';
import img5 from '../assets/T-shirts/Men/1.jpg';
import img6 from '../assets/T-shirts/Men/19.webp';
import img7 from '../assets/T-shirts/Men/10.webp';
import img8 from '../assets/T-shirts/Men/5.webp';

const products = [
  { id: 'men-1', image: img1, title: 'Premium Oxford Shirt', price: 'Rs 4,750', category: 'Shirts' },
  { id: 'men-2', image: img2, title: 'V-Neck T-Shirt', price: 'Rs 3,200', category: 'T-Shirts' },
  { id: 'men-3', image: img3, title: 'Athletic Shorts', price: 'Rs 5,300', category: 'Shorts' },
  { id: 'men-4', image: img4, title: 'Long Sleeve Shirt', price: 'Rs 4,800', category: 'Shirts' },
  { id: 'men-5', image: img5, title: 'Classic Cotton Tee', price: 'Rs 3,500', category: 'T-Shirts' },
  { id: 'men-6', image: img6, title: 'Oversized Tee', price: 'Rs 4,200', category: 'T-Shirts' },
  { id: 'men-7', image: img7, title: 'Henley T-Shirt', price: 'Rs 3,800', category: 'T-Shirts' },
  { id: 'men-8', image: img8, title: 'Polo T-Shirt', price: 'Rs 4,500', category: 'T-Shirts' },
];

const MenSection = () => {
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
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <FaMale className="text-white text-sm" />
            </div>
            <span className="text-blue-400 text-sm font-semibold uppercase tracking-wider">Men's Collection</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Men's
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600"> Essentials</span>
          </h2>
          
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Elevate your style with our premium men's collection designed for performance and comfort
          </p>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next-men',
              prevEl: '.swiper-button-prev-men',
            }}
            pagination={{ 
              clickable: true,
              el: '.swiper-pagination-men',
              bulletClass: 'swiper-pagination-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active'
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="men-swiper"
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
          <button className="swiper-button-prev-men absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button className="swiper-button-next-men absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Custom Pagination */}
          <div className="swiper-pagination-men flex justify-center mt-8 space-x-2"></div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/men"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span>Shop Men's Collection</span>
            <FaArrowRight className="text-sm" />
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default MenSection;
