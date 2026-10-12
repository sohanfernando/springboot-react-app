import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, X, AlertTriangle } from 'lucide-react';

/**
 * Admin primitives.
 *
 * The admin shares the storefront's foundation — Inter, square corners,
 * hairline #dadada rules, greyscale surfaces — so the two read as one product.
 * Where it deliberately diverges is status: a console has to show at a glance
 * what needs attention, so semantic colour is allowed here, confined to small
 * dots and never used as decoration. That keeps colour meaningful rather than
 * the wash of purple/blue/pink/green gradients this replaced.
 */

export const Card = ({ className = '', children }) => (
  <div className={`bg-white border border-line ${className}`}>{children}</div>
);

export const PageHeading = ({ eyebrow, title, meta, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
    <div>
      {eyebrow && (
        <p className="text-[10px] tracking-eyebrow uppercase text-black/35 mb-2">{eyebrow}</p>
      )}
      <h1 className="text-2xl font-medium tracking-tight">{title}</h1>
      {meta && <p className="text-[12px] text-black/45 mt-1.5 tabular-nums">{meta}</p>}
    </div>
    {children && <div className="flex items-center gap-3">{children}</div>}
  </div>
);

/* ---------------------------------------------------------------- buttons -- */

const base =
  'inline-flex items-center justify-center gap-2 text-[11px] tracking-label uppercase font-medium transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap';

const tones = {
  solid: 'bg-black text-white hover:bg-carbon',
  outline: 'border border-line text-black hover:border-black hover:bg-muted',
  quiet: 'text-black/50 hover:text-black',
  danger: 'border border-line text-rose-600 hover:border-rose-600 hover:bg-rose-50',
  destructive: 'bg-rose-600 text-white hover:bg-rose-700',
};

export const Button = React.forwardRef(
  ({ tone = 'solid', size = 'md', className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      className={`${base} ${tones[tone]} ${size === 'sm' ? 'h-8 px-3' : 'h-10 px-5'} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = 'Button';

export const ButtonLink = ({ to, tone = 'solid', size = 'md', className = '', children }) => (
  <Link
    to={to}
    className={`${base} ${tones[tone]} ${size === 'sm' ? 'h-8 px-3' : 'h-10 px-5'} ${className}`}
  >
    {children}
  </Link>
);

/* ----------------------------------------------------------------- inputs -- */

export const Input = ({ className = '', ...props }) => (
  <input
    className={`h-10 px-3 bg-white border border-line text-[13px] text-black placeholder:text-black/30 focus:outline-none focus:border-black transition-colors duration-200 ${className}`}
    {...props}
  />
);

const SELECT_SIZES = {
  xs: { field: 'h-7 pl-2 pr-6 text-[10px]', chevron: 'right-1.5', icon: 11 },
  sm: { field: 'h-8 pl-2.5 pr-7 text-[11px]', chevron: 'right-2', icon: 12 },
  md: { field: 'h-10 pl-3 pr-8 text-[12px]', chevron: 'right-2.5', icon: 14 },
};

/**
 * A native <select> with the platform arrow suppressed and our own chevron
 * drawn in its place, so the indicator sits where the design puts it and can
 * turn when the list opens.
 *
 * "Open" has no CSS state on a native select, so it is tracked from the events
 * that actually open and close the list. The element stays a real <select>,
 * which keeps keyboard support and the native picker on mobile — worth far
 * more than a perfectly synced arrow.
 */
export const Select = ({
  className = '',
  size = 'md',
  onMouseDown,
  onBlur,
  onChange,
  onKeyDown,
  children,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const s = SELECT_SIZES[size] || SELECT_SIZES.md;

  return (
    <span className={`relative inline-block align-middle ${className}`}>
      <select
        {...props}
        onMouseDown={(e) => {
          setOpen((v) => !v);
          onMouseDown?.(e);
        }}
        onBlur={(e) => {
          setOpen(false);
          onBlur?.(e);
        }}
        onChange={(e) => {
          setOpen(false);
          onChange?.(e);
        }}
        onKeyDown={(e) => {
          if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) setOpen(true);
          if (e.key === 'Escape' || e.key === 'Tab') setOpen(false);
          onKeyDown?.(e);
        }}
        className={`block w-full appearance-none bg-white border border-line text-black focus:outline-none focus:border-black transition-colors duration-200 cursor-pointer ${s.field}`}
      >
        {children}
      </select>
      <ChevronDown
        size={s.icon}
        strokeWidth={1.8}
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${s.chevron} text-black/40 transition-transform duration-200 ${
          open ? 'rotate-180' : 'rotate-0'
        }`}
      />
    </span>
  );
};

export const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="block text-[10px] tracking-label uppercase text-black/45 mb-2">{label}</span>
    {children}
    {hint && <span className="block mt-1.5 text-[11px] text-black/40">{hint}</span>}
  </label>
);

/* ----------------------------------------------------------------- status -- */

const TONES = {
  delivered: 'bg-emerald-500',
  success: 'bg-emerald-500',
  paid: 'bg-emerald-500',
  shipped: 'bg-blue-500',
  confirmed: 'bg-indigo-500',
  processing: 'bg-amber-500',
  pending: 'bg-amber-500',
  failed: 'bg-rose-500',
  cancelled: 'bg-rose-500',
};

/** A dot carries the state; the label stays plain so tables read calmly. */
export const Status = ({ value, className = '' }) => {
  const key = String(value || '').toLowerCase();
  return (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap ${className}`}>
      <span className={`w-1.5 h-1.5 shrink-0 ${TONES[key] || 'bg-black/25'}`} />
      <span className="text-[11px] tracking-label uppercase text-black/70">{value || '—'}</span>
    </span>
  );
};

/* ------------------------------------------------------------------ table -- */

export const Table = ({ headers, children, empty, colSpan }) => (
  <Card className="overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-line">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left text-[10px] tracking-label uppercase text-black/40 font-medium px-5 py-3.5 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {React.Children.count(children) > 0 ? (
            children
          ) : (
            <tr>
              <td colSpan={colSpan || headers.length} className="px-5 py-16 text-center">
                <p className="text-[13px] text-black/40">{empty || 'Nothing here yet.'}</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </Card>
);

export const Row = ({ children }) => (
  <tr className="border-b border-line last:border-b-0 hover:bg-muted/60 transition-colors duration-150">
    {children}
  </tr>
);

export const Cell = ({ className = '', children }) => (
  <td className={`px-5 py-3.5 text-[13px] text-black/75 align-middle ${className}`}>{children}</td>
);

/* ------------------------------------------------------------------ misc --- */

export const Loading = ({ label = 'Loading' }) => (
  <div className="py-20 text-center">
    <span className="text-[10px] tracking-eyebrow uppercase text-black/35">{label}…</span>
  </div>
);

export const Modal = ({ title, onClose, children, footer, size = 'lg' }) => {
  // Escape closes, and the page behind must not scroll while it is open.
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 w-full h-full bg-black/50 cursor-default"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        className={`relative bg-white w-full ${
          size === 'sm' ? 'max-w-sm' : 'max-w-lg'
        } max-h-[90vh] flex flex-col border border-line shadow-2xl`}
      >
        <div className="shrink-0 flex items-start justify-between gap-4 px-6 py-5 border-b border-line">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-black/35 hover:text-black transition-colors duration-200"
          >
            <X size={18} strokeWidth={1.6} />
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="shrink-0 px-6 py-4 border-t border-line">{footer}</div>}
      </div>
    </div>
  );
};

/**
 * Confirmation for destructive actions, replacing window.confirm — which is
 * unstyled, blocks the whole tab, and cannot say which record is about to go.
 *
 * Cancel takes the initial focus deliberately: on a dialog whose primary
 * action is irreversible, a stray Enter should do nothing.
 */
export const ConfirmDialog = ({
  title = 'Are you sure?',
  body,
  confirmLabel = 'Delete',
  busy = false,
  onConfirm,
  onCancel,
}) => {
  const cancelRef = React.useRef(null);

  React.useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  return (
    <Modal
      size="sm"
      title={title}
      onClose={busy ? () => {} : onCancel}
      footer={
        <div className="flex justify-end gap-3">
          <Button ref={cancelRef} tone="outline" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button tone="destructive" onClick={onConfirm} disabled={busy}>
            {busy ? 'Deleting…' : confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="flex gap-4">
        <span className="shrink-0 w-9 h-9 border border-rose-200 bg-rose-50 flex items-center justify-center">
          <AlertTriangle size={16} strokeWidth={1.7} className="text-rose-600" />
        </span>
        <div className="text-[13px] leading-relaxed text-black/65">{body}</div>
      </div>
    </Modal>
  );
};
