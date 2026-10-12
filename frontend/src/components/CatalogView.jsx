import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import axios from 'axios';
import ProductGrid from './ProductGrid';
import ProductFilters from './ProductFilters';
import { SORT_OPTIONS } from '../lib/catalog';
import { PageHeader, Container, Button, ButtonLink, EmptyState, Spinner } from './ui/Primitives';

const numericPrice = (value) =>
  typeof value === 'string' ? Number(value.replace(/[^0-9.]/g, '')) : Number(value ?? 0);

const unique = (values) => [...new Set(values.filter(Boolean))];

const defaultFilters = (maxPrice) => ({
  categories: [],
  sizes: [],
  colors: [],
  availability: 'all',
  priceRange: [0, maxPrice],
  sortBy: 'default',
});

/**
 * Every catalogue page — Men, Women, Accessories, Latest — is this component
 * with different data. Facet values and the price ceiling are derived from
 * the products that actually came back, so the slider can never filter the
 * whole catalogue away.
 */
const CatalogView = ({ eyebrow, title, fetcher, subcategories = [], emptyCopy }) => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState(() => defaultFilters(Infinity));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setFailed(false);
      try {
        const data = await fetcher(axios);
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) {
          setProducts([]);
          setFailed(true);
        }
      }
      if (!cancelled) setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [fetcher]);

  // Facets derived from the data, not hard-coded.
  const facets = useMemo(() => {
    const prices = products.map((p) => numericPrice(p.price)).filter(Number.isFinite);
    const maxPrice = prices.length ? Math.ceil(Math.max(...prices)) : 100000;

    return {
      maxPrice: maxPrice || 100000,
      sizes: unique(products.flatMap((p) => p.sizes || p.size || [])),
      colors: unique(products.flatMap((p) => p.colors || (p.color ? [p.color] : []))),
      counts: products.reduce((acc, p) => {
        if (p.subcategory) acc[p.subcategory] = (acc[p.subcategory] || 0) + 1;
        return acc;
      }, {}),
    };
  }, [products]);

  // Seed the price ceiling once the data lands, and honour ?category= from
  // the nav's dropdown links.
  useEffect(() => {
    if (loading) return;
    const fromUrl = searchParams.get('category');
    setFilters((prev) => ({
      ...defaultFilters(facets.maxPrice),
      sortBy: ready ? prev.sortBy : 'default',
      categories: fromUrl ? [fromUrl] : [],
    }));
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, facets.maxPrice, searchParams]);

  const clearFilters = () => setFilters(defaultFilters(facets.maxPrice));

  const visible = useMemo(() => {
    const ceiling = filters.priceRange?.[1] ?? facets.maxPrice;

    const result = products.filter((p) => {
      if (filters.categories?.length && !filters.categories.includes(p.subcategory)) return false;

      if (filters.availability === 'in-stock' && p.availability === 'out-of-stock') return false;
      if (filters.availability === 'out-of-stock' && p.availability !== 'out-of-stock') return false;

      const price = numericPrice(p.price);
      if (Number.isFinite(price) && price > ceiling) return false;

      if (filters.sizes?.length) {
        const own = p.sizes || p.size || [];
        if (!filters.sizes.some((s) => own.includes(s))) return false;
      }

      if (filters.colors?.length) {
        const own = p.colors || (p.color ? [p.color] : []);
        if (!filters.colors.some((c) => own.includes(c))) return false;
      }

      return true;
    });

    switch (filters.sortBy) {
      case 'price-low-high':
        return [...result].sort((a, b) => numericPrice(a.price) - numericPrice(b.price));
      case 'price-high-low':
        return [...result].sort((a, b) => numericPrice(b.price) - numericPrice(a.price));
      case 'newest':
        return [...result].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      default:
        return result;
    }
  }, [products, filters, facets.maxPrice]);

  const renderResults = () => {
    if (loading) return <Spinner label="Loading pieces" />;

    if (failed) {
      return (
        <EmptyState
          eyebrow="Unavailable"
          title="We couldn't reach the studio"
          body="The catalogue didn't load. Check your connection and try again."
          action={
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        />
      );
    }

    if (!products.length) {
      return (
        <EmptyState
          eyebrow="Empty"
          title="Nothing here yet"
          body={emptyCopy || 'This collection is still being cut. Check back shortly.'}
          action={<ButtonLink to="/" variant="outline">Back to Home</ButtonLink>}
        />
      );
    }

    if (!visible.length) {
      return (
        <EmptyState
          eyebrow="No matches"
          title="Nothing fits those filters"
          body="Try widening the price or clearing a category to see more."
          action={
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          }
        />
      );
    }

    return <ProductGrid products={visible} columns={3} stagger={0.08} />;
  };

  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        meta={loading ? 'Loading' : `${visible.length} ${visible.length === 1 ? 'piece' : 'pieces'}`}
      />

      <Container className="pb-24 md:pb-36">
        <div className="flex gap-10 xl:gap-16">
          <ProductFilters
            filters={filters}
            setFilters={setFilters}
            clearFilters={clearFilters}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            subcategories={subcategories}
            sizes={facets.sizes}
            colors={facets.colors}
            priceBounds={[0, facets.maxPrice]}
            counts={facets.counts}
          />

          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 pb-6 mb-8 md:mb-12 border-b border-line">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden flex items-center gap-2.5 text-[10px] tracking-label uppercase text-black/60 hover:text-black transition-colors duration-300"
              >
                <SlidersHorizontal size={14} strokeWidth={1.5} />
                Filter
              </button>

              <span className="hidden lg:block text-[10px] tracking-label uppercase text-black/30 tabular-nums">
                {loading ? '—' : `${visible.length} of ${products.length}`}
              </span>

              <label className="flex items-center gap-3 ml-auto">
                <span className="hidden sm:inline text-[10px] tracking-label uppercase text-black/30">
                  Sort
                </span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
                  className="bg-transparent text-[10px] tracking-label uppercase text-black border-b border-line focus:border-black focus:outline-none py-1.5 pr-6 transition-colors duration-300 cursor-pointer"
                >
                  {SORT_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {renderResults()}
          </div>
        </div>
      </Container>
    </>
  );
};

export default CatalogView;
