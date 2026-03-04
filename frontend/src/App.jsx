import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './layout/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import Stock from './pages/Stock';
import PurchaseOrders from './pages/PurchaseOrders';
import Integrations from './pages/Integrations';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="stock" element={<Stock />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="settings" element={<div className="p-8 text-gray-500">Configurações em breve...</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
