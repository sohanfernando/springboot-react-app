/**
 * Presentation helpers with no dependencies — shared by the storefront and the
 * admin. Kept out of lib/motion so the admin does not pull in GSAP just to
 * format a price.
 */

/** Currency formatting used across the storefront and admin. */
export function formatPrice(value) {
  const n =
    typeof value === 'string' ? Number(value.replace(/[^0-9.]/g, '')) : Number(value);
  if (!Number.isFinite(n)) return String(value ?? '');
  return `Rs ${n.toLocaleString('en-LK', { maximumFractionDigits: 2 })}`;
}

/** Resolve a product image reference to an absolute URL. */
export function getImageUrl(img) {
  if (!img) return '';
  if (typeof img !== 'string') return '';
  if (img.startsWith('http') || img.startsWith('data:') || img.startsWith('blob:')) return img;
  if (img.startsWith('/uploads/products/')) return `${window.API_BASE_URL}${img}`;
  if (img.startsWith('/')) return img; // bundled asset from Vite
  return `${window.API_BASE_URL}/uploads/products/${img}`;
}
