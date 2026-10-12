import React from 'react';
import CatalogView from '../components/CatalogView';

const SUBCATEGORIES = ['T-Shirts', 'Shirts', 'Shorts', 'Joggers & Pants'];

const fetchMen = async (axios) => {
  const res = await axios.get('/admin/products/category/Men');
  return res.data;
};

const MenPage = () => (
  <CatalogView
    eyebrow="Collection I"
    title="Men"
    fetcher={fetchMen}
    subcategories={SUBCATEGORIES}
    emptyCopy="The men's collection is being cut. Check back shortly."
  />
);

export default MenPage;
