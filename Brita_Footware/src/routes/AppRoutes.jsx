import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";

// Customer Pages
import Home from "../pages/customer/Home";
import Shop from "../pages/customer/Shop";
import ProductDetailsPage from "../pages/customer/ProductDetailsPage";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import OrderSuccess from "../pages/customer/OrderSuccess";
import CustomerLogin from "../pages/customer/CustomerLogin";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import Wishlist from "../pages/customer/Wishlist";

// Admin Pages
import AdminLogin from "../pages/admin/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import Inventory from "../pages/admin/Inventory";
import AdminOrders from "../pages/admin/Orders";
import Customers from "../pages/admin/Customers";
import Finance from "../pages/admin/Finance";
import Reports from "../pages/admin/Reports";
import Coupons from "../pages/admin/Coupons";
import CMS from "../pages/admin/CMS";
import Returns from "../pages/admin/Returns";
import Notifications from "../pages/admin/Notifications";
import Settings from "../pages/admin/Settings";

import { useAuth } from "../context/AuthContext";

function ProtectedAdmin({ children }) {
  const { admin } = useAuth();
  return admin ? children : <Navigate to="/admin/login" replace />;
}

function ProtectedCustomer({ children }) {
  const { customer } = useAuth();
  return customer ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Customer Routes ── */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/men" element={<Shop category="men" />} />
        <Route path="/women" element={<Shop category="women" />} />
        <Route path="/sneakers" element={<Shop category="sneakers" />} />
        <Route path="/new-arrivals" element={<Shop isNew />} />
        <Route path="/sale" element={<Shop isSale />} />
        <Route path="/product/:slug" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route
          path="/dashboard"
          element={<ProtectedCustomer><CustomerDashboard /></ProtectedCustomer>}
        />
        <Route path="/wishlist" element={<Wishlist />} />
      </Route>

      {/* ── Auth Routes ── */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<CustomerLogin />} />
      </Route>

      {/* ── Admin Auth ── */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ── Admin Routes ── */}
      <Route
        path="/admin"
        element={<ProtectedAdmin><AdminLayout /></ProtectedAdmin>}
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="finance" element={<Finance />} />
        <Route path="reports" element={<Reports />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="cms" element={<CMS />} />
        <Route path="returns" element={<Returns />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
