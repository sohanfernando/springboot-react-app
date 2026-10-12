import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Eye } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { getImageUrl, formatPrice } from '../lib/format';
import {
  Card,
  PageHeading,
  Table,
  Row,
  Cell,
  Status,
  Loading,
  Button,
  Input,
  Select,
  Modal,
  ConfirmDialog,
} from '../components/admin/AdminUI';

const STATUSES = [
  ['processing', 'Processing'],
  ['confirmed', 'Confirmed'],
  ['shipped', 'Shipped'],
  ['delivered', 'Delivered'],
];

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

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/orders');
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { id } = pendingDelete;
    setDeleting(true);
    try {
      await axios.delete(`/api/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      if (selected?.id === id) setSelected(null);
      setPendingDelete(null);
      showToast('Order deleted', 'success');
    } catch {
      showToast('Could not delete that order', 'error');
    }
    setDeleting(false);
  };

  const handleStatusChange = async (order, status) => {
    try {
      await axios.patch(`/api/orders/${order.id}/status`, status, {
        headers: { 'Content-Type': 'text/plain' },
      });
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
      setSelected((prev) => (prev && prev.id === order.id ? { ...prev, status } : prev));
      showToast(`Order #${order.id} marked ${status}`, 'success');
    } catch {
      showToast('Could not update the status', 'error');
    }
  };

  const q = search.trim().toLowerCase();
  const visible = orders.filter((order) => {
    if (statusFilter !== 'all' && (order.status || 'processing') !== statusFilter) return false;
    if (!q) return true;
    return [order.id, order.recipientName, order.city, order.address, order.userId]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(q);
  });

  const selectedItems = parseItems(selected?.items);

  return (
    <>
      <PageHeading
        eyebrow="Fulfilment"
        title="Orders"
        meta={loading ? 'Loading' : `${visible.length} of ${orders.length} orders`}
      >
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search recipient, city, id"
          className="w-56"
        />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          {STATUSES.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
      </PageHeading>

      {loading ? (
        <Card><Loading label="Loading orders" /></Card>
      ) : (
        <Table
          headers={['Order', 'Recipient', 'Destination', 'Total', 'Status', '']}
          empty={q || statusFilter !== 'all' ? 'No orders match those filters.' : 'No orders yet.'}
        >
          {visible.map((order) => (
            <Row key={order.id}>
              <Cell className="tabular-nums text-black">#{order.id}</Cell>
              <Cell>
                <span className="block text-black">{order.recipientName || '—'}</span>
                <span className="block text-[11px] text-black/40 tabular-nums">
                  User {order.userId}
                </span>
              </Cell>
              <Cell className="text-black/50 max-w-[16rem] truncate">
                {[order.address, order.city, order.postalCode].filter(Boolean).join(', ') || '—'}
              </Cell>
              <Cell className="tabular-nums">{formatPrice(order.total)}</Cell>
              <Cell>
                <div className="flex items-center gap-3">
                  <Status value={order.status || 'processing'} />
                  <Select
                    size="sm"
                    value={order.status || 'processing'}
                    onChange={(e) => handleStatusChange(order, e.target.value)}
                    aria-label={`Status for order ${order.id}`}
                  >
                    {STATUSES.map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </Select>
                </div>
              </Cell>
              <Cell>
                <div className="flex items-center justify-end gap-2">
                  <Button tone="outline" size="sm" onClick={() => setSelected(order)}>
                    <Eye size={13} strokeWidth={1.6} />
                    View
                  </Button>
                  <Button
                    tone="danger"
                    size="sm"
                    onClick={() => setPendingDelete(order)}
                    aria-label={`Delete order ${order.id}`}
                  >
                    <Trash2 size={13} strokeWidth={1.6} />
                  </Button>
                </div>
              </Cell>
            </Row>
          ))}
        </Table>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete order"
          confirmLabel="Delete order"
          busy={deleting}
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
          body={
            <>
              Order <strong className="font-medium text-black">#{pendingDelete.id}</strong> for{' '}
              <strong className="font-medium text-black">
                {pendingDelete.recipientName || 'this customer'}
              </strong>{' '}
              will be permanently deleted. The payment record is not affected.
            </>
          }
        />
      )}

      {selected && (
        <Modal title={`Order #${selected.id}`} onClose={() => setSelected(null)}>
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 pb-6 border-b border-line">
            {[
              ['Recipient', selected.recipientName],
              ['Customer ID', selected.userId],
              ['Status', selected.status || 'processing'],
              ['Total', formatPrice(selected.total)],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] tracking-label uppercase text-black/40 mb-1.5">{label}</p>
                <p className="text-[13px]">{value ?? '—'}</p>
              </div>
            ))}
            <div className="col-span-2">
              <p className="text-[10px] tracking-label uppercase text-black/40 mb-1.5">
                Shipping address
              </p>
              <p className="text-[13px] leading-relaxed">
                {[selected.address, selected.city, selected.postalCode]
                  .filter(Boolean)
                  .join(', ') || '—'}
              </p>
            </div>
          </div>

          <p className="text-[10px] tracking-label uppercase text-black/40 mt-6 mb-4">
            {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}
          </p>

          <div className="flex flex-col gap-4">
            {selectedItems.map((item, i) => (
              <div key={`${item.id ?? 'item'}-${i}`} className="flex items-center gap-4">
                <div className="relative w-12 h-14 shrink-0 bg-muted overflow-hidden">
                  {getImageUrl(item.image) ? (
                    <img
                      src={getImageUrl(item.image)}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] truncate">{item.title || item.name}</p>
                  <p className="text-[11px] text-black/40 mt-0.5">
                    {[item.selectedColor || item.color, item.selectedSize || item.sizes?.[0]]
                      .filter(Boolean)
                      .join(' · ')}
                    {item.quantity ? ` · Qty ${item.quantity}` : ''}
                  </p>
                </div>
                <span className="text-[13px] tabular-nums shrink-0">{formatPrice(item.price)}</span>
              </div>
            ))}
            {selectedItems.length === 0 && (
              <p className="text-[13px] text-black/40">Item details could not be read.</p>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default AdminOrdersPage;
