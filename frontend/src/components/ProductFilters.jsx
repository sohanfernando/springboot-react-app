import React from 'react';
import { X, Check } from 'lucide-react';
import { formatPrice } from '../lib/motion';

const Facet = ({ title, children }) => (
  <div className="py-7 border-b border-line last:border-b-0">
    <p className="text-[10px] tracking-eyebrow uppercase text-black/30 mb-5">{title}</p>
    {children}
  </div>
);

/* A square that fills solid black when checked — no tick colour, no radius. */
const CheckRow = ({ checked, onChange, label, count }) => (
  <button
    type="button"
    onClick={onChange}
    className="group flex items-center gap-3 w-full text-left py-1.5"
  >
    <span
      className={`shrink-0 w-3.5 h-3.5 border flex items-center justify-center transition-colors duration-300 ${
        checked ? 'bg-black border-black' : 'border-line group-hover:border-black'
      }`}
    >
      {checked && <Check size={9} strokeWidth={3} className="text-white" />}
    </span>
    <span
      className={`flex-1 text-[11px] tracking-label uppercase transition-colors duration-300 ${
        checked ? 'text-black' : 'text-black/50 group-hover:text-black'
      }`}
    >
      {label}
    </span>
    {typeof count === 'number' && (
      <span className="text-[10px] text-black/25 tabular-nums">{count}</span>
    )}
  </button>
);

const Chip = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`h-9 px-3 text-[10px] tracking-label uppercase border transition-colors duration-300 ${
      active ? 'bg-black text-white border-black' : 'bg-white text-black/60 border-line hover:border-black hover:text-black'
    }`}
  >
    {children}
  </button>
);

/**
 * One filter panel for every catalogue page. Sticky rail on desktop, a
 * full-height drawer sliding in from the left on mobile.
 */
const ProductFilters = ({
  filters,
  setFilters,
  clearFilters,
  open,
  onClose,
  subcategories = [],
  sizes = [],
  colors = [],
  priceBounds = [0, 100000],
  counts = {},
}) => {
  const toggleIn = (key, value) =>
    setFilters((prev) => {
      const list = Array.isArray(prev[key]) ? prev[key] : [];
      return {
        ...prev,
        [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
      };
    });

  const [min, max] = priceBounds;
  const current = Array.isArray(filters.priceRange) ? filters.priceRange[1] : max;

  const activeCount =
    (filters.categories?.length || 0) +
    (filters.sizes?.length || 0) +
    (filters.colors?.length || 0) +
    (filters.availability && filters.availability !== 'all' ? 1 : 0) +
    (current < max ? 1 : 0);

  const panel = (
    <>
      <div className="flex items-center justify-between pb-6 border-b border-line">
        <p className="text-[11px] tracking-label uppercase font-medium">
          Filter{activeCount > 0 && <span className="text-black/30"> · {activeCount}</span>}
        </p>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={clearFilters}
            className="text-[10px] tracking-label uppercase text-black/40 hover:text-black transition-colors duration-300 pb-0.5 border-b border-transparent hover:border-black"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="lg:hidden text-black hover:opacity-60 transition-opacity duration-300"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {subcategories.length > 0 && (
        <Facet title="Category">
          <div className="flex flex-col">
            {subcategories.map((c) => (
              <CheckRow
                key={c}
                label={c}
                count={counts[c]}
                checked={(filters.categories || []).includes(c)}
                onChange={() => toggleIn('categories', c)}
              />
            ))}
          </div>
        </Facet>
      )}

      <Facet title="Availability">
        <div className="flex flex-col">
          {[
            ['all', 'All Pieces'],
            ['in-stock', 'In Stock'],
            ['out-of-stock', 'Sold Out'],
          ].map(([value, label]) => (
            <CheckRow
              key={value}
              label={label}
              checked={(filters.availability || 'all') === value}
              onChange={() => setFilters((prev) => ({ ...prev, availability: value }))}
            />
          ))}
        </div>
      </Facet>

      <Facet title="Price">
        <input
          type="range"
          min={min}
          max={max}
          step={Math.max(1, Math.round((max - min) / 100))}
          value={current}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, priceRange: [min, Number(e.target.value)] }))
          }
          className="w-full h-px accent-black cursor-pointer"
        />
        <div className="flex justify-between mt-4 text-[10px] tracking-label uppercase text-black/40 tabular-nums">
          <span>{formatPrice(min)}</span>
          <span className="text-black">{formatPrice(current)}</span>
        </div>
      </Facet>

      {sizes.length > 0 && (
        <Facet title="Size">
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <Chip
                key={s}
                active={(filters.sizes || []).includes(s)}
                onClick={() => toggleIn('sizes', s)}
              >
                {s}
              </Chip>
            ))}
          </div>
        </Facet>
      )}

      {colors.length > 0 && (
        <Facet title="Colour">
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <Chip
                key={c}
                active={(filters.colors || []).includes(c)}
                onClick={() => toggleIn('colors', c)}
              >
                {c}
              </Chip>
            ))}
          </div>
        </Facet>
      )}
    </>
  );

  return (
    <>
      {/* Desktop rail */}
      <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
        <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar pr-2">
          {panel}
        </div>
      </aside>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-[180] transition-opacity duration-500 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          type="button"
          aria-label="Close filters"
          onClick={onClose}
          className="absolute inset-0 w-full h-full bg-black/40 cursor-default"
        />
        <div
          className={`absolute inset-y-0 left-0 w-full max-w-sm bg-white overflow-y-auto no-scrollbar px-5 py-6 transition-transform duration-500 ease-overlay ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {panel}
          <button
            type="button"
            onClick={onClose}
            className="w-full h-12 mt-8 bg-black text-white text-[10px] tracking-button uppercase hover:bg-carbon transition-colors duration-300"
          >
            Show Results
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductFilters;
