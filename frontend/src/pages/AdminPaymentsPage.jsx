import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(window.API_BASE_URL + '/api/payments');
      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setPayments([]);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) return;
    try {
      await axios.delete(`${window.API_BASE_URL}/api/payments/${id}`);
      setPayments(payments.filter(payment => payment.id !== id));
    } catch (e) {
      alert('Failed to delete payment.');
    }
  };

  const filteredPayments = payments.filter(payment => {
    const q = search.toLowerCase();
    return (
      payment.recipientName?.toLowerCase().includes(q) ||
      payment.paymentMethod?.toLowerCase().includes(q) ||
      payment.paymentStatus?.toLowerCase().includes(q) ||
      (payment.transactionId && payment.transactionId.toLowerCase().includes(q)) ||
      (payment.orderId && payment.orderId.toString().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-blue-700">Manage Payments</h1>
        <div className="mb-6 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by recipient, method, status, transaction, order id..."
            className="border px-4 py-2 rounded-lg w-80"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600"
            onClick={fetchPayments}
          >
            Refresh
          </button>
        </div>
        {loading ? (
          <div>Loading payments...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-lg">
              <thead>
                <tr className="bg-blue-100 text-blue-700">
                  <th className="p-4 text-left">Payment ID</th>
                  <th className="p-4 text-left">Recipient</th>
                  <th className="p-4 text-left">Method</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">Transaction ID</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map(payment => (
                  <tr key={payment.id} className="border-b">
                    <td className="p-4">{payment.id}</td>
                    <td className="p-4">{payment.recipientName}</td>
                    <td className="p-4">{payment.paymentMethod}</td>
                    <td className="p-4">{payment.paymentStatus}</td>
                    <td className="p-4">Rs {payment.amount}</td>
                    <td className="p-4">{payment.orderId}</td>
                    <td className="p-4">{payment.transactionId}</td>
                    <td className="p-4">{payment.paymentDate ? new Date(payment.paymentDate).toLocaleString() : ''}</td>
                    <td className="p-4">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                        onClick={() => handleDelete(payment.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPayments.length === 0 && (
                  <tr><td colSpan={8} className="text-center p-8 text-gray-500">No payments found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentsPage; 
