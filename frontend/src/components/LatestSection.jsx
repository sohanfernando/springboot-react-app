import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductGrid from './ProductGrid';
import { SectionHeader, Spinner, ButtonLink } from './ui/Primitives';

const WEEK = 7 * 24 * 60 * 60 * 1000;

const LatestSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/admin/products');
        const all = Array.isArray(res.data) ? res.data : [];
        const cutoff = Date.now() - WEEK;

        const latest = all
          .filter((p) => p.createdAt && new Date(p.createdAt).getTime() >= cutoff)
          .map((p) => ({ ...p, isNew: true }));

        // Nothing new this week still deserves a filled section — fall back
        // to the most recent pieces rather than showing an empty headline.
        const fallback = [...all]
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          .slice(0, 4);

        if (!cancelled) setProducts((latest.length ? latest : fallback).slice(0, 8));
      } catch {
        if (!cancelled) setProducts([]);
      }
      if (!cancelled) setLoading(false);
    };

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const renderBody = () => {
    if (loading) return <Spinner label="Loading arrivals" />;
    if (products.length) return <ProductGrid products={products} offset />;
    return (
      <div className="py-16 text-center border-t border-line">
        <p className="text-sm text-black/40 mb-8">
          The next drop is still in the studio. Browse the full catalogue in the meantime.
        </p>
        <ButtonLink to="/men" variant="outline">
          Browse Everything
        </ButtonLink>
      </div>
    );
  };

  return (
    <section className="py-24 md:py-36 bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-12">
        <SectionHeader
          eyebrow="Just Arrived"
          title="New Arrivals"
          action="View All"
          actionTo="/latest"
        />

        {renderBody()}
      </div>
    </section>
  );
};

export default LatestSection;
