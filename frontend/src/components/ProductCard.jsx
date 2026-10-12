import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getImageUrl, formatPrice } from '../lib/motion';

/**
 * Three moves make this card, and they run at three different speeds:
 * the alternate image crossfades at 700ms, the action bar rises at 400ms,
 * and the title drops to 60% opacity at 300ms.
 */
const ProductCard = ({
  id,
  image,
  images,
  title,
  price,
  originalPrice,
  color,
  category,
  subcategory,
  availability,
  sizes,
  isNew = false,
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useAuth();
  const { showToast } = useToast();

  const gallery = Array.isArray(images) && images.length ? images : [image];
  const primary = getImageUrl(gallery[0]);
  const secondary = gallery.length > 1 ? getImageUrl(gallery[1]) : null;

  const outOfStock = availability === 'out-of-stock';
  const wishlisted = isInWishlist(id);
  const onSale = Number(originalPrice) > 0 && Number(originalPrice) > Number(String(price).replace(/[^0-9.]/g, ''));

  const payload = { id, image: gallery[0], images: gallery, title, price, color, availability, sizes };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) {
      showToast('This piece is out of stock', 'error');
      return;
    }
    addToCart(payload);
    showToast('Added to your bag', 'success');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(payload);
    showToast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist', 'success');
  };

  return (
    <article className="group relative">
      {/* Image frame */}
      <div className="relative overflow-hidden bg-muted aspect-[4/5]">
        <Link
          to={`/product/${id}`}
          className="absolute inset-0 z-[1] block"
          aria-label={title}
        >
          {primary ? (
            <>
              <img
                src={primary}
                alt={title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 opacity-100 group-hover:opacity-0"
              />
              {secondary && (
                <img
                  src={secondary}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 opacity-0 group-hover:opacity-100"
                />
              )}
              {!secondary && (
                <span className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.06] transition-colors duration-700" />
              )}
            </>
          ) : (
            <span className="absolute inset-0 flex items-center justify-center font-playfair text-3xl font-light text-black/15">
              {(title || '?').charAt(0)}
            </span>
          )}
        </Link>

        {/* Badges — meaning is carried by inversion, not colour */}
        <div className="absolute top-3 left-3 z-[2] flex flex-col gap-1 pointer-events-none">
          {outOfStock && (
            <span className="bg-black text-white text-[8px] tracking-label uppercase px-2 py-1">
              Sold Out
            </span>
          )}
          {onSale && !outOfStock && (
            <span className="bg-black text-white text-[8px] tracking-label uppercase px-2 py-1">Sale</span>
          )}
          {isNew && !outOfStock && !onSale && (
            <span className="bg-white text-black text-[8px] tracking-label uppercase px-2 py-1">New</span>
          )}
        </div>

        {/* Action bar — rises from translate-y-full at 400ms ease-out */}
        <div className="absolute bottom-0 left-0 right-0 z-[2] translate-y-full group-hover:translate-y-0 focus-within:translate-y-0 transition-transform duration-400 ease-out">
          <div className="flex">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex-1 h-10 bg-black text-white text-[9px] tracking-button uppercase flex items-center justify-center gap-1.5 hover:bg-carbon transition-colors duration-300 disabled:bg-subtle disabled:cursor-not-allowed"
            >
              <Plus size={11} strokeWidth={2} />
              {outOfStock ? 'Sold Out' : 'Add to Bag'}
            </button>
            <button
              type="button"
              onClick={handleWishlist}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="w-10 h-10 bg-white text-black border-l border-line flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300"
            >
              <Heart size={13} strokeWidth={1.6} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="pt-4 pb-2">
        {(category || subcategory) && (
          <p className="text-[9px] tracking-[0.3em] uppercase text-black/30 mb-1.5">
            {[category, subcategory].filter(Boolean).join(' / ')}
          </p>
        )}
        <h3 className="text-sm font-medium leading-tight mb-2 transition-opacity duration-300 group-hover:opacity-60">
          <Link to={`/product/${id}`}>{title}</Link>
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm tabular-nums">
            {typeof price === 'string' && price.trim().startsWith('Rs') ? price : formatPrice(price)}
          </span>
          {onSale && (
            <span className="text-xs text-black/30 line-through tabular-nums">
              {formatPrice(originalPrice)}
            </span>
          )}
          {color && <span className="ml-auto text-[10px] uppercase tracking-label text-black/30">{color}</span>}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
