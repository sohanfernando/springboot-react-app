import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { gsap, reveal, getImageUrl, formatPrice } from '../lib/motion';
import {
  Container,
  PageHeader,
  Eyebrow,
  ButtonLink,
  EmptyState,
  Spinner,
} from '../components/ui/Primitives';

const STATUS_LABEL = {
  delivered: 'Delivered',
  shipped: 'Shipped',
  confirmed: 'Confirmed',
  processing: 'Processing',
};

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

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${window.API_BASE_URL}/api/orders/mine`);
        const mine = Array.isArray(res.data) ? res.data : [];
        if (!cancelled) setOrders(mine);
      } catch {
        if (!cancelled) setOrders([]);
      }
      if (!cancelled) setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      reveal('.order-row', { stagger: 0.08, y: 40, start: 'top 92%', trigger: rootRef.current });
    }, rootRef);
    return () => ctx.revert();
  }, [orders.length]);

  if (!user) {
    return (
      <>
        <PageHeader eyebrow="Account" title="Orders" />
        <Container>
          <EmptyState
            eyebrow="Sign in required"
            title="Your orders live behind the door"
            body="Sign in to see everything you've ordered and where it is."
            action={<ButtonLink to="/login">Sign In</ButtonLink>}
          />
        </Container>
      </>
    );
  }

  return (
    <div ref={rootRef}>
      <PageHeader
        eyebrow="Account"
        title="Orders"
        meta={loading ? 'Loading' : `${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`}
      />

      <Container className="pb-24 md:pb-36">
        {(() => {
          if (loading) return <Spinner label="Loading orders" />;

          if (!orders.length) {
            return (
              <EmptyState
                eyebrow="No history"
                title="You haven't ordered yet"
                body="Once you place an order it will appear here with its progress."
                action={<ButtonLink to="/latest">Start Shopping</ButtonLink>}
              />
            );
          }

          return (
            <div className="border-t border-line">
              {orders.map((order) => {
                const items = parseItems(order.items);
                const label = STATUS_LABEL[order.status] || 'Placed';

                return (
                  <article key={order.id} className="order-row py-8 border-b border-line">
                    <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
                      <div>
                        <Eyebrow>Order</Eyebrow>
                        <p className="font-playfair text-xl font-light mt-1.5">#{order.id}</p>
                      </div>

                      <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2.5 text-[10px] tracking-label uppercase text-black/50">
                          <span
                            className={`w-1.5 h-1.5 ${
                              order.status === 'delivered' ? 'bg-black' : 'bg-black/25'
                            }`}
                          />
                          {label}
                        </span>
                        <span className="text-sm tabular-nums">{formatPrice(order.total)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {items.map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
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
                              {[item.selectedColor || item.color, item.selectedSize || item.sizes?.[0]]
                                .filter(Boolean)
                                .join(' · ')}
                              {item.quantity ? ` · Qty ${item.quantity}` : ''}
                            </p>
                          </div>

                          <span className="text-[13px] tabular-nums shrink-0">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {(order.address || order.city) && (
                      <p className="mt-6 text-[11px] text-black/35">
                        Shipping to {[order.recipientName, order.address, order.city, order.postalCode]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          );
        })()}
      </Container>
    </div>
  );
};

export default OrdersPage;
