import React from 'react';
import AdminProductManager from '../components/AdminProductManager';
import { PageHeading } from '../components/admin/AdminUI';

const AdminCatalogPage = () => (
  <>
    <PageHeading
      eyebrow="Inventory"
      title="Catalogue"
      meta="Add, edit and remove the pieces shown in the storefront"
    />
    <AdminProductManager />
  </>
);

export default AdminCatalogPage;
