import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Heart, Minus, Plus, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { gsap, reveal, getImageUrl, formatPrice } from '../lib/motion';
import { useStoreSettings, freeDeliveryText } from '../lib/storeSettings';
import ProductGrid from '../components/ProductGrid';
import {
  Container,
  Eyebrow,
  Button,
  ButtonLink,
  EmptyState,
  Spinner,
  SectionHeader,
} from '../components/ui/Primitives';

const ASSURANCES = [
  { icon: Truck, title: 'Free Delivery', delivery: true },
  { icon: ShieldCheck, title: 'Secure Checkout', body: 'Card payments handled by Stripe' },
  { icon: RotateCcw, title: 'Thirty Days', body: 'Unworn returns, no questions asked' },
];

const Chip = ({ active, onClick, children, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`min-w-[3rem] h-11 px-4 text-[10px] tracking-label uppercase border transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${
      active
        ? 'bg-black text-white border-black'
        : 'bg-white text-black/60 border-line hover:border-black hover:text-black'
    }`}
  >
    {children}
  </button>
);

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useAuth();
  const { showToast } = useToast();
  const freeDeliveryBody = freeDeliveryText(useStoreSettings(), {
    over: (amount) => `On every order above ${amount}`,
    always: 'On every order',
    fallback: 'On qualifying orders',
  });

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const rootRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setActiveImage(0);
      setSelectedSize('');
      setSelectedColor('');
      setQuantity(1);

      try {
        const res = await axios.get(`/admin/products/${productId}`);
        if (cancelled) return;
        setProduct(res.data);

        // Pull a few more pieces from the same category to close the page out.
        if (res.data?.category) {
          try {
            const more = await axios.get(
              `/admin/products/category/${encodeURIComponent(res.data.category)}`
            );
            if (!cancelled) {
              setRelated(
                (Array.isArray(more.data) ? more.data : [])
                  .filter((p) => String(p.id) !== String(productId))
                  .slice(0, 4)
              );
            }
          } catch {
            if (!cancelled) setRelated([]);
          }
        }
      } catch {
        if (!cancelled) setProduct(null);
      }
      if (!cancelled) setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  // A new colour means a new set of shots — start at the first one.
  useEffect(() => {
    setActiveImage(0);
  }, [selectedColor]);

  useLayoutEffect(() => {
    if (!product) return undefined;
    const ctx = gsap.context(() => {
      reveal('.pd-item', { stagger: 0.08, y: 40, start: 'top 95%', trigger: rootRef.current });
    }, rootRef);
    return () => ctx.revert();
  }, [product]);

  const allImages = useMemo(() => (Array.isArray(product?.images) ? product.images : []), [product]);
  const imageColors = useMemo(() => product?.imageColors || {}, [product]);

  /**
   * The shots for the chosen colour. Images with no colour recorded belong to
   * every colour, so a product saved before colours were assigned — or one
   * where only some shots are tagged — still shows a full gallery instead of
   * an empty frame.
   */
  const images = useMemo(() => {
    if (!selectedColor) return allImages;
    const forColor = allImages.filter((url) => imageColors[url] === selectedColor);
    return forColor.length ? forColor : allImages;
  }, [allImages, imageColors, selectedColor]);
  const colors = useMemo(() => (Array.isArray(product?.colors) ? product.colors : []), [product]);
  const sizes = useMemo(() => (Array.isArray(product?.sizes) ? product.sizes : []), [product]);
  const features = useMemo(() => (Array.isArray(product?.features) ? product.features : []), [product]);

  if (loading) {
    return (
      <div className="pt-32 md:pt-40">
        <Spinner label="Loading piece" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-28 md:pt-40">
        <Container>
          <EmptyState
            eyebrow="Not found"
            title="This piece has moved on"
            body="It may have sold out or been retired from the collection."
            action={<ButtonLink to="/latest" variant="outline">Browse the Collection</ButtonLink>}
          />
        </Container>
      </div>
    );
  }

  const outOfStock = product.availability === 'out-of-stock';
  const wishlisted = isInWishlist(product.id);
  const safeIndex = activeImage < images.length ? activeImage : 0;
  const mainImage = images.length ? getImageUrl(images[safeIndex]) : '';
  const onSale = Number(product.originalPrice) > Number(product.price);
  const discount = onSale
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (outOfStock) {
      showToast('This piece is sold out', 'error');
      return;
    }
    if (sizes.length > 0 && !selectedSize) {
      showToast('Please choose a size', 'error');
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      showToast('Please choose a colour', 'error');
      return;
    }

    addToCart({
      ...product,
      title: product.title || product.name,
      selectedSize,
      selectedColor,
      quantity,
      image: images.length ? images[safeIndex] : '',
    });
    showToast('Added to your bag', 'success');
  };

  return (
    <div ref={rootRef}>
      {/* Breadcrumb */}
      <div className="pt-24 sm:pt-28 md:pt-32 pb-6">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2.5 text-[10px] tracking-label uppercase text-black/40 hover:text-black transition-colors duration-300"
            >
              <ArrowLeft size={13} strokeWidth={1.5} />
              Back
            </button>
            <p className="text-[10px] tracking-label uppercase text-black/25">
              {[product.category, product.subcategory].filter(Boolean).join(' / ')}
            </p>
          </div>
        </Container>
      </div>

      <Container className="pb-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Gallery */}
          <div className="lg:col-span-7 pd-item">
            <div className="flex flex-col-reverse sm:flex-row gap-4">
              {images.length > 1 && (
                <div className="flex sm:flex-col gap-3 sm:w-20 shrink-0 overflow-x-auto no-scrollbar">
                  {images.map((image, i) => (
                    <button
                      key={image + i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={`relative w-16 sm:w-full aspect-[4/5] shrink-0 overflow-hidden bg-muted border transition-colors duration-300 ${
                        safeIndex === i ? 'border-black' : 'border-transparent hover:border-line'
                      }`}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover object-top"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex-1 relative overflow-hidden bg-muted aspect-[4/5]">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={product.title || product.name}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center font-playfair text-5xl font-light text-black/15">
                    {(product.name || '?').charAt(0)}
                  </span>
                )}

                {outOfStock && (
                  <span className="absolute top-4 left-4 bg-black text-white text-[8px] tracking-label uppercase px-2 py-1">
                    Sold Out
                  </span>
                )}
                {onSale && !outOfStock && (
                  <span className="absolute top-4 left-4 bg-black text-white text-[8px] tracking-label uppercase px-2 py-1">
                    {discount}% Off
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-5 lg:pt-6">
            <div className="pd-item mb-4">
              <Eyebrow>{product.subcategory || product.category || 'Piece'}</Eyebrow>
            </div>

            <h1
              className="pd-item font-playfair text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-[1.1] mb-5"
            >
              {product.title || product.name}
            </h1>

            <div className="pd-item flex items-baseline gap-3 mb-8">
              <span className="text-lg tabular-nums">{formatPrice(product.price)}</span>
              {onSale && (
                <span className="text-sm text-black/30 line-through tabular-nums">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="ml-auto text-[10px] tracking-label uppercase text-black/40">
                {outOfStock ? 'Sold Out' : 'In Stock'}
              </span>
            </div>

            {product.description && (
              <p className="pd-item text-sm leading-relaxed text-black/55 mb-9">
                {product.description}
              </p>
            )}

            {/* Colour */}
            {colors.length > 0 && (
              <div className="pd-item mb-8">
                <div className="flex items-baseline justify-between mb-4">
                  <Eyebrow>Colour</Eyebrow>
                  {selectedColor && (
                    <span className="text-[10px] tracking-label uppercase text-black/50">
                      {selectedColor}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <Chip
                      key={color}
                      active={selectedColor === color}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {sizes.length > 0 && (
              <div className="pd-item mb-8">
                <div className="flex items-baseline justify-between mb-4">
                  <Eyebrow>Size</Eyebrow>
                  <Link
                    to="/aboutus"
                    className="text-[10px] tracking-label uppercase text-black/40 hover:text-black transition-colors duration-300 pb-0.5 border-b border-transparent hover:border-black"
                  >
                    Size Guide
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <Chip key={size} active={selectedSize === size} onClick={() => setSelectedSize(size)}>
                      {size}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="pd-item mb-8">
              <div className="mb-4">
                <Eyebrow>Quantity</Eyebrow>
              </div>
              <div className="inline-flex items-center border border-line">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="w-11 h-11 flex items-center justify-center text-black/50 hover:text-black hover:bg-muted transition-colors duration-300 disabled:opacity-25"
                >
                  <Minus size={13} strokeWidth={1.5} />
                </button>
                <span className="w-12 text-center text-sm tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  disabled={quantity >= 10}
                  aria-label="Increase quantity"
                  className="w-11 h-11 flex items-center justify-center text-black/50 hover:text-black hover:bg-muted transition-colors duration-300 disabled:opacity-25"
                >
                  <Plus size={13} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pd-item flex gap-3 mb-10">
              <Button onClick={handleAddToCart} disabled={outOfStock} className="flex-1 !px-4 h-14">
                {outOfStock ? 'Sold Out' : 'Add to Bag'}
              </Button>
              <button
                type="button"
                onClick={() => {
                  toggleWishlist(product);
                  showToast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist', 'success');
                }}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                className={`w-14 h-14 border flex items-center justify-center transition-colors duration-300 ${
                  wishlisted
                    ? 'bg-black text-white border-black'
                    : 'border-line text-black hover:border-black'
                }`}
              >
                <Heart size={16} strokeWidth={1.5} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="pd-item border-t border-line pt-7 mb-7">
                <div className="mb-4">
                  <Eyebrow>Details</Eyebrow>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {features.map((f, i) => (
                    <li key={i} className="flex gap-3 text-[13px] text-black/55 leading-relaxed">
                      <span className="mt-2 w-1 h-1 bg-black/25 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Assurances */}
            <div className="pd-item border-t border-line divide-y divide-line">
              {ASSURANCES.map((assurance) => (
                <div key={assurance.title} className="flex items-start gap-4 py-4">
                  <assurance.icon size={16} strokeWidth={1.4} className="mt-0.5 text-black/40 shrink-0" />
                  <div>
                    <p className="text-[11px] tracking-label uppercase mb-1">{assurance.title}</p>
                    <p className="text-[12px] text-black/40">
                      {assurance.delivery ? freeDeliveryBody : assurance.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-20 md:py-28 bg-secondary">
          <Container>
            <SectionHeader
              eyebrow="Also in this collection"
              title="You may also like"
              action="View All"
              actionTo={`/${String(product.category || '').toLowerCase()}`}
            />
            <ProductGrid products={related} />
          </Container>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
