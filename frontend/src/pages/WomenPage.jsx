import React from 'react';
import CatalogView from '../components/CatalogView';

const SUBCATEGORIES = ['T-Shirts', 'Crop Tops', 'Dresses', 'Joggers & Pants', 'Shorts', 'Sports Bra'];

const fetchWomen = async (axios) => {
  const res = await axios.get('/admin/products/category/Women');
  return res.data;
};

const WomenPage = () => (
  <CatalogView
    eyebrow="Collection II"
    title="Women"
    fetcher={fetchWomen}
    subcategories={SUBCATEGORIES}
    emptyCopy="The women's collection is being cut. Check back shortly."
  />
);

export default WomenPage;
