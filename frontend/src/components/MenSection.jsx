import React from 'react';
import ProductCard from './ProductCard';
import img1 from '../assets/Shirts/6.webp';
import img2 from '../assets/T-shirts/Men/5.webp';
import img3 from '../assets/Shorts/8.webp';
import img4 from '../assets/Shirts/13.webp';
import img5 from '../assets/T-shirts/Men/1.jpg';
import img6 from '../assets/T-shirts/Men/19.webp';
import img7 from '../assets/T-shirts/Men/10.webp';
import img8 from '../assets/T-shirts/Men/5.webp';

const products = [
  { image: img1, title: 'Piped Zip Pullover Tee', price: 'Rs 4,750' },
  { image: img2, title: 'Piped Zip Flat Short', price: 'Rs 3,200' },
  { image: img3, title: 'Crop Jacket Navy', price: 'Rs 5,300' },
  { image: img4, title: 'Crop Jacket Navy', price: 'Rs 5,300' },
  { image: img5, title: 'Crop Jacket Navy', price: 'Rs 5,300' },
  { image: img6, title: 'Crop Jacket Navy', price: 'Rs 5,300' },
  { image: img7, title: 'Crop Jacket Navy', price: 'Rs 5,300' },
  { image: img8, title: 'Crop Jacket Navy', price: 'Rs 5,300' },
];

const LatestSection = () => {
  return (
    <div className='w-full flex justify-center py-6 m-auto'>
        <section className="w-[95%] h-[170vh] py-8 px-10 bg-gray-200 rounded-3xl overflow-hidden">
            <h2 className="text-2xl font-bold mb-6 text-black">Men</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                <ProductCard
                    key={index}
                    image={product.image}
                    title={product.title}
                    price={product.price}
                />
                ))}
            </div>
        </section>
    </div>
  );
};

export default LatestSection;
