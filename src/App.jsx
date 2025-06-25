import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { refreshIdToken, logout } from './store/authSlice';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import FullPageLoader from './components/FullPageLoader';

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const tryRestoreSession = async () => {
    const storedRefreshToken = sessionStorage.getItem('refreshToken');
    if (storedRefreshToken) {
      try {
        await dispatch(refreshIdToken(storedRefreshToken)).unwrap();
      } catch (err) {
        console.error('Session expired or invalid:', err);
        dispatch(logout());
      }
    }
    setLoading(false);
  };

  tryRestoreSession();
}, [dispatch]);


  if (loading) return <FullPageLoader />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={!!user}>
              <Sidebar />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
