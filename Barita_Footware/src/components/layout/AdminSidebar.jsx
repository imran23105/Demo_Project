import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, Warehouse, ShoppingCart, Users,
  TrendingUp, BarChart3, Tag, Layout, RotateCcw, Bell, Settings,
  ChevronLeft, ChevronRight, LogOut, Store, ExternalLink,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: Warehouse, label: "Inventory", href: "/admin/inventory" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: TrendingUp, label: "Finance", href: "/admin/finance" },
  { icon: BarChart3, label: "Reports", href: "/admin/reports" },
  { icon: Tag, label: "Coupons", href: "/admin/coupons" },
  { icon: Layout, label: "CMS", href: "/admin/cms" },
  { icon: RotateCcw, label: "Returns", href: "/admin/returns" },
  { icon: Bell, label: "Notifications", href: "/admin/notifications", badge: 4 },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminSidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, adminLogout } = useAuth();

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="bg-primary h-screen sticky top-0 flex flex-col overflow-hidden shrink-0 z-40"
    >
      {/* Logo */}
      <div className={`flex items-center border-b border-white/10 h-16 ${collapsed ? "justify-center px-3" : "px-5"}`}>
        <Link to="/admin/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-heading font-black text-sm">B</span>
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-w-0"
            >
              <span className="font-heading font-black text-white text-sm leading-none block truncate">BRITA</span>
              <span className="text-[8px] text-slate-500 tracking-[0.2em] leading-none block">ADMIN PANEL</span>
            </motion.div>
          )}
        </Link>
        <button
          onClick={onToggle}
          id="sidebar-toggle-btn"
          className={`ml-auto p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all ${collapsed ? "hidden" : "block"}`}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              id={`admin-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={`admin-nav-item ${isActive ? "active" : ""} ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <div className="relative shrink-0">
                <Icon size={18} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-danger text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Admin info + logout */}
      <div className="border-t border-white/10 p-3 space-y-2">
        {/* Visit Store */}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className={`admin-nav-item text-slate-500 ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Visit Store" : undefined}
        >
          <ExternalLink size={16} className="shrink-0" />
          {!collapsed && <span className="truncate text-xs">Visit Store</span>}
        </a>

        {/* Admin Profile */}
        {!collapsed && admin && (
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">{admin.name.charAt(0)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate">{admin.name}</p>
              <p className="text-slate-500 text-[10px] truncate">{admin.email}</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          id="admin-logout-btn"
          className={`admin-nav-item w-full text-danger hover:text-danger hover:bg-danger/10 ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle (when not collapsed) */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="absolute top-5 -right-3 w-6 h-6 bg-primary border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-md"
        >
          <ChevronRight size={12} />
        </button>
      )}
    </motion.aside>
  );
}
