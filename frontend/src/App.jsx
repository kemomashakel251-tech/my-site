import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components & Layout
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import Storefront from './pages/Storefront';
import Tracking from './pages/Tracking';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Coupons from './pages/Coupons';
import Settings from './pages/Settings';
import Logs from './pages/Logs';

/**
 * Gatekeeper component for checking token existence.
 * Redirects unauthorized users to the secure login page.
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { token, user, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ fontWeight: 'bold' }}>Loading / جاري التحميل...</div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

/**
 * Full layout for authenticated admin sessions.
 * Displays Sidebar next to Main Viewport with Top Navbar.
 */
function AdminLayout() {
  return (
    <div className="dashboard-layout">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Main Viewport wrapper */}
      <div className="main-content">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic page container */}
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          
          {/* Manager & Admin Only routes */}
          <Route 
            path="products" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <Products />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="categories" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <Categories />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="customers" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <Customers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="coupons" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <Coupons />
              </ProtectedRoute>
            } 
          />

          {/* Admin Only routes */}
          <Route 
            path="settings" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="logs" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Logs />
              </ProtectedRoute>
            } 
          />

          {/* Fallback inside admin panel */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              {/* Public Storefront Landing Pages */}
              <Route path="/" element={<Storefront />} />
              <Route path="/product/:id" element={<Storefront />} />
              <Route path="/track" element={<Tracking />} />

              {/* Secure Login Portal */}
              <Route path="/admin/login" element={<Login />} />
              
              {/* Authenticated Admin Control Panel */}
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                } 
              />

              {/* Fallback to storefront */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
