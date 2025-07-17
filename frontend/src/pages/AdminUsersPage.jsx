import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:8080/users');
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setUsers([]);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-green-700">User Details</h1>
        {loading ? (
          <div>Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-lg">
              <thead>
                <tr className="bg-green-100 text-green-700">
                  <th className="p-4 text-left">User ID</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b">
                    <td className="p-4">{user.id}</td>
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.role}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={4} className="text-center p-8 text-gray-500">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage; 