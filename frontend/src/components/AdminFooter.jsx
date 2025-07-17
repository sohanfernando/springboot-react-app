import React from 'react';

const AdminFooter = () => (
  <footer className="w-full py-4 bg-zinc-950 text-center text-gray-400 text-sm border-t border-zinc-800 flex flex-col items-center gap-1">
    <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-2" />
    <div>&copy; {new Date().getFullYear()} Admin Dashboard</div>
    <div className="text-xs text-gray-500">Powered by SohanDev</div>
  </footer>
);

export default AdminFooter; 