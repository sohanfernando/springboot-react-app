import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Package, ClipboardList, CreditCard, Users, ArrowRight } from 'lucide-react';
import { formatPrice } from '../lib/format';
import {
  Card,
  PageHeading,
  Table,
  Row,
  Cell,
  Status,
  Loading,
  ButtonLink,
} from '../components/admin/AdminUI';

const countOf = (data) => {
  if (Array.isArray(data)) return data.length;
  if (Array.isArray(data?.content)) return data.content.length;
  return 0;
};

const listOf = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
};

const TILES = [
  { key: 'products', label: 'Products', icon: Package, to: '/admin/catalog', action: 'Manage catalogue' },
  { key: 'orders', label: 'Orders', icon: ClipboardList, to: '/admin/orders', action: 'Manage orders' },
  { key: 'payments', label: 'Payments', icon: CreditCard, to: '/admin/payments', action: 'View payments' },
  { key: 'users', label: 'Customers', icon: Users, to: '/admin/users', action: 'View customers' },
];

const AdminHomePage = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, payments: 0 });
  const [revenue, setRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const [products, orders, users, payments] = await Promise.all([
          axios.get('/admin/products'),
          axios.get('/api/orders'),
          axios.get('/users'),
          axios.get('/api/payments'),
        ]);
        if (cancelled) return;

        setStats({
          products: countOf(products.data),
          orders: countOf(orders.data),
          users: countOf(users.data),
          payments: countOf(payments.data),
        });

        // Only settled payments count toward takings.
        setRevenue(
          listOf(payments.data)
            .filter((p) => String(p.paymentStatus || '').toLowerCase() === 'success')
            .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
        );

        setRecentOrders([...listOf(orders.data)].sort((a, b) => b.id - a.id).slice(0, 6));
      } catch {
        if (!cancelled) {
          setStats({ products: 0, orders: 0, users: 0, payments: 0 });
          setRecentOrders([]);
        }
      }
      if (!cancelled) setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageHeading
        eyebrow="Overview"
        title="Dashboard"
        meta={loading ? 'Loading' : `${formatPrice(revenue)} collected across ${stats.payments} payments`}
      />

      {/* Counts */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        {TILES.map((tile) => (
          <Link key={tile.key} to={tile.to} className="group">
            <Card className="h-full p-5 transition-colors duration-200 group-hover:border-black">
              <div className="flex items-start justify-between mb-6">
                <tile.icon size={17} strokeWidth={1.5} className="text-black/35" />
                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  className="text-black/20 group-hover:text-black group-hover:translate-x-1 transition-all duration-200"
                />
              </div>
              <p className="text-3xl font-light tabular-nums leading-none mb-2">
                {loading ? '—' : stats[tile.key]}
              </p>
              <p className="text-[10px] tracking-label uppercase text-black/40">{tile.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Takings */}
      <Card className="p-5 mb-8 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-label uppercase text-black/40 mb-2">Revenue collected</p>
          <p className="text-2xl font-light tabular-nums">
            {loading ? '—' : formatPrice(revenue)}
          </p>
        </div>
        <p className="text-[11px] text-black/40 max-w-sm">
          Successful payments only. Pending and failed attempts are excluded.
        </p>
      </Card>

      {/* Recent orders */}
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-[11px] tracking-label uppercase text-black/45">Latest orders</h2>
        <ButtonLink to="/admin/orders" tone="quiet" size="sm">
          All orders
        </ButtonLink>
      </div>

      {loading ? (
        <Card>
          <Loading label="Loading orders" />
        </Card>
      ) : (
        <Table
          headers={['Order', 'Recipient', 'Destination', 'Status', 'Total']}
          empty="No orders have been placed yet."
        >
          {recentOrders.map((order) => (
            <Row key={order.id}>
              <Cell className="tabular-nums text-black">#{order.id}</Cell>
              <Cell>{order.recipientName || '—'}</Cell>
              <Cell className="text-black/50">{order.city || '—'}</Cell>
              <Cell>
                <Status value={order.status || 'processing'} />
              </Cell>
              <Cell className="tabular-nums">{formatPrice(order.total)}</Cell>
            </Row>
          ))}
        </Table>
      )}
    </>
  );
};

export default AdminHomePage;
