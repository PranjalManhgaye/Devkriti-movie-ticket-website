import React from 'react';
import { Navigate } from 'react-router-dom';

// Usage: <AdminRoute><Component/></AdminRoute>
export default function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}
