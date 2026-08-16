import React, { useState } from "react";
import { motion } from "framer-motion";
import { Package, Heart, MapPin, User, LogOut, ShoppingBag, Clock, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { orders } from "../../data/orders";
import { formatCurrency } from "../../utils/formatCurrency";
import ProductCard from "../../components/product/ProductCard";

export default function CustomerDashboard() {
  const { customer, customerLogout } = useAuth();
  const { wishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState("orders");

  const myOrders = orders.slice(0, 5);

  const stats = [
    { label: "Total Orders", value: customer?.orders || 8, icon: Package, color: "bg-blue-50 text-secondary" },
    { label: "Active Orders", value: 2, icon: Clock, color: "bg-amber-50 text-amber-600" },
    { label: "Wishlist Items", value: wishlist.length || 5, icon: Heart, color: "bg-pink-50 text-pink-600" },
    { label: "Total Spent", value: formatCurrency(customer?.totalSpent || 24890), icon: ShoppingBag, color: "bg-green-50 text-green-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container-max">
        {/* Profile Banner */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-card mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white text-2xl font-black shadow-md">
              {customer?.name?.charAt(0) || "C"}
            </div>
            <div>
              <h1 className="font-heading font-black text-2xl text-primary">{customer?.name || "Demo Customer"}</h1>
              <p className="text-slate-500 text-xs mt-0.5">{customer?.email} • {customer?.phone}</p>
            </div>
          </div>
          <button onClick={customerLogout} className="btn-secondary text-xs px-4 py-2 flex items-center gap-2 text-danger border-red-200 hover:bg-red-50 hover:border-red-400">
            <LogOut size={14} /> Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">{s.label}</p>
                  <p className="font-heading font-black text-xl text-primary mt-0.5">{s.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs Bar - Scrollable and responsive on mobile */}
        <div className="flex border-b border-slate-200 mb-6 gap-2 sm:gap-6 overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
          {[
            { id: "orders", label: "My Orders", icon: Package },
            { id: "wishlist", label: `Wishlist (${wishlist.length})`, icon: Heart },
            { id: "addresses", label: "Saved Addresses", icon: MapPin },
            { id: "profile", label: "Profile Settings", icon: User },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-2.5 sm:px-1 sm:py-0 sm:pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 rounded-lg sm:rounded-none ${
                  activeTab === t.id
                    ? "border-secondary text-secondary bg-secondary/5 sm:bg-transparent"
                    : "border-transparent text-slate-500 hover:text-primary hover:bg-slate-100 sm:hover:bg-transparent"
                }`}
              >
                <Icon size={16} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-heading font-bold text-sm text-primary">Recent Orders</div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myOrders.map((o) => (
                    <tr key={o.id}>
                      <td className="font-mono font-bold text-secondary">{o.id}</td>
                      <td className="text-xs">{new Date(o.date).toLocaleDateString("en-IN")}</td>
                      <td className="text-xs">{o.products.map((p) => p.name).join(", ")}</td>
                      <td className="font-bold">{formatCurrency(o.total)}</td>
                      <td>
                        <span className={`badge ${o.status === "Delivered" ? "badge-success" : o.status === "Cancelled" ? "badge-danger" : "badge-warning"}`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "wishlist" && (
          <div>
            {wishlist.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                <Heart size={40} className="text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">Your wishlist is empty</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {wishlist.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "addresses" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border-2 border-secondary/30 shadow-card relative">
              <span className="badge bg-secondary text-white text-[10px] absolute top-4 right-4">DEFAULT</span>
              <h3 className="font-heading font-bold text-sm text-primary mb-2">Home Address</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                42, Green Park Avenue, Bandra West<br />
                Mumbai, Maharashtra – 400050<br />
                Phone: +91 9876543210
              </p>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card max-w-lg space-y-4">
            <h3 className="font-heading font-bold text-base text-primary">Personal Details</h3>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Full Name</label>
              <input type="text" defaultValue={customer?.name} className="input-field" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Email</label>
              <input type="email" defaultValue={customer?.email} className="input-field" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Phone</label>
              <input type="tel" defaultValue={customer?.phone} className="input-field" />
            </div>
            <button className="btn-primary py-2.5 px-6 text-xs">Save Changes</button>
          </div>
        )}
      </div>
    </div>
  );
}
