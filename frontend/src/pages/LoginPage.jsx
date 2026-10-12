import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { gsap, reveal } from '../lib/motion';
import { Button, Field } from '../components/ui/Primitives';
import loginImage from '../assets/T-shirts/Men/1.jpg';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, loginAdmin } = useAuth();
  const { showToast } = useToast();
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      reveal('.auth-item', { stagger: 0.08, y: 40, start: 'top 98%', trigger: rootRef.current });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${window.API_BASE_URL}/users/login`, { email, password });
      if (response.data.role === 'ADMIN') {
        // Admin screens read the admin session, so store it there.
        loginAdmin(response.data);
        showToast('Welcome back, admin', 'success');
        navigate('/admin');
      } else {
        login(response.data);
        showToast('Welcome back', 'success');
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Those details did not match. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={rootRef} className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* Plate */}
      <div className="relative hidden lg:block bg-void overflow-hidden">
        <img src={loginImage} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/50" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 xl:p-16">
          <p className="text-white/40 text-[10px] tracking-eyebrow uppercase mb-5">Members</p>
          <h2 className="font-playfair text-white text-4xl xl:text-5xl font-light leading-[1.1] max-w-md">
            Your bag, your saved pieces, exactly where you left them.
          </h2>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-4 sm:px-8 py-28 md:py-32">
        <div className="w-full max-w-sm">
          <div className="auth-item mb-3">
            <p className="text-[10px] tracking-eyebrow uppercase text-black/30">Welcome back</p>
          </div>

          <h1 className="auth-item font-playfair text-4xl md:text-5xl font-light mb-10">
            Sign In
          </h1>

          {error && (
            <p className="auth-item mb-7 border-l-2 border-destructive pl-4 py-2 text-[12px] text-destructive">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="auth-item">
              <Field
                label="Email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="auth-item">
              <Field label="Password">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 px-4 pr-12 bg-white border border-line text-sm text-black placeholder:text-black/25 focus:outline-none focus:border-black transition-colors duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                  </button>
                </div>
              </Field>
            </div>

            <div className="auth-item mt-2">
              <Button type="submit" disabled={loading} className="w-full !px-4 h-14">
                {loading ? 'Signing in…' : 'Sign In'}
              </Button>
            </div>
          </form>

          <p className="auth-item mt-10 pt-8 border-t border-line text-[11px] tracking-label uppercase text-black/40">
            New here?{' '}
            <Link to="/signup" className="text-black pb-0.5 border-b border-black">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
