import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { X, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { gsap, reveal, getImageUrl, formatPrice } from '../lib/motion';
import { useStoreSettings, freeDeliveryText } from '../lib/storeSettings';
import {
  Container,
  PageHeader,
  Eyebrow,
  Button,
  ButtonLink,
  EmptyState,
} from '../components/ui/Primitives';

const priceOf = (value) =>
  typeof value === 'string' ? Number(value.replace(/[^0-9.]/g, '')) : Number(value ?? 0);

const CartPage = () => {
  const { cart, removeFromCart, updateCartQuantity, getCartCount, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const rootRef = useRef(null);

  // Subtotal, delivery and total are priced by the server from the catalogue
  // and the store's current settings; this page only displays the answer.
  const [quote, setQuote] = useState(null);
  const [quoteError, setQuoteError] = useState('');
  const bagKey = cart.map((item) => `${item.id}:${item.quantity}`).join(',');

  useEffect(() => {
    if (!bagKey) return undefined;
    let cancelled = false;
    setQuoteError('');
    axios
      .post('/api/orders/quote', { items: cart.map(({ id, quantity }) => ({ id, quantity })) })
      .then((res) => {
        if (!cancelled) setQuote(res.data);
      })
      .catch((err) => {
        if (cancelled) return;
        setQuote(null);
        setQuoteError(err.response?.data?.message || 'We could not price your bag. Please try again.');
      });
    return () => {
      cancelled = true;
    };
    // bagKey captures every change to the bag that affects its price.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bagKey]);

  const subtotal = Number(quote?.subtotal ?? 0);
  const shipping = Number(quote?.shipping ?? 0);
  const remaining = Number(quote?.remainingForFreeShipping ?? 0);
  const threshold = Number(quote?.freeShippingThreshold ?? 0);
  const settings = useStoreSettings();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      reveal('.cart-row', { stagger: 0.07, y: 40, start: 'top 95%', trigger: rootRef.current });
    }, rootRef);
    return () => ctx.revert();
  }, [cart.length]);

  const handleCheckout = () => {
    if (!user) {
      setError('Please sign in to complete your order.');
      return;
    }
    navigate('/payment', { state: { cart, user } });
  };

  if (cart.length === 0) {
    return (
      <>
        <PageHeader eyebrow="Your Bag" title="Shopping Bag" meta="Empty" />
        <Container>
          <EmptyState
            eyebrow="Nothing yet"
            title="Your bag is empty"
            body="Everything you add will wait here until you're ready."
            action={<ButtonLink to="/latest">Start Shopping</ButtonLink>}
          />
        </Container>
      </>
    );
  }

  return (
    <div ref={rootRef}>
      <PageHeader
        eyebrow="Your Bag"
        title="Shopping Bag"
        meta={`${getCartCount()} ${getCartCount() === 1 ? 'piece' : 'pieces'}`}
      />

      <Container className="pb-24 md:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Line items */}
          <div className="lg:col-span-8">
            <div className="border-t border-line">
              {cart.map((item) => {
                const unit = priceOf(item.price);
                const size = item.selectedSize || item.sizes?.[0];
                const colour = item.selectedColor || item.color;

                return (
                  <div
                    key={item.id}
                    className="cart-row flex gap-4 sm:gap-6 py-6 border-b border-line"
                  >
                    <Link
                      to={`/product/${item.id}`}
                      className="relative w-20 sm:w-24 shrink-0 aspect-[4/5] overflow-hidden bg-muted"
                    >
                      {getImageUrl(item.image) ? (
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title || item.name}
                          className="absolute inset-0 w-full h-full object-cover object-top"
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center font-playfair text-xl text-black/15">
                          {(item.title || item.name || '?').charAt(0)}
                        </span>
                      )}
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-sm font-medium leading-tight mb-1.5 truncate">
                            <Link to={`/product/${item.id}`} className="hover:opacity-60 transition-opacity duration-300">
                              {item.title || item.name}
                            </Link>
                          </h3>
                          <p className="text-[10px] tracking-label uppercase text-black/35">
                            {[colour, size].filter(Boolean).join(' · ') || 'One size'}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove from bag"
                          className="shrink-0 text-black/30 hover:text-black transition-colors duration-300"
                        >
                          <X size={16} strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="mt-auto pt-4 flex items-end justify-between gap-4">
                        <div className="inline-flex items-center border border-line">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="w-9 h-9 flex items-center justify-center text-black/50 hover:text-black hover:bg-muted transition-colors duration-300"
                          >
                            <Minus size={12} strokeWidth={1.5} />
                          </button>
                          <span className="w-10 text-center text-[13px] tabular-nums">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="w-9 h-9 flex items-center justify-center text-black/50 hover:text-black hover:bg-muted transition-colors duration-300"
                          >
                            <Plus size={12} strokeWidth={1.5} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm tabular-nums">{formatPrice(unit * item.quantity)}</p>
                          {item.quantity > 1 && (
                            <p className="text-[11px] text-black/30 tabular-nums mt-0.5">
                              {formatPrice(unit)} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              to="/latest"
              className="inline-flex items-center gap-2.5 mt-8 text-[10px] tracking-label uppercase text-black/40 hover:text-black transition-colors duration-300"
            >
              <ArrowLeft size={13} strokeWidth={1.5} />
              Continue shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="cart-row lg:sticky lg:top-28 border border-line p-6 md:p-7">
              <div className="mb-6">
                <Eyebrow>Order Summary</Eyebrow>
              </div>

              <div className="flex flex-col gap-3 text-[13px] pb-5 border-b border-line">
                <div className="flex justify-between">
                  <span className="text-black/50">Subtotal</span>
                  <span className="tabular-nums">{quote ? formatPrice(subtotal) : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Delivery</span>
                  <span className="tabular-nums">
                    {!quote ? '—' : shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline py-5">
                <span className="text-[10px] tracking-label uppercase">Total</span>
                <span className="font-playfair text-2xl font-light tabular-nums">
                  {quote ? formatPrice(quote.total) : '—'}
                </span>
              </div>

              {quoteError && (
                <p className="mb-6 border-l-2 border-destructive pl-4 py-2 text-[12px] text-destructive">
                  {quoteError}
                </p>
              )}

              {remaining > 0 && threshold > 0 && (
                <div className="mb-6">
                  <div className="h-px w-full bg-line mb-3">
                    <div
                      className="h-full bg-black transition-all duration-700"
                      style={{ width: `${Math.min(100, (subtotal / threshold) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-black/40">
                    Add {formatPrice(remaining)} for free delivery.
                  </p>
                </div>
              )}

              <Button onClick={handleCheckout} disabled={!quote} className="w-full !px-4 h-14">
                Proceed to Checkout
              </Button>

              {error && (
                <p className="mt-4 text-[11px] tracking-label uppercase text-destructive">
                  {error}{' '}
                  <Link to="/login" className="underline underline-offset-4">
                    Sign in
                  </Link>
                </p>
              )}

              <p className="mt-6 text-[11px] leading-relaxed text-black/35">
                {freeDeliveryText(settings, {
                  over: (amount) => `Free delivery above ${amount}. `,
                  always: 'Free delivery on every order. ',
                  fallback: '',
                })}
                Standard delivery takes 3–5 business days from our Colombo studio.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
