import React from 'react';
import { FaRegHeart, FaRegEye, FaShoppingBag } from 'react-icons/fa';

const ProductCard = ({ image, title, price }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col h-full">
      <div className="p-4">
        <img
          src={image}
          alt={title}
          className="w-full h-[550px] object-cover rounded-md mx-auto"
        />
      </div>
      <div className="mt-auto p-4 bg-black rounded-b-xl text-white">
        <h3 className="font-semibold text-sm min-h-[40px]">{title}</h3>
        <p className="text-sm mt-1">{price}</p>
        <div className="flex items-center gap-4 mt-3">
          <button className="hover:text-gray-300"><FaRegEye /></button>
          <button className="hover:text-gray-300"><FaShoppingBag /></button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
