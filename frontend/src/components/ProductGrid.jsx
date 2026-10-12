import React, { useLayoutEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { gsap, reveal } from '../lib/motion';

/**
 * The one product grid. `offset` staggers alternate cards down by 4rem on
 * desktop, which is what stops a row of four reading like a spreadsheet.
 */
const ProductGrid = ({ products = [], offset = false, columns = 4, stagger = 0.12 }) => {
  const rootRef = useRef(null);

  const colClass =
    columns === 3
      ? 'grid-cols-2 lg:grid-cols-3'
      : columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-2 lg:grid-cols-4';

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      reveal('.product-cell', { stagger, y: 60, start: 'top 82%', trigger: rootRef.current });
    }, rootRef);
    return () => ctx.revert();
  }, [products.length, stagger]);

  return (
    <div ref={rootRef} className={`grid ${colClass} gap-3 sm:gap-4 md:gap-6`}>
      {products.map((product, i) => (
        <div
          key={product.id ?? i}
          className={`product-cell ${offset && i % 2 === 1 ? 'md:mt-16' : ''}`}
        >
          <ProductCard
            id={product.id}
            image={Array.isArray(product.images) ? product.images[0] : product.image}
            images={Array.isArray(product.images) ? product.images : undefined}
            title={product.name || product.title}
            price={product.price}
            originalPrice={product.originalPrice}
            color={product.color}
            category={product.category}
            subcategory={product.subcategory}
            availability={product.availability}
            sizes={product.sizes || product.size}
            isNew={product.isNew}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
