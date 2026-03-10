import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { Layout } from './layout/Layout';
import { AuthProvider, useAuth } from './api/AuthContext';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import Stock from './pages/Stock';
import PurchaseOrders from './pages/PurchaseOrders';
import Integrations from './pages/Integrations';
import Login from './pages/Login';
import Reports from './pages/Reports';
import History from './pages/History';
import Settings from './pages/Settings';
import Register from './pages/Register';
import Sales from './pages/Sales';
import Clients from './pages/Clients';
import CRM from './pages/CRM';
import Finance from './pages/Finance';
import EnterpriseAI from './pages/EnterpriseAI';
import Users from './pages/admin/Users';
import Logs from './pages/admin/Logs';
import Layout from './layout/Layout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="stock" element={<Stock />} />
            <Route path="purchase-orders" element={<PurchaseOrders />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
            <Route path="reports" element={<Reports />} />

            <Route path="sales" element={<Sales />} />
            <Route path="crm" element={<CRM />} />
            <Route path="finance" element={<Finance />} />
            <Route path="ai" element={<EnterpriseAI />} />
            <Route path="clients" element={<Clients />} />
            <Route path="purchases" element={<PurchaseOrders />} />

            {/* Admin Routes */}
            <Route path="admin/users" element={<Users />} />
            <Route path="admin/logs" element={<Logs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
