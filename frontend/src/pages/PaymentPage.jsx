import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, total, user } = location.state || {};
  const { setCart } = useAuth();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDate, setPaymentDate] = useState('');

  useEffect(() => {
    if (user) {
      setRecipientName(user.name || '');
    }
    setPaymentDate(new Date().toLocaleString());
    if (total <= 3000) {
      setPaymentMethod('Cash on Delivery');
    } else {
      setPaymentMethod('Card');
    }
  }, [user, total]);

  if (!cart || !user) {
    return <div className="min-h-screen bg-gray-50"><Navbar /><div className="pt-32 pb-16 text-center text-gray-500 text-lg">No cart or user info found.</div><Footer /></div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const paymentRes = await axios.post('http://localhost:8080/api/payments', {
        recipientName,
        paymentMethod,
        amount: total,
      });
      const payment = paymentRes.data;
      // Now create the order with paymentId
      const orderRes = await axios.post('http://localhost:8080/api/orders', {
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
      await axios.patch(`http://localhost:8080/api/payments/${payment.id}/order`, orderRes.data.id, {
        headers: { 'Content-Type': 'application/json' },
      });
      setCart([]); // Clear the cart after successful checkout
      navigate('/order-confirmation', { state: { order: orderRes.data } });
    } catch (e) {
      setError('Payment or order failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-32 pb-16">
        <div className="max-w-xl mx-auto px-4 bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Payment Details</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Recipient Name</label>
              <input type="text" className="w-full border rounded-lg px-4 py-2" value={recipientName} onChange={e => setRecipientName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Payment Date</label>
              <input type="text" className="w-full border rounded-lg px-4 py-2 bg-gray-100" value={paymentDate} readOnly />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
              <select className="w-full border rounded-lg px-4 py-2" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} required disabled={total > 3000}>
                {total <= 3000 && <option value="Cash on Delivery">Cash on Delivery</option>}
                <option value="Card">Card</option>
              </select>
            </div>
            {paymentMethod === 'Card' && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Name on Card</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" value={name} onChange={e => setName(e.target.value)} required={paymentMethod === 'Card'} />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Card Number</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" value={cardNumber} onChange={e => setCardNumber(e.target.value)} required={paymentMethod === 'Card'} maxLength={16} />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-700 font-medium mb-2">Expiry</label>
                    <input type="text" className="w-full border rounded-lg px-4 py-2" value={expiry} onChange={e => setExpiry(e.target.value)} required={paymentMethod === 'Card'} placeholder="MM/YY" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-700 font-medium mb-2">CVV</label>
                    <input type="password" className="w-full border rounded-lg px-4 py-2" value={cvv} onChange={e => setCvv(e.target.value)} required={paymentMethod === 'Card'} maxLength={4} />
                  </div>
                </div>
              </>
            )}
            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-bold">Total: Rs {total}</span>
              <button type="submit" className="bg-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors" disabled={loading}>
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage; 