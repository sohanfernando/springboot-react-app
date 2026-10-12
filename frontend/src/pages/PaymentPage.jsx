import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getImageUrl, formatPrice } from '../lib/motion';
import {
  Container,
  PageHeader,
  Eyebrow,
  Button,
  ButtonLink,
  Field,
  EmptyState,
} from '../components/ui/Primitives';

/**
 * The publishable key MUST belong to the same Stripe account as the backend's
 * STRIPE_SECRET_KEY. If they differ, the intent is created on one account and
 * confirmed against another, and Stripe answers "No such payment_intent" —
 * exactly what a hard-coded key here produced once the backend key changed.
 * Both keys carry their account id right after the prefix, so
 * pk_test_51ABC... and sk_test_51ABC... must share that segment.
 */
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

const COD_LIMIT = 3000;

const cardElementOptions = {
  style: {
    base: {
      fontSize: '14px',
      color: '#000000',
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      '::placeholder': { color: 'rgba(0,0,0,0.25)' },
    },
    invalid: { color: '#dc2626' },
  },
};

const PaymentForm = ({ cart, total, user, setCart, navigate }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [recipientName, setRecipientName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  const createPaymentIntent = async () => {
    try {
      const response = await axios.post(`${window.API_BASE_URL}/api/payments/create-payment-intent`, {
        amount: Math.round(total),
        currency: 'lkr',
        description: `Order payment for ${user?.name || 'Customer'}`,
        receiptEmail: user?.email,
      });
      setClientSecret(response.data.clientSecret);
    } catch (err) {
      // The server passes Stripe's own message through as `error`; showing it
      // beats a generic string when the cause is a key or currency problem.
      setError(
        err.response?.data?.error ||
          'We could not start the payment. Please try again.'
      );
      console.error('Payment intent creation error:', err);
    }
  };

  useEffect(() => {
    if (user) {
      setRecipientName(user.name || '');
      setAddress(user.address || '');
      setCity(user.city || '');
      setPostalCode(user.postalCode || '');
    }
    if (total <= COD_LIMIT) {
      setPaymentMethod('Cash on Delivery');
    } else {
      setPaymentMethod('Stripe');
      createPaymentIntent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, total]);

  const handleCashOnDelivery = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const paymentRes = await axios.post(`${window.API_BASE_URL}/api/payments`, {
        recipientName,
        paymentMethod: 'Cash on Delivery',
        amount: total,
        address,
        city,
        postalCode,
      });
      const payment = paymentRes.data;

      const orderRes = await axios.post(`${window.API_BASE_URL}/api/orders`, {
        userId: user.id,
        items: JSON.stringify(cart),
        total,
        recipientName,
        address,
        city,
        postalCode,
        paymentId: payment.id,
      });

      await axios.patch(`${window.API_BASE_URL}/api/payments/${payment.id}/order`, orderRes.data.id, {
        headers: { 'Content-Type': 'application/json' },
      });

      setCart([]);
      navigate('/order-confirmation', { state: { order: orderRes.data } });
    } catch (e2) {
      setError('The order could not be placed. Please try again.');
      console.error('Payment error:', e2);
    }
    setLoading(false);
  };

  const handleStripeSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    const cardElement = elements.getElement(CardElement);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: recipientName,
            address: { line1: address, city, postal_code: postalCode },
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'The payment was declined. Please try again.');
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        const paymentRes = await axios.post(`${window.API_BASE_URL}/api/payments/stripe-payment`, {
          paymentIntentId: paymentIntent.id,
          recipientName,
          amount: total,
          address,
          city,
          postalCode,
        });
        const payment = paymentRes.data;

        const orderRes = await axios.post(`${window.API_BASE_URL}/api/orders`, {
          userId: user.id,
          items: JSON.stringify(cart),
          total,
          recipientName,
          address,
          city,
          postalCode,
          paymentId: payment.id,
        });

        await axios.patch(`${window.API_BASE_URL}/api/payments/${payment.id}/order`, orderRes.data.id, {
          headers: { 'Content-Type': 'application/json' },
        });

        setCart([]);
        navigate('/order-confirmation', { state: { order: orderRes.data } });
      } else {
        setError('The payment did not complete. Please try again.');
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err?.message ||
          'Something went wrong during payment. Please try again.'
      );
      console.error('Stripe payment error:', err);
    }

    setLoading(false);
  };

  const isCod = paymentMethod === 'Cash on Delivery';
  const submitDisabled = loading || (!isCod && (!stripe || !clientSecret));

  return (
    <form onSubmit={isCod ? handleCashOnDelivery : handleStripeSubmit}>
      {/* Delivery */}
      <div className="mb-6">
        <Eyebrow>Delivery</Eyebrow>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
        <Field
          label="Recipient Name"
          className="sm:col-span-2"
          type="text"
          required
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          placeholder="Who is receiving this?"
        />
        <Field
          label="Address"
          className="sm:col-span-2"
          type="text"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Street address"
        />
        <Field
          label="City"
          type="text"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Colombo"
        />
        <Field
          label="Postal Code"
          type="text"
          required
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          placeholder="01500"
        />
      </div>

      {/* Payment */}
      <div className="mt-12 mb-6">
        <Eyebrow>Payment</Eyebrow>
      </div>

      <Field label="Method">
        <select
          value={paymentMethod}
          onChange={(e) => {
            setPaymentMethod(e.target.value);
            if (e.target.value === 'Stripe' && !clientSecret) createPaymentIntent();
          }}
          required
          disabled={total > COD_LIMIT}
          className="w-full h-12 px-4 bg-white border border-line text-sm text-black focus:outline-none focus:border-black transition-colors duration-300 disabled:text-black/50"
        >
          {total <= COD_LIMIT && <option value="Cash on Delivery">Cash on Delivery</option>}
          <option value="Stripe">Card — Visa, Mastercard</option>
        </select>
      </Field>

      {total > COD_LIMIT && (
        <p className="mt-3 text-[11px] text-black/40">
          Orders above {formatPrice(COD_LIMIT)} are card only.
        </p>
      )}

      {!isCod && (
        <div className="mt-7">
          <p className="text-[10px] tracking-label uppercase text-black/40 mb-2">Card Details</p>
          <div className="border border-line px-4 py-4 focus-within:border-black transition-colors duration-300">
            <CardElement options={cardElementOptions} />
          </div>
          <p className="mt-3 text-[11px] text-black/35">
            Test card 4242 4242 4242 4242 · any future expiry · any CVC
          </p>
        </div>
      )}

      <div className="mt-10 pt-8 border-t border-line">
        <Button type="submit" disabled={submitDisabled} className="w-full !px-4 h-14">
          <Lock size={12} strokeWidth={1.6} />
          {loading ? 'Processing…' : isCod ? 'Place Order' : `Pay ${formatPrice(total)}`}
        </Button>

        {error && (
          <p className="mt-5 border-l-2 border-destructive pl-4 py-2 text-[12px] text-destructive">
            {error}
          </p>
        )}
      </div>
    </form>
  );
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, total, user } = location.state || {};
  const { setCart } = useAuth();

  if (!cart || !user) {
    return (
      <>
        <PageHeader eyebrow="Checkout" title="Payment" />
        <Container>
          <EmptyState
            eyebrow="Nothing to pay for"
            title="Your checkout has expired"
            body="Add pieces to your bag and start checkout again from there."
            action={<ButtonLink to="/cart">Go to Bag</ButtonLink>}
          />
        </Container>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Checkout" title="Payment" meta="Step 2 of 2" />

      <Container className="pb-24 md:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-7">
            {!STRIPE_PUBLISHABLE_KEY && (
              <div className="mb-8 border-l-2 border-destructive pl-4 py-3">
                <p className="text-[11px] tracking-label uppercase text-destructive mb-1.5">
                  Card payment not configured
                </p>
                <p className="text-[12px] text-black/55 leading-relaxed">
                  Set <code>VITE_STRIPE_PUBLISHABLE_KEY</code> in{' '}
                  <code>frontend/.env</code> and restart the dev server. It must come
                  from the same Stripe account as the server's{' '}
                  <code>STRIPE_SECRET_KEY</code>.
                </p>
              </div>
            )}
            <Elements stripe={stripePromise}>
              <PaymentForm
                cart={cart}
                total={total}
                user={user}
                setCart={setCart}
                navigate={navigate}
              />
            </Elements>
          </div>

          {/* Order review */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 border border-line p-6 md:p-7">
              <div className="mb-6">
                <Eyebrow>Your Order</Eyebrow>
              </div>

              <div className="flex flex-col gap-4 pb-6 border-b border-line max-h-80 overflow-y-auto no-scrollbar">
                {cart.map((item, i) => (
                  <div key={item.id ?? i} className="flex items-center gap-4">
                    <div className="relative w-12 h-[60px] shrink-0 overflow-hidden bg-muted">
                      {getImageUrl(item.image) ? (
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title || item.name}
                          className="absolute inset-0 w-full h-full object-cover object-top"
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center font-playfair text-black/15">
                          {(item.title || item.name || '?').charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium truncate">{item.title || item.name}</p>
                      <p className="text-[10px] tracking-label uppercase text-black/35 mt-0.5">
                        Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-[12px] tabular-nums shrink-0">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-baseline py-6">
                <span className="text-[10px] tracking-label uppercase">Total</span>
                <span className="font-playfair text-2xl font-light tabular-nums">
                  {formatPrice(total)}
                </span>
              </div>

              <Link
                to="/cart"
                className="text-[10px] tracking-label uppercase text-black/40 hover:text-black transition-colors duration-300 pb-0.5 border-b border-transparent hover:border-black"
              >
                Edit your bag
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
};

export default PaymentPage;
