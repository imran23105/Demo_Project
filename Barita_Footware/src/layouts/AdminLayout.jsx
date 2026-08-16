import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Bell, Search } from "lucide-react";
import AdminSidebar from "../components/layout/AdminSidebar";
import { useAuth } from "../context/AuthContext";

const pageTitles = {
  "/admin/dashboard": "Dashboard",
  "/admin/products": "Products",
  "/admin/inventory": "Inventory",
  "/admin/orders": "Orders",
  "/admin/customers": "Customers",
  "/admin/finance": "Finance",
  "/admin/reports": "Reports",
  "/admin/coupons": "Coupons & Offers",
  "/admin/cms": "Content Management",
  "/admin/returns": "Returns & Refunds",
  "/admin/notifications": "Notifications",
  "/admin/settings": "Settings",
};

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();
  const { admin } = useAuth();
  const pageTitle = pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <AdminSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed left-0 top-0 h-full z-50 lg:hidden"
            >
              <AdminSidebar
                collapsed={false}
                onToggle={() => setMobileDrawerOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-all"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-heading font-bold text-base text-primary">{pageTitle}</h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Search */}
            <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-56">
              <Search size={14} className="text-slate-400 shrink-0" />
              <input
                placeholder="Search..."
                className="bg-transparent text-sm text-slate-600 outline-none w-full placeholder:text-slate-400"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-all">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
            </button>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {admin?.name.charAt(0) || "A"}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-primary leading-tight">{admin?.name}</p>
                <p className="text-[10px] text-slate-400">Store Owner</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-4 lg:p-6 min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
