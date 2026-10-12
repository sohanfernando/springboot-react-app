import React, { useEffect } from 'react';
import { Check, AlertCircle, Info, X } from 'lucide-react';

const ICONS = {
  success: Check,
  error: AlertCircle,
  info: Info,
};

/**
 * One toast style for the whole app. It used to render two ways — a refined
 * one for the storefront and the original rounded/coloured one for admin —
 * but the admin now shares the same design language, so the branch is gone.
 */
const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [duration, onClose]);

  const Icon = ICONS[type] || Check;
  const isError = type === 'error';

  return (
    <div
      role="alert"
      className={`flex items-center gap-4 min-w-[280px] max-w-sm px-5 py-4 border font-inter ${
        isError ? 'bg-white text-rose-600 border-rose-500' : 'bg-void text-white border-void'
      }`}
      style={{ animation: 'slideInRight 0.4s cubic-bezier(0.76, 0, 0.24, 1)' }}
    >
      <Icon size={15} strokeWidth={1.6} className="shrink-0" />
      <p className="flex-1 text-[11px] tracking-label uppercase leading-relaxed">{message}</p>
      <button
        onClick={onClose}
        aria-label="Dismiss"
        className="shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-200"
      >
        <X size={14} strokeWidth={1.6} />
      </button>
    </div>
  );
};

export default Toast;
