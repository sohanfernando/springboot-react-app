import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Initialize Stripe - Replace with your publishable key
const stripePromise = loadStripe('pk_test_51Pp5EuKbzWjobKfETg3UmXz4SzjH2r2VvO4WQxEDx7qxT9eGGrGygKjSA1MwKE29Nus5ISz4QXucw8rhQvHOce5100v1Op5iuW');

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

  useEffect(() => {
    if (user) {
      setRecipientName(user.name || '');
    }
    if (total <= 3000) {
      setPaymentMethod('Cash on Delivery');
    } else {
      setPaymentMethod('Stripe');
      // Create payment intent when component mounts for Stripe payments
      createPaymentIntent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, total]);

  const createPaymentIntent = async () => {
    try {
      const response = await axios.post(window.API_BASE_URL + '/api/payments/create-payment-intent', {
        amount: Math.round(total), // Convert to integer
        currency: 'lkr',
        description: `Order payment for ${user?.name || 'Customer'}`,
        receiptEmail: user?.email
      });
      setClientSecret(response.data.clientSecret);
    } catch (err) {
      setError('Failed to initialize payment. Please try again.');
      console.error('Payment intent creation error:', err);
    }
  };

  const handleCashOnDelivery = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const paymentRes = await axios.post(window.API_BASE_URL + '/api/payments', {
        recipientName,
        paymentMethod: 'Cash on Delivery',
        amount: total,
        address,
        city,
        postalCode,
      });
      const payment = paymentRes.data;
      
      const orderRes = await axios.post(window.API_BASE_URL + '/api/orders', {
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
    } catch (e) {
      setError('Payment or order failed. Please try again.');
      console.error('Payment error:', e);
    }
    setLoading(false);
  };

  const handleStripeSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    const cardElement = elements.getElement(CardElement);

    try {
      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: recipientName,
            address: {
              line1: address,
              city: city,
              postal_code: postalCode,
            },
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed. Please try again.');
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Create payment record in backend
        const paymentRes = await axios.post(window.API_BASE_URL + '/api/payments/stripe-payment', {
          paymentIntentId: paymentIntent.id,
          recipientName,
          amount: total,
          address,
          city,
          postalCode,
        });

        const payment = paymentRes.data;

        // Create order
        const orderRes = await axios.post(window.API_BASE_URL + '/api/orders', {
          userId: user.id,
          items: JSON.stringify(cart),
          total,
          recipientName,
          address,
          city,
          postalCode,
          paymentId: payment.id,
        });

        // Update payment with orderId
        await axios.patch(`${window.API_BASE_URL}/api/payments/${payment.id}/order`, orderRes.data.id, {
          headers: { 'Content-Type': 'application/json' },
        });

        setCart([]);
        navigate('/order-confirmation', { state: { order: orderRes.data } });
      } else {
        setError('Payment was not successful. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during payment. Please try again.');
      console.error('Stripe payment error:', err);
    }
    
    setLoading(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={paymentMethod === 'Cash on Delivery' ? handleCashOnDelivery : handleStripeSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-700 font-medium mb-2">Recipient Name</label>
        <input 
          type="text" 
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" 
          value={recipientName} 
          onChange={e => setRecipientName(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2">Address</label>
        <input 
          type="text" 
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" 
          value={address} 
          onChange={e => setAddress(e.target.value)} 
          required 
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-2">City</label>
          <input 
            type="text" 
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" 
            value={city} 
            onChange={e => setCity(e.target.value)} 
            required 
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-2">Postal Code</label>
          <input 
            type="text" 
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" 
            value={postalCode} 
            onChange={e => setPostalCode(e.target.value)} 
            required 
          />
        </div>
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
        <select 
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" 
          value={paymentMethod} 
          onChange={e => {
            setPaymentMethod(e.target.value);
            if (e.target.value === 'Stripe' && !clientSecret) {
              createPaymentIntent();
            }
          }} 
          required 
          disabled={total > 3000}
        >
          {total <= 3000 && <option value="Cash on Delivery">Cash on Delivery</option>}
          <option value="Stripe">Credit/Debit Card (Stripe)</option>
        </select>
      </div>
      
      {paymentMethod === 'Stripe' && (
        <div>
          <label className="block text-gray-700 font-medium mb-2">Card Details</label>
          <div className="border rounded-lg px-4 py-3 bg-white">
            <CardElement options={cardElementOptions} />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Test card: 4242 4242 4242 4242 | Any future expiry | Any 3-digit CVC
          </p>
        </div>
      )}

      <div className="flex justify-between items-center mt-6 pt-6 border-t">
        <span className="text-lg font-bold text-gray-800">Total: Rs {total.toFixed(2)}</span>
        <button 
          type="submit" 
          className="bg-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed" 
          disabled={loading || (paymentMethod === 'Stripe' && (!stripe || !clientSecret))}
        >
          {loading ? 'Processing...' : paymentMethod === 'Cash on Delivery' ? 'Place Order' : 'Pay Now'}
        </button>
      </div>
      {error && <div className="text-red-500 text-sm mt-2 bg-red-50 p-3 rounded">{error}</div>}
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-16 text-center text-gray-500 text-lg">
          No cart or user info found. Please add items to your cart first.
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-32 pb-16">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Details</h1>
            <p className="text-gray-600 mb-6">Complete your order securely</p>
            
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;
