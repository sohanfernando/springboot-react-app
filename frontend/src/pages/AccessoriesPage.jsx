import React from 'react';
import CatalogView from '../components/CatalogView';

const SUBCATEGORIES = ['Bags', 'Hats', 'Slides', 'Bottle'];

const fetchAccessories = async (axios) => {
  const res = await axios.get('/admin/products/category/Accessories');
  return res.data;
};

const AccessoriesPage = () => (
  <CatalogView
    eyebrow="Collection III"
    title="Accessories"
    fetcher={fetchAccessories}
    subcategories={SUBCATEGORIES}
    emptyCopy="No accessories in the studio right now. Check back shortly."
  />
);

export default AccessoriesPage;
