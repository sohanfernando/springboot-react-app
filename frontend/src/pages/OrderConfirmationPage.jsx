import React, { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap, reveal, drawLine, getImageUrl, formatPrice } from '../lib/motion';
import {
  Container,
  PageHeader,
  Eyebrow,
  ButtonLink,
  EmptyState,
} from '../components/ui/Primitives';

const parseItems = (items) => {
  if (Array.isArray(items)) return items;
  if (typeof items === 'string') {
    try {
      const parsed = JSON.parse(items);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const OrderConfirmationPage = () => {
  const location = useLocation();
  const order = location.state?.order;
  const items = parseItems(order?.items);
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!order) return undefined;
    const ctx = gsap.context(() => {
      reveal('.oc-item', { stagger: 0.08, y: 40, start: 'top 98%', trigger: rootRef.current });
      drawLine('.oc-rule', { start: 'top 98%', trigger: rootRef.current });
    }, rootRef);
    return () => ctx.revert();
  }, [order]);

  if (!order) {
    return (
      <>
        <PageHeader eyebrow="Order" title="Confirmation" />
        <Container>
          <EmptyState
            eyebrow="Nothing to show"
            title="No order to confirm"
            body="If you've just ordered, you'll find it in your order history."
            action={<ButtonLink to="/orders">View Orders</ButtonLink>}
          />
        </Container>
      </>
    );
  }

  return (
    <div ref={rootRef}>
      <section className="pt-28 sm:pt-32 md:pt-40 pb-16 md:pb-20">
        <Container>
          <div className="max-w-2xl">
            <div className="oc-item mb-6">
              <Eyebrow>Order #{order.id}</Eyebrow>
            </div>

            <h1
              className="oc-item font-playfair text-[clamp(2.25rem,6vw,4.5rem)] font-light leading-[1.02] mb-8"
            >
              Thank you. It's on its way.
            </h1>

            <p className="oc-item text-sm leading-relaxed text-black/55 max-w-md">
              We've received your order and started picking it in the studio. You'll get an email
              the moment it leaves us — usually within a day.
            </p>

            <div className="oc-item mt-10 flex flex-wrap gap-3">
              <ButtonLink to="/orders">Track This Order</ButtonLink>
              <ButtonLink to="/latest" variant="outline">
                Continue Shopping
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <Container className="pb-24 md:pb-36">
        <div className="oc-rule h-px w-full bg-line origin-left mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Items */}
          <div className="lg:col-span-7">
            <div className="oc-item mb-6">
              <Eyebrow>{items.length} {items.length === 1 ? 'Piece' : 'Pieces'}</Eyebrow>
            </div>

            <div className="border-t border-line">
              {items.map((item, i) => {
                const colour = item.selectedColor || item.color;
                const size = item.selectedSize || item.sizes?.[0];

                return (
                  <div
                    key={`${item.id ?? 'item'}-${i}`}
                    className="oc-item flex items-center gap-4 py-5 border-b border-line"
                  >
                    <div className="relative w-14 h-[70px] shrink-0 overflow-hidden bg-muted">
                      {getImageUrl(item.image) ? (
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title || item.name}
                          className="absolute inset-0 w-full h-full object-cover object-top"
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center font-playfair text-black/15">
                          {(item.title || item.name || '?').charAt(0)}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate">{item.title || item.name}</p>
                      <p className="text-[10px] tracking-label uppercase text-black/35 mt-1">
                        {[colour, size].filter(Boolean).join(' · ') || 'One size'}
                        {item.quantity ? ` · Qty ${item.quantity}` : ''}
                      </p>
                    </div>

                    <span className="text-[13px] tabular-nums shrink-0">{formatPrice(item.price)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="oc-item border border-line p-6 md:p-7">
              <div className="mb-6">
                <Eyebrow>Summary</Eyebrow>
              </div>

              <div className="flex justify-between items-baseline pb-6 border-b border-line">
                <span className="text-[10px] tracking-label uppercase">Total Paid</span>
                <span className="font-playfair text-2xl font-light tabular-nums">
                  {formatPrice(order.total)}
                </span>
              </div>

              {(order.recipientName || order.address) && (
                <div className="pt-6">
                  <p className="text-[10px] tracking-label uppercase text-black/40 mb-3">
                    Shipping To
                  </p>
                  <div className="text-[13px] leading-relaxed text-black/60">
                    {order.recipientName && <p>{order.recipientName}</p>}
                    {order.address && <p>{order.address}</p>}
                    {(order.city || order.postalCode) && (
                      <p>{[order.city, order.postalCode].filter(Boolean).join(' ')}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
};

export default OrderConfirmationPage;
