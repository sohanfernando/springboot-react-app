import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductGrid from '../components/ProductGrid';
import {
  Container,
  PageHeader,
  Eyebrow,
  ButtonLink,
  EmptyState,
  Spinner,
} from '../components/ui/Primitives';

const SUGGESTIONS = ['T-Shirts', 'Shirts', 'Dresses', 'Joggers', 'Shorts', 'Accessories'];

const haystack = (product) =>
  [
    product.name,
    product.title,
    product.description,
    product.category,
    product.subcategory,
    product.color,
    ...(product.colors || []),
    ...(product.sizes || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

/**
 * Searches the live catalogue rather than a bundled fixture, so every result
 * links to a product page that actually resolves.
 */
const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setFailed(false);
      try {
        const res = await axios.get('/admin/products');
        if (!cancelled) setProducts(Array.isArray(res.data) ? res.data : []);
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
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    const words = term.split(/\s+/);
    return products.filter((p) => {
      const text = haystack(p);
      return words.every((w) => text.includes(w));
    });
  }, [products, query]);

  const renderBody = () => {
    if (!query.trim()) {
      return (
        <EmptyState
          eyebrow="Start typing"
          title="What are you looking for?"
          body="Use the search icon in the header, or try one of the suggestions below."
          action={
            <div className="flex flex-wrap justify-center gap-2.5">
              {SUGGESTIONS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                  className="h-10 px-5 border border-line text-[10px] tracking-label uppercase text-black/60 hover:bg-black hover:text-white hover:border-black transition-colors duration-300"
                >
                  {term}
                </button>
              ))}
            </div>
          }
        />
      );
    }

    if (loading) return <Spinner label="Searching" />;

    if (failed) {
      return (
        <EmptyState
          eyebrow="Unavailable"
          title="Search is offline"
          body="We couldn't reach the catalogue. Try again in a moment."
          action={<ButtonLink to="/" variant="outline">Back to Home</ButtonLink>}
        />
      );
    }

    if (!results.length) {
      return (
        <EmptyState
          eyebrow="No matches"
          title={`Nothing for "${query}"`}
          body="Try a different word, a category name, or a colour."
          action={
            <div className="flex flex-wrap justify-center gap-2.5">
              {SUGGESTIONS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                  className="h-10 px-5 border border-line text-[10px] tracking-label uppercase text-black/60 hover:bg-black hover:text-white hover:border-black transition-colors duration-300"
                >
                  {term}
                </button>
              ))}
            </div>
          }
        />
      );
    }

    return <ProductGrid products={results} stagger={0.07} />;
  };

  const meta = (() => {
    if (!query.trim()) return undefined;
    if (loading) return 'Searching';
    return `${results.length} ${results.length === 1 ? 'result' : 'results'}`;
  })();

  return (
    <>
      <PageHeader eyebrow="Search" title={query.trim() ? `"${query}"` : 'Search'} meta={meta} />

      <Container className="pb-24 md:pb-36">
        {query.trim() && results.length > 0 && (
          <div className="mb-8 md:mb-12">
            <Eyebrow>Results</Eyebrow>
          </div>
        )}
        {renderBody()}
      </Container>
    </>
  );
};

export default SearchPage;
