import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SmoothScroll from './SmoothScroll';
import Preloader from './Preloader';
import Navbar from './Navbar';
import Footer from './Footer';
import { UIProvider } from '../context/UIContext';

/**
 * Chrome for the whole customer side. The `velora` class on <html> is what
 * scopes the document-level styling (hairline scrollbar, Inter body type)
 * to the storefront — the admin side never mounts this, so
 * it keeps its own look.
 */
const CustomerLayout = () => {
  useEffect(() => {
    document.documentElement.classList.add('velora');
    return () => document.documentElement.classList.remove('velora');
  }, []);

  return (
    <UIProvider>
      <SmoothScroll>
        <Preloader />
        <Navbar />
        <main className="min-h-screen bg-white">
          <Outlet />
        </main>
        <Footer />
      </SmoothScroll>
    </UIProvider>
  );
};

export default CustomerLayout;
