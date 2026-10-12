import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductGrid from './ProductGrid';
import { SectionHeader, Spinner } from './ui/Primitives';

const GROUNDS = {
  white: 'bg-white',
  grey: 'bg-secondary',
};

/**
 * A category preview rail. One component drives Men, Women and Accessories on
 * the homepage — the sections differ only by data and ground.
 */
const CategoryRail = ({ category, eyebrow, title, to, ground = 'white', limit = 4 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/admin/products/category/${encodeURIComponent(category)}`);
        if (!cancelled) setProducts(Array.isArray(res.data) ? res.data.slice(0, limit) : []);
      } catch {
        if (!cancelled) setProducts([]);
      }
      if (!cancelled) setLoading(false);
    };

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [category, limit]);

  // A rail with nothing in it is just an empty headline — drop it entirely.
  if (!loading && products.length === 0) return null;

  return (
    <section className={`py-24 md:py-36 ${GROUNDS[ground]}`}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-12">
        <SectionHeader eyebrow={eyebrow} title={title} action="View All" actionTo={to} />
        {loading ? <Spinner label={`Loading ${category}`} /> : <ProductGrid products={products} offset />}
      </div>
    </section>
  );
};

export default CategoryRail;
