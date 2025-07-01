import React from 'react';
import ProductCard from './ProductCard';
import img1 from '../assets/T-shirts/Women/6.webp';
import img2 from '../assets/T-shirts/Women/1.webp';
import img3 from '../assets/T-shirts/Women/3.webp';
import img4 from '../assets/Sports bra/1.webp';
import img5 from '../assets/Crop tops/1.webp';
import img6 from '../assets/Sports bra/3.webp';
import img7 from '../assets/Shorts/Women/1.webp';
import img8 from '../assets/T-shirts/Women/5.webp';

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
            <h2 className="text-2xl font-bold mb-6 text-black">Women</h2>
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
