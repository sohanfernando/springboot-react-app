import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { gsap, reveal } from '../lib/motion';
import {
  Container,
  PageHeader,
  Eyebrow,
  Button,
  ButtonLink,
  Field,
  EmptyState,
} from '../components/ui/Primitives';

const FIELDS = [
  ['name', 'Full Name', 'text', true],
  ['email', 'Email', 'email', true],
  ['phone', 'Phone', 'tel', false],
  ['address', 'Address', 'text', false],
  ['city', 'City', 'text', false],
  ['postalCode', 'Postal Code', 'text', false],
];

const emptyForm = (user) => ({
  name: user?.name || '',
  email: user?.email || '',
  phone: user?.phone || '',
  address: user?.address || '',
  city: user?.city || '',
  postalCode: user?.postalCode || '',
});

const ProfilePage = () => {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => emptyForm(user));
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      reveal('.profile-item', { stagger: 0.07, y: 40, start: 'top 95%', trigger: rootRef.current });
    }, rootRef);
    return () => ctx.revert();
  }, [user]);

  if (!user) {
    return (
      <>
        <PageHeader eyebrow="Account" title="Profile" />
        <Container>
          <EmptyState
            eyebrow="Sign in required"
            title="Your details live behind the door"
            body="Sign in to view and edit your delivery details."
            action={<ButtonLink to="/login">Sign In</ButtonLink>}
          />
        </Container>
      </>
    );
  }

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.patch(`${window.API_BASE_URL}/users/${user.id}`, form);
      // Merge rather than replace: the response has no token, and replacing
      // the stored session would sign the user out.
      login({ ...user, ...res.data });
      setEditing(false);
      showToast('Profile updated', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not save your profile', 'error');
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setForm(emptyForm(user));
    setEditing(false);
  };

  const initials = (user.name || user.email || '?').trim().charAt(0).toUpperCase();

  return (
    <div ref={rootRef}>
      <PageHeader eyebrow="Account" title="Profile" meta={user.email}>
        {!editing && (
          <Button variant="outline" onClick={() => setEditing(true)}>
            Edit Details
          </Button>
        )}
      </PageHeader>

      <Container className="pb-24 md:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Identity card */}
          <aside className="lg:col-span-4">
            <div className="profile-item border border-line p-7">
              <div className="w-16 h-16 bg-void text-white flex items-center justify-center font-playfair text-2xl font-light mb-6">
                {initials}
              </div>
              <p className="font-playfair text-2xl font-light leading-tight mb-1.5">{user.name}</p>
              <p className="text-[11px] text-black/40 mb-6 break-all">{user.email}</p>
              {user.role && (
                <span className="inline-block text-[9px] tracking-label uppercase border border-line px-2.5 py-1 text-black/50">
                  {user.role}
                </span>
              )}

              <div className="mt-8 pt-6 border-t border-line flex flex-col gap-3">
                {[
                  ['My Orders', '/orders'],
                  ['Wishlist', '/wishlist'],
                  ['Shopping Bag', '/cart'],
                ].map(([label, to]) => (
                  <Link
                    key={to}
                    to={to}
                    className="text-[11px] tracking-label uppercase text-black/50 hover:text-black transition-colors duration-300 w-fit pb-0.5 border-b border-transparent hover:border-black"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Details */}
          <div className="lg:col-span-8">
            <div className="profile-item mb-8">
              <Eyebrow>Delivery Details</Eyebrow>
            </div>

            <form onSubmit={handleSave}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
                {FIELDS.map(([name, label, type, required]) => (
                  <div key={name} className="profile-item">
                    {editing ? (
                      <Field
                        label={label}
                        name={name}
                        type={type}
                        required={required}
                        value={form[name]}
                        onChange={handleChange}
                        placeholder={`Your ${label.toLowerCase()}`}
                      />
                    ) : (
                      <div className="border-b border-line pb-4">
                        <p className="text-[10px] tracking-label uppercase text-black/40 mb-2">{label}</p>
                        <p className="text-sm">
                          {form[name] || <span className="text-black/25">Not set</span>}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {editing && (
                <div className="profile-item flex flex-wrap gap-3 mt-10">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving…' : 'Save Changes'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel} disabled={saving}>
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProfilePage;
