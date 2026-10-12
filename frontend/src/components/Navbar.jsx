import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, Heart, ShoppingBag, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { gsap, prefersReducedMotion } from '../lib/motion';

const CATEGORIES = {
  Men: {
    to: '/men',
    items: ['Shop All', 'T-Shirts', 'Shirts', 'Shorts', 'Joggers & Pants'],
  },
  Women: {
    to: '/women',
    items: ['Shop All', 'T-Shirts', 'Crop Tops', 'Dresses', 'Joggers & Pants', 'Shorts', 'Sports Bra'],
  },
  Accessories: {
    to: '/accessories',
    items: ['Shop All', 'Bags', 'Hats', 'Slides', 'Bottles'],
  },
};

const itemLink = (key, item) => {
  const base = CATEGORIES[key].to;
  return item === 'Shop All' ? base : `${base}?category=${encodeURIComponent(item)}`;
};

const Navbar = () => {
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, getCartCount, getWishlistCount } = useAuth();
  const { introDelay } = useUI();

  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  const profileRef = useRef(null);
  const searchInputRef = useRef(null);

  const isHome = location.pathname === '/';
  // Transparent only at the top of the homepage; everywhere else the nav is solid.
  const transparent = isHome && !scrolled && !searchOpen && !openMenu;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Drop the nav in once the opening curtain has cleared.
  useLayoutEffect(() => {
    if (!navRef.current) return undefined;
    if (prefersReducedMotion()) {
      gsap.set(navRef.current, { y: 0, opacity: 1 });
      return undefined;
    }
    gsap.set(navRef.current, { y: -100, opacity: 0 });
    const tween = gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: introDelay, ease: 'power3.out' }
    );
    return () => tween.kill();
  }, [introDelay]);

  // Close everything on navigation.
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
    setSearchOpen(false);
    setProfileOpen(false);
  }, [location]);

  // The drawer and search overlay own the scroll while open.
  useEffect(() => {
    const locked = mobileOpen || searchOpen;
    const lenis = window.__lenis;
    if (locked) {
      document.body.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      document.body.style.overflow = '';
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      lenis?.start();
    };
  }, [mobileOpen, searchOpen]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setSearchOpen(false);
      setMobileOpen(false);
      setOpenMenu(null);
      setProfileOpen(false);
    };
    const onClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    setQuery('');
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/login');
  };

  const cartCount = mounted ? getCartCount() : 0;
  const wishCount = mounted ? getWishlistCount() : 0;

  const shellClass = transparent
    ? 'bg-transparent'
    : 'bg-white/95 backdrop-blur-sm border-b border-line';
  const inkClass = transparent ? 'text-white' : 'text-black';

  const linkClass = `text-[11px] tracking-label uppercase font-medium transition-opacity duration-300 hover:opacity-60 ${inkClass}`;

  return (
    <>
      <nav
        ref={navRef}
        onMouseLeave={() => setOpenMenu(null)}
        className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-500 ${shellClass}`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            {/* Left — categories */}
            <div className="hidden lg:flex items-center gap-7">
              {Object.keys(CATEGORIES).map((key) => (
                <div key={key} onMouseEnter={() => setOpenMenu(key)}>
                  <Link to={CATEGORIES[key].to} className={linkClass}>
                    {key}
                  </Link>
                </div>
              ))}
              <Link to="/latest" className={linkClass} onMouseEnter={() => setOpenMenu(null)}>
                Latest
              </Link>
              {/* Dropped below xl so the left links never reach the centred wordmark */}
              <Link
                to="/aboutus"
                className={`hidden xl:block ${linkClass}`}
                onMouseEnter={() => setOpenMenu(null)}
              >
                About
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className={`lg:hidden transition-colors duration-300 ${inkClass}`}
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>

            {/* Centre — wordmark */}
            <Link
              to="/"
              className={`font-playfair text-base sm:text-lg lg:text-xl xl:text-2xl tracking-[0.25em] xl:tracking-wordmark font-light absolute left-1/2 -translate-x-1/2 whitespace-nowrap transition-colors duration-300 ${inkClass}`}
            >
              FASHIONHUB
            </Link>

            {/* Right — actions */}
            <div className="flex items-center gap-4 sm:gap-5">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className={`transition-opacity duration-300 hover:opacity-60 ${inkClass}`}
              >
                <Search size={18} strokeWidth={1.5} />
              </button>

              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className={`relative hidden sm:block transition-opacity duration-300 hover:opacity-60 ${inkClass}`}
              >
                <Heart size={18} strokeWidth={1.5} />
                {wishCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-black text-white text-[8px] rounded-full flex items-center justify-center tabular-nums">
                    {wishCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                aria-label="Cart"
                className={`relative transition-opacity duration-300 hover:opacity-60 ${inkClass}`}
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-black text-white text-[8px] rounded-full flex items-center justify-center tabular-nums">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative hidden sm:block" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen((v) => !v)}
                    aria-label="Account"
                    className={`transition-opacity duration-300 hover:opacity-60 ${inkClass}`}
                  >
                    <User size={18} strokeWidth={1.5} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-4 w-64 bg-white border border-line">
                      <div className="px-5 py-4 border-b border-line">
                        <p className="text-[10px] tracking-eyebrow uppercase text-black/30 mb-1.5">
                          Signed in
                        </p>
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-[11px] text-black/40 truncate">{user.email}</p>
                      </div>
                      <div className="py-2">
                        {[
                          ['Profile', '/profile'],
                          ['Orders', '/orders'],
                          ['Wishlist', '/wishlist'],
                        ].map(([label, to]) => (
                          <Link
                            key={to}
                            to={to}
                            className="flex items-center justify-between px-5 py-2.5 text-[11px] tracking-label uppercase text-black/60 hover:text-black transition-colors duration-300"
                          >
                            {label}
                            <ChevronRight size={12} strokeWidth={1.5} />
                          </Link>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-5 py-3.5 border-t border-line text-[11px] tracking-label uppercase text-black/60 hover:text-black transition-colors duration-300"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`hidden sm:block text-[11px] tracking-label uppercase font-medium transition-opacity duration-300 hover:opacity-60 ${inkClass}`}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Category panel */}
        <div
          className={`hidden lg:block overflow-hidden bg-white border-t border-line transition-[max-height,opacity] duration-500 ease-overlay ${
            openMenu ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="max-w-screen-2xl mx-auto px-12 py-10">
            {openMenu && (
              <div className="grid grid-cols-12 gap-10">
                <div className="col-span-3">
                  <p className="text-[10px] tracking-eyebrow uppercase text-black/30 mb-3">
                    Collection
                  </p>
                  <p className="font-playfair text-3xl font-light">{openMenu}</p>
                </div>
                <div className="col-span-9 grid grid-cols-3 gap-x-8 gap-y-3">
                  {CATEGORIES[openMenu].items.map((item) => (
                    <Link
                      key={item}
                      to={itemLink(openMenu, item)}
                      className="text-[11px] tracking-label uppercase text-black/50 hover:text-black transition-colors duration-300 pb-1 border-b border-transparent hover:border-black w-fit"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Search overlay */}
      <div
        className={`fixed inset-0 z-[150] transition-opacity duration-500 ${
          searchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          type="button"
          aria-label="Close search"
          onClick={() => setSearchOpen(false)}
          className="absolute inset-0 w-full h-full bg-black/40 cursor-default"
        />
        <div
          className={`relative bg-white transition-transform duration-500 ease-overlay ${
            searchOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-12 py-10 md:py-16">
            <div className="flex items-start justify-between gap-6 mb-8">
              <p className="text-[10px] tracking-eyebrow uppercase text-black/30">Search</p>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="text-black hover:opacity-60 transition-opacity duration-300"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <form onSubmit={submitSearch}>
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full bg-transparent font-playfair text-2xl sm:text-4xl md:text-5xl font-light placeholder:text-black/20 focus:outline-none pb-6 border-b border-line focus:border-black transition-colors duration-300"
              />
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <span className="text-[10px] tracking-eyebrow uppercase text-black/30">Popular</span>
                {['Dresses', 'T-Shirts', 'Joggers', 'Accessories'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      navigate(`/search?q=${encodeURIComponent(term)}`);
                    }}
                    className="text-[11px] tracking-label uppercase text-black/50 hover:text-black transition-colors duration-300 pb-0.5 border-b border-transparent hover:border-black"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-[200] bg-void flex flex-col transition-transform duration-500 ease-overlay ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
          <span className="font-playfair text-white text-lg tracking-wordmark font-light">
            FASHIONHUB
          </span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="text-white hover:opacity-60 transition-opacity duration-300"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-8 no-scrollbar">
          {Object.keys(CATEGORIES).map((key) => (
            <div key={key} className="mb-9">
              <Link
                to={CATEGORIES[key].to}
                className="font-playfair text-white text-3xl font-light block mb-4"
              >
                {key}
              </Link>
              <div className="flex flex-col gap-2.5 pl-1">
                {CATEGORIES[key].items.map((item) => (
                  <Link
                    key={item}
                    to={itemLink(key, item)}
                    className="text-[11px] tracking-label uppercase text-white/40 hover:text-white transition-colors duration-300 w-fit"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div className="border-t border-white/10 pt-8 flex flex-col gap-4">
            {[
              ['Latest', '/latest'],
              ['About', '/aboutus'],
              ['Wishlist', '/wishlist'],
              ['Cart', '/cart'],
            ].map(([label, to]) => (
              <Link
                key={to}
                to={to}
                className="text-[11px] tracking-label uppercase text-white/60 hover:text-white transition-colors duration-300 w-fit"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="px-4 sm:px-6 py-6 border-t border-white/10">
          {user ? (
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] tracking-eyebrow uppercase text-white/30 mb-1">Signed in</p>
                <p className="text-sm text-white truncate">{user.name}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="shrink-0 text-[10px] tracking-button uppercase text-white/60 hover:text-white transition-colors duration-300"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="flex-1 h-12 border border-white/25 text-white text-[10px] tracking-button uppercase flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="flex-1 h-12 bg-white text-black text-[10px] tracking-button uppercase flex items-center justify-center hover:bg-secondary transition-colors duration-300"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
