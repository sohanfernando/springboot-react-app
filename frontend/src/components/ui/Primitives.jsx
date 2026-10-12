import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, reveal, drawLine } from '../../lib/motion';

/* The container every section and page shares. */
export const Container = ({ className = '', children }) => (
  <div className={`max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-12 ${className}`}>{children}</div>
);

/* 10px, 0.5em tracked, 30% ink. The one label style. */
export const Eyebrow = ({ children, onDark = false, className = '' }) => (
  <p
    className={`text-[10px] tracking-eyebrow uppercase ${
      onDark ? 'text-white/40' : 'text-black/30'
    } ${className}`}
  >
    {children}
  </p>
);

export const Rule = ({ onDark = false, className = '' }) => (
  <span
    className={`block h-px w-full origin-left ${onDark ? 'bg-white/15' : 'bg-line'} ${className}`}
  />
);

/**
 * Every section header in the storefront is this shape: eyebrow, Playfair
 * headline, optional right-aligned link that underlines on hover.
 */
export const SectionHeader = ({ eyebrow, title, action, actionTo, onDark = false, className = '' }) => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      reveal('.sh-item', { stagger: 0.1, y: 40, start: 'top 85%', trigger: ref.current });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10 md:mb-16 ${className}`}
    >
      <div>
        {eyebrow && (
          <div className="sh-item mb-4">
            <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>
          </div>
        )}
        <h2
          className={`sh-item font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-tight ${
            onDark ? 'text-white' : 'text-black'
          }`}
        >
          {title}
        </h2>
      </div>

      {action && actionTo && (
        <Link
          to={actionTo}
          className={`sh-item shrink-0 text-[11px] tracking-[0.3em] uppercase pb-0.5 border-b border-transparent transition-colors duration-300 ${
            onDark
              ? 'text-white/40 hover:text-white hover:border-white'
              : 'text-black/40 hover:text-black hover:border-black'
          }`}
        >
          {action} &rarr;
        </Link>
      )}
    </div>
  );
};

/**
 * The header for interior pages. Sits directly under the fixed nav on a
 * white ground with a hairline rule that draws itself in.
 */
export const PageHeader = ({ eyebrow, title, meta, children }) => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      reveal('.ph-item', { stagger: 0.09, y: 40, start: 'top 95%', trigger: ref.current });
      drawLine('.ph-rule', { start: 'top 95%', trigger: ref.current });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <header ref={ref} className="pt-28 sm:pt-32 md:pt-40 pb-8 md:pb-12">
      <Container>
        {eyebrow && (
          <div className="ph-item mb-5">
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h1 className="ph-item font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05]">
            {title}
          </h1>
          {children && <div className="ph-item shrink-0">{children}</div>}
        </div>
        {meta && <p className="ph-item mt-5 text-xs tracking-[0.18em] uppercase text-black/40">{meta}</p>}
        <div className="ph-rule mt-8 md:mt-10">
          <Rule />
        </div>
      </Container>
    </header>
  );
};

/* Square, black, 0.25em tracked. The only button shape in the system. */
const buttonBase =
  'inline-flex items-center justify-center gap-2.5 text-[10px] tracking-button uppercase font-medium transition-colors duration-300 disabled:cursor-not-allowed';

const variants = {
  solid: 'bg-black text-white hover:bg-carbon disabled:bg-line disabled:text-black/40',
  outline:
    'border border-line text-black hover:bg-black hover:text-white disabled:text-black/30 disabled:hover:bg-transparent',
  light: 'bg-white text-black hover:bg-secondary',
  ghostDark: 'border border-white/25 text-white hover:bg-white hover:text-black',
};

export const Button = ({ variant = 'solid', className = '', children, ...props }) => (
  <button className={`${buttonBase} ${variants[variant]} px-8 h-12 ${className}`} {...props}>
    {children}
  </button>
);

export const ButtonLink = ({ to, variant = 'solid', className = '', children, ...props }) => (
  <Link to={to} className={`${buttonBase} ${variants[variant]} px-8 h-12 ${className}`} {...props}>
    {children}
  </Link>
);

/* Square field with a hairline border; focus is a black ring, never a colour. */
export const Field = ({ label, hint, className = '', children, ...props }) => (
  <label className={`block ${className}`}>
    {label && (
      <span className="block text-[10px] tracking-label uppercase text-black/40 mb-2">{label}</span>
    )}
    {children || (
      <input
        className="w-full h-12 px-4 bg-white border border-line text-sm text-black placeholder:text-black/25 focus:outline-none focus:border-black transition-colors duration-300"
        {...props}
      />
    )}
    {hint && <span className="block mt-2 text-[11px] text-black/40">{hint}</span>}
  </label>
);

export const Badge = ({ tone = 'dark', children, className = '' }) => (
  <span
    className={`inline-block text-[8px] tracking-label uppercase px-2 py-1 ${
      tone === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
    } ${className}`}
  >
    {children}
  </span>
);

/* Empty states are a rule, a Playfair line, and one action. Nothing else. */
export const EmptyState = ({ eyebrow, title, body, action }) => (
  <div className="py-24 md:py-32 text-center">
    {eyebrow && (
      <div className="mb-6">
        <Eyebrow className="!tracking-eyebrow">{eyebrow}</Eyebrow>
      </div>
    )}
    <h2 className="font-playfair text-2xl md:text-4xl font-light mb-4">{title}</h2>
    {body && <p className="text-sm text-black/50 max-w-md mx-auto mb-10">{body}</p>}
    {action}
  </div>
);

export const Spinner = ({ label = 'Loading' }) => (
  <div className="py-24 text-center">
    <span className="inline-block w-6 h-px bg-black/20 relative overflow-hidden align-middle mr-4">
      <span className="absolute inset-y-0 left-0 w-1/2 bg-black animate-marquee" />
    </span>
    <span className="text-[10px] tracking-eyebrow uppercase text-black/40">{label}</span>
  </div>
);
