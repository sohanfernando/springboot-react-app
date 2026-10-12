import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  CreditCard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/catalog', label: 'Catalogue', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

/**
 * Shell for every admin screen: a fixed dark rail beside a light workspace.
 *
 * It also holds the auth guard. Previously only the dashboard checked for an
 * admin session, so /admin/orders, /admin/payments and /admin/users could be
 * opened by anyone who knew the URL. Guarding here covers every admin route by
 * construction, including ones added later.
 */
const AdminLayout = () => {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!admin || admin.role !== 'ADMIN') navigate('/admin-login', { replace: true });
  }, [admin, navigate]);

  if (!admin || admin.role !== 'ADMIN') return null;

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin-login', { replace: true });
  };

  const initials = (admin.name || admin.email || 'A').trim().charAt(0).toUpperCase();

  const rail = (
    <div className="flex flex-col h-full bg-void text-white">
      <div className="px-6 py-6 border-b border-white/10">
        <Link to="/admin" className="block">
          <span className="font-playfair text-lg tracking-[0.28em] font-light">FASHIONHUB</span>
          <span className="block text-[9px] tracking-eyebrow uppercase text-white/35 mt-1.5">
            Administration
          </span>
        </Link>
      </div>

      <nav className="flex-1 py-5 overflow-y-auto">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-[11px] tracking-label uppercase transition-colors duration-200 border-l-2 ${
                isActive
                  ? 'border-white text-white bg-white/[0.06]'
                  : 'border-transparent text-white/45 hover:text-white hover:bg-white/[0.03]'
              }`
            }
          >
            <item.icon size={15} strokeWidth={1.6} />
            {item.label}
          </NavLink>
        ))}

        <div className="mt-6 pt-5 border-t border-white/10">
          <a
            href="/"
            className="flex items-center gap-3 px-6 py-3 text-[11px] tracking-label uppercase text-white/45 hover:text-white transition-colors duration-200"
          >
            <ExternalLink size={15} strokeWidth={1.6} />
            View Store
          </a>
        </div>
      </nav>

      <div className="shrink-0 px-6 py-5 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 shrink-0 bg-white text-black flex items-center justify-center text-[13px] font-medium">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="text-[12px] truncate">{admin.name}</p>
            <p className="text-[10px] text-white/35 truncate">{admin.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full h-9 flex items-center justify-center gap-2 border border-white/20 text-[10px] tracking-button uppercase text-white/70 hover:bg-white hover:text-black hover:border-white transition-colors duration-200"
        >
          <LogOut size={13} strokeWidth={1.6} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted font-inter text-black">
      {/* Desktop rail */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-60 z-40">{rail}</aside>

      {/* Mobile rail */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 w-full h-full bg-black/50 cursor-default"
        />
        <div
          className={`absolute inset-y-0 left-0 w-64 transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {rail}
        </div>
      </div>

      <div className="lg:pl-60">
        {/* Mobile bar */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-void text-white">
          <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={20} strokeWidth={1.6} />
          </button>
          <span className="font-playfair text-sm tracking-[0.28em] font-light">FASHIONHUB</span>
          <button type="button" onClick={handleLogout} aria-label="Sign out">
            <LogOut size={17} strokeWidth={1.6} />
          </button>
        </div>

        <main className="px-5 sm:px-8 py-8 sm:py-10 max-w-[1600px]">
          <Outlet />
        </main>
      </div>

      {/* Close affordance for the mobile drawer, kept out of the rail markup */}
      {menuOpen && (
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          className="lg:hidden fixed top-4 right-4 z-[60] text-white"
        >
          <X size={22} strokeWidth={1.6} />
        </button>
      )}
    </div>
  );
};

export default AdminLayout;
