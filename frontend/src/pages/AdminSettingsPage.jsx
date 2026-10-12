import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../lib/format';
import { clearStoreSettingsCache } from '../lib/storeSettings';
import { Card, PageHeading, Field, Input, Button, Loading } from '../components/admin/AdminUI';

const FIELDS = [
  {
    name: 'shippingFee',
    label: 'Delivery fee (Rs)',
    hint: 'Charged on orders that do not qualify for free delivery. Enter 0 to make delivery always free.',
  },
  {
    name: 'freeShippingThreshold',
    label: 'Free delivery above (Rs)',
    hint: 'Orders with a subtotal above this amount are delivered free.',
  },
  {
    name: 'codLimit',
    label: 'Cash on delivery limit (Rs)',
    hint: 'Orders with a total above this must be paid by card. Enter 0 to turn cash on delivery off.',
  },
];

const toForm = (settings) =>
  Object.fromEntries(FIELDS.map(({ name }) => [name, String(settings?.[name] ?? '')]));

const AdminSettingsPage = () => {
  const [saved, setSaved] = useState(null);
  const [form, setForm] = useState(toForm(null));
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    axios
      .get('/api/settings')
      .then((res) => {
        if (cancelled) return;
        setSaved(res.data);
        setForm(toForm(res.data));
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const body = Object.fromEntries(FIELDS.map(({ name }) => [name, Number(form[name])]));
      const res = await axios.put('/api/settings', body);
      setSaved(res.data);
      setForm(toForm(res.data));
      clearStoreSettingsCache();
      showToast('Settings saved', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the settings. Please try again.');
    }
    setSaving(false);
  };

  const unchanged = saved && FIELDS.every(({ name }) => Number(form[name]) === Number(saved[name]));

  return (
    <>
      <PageHeading
        eyebrow="Store"
        title="Settings"
        meta="Delivery charges and payment rules applied at checkout"
      />

      {loadError ? (
        <Card className="p-7">
          <p className="text-[13px] text-black/55">The settings could not be loaded. Refresh to try again.</p>
        </Card>
      ) : !saved ? (
        <Card><Loading label="Loading settings" /></Card>
      ) : (
        <Card className="p-7 max-w-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {FIELDS.map(({ name, label, hint }) => (
              <Field key={name} label={label} hint={hint}>
                <Input
                  type="number"
                  name={name}
                  min="0"
                  max="99999999"
                  step="0.01"
                  required
                  inputMode="decimal"
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full tabular-nums"
                />
              </Field>
            ))}

            {error && (
              <p className="border-l-2 border-rose-500 pl-3 py-2 text-[12px] text-rose-600">{error}</p>
            )}

            <div className="flex items-center justify-between gap-4 pt-5 border-t border-line">
              <p className="text-[11px] text-black/40">
                Currently: {formatPrice(saved.shippingFee)} delivery, free above{' '}
                {formatPrice(saved.freeShippingThreshold)}, cash up to {formatPrice(saved.codLimit)}.
              </p>
              <Button type="submit" disabled={saving || unchanged}>
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </>
  );
};

export default AdminSettingsPage;
