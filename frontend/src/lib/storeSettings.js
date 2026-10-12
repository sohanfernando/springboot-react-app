import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatPrice } from './format';

/**
 * Delivery fee, free-delivery threshold and cash-on-delivery limit live on the
 * server, where an administrator can change them. Nothing here holds a figure
 * of its own; it only fetches them, once per page load, for display.
 */
let pending = null;

export const loadStoreSettings = () => {
  if (!pending) {
    pending = axios
      .get('/api/settings')
      .then((res) => res.data)
      .catch((err) => {
        pending = null; // let the next caller retry
        throw err;
      });
  }
  return pending;
};

/** Call after saving new settings so the next read is fresh. */
export const clearStoreSettingsCache = () => {
  pending = null;
};

/** The current settings, or null until they have loaded. */
export const useStoreSettings = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loadStoreSettings()
      .then((data) => {
        if (!cancelled) setSettings(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
};

/**
 * Wording for a free-delivery promise. `over` receives the formatted
 * threshold; `always` is used when the delivery fee is zero; `fallback` is
 * shown until the settings arrive, so no figure is ever guessed.
 */
export const freeDeliveryText = (settings, { over, always, fallback }) => {
  if (!settings) return fallback;
  if (Number(settings.shippingFee) === 0) return always;
  return over(formatPrice(settings.freeShippingThreshold));
};
