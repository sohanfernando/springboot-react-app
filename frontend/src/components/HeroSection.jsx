import React from 'react';
import Model1 from "../assets/T-shirts/Men/1.jpg"
import Model2 from "../assets/T-shirts/Women/5.webp"
import Model3 from "../assets/T-shirts/Men/7.webp"

const HeroSection = () => {
  return (
    <div className="w-full flex justify-center py-6 m-auto">
      <div className="w-[95%] h-[90vh] bg-black text-white rounded-3xl overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          {/* Image 1 */}
          <div className="flex-1 relative">
            <img
              src={Model1}
              alt="Model 1"
              className="h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
          </div>

          {/* Image 2 (center with button) */}
          <div className="flex-1 relative flex items-center justify-center">
            <img
              src={Model2}
              alt="Model 2"
              className="h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            <div className="absolute text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">FashionHub</h1>
              <button className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded hover:bg-yellow-300 transition">
                SHOP NOW
              </button>
            </div>
          </div>

          {/* Image 3 */}
          <div className="flex-1 relative">
            <img
              src={Model3}
              alt="Model 3"
              className="h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
