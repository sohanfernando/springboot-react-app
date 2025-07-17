import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/orders');
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setOrders([]);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/orders/${id}`);
      setOrders(orders.filter(order => order.id !== id));
    } catch (e) {
      alert('Failed to delete order.');
    }
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (order, newStatus) => {
    try {
      await axios.patch(`http://localhost:8080/api/orders/${order.id}/status`, newStatus, {
        headers: { 'Content-Type': 'text/plain' },
      });
      setOrders(orders.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === order.id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (e) {
      alert('Failed to update order status.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-blue-700">Manage Orders</h1>
        {loading ? (
          <div>Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-lg">
              <thead>
                <tr className="bg-blue-100 text-blue-700">
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">User ID</th>
                  <th className="p-4 text-left">Recipient Name</th>
                  <th className="p-4 text-left">Total</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b">
                    <td className="p-4">{order.id}</td>
                    <td className="p-4">{order.userId}</td>
                    <td className="p-4">{order.recipientName}</td>
                    <td className="p-4">Rs {order.total}</td>
                    <td className="p-4 flex gap-2 items-center">
                      <select
                        value={order.status || 'processing'}
                        onChange={e => handleStatusChange(order, e.target.value)}
                        className="border rounded px-2 py-1 mr-2"
                      >
                        <option value="processing">Processing</option>
                        <option value="confirmed">Order Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                        onClick={() => handleView(order)}
                      >
                        View
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                        onClick={() => handleDelete(order.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={5} className="text-center p-8 text-gray-500">No orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl"
              onClick={closeModal}
            >&times;</button>
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <div className="mb-2"><b>Order ID:</b> {selectedOrder.id}</div>
            <div className="mb-2"><b>User ID:</b> {selectedOrder.userId}</div>
            <div className="mb-2"><b>Recipient Name:</b> {selectedOrder.recipientName}</div>
            <div className="mb-2"><b>Total:</b> Rs {selectedOrder.total}</div>
            <div className="mb-2"><b>Address:</b> {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.postalCode}</div>
            <div className="mb-2"><b>Status:</b> {selectedOrder.status || 'processing'}</div>
            <div className="mb-2"><b>Items:</b></div>
            <ul className="list-disc pl-6">
              {Array.isArray(selectedOrder.items)
                ? selectedOrder.items.map((item, idx) => (
                    <li key={idx}>{item.title} x {item.quantity}</li>
                  ))
                : (() => {
                    try {
                      const items = JSON.parse(selectedOrder.items);
                      return items.map((item, idx) => (
                        <li key={idx}>{item.title} x {item.quantity}</li>
                      ));
                    } catch {
                      return <li>Could not parse items</li>;
                    }
                  })()}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage; 