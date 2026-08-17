import React, { useState } from "react";
import { Users, Search, ShoppingBag, DollarSign, UserCheck, Eye, X } from "lucide-react";
import { customers as initialCustomers } from "../../data/customers";
import { formatCurrency } from "../../utils/formatCurrency";

export default function Customers() {
  const [customerList, setCustomerList] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filtered = customerList.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-black text-2xl text-primary">Customer Relationship Management (CRM)</h2>
        <p className="text-slate-400 text-xs mt-0.5">Manage 1,200+ registered customers, order histories, total spends, and profiles.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {[
          { label: "Total Registered", val: "1,200", icon: Users, color: "bg-blue-50 text-secondary" },
          { label: "Active Customers", val: "1,020", icon: UserCheck, color: "bg-green-50 text-green-600" },
          { label: "Avg Customer Spend", val: formatCurrency(4250), icon: DollarSign, color: "bg-purple-50 text-purple-600" },
          { label: "Repeat Buyers", val: "68%", icon: ShoppingBag, color: "bg-amber-50 text-amber-600" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-100 shadow-card flex items-center gap-2.5 sm:gap-3 min-w-0 overflow-hidden">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
                <Icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium truncate">{s.label}</p>
                <p className="font-heading font-bold text-sm sm:text-lg text-primary truncate">{s.val}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, email, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field text-xs pl-10 py-2"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>City</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Last Purchase</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 15).map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <img src={c.avatar} alt="" className="w-8 h-8 rounded-full bg-slate-100" />
                      <div>
                        <p className="font-bold text-primary text-xs">{c.name}</p>
                        <p className="text-[10px] text-slate-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-xs text-slate-600">{c.phone}</td>
                  <td className="text-xs font-semibold text-slate-700">{c.city}</td>
                  <td className="font-semibold">{c.orders}</td>
                  <td className="font-bold text-primary">{formatCurrency(c.totalSpent)}</td>
                  <td className="text-xs text-slate-500">{new Date(c.lastPurchase).toLocaleDateString("en-IN")}</td>
                  <td>
                    <span className={`badge ${c.status === "Active" ? "badge-success" : "badge-danger"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => setSelectedCustomer(c)} className="p-1.5 hover:bg-slate-100 rounded-lg text-secondary font-semibold text-xs flex items-center gap-1">
                      <Eye size={14} /> Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-base text-primary">Customer Profile</h3>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-primary"><X size={18} /></button>
            </div>
            <div className="text-center pb-2">
              <img src={selectedCustomer.avatar} alt="" className="w-16 h-16 rounded-full mx-auto mb-2 bg-slate-100" />
              <h4 className="font-heading font-bold text-lg text-primary">{selectedCustomer.name}</h4>
              <p className="text-xs text-slate-400">{selectedCustomer.email}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs text-slate-600">
              <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
              <p><strong>City:</strong> {selectedCustomer.city}</p>
              <p><strong>Total Orders:</strong> {selectedCustomer.orders}</p>
              <p><strong>Total Spent:</strong> {formatCurrency(selectedCustomer.totalSpent)}</p>
              <p><strong>Joined:</strong> {new Date(selectedCustomer.joinedAt).toLocaleDateString("en-IN")}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
