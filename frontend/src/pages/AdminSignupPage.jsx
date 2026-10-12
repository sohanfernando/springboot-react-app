import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button, Field, Input } from '../components/admin/AdminUI';

export default function AdminSignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { admin } = useAuth();
  const { showToast } = useToast();
  const isAdmin = admin?.role === 'ADMIN';

  // Only a signed-in administrator can create another one; the server
  // enforces this too, so this guard is just to avoid showing a dead form.
  useEffect(() => {
    if (!isAdmin) navigate('/admin-login', { replace: true });
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/users/admins', { name, email, password });
      showToast('Administrator account created', 'success');
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || 'We could not create that account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void font-inter flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="inline-flex items-center justify-center w-11 h-11 border border-white/20 mb-6">
            <ShieldCheck size={18} strokeWidth={1.5} className="text-white" />
          </span>
          <p className="font-playfair text-white text-xl tracking-[0.28em] font-light">FASHIONHUB</p>
          <p className="text-[10px] tracking-eyebrow uppercase text-white/35 mt-2">Administration</p>
        </div>

        <div className="bg-white border border-line p-7">
          <h1 className="text-lg font-medium mb-1">Create administrator</h1>
          <p className="text-[12px] text-black/45 mb-7">
            This account will have full access to the catalogue, orders and payments.
          </p>

          {error && (
            <p className="mb-6 border-l-2 border-rose-500 pl-3 py-2 text-[12px] text-rose-600">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Field label="Full name">
              <Input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full"
              />
            </Field>

            <Field label="Email">
              <Input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fashionhub.com"
                className="w-full"
              />
            </Field>

            <Field label="Password" hint="At least 8 characters.">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                </button>
              </div>
            </Field>

            <Button type="submit" disabled={loading} className="w-full mt-1">
              {loading ? 'Creating…' : 'Create account'}
            </Button>
          </form>

          <p className="mt-7 pt-5 border-t border-line text-[11px] tracking-label uppercase text-black/40">
            <Link to="/admin/users" className="text-black border-b border-black pb-0.5">
              Back to users
            </Link>
          </p>
        </div>

        <p className="text-center mt-6">
          <Link
            to="/"
            className="text-[10px] tracking-label uppercase text-white/30 hover:text-white transition-colors duration-200"
          >
            Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}
