import React from 'react';
import CatalogView from '../components/CatalogView';

const SUBCATEGORIES = ['T-Shirts', 'Shirts', 'Crop Tops', 'Dresses', 'Shorts', 'Joggers & Pants', 'Sports Bra'];
const WEEK = 7 * 24 * 60 * 60 * 1000;

// "Latest" is everything added in the last seven days, newest first.
const fetchLatest = async (axios) => {
  const res = await axios.get('/admin/products');
  const all = Array.isArray(res.data) ? res.data : [];
  const cutoff = Date.now() - WEEK;

  return all
    .filter((p) => p.createdAt && new Date(p.createdAt).getTime() >= cutoff)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((p) => ({ ...p, isNew: true }));
};

const LatestPage = () => (
  <CatalogView
    eyebrow="This Week"
    title="Latest Arrivals"
    fetcher={fetchLatest}
    subcategories={SUBCATEGORIES}
    emptyCopy="Nothing new landed this week. The next drop is close."
  />
);

export default LatestPage;
