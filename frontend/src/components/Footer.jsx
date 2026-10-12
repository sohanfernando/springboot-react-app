import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUp } from 'lucide-react';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import { gsap, reveal, drawLine } from '../lib/motion';

const SHOP = [
  ["Men's Collection", '/men'],
  ["Women's Collection", '/women'],
  ['Accessories', '/accessories'],
  ['Latest Arrivals', '/latest'],
];

const ACCOUNT = [
  ['My Profile', '/profile'],
  ['My Orders', '/orders'],
  ['Wishlist', '/wishlist'],
  ['Shopping Bag', '/cart'],
];

const HOUSE = [
  ['Our Story', '/aboutus'],
  ['Size Guide', '/aboutus'],
  ['Shipping & Returns', '/aboutus'],
  ['Contact', '/aboutus'],
];

const SOCIALS = [
  { icon: FaInstagram, label: 'Instagram', href: 'https://instagram.com' },
  { icon: FaFacebookF, label: 'Facebook', href: 'https://facebook.com' },
];

const Column = ({ title, links }) => (
  <div className="f-item">
    <p className="text-[10px] tracking-eyebrow uppercase text-white/30 mb-6">{title}</p>
    <ul className="flex flex-col gap-3">
      {links.map(([label, to]) => (
        <li key={label + to}>
          <Link
            to={to}
            className="text-[11px] tracking-label uppercase text-white/60 hover:text-white transition-colors duration-300"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const rootRef = useRef(null);
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      drawLine('.f-rule', { start: 'top 92%', trigger: rootRef.current });
      reveal('.f-item', { stagger: 0.09, y: 40, start: 'top 88%', trigger: rootRef.current });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer ref={rootRef} className="bg-void text-white pt-20 md:pt-28 pb-8">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-16 md:pb-20">
          <div className="lg:col-span-5">
            <p className="f-item text-[10px] tracking-eyebrow uppercase text-white/30 mb-5">
              The List
            </p>
            <h2 className="f-item font-playfair text-3xl md:text-4xl lg:text-5xl font-light leading-tight">
              First look at
              <br />
              every collection.
            </h2>
          </div>

          <div className="lg:col-span-7 lg:pt-10">
            {joined ? (
              <p className="f-item text-sm text-white/60 border-b border-white/15 pb-4">
                You're on the list. Look out for the next drop.
              </p>
            ) : (
              <form
                className="f-item"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setJoined(true);
                }}
              >
                <div className="flex items-center gap-4 border-b border-white/20 focus-within:border-white transition-colors duration-300">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="flex-1 bg-transparent py-4 text-sm text-white placeholder:text-white/25 focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="shrink-0 flex items-center gap-2 text-[10px] tracking-button uppercase text-white/60 hover:text-white transition-colors duration-300 py-4"
                  >
                    Subscribe
                    <ArrowRight size={13} strokeWidth={1.5} />
                  </button>
                </div>
              </form>
            )}
            <p className="f-item mt-4 text-[11px] text-white/30">
              No spam. Unsubscribe whenever you like.
            </p>
          </div>
        </div>

        <div className="f-rule">
          <span className="block h-px w-full bg-white/10 origin-left" />
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 md:gap-8 py-16 md:py-20">
          <div className="col-span-2 lg:col-span-2 f-item">
            <p className="font-playfair text-2xl tracking-wordmark font-light mb-6">FASHIONHUB</p>
            <p className="text-[13px] leading-relaxed text-white/40 max-w-xs mb-8">
              Considered pieces for a considered wardrobe. Made in small runs, cut for how you
              actually live.
            </p>
            <div className="flex items-center gap-5">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="text-white/40 hover:text-white transition-colors duration-300"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <Column title="Shop" links={SHOP} />
          <Column title="Account" links={ACCOUNT} />
          <Column title="House" links={HOUSE} />
        </div>

        <div className="f-rule">
          <span className="block h-px w-full bg-white/10 origin-left" />
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <p className="text-[10px] tracking-label uppercase text-white/25">
            &copy; {new Date().getFullYear()} FashionHub — Colombo
          </p>

          <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
            {['Privacy', 'Terms', 'Cookies'].map((label) => (
              <a
                key={label}
                href="#"
                className="text-[10px] tracking-label uppercase text-white/25 hover:text-white transition-colors duration-300"
              >
                {label}
              </a>
            ))}
            <button
              type="button"
              onClick={toTop}
              className="flex items-center gap-2 text-[10px] tracking-label uppercase text-white/25 hover:text-white transition-colors duration-300"
            >
              Back to top
              <ArrowUp size={12} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
