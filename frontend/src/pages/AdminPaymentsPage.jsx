import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, RotateCw } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../lib/format';
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
  ConfirmDialog,
} from '../components/admin/AdminUI';

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/payments');
      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch {
      setPayments([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { id } = pendingDelete;
    setDeleting(true);
    try {
      await axios.delete(`/api/payments/${id}`);
      setPayments((prev) => prev.filter((p) => p.id !== id));
      setPendingDelete(null);
      showToast('Payment deleted', 'success');
    } catch {
      showToast('Could not delete that payment', 'error');
    }
    setDeleting(false);
  };

  const q = search.trim().toLowerCase();
  const visible = q
    ? payments.filter((p) =>
        [p.recipientName, p.paymentMethod, p.paymentStatus, p.transactionId, p.orderId, p.id]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(q)
      )
    : payments;

  const collected = visible
    .filter((p) => String(p.paymentStatus || '').toLowerCase() === 'success')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return (
    <>
      <PageHeading
        eyebrow="Finance"
        title="Payments"
        meta={
          loading
            ? 'Loading'
            : `${visible.length} of ${payments.length} · ${formatPrice(collected)} collected`
        }
      >
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search recipient, method, transaction"
          className="w-64"
        />
        <Button tone="outline" onClick={fetchPayments} disabled={loading}>
          <RotateCw size={13} strokeWidth={1.6} />
          Refresh
        </Button>
      </PageHeading>

      {loading ? (
        <Card><Loading label="Loading payments" /></Card>
      ) : (
        <Table
          headers={['ID', 'Recipient', 'Method', 'Status', 'Amount', 'Order', 'Transaction', 'Date', '']}
          empty={q ? `Nothing matches "${search}".` : 'No payments recorded yet.'}
        >
          {visible.map((payment) => (
            <Row key={payment.id}>
              <Cell className="tabular-nums text-black/40">{payment.id}</Cell>
              <Cell className="text-black">{payment.recipientName || '—'}</Cell>
              <Cell className="text-black/60">{payment.paymentMethod || '—'}</Cell>
              <Cell><Status value={payment.paymentStatus} /></Cell>
              <Cell className="tabular-nums">{formatPrice(payment.amount)}</Cell>
              <Cell className="tabular-nums text-black/50">
                {payment.orderId ? `#${payment.orderId}` : '—'}
              </Cell>
              <Cell>
                <span
                  className="block max-w-[12rem] truncate text-[11px] text-black/45"
                  title={payment.transactionId || ''}
                >
                  {payment.transactionId || '—'}
                </span>
              </Cell>
              <Cell className="text-black/50 whitespace-nowrap">
                {payment.paymentDate
                  ? new Date(payment.paymentDate).toLocaleDateString(undefined, {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '—'}
              </Cell>
              <Cell>
                <div className="flex justify-end">
                  <Button
                    tone="danger"
                    size="sm"
                    onClick={() => setPendingDelete(payment)}
                    aria-label={`Delete payment ${payment.id}`}
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
          title="Delete payment"
          confirmLabel="Delete payment"
          busy={deleting}
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
          body={
            <>
              Payment <strong className="font-medium text-black">#{pendingDelete.id}</strong> of{' '}
              <strong className="font-medium text-black">{formatPrice(pendingDelete.amount)}</strong>{' '}
              will be permanently deleted. This only removes the record here — it does not refund
              anything in Stripe.
            </>
          }
        />
      )}
    </>
  );
};

export default AdminPaymentsPage;
