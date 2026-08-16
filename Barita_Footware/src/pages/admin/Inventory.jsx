import React, { useState } from "react";
import { Warehouse, AlertTriangle, PackageX, DollarSign, Search } from "lucide-react";
import { inventory, inventoryStats } from "../../data/inventory";
import { formatCurrency } from "../../utils/formatCurrency";

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = inventory.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" ? true : item.stockStatus.toLowerCase().replace(/\s+/g, "-") === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-black text-2xl text-primary">Inventory & Stock Tracking</h2>
        <p className="text-slate-400 text-xs mt-0.5">Real-time warehouse stock levels, reorder thresholds, and inventory values.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4">
        {[
          { label: "Total SKU Items", val: inventoryStats.totalProducts, icon: Warehouse, color: "bg-blue-50 text-secondary" },
          { label: "Total Stock Units", val: inventoryStats.totalUnits.toLocaleString(), icon: Warehouse, color: "bg-purple-50 text-purple-600" },
          { label: "Low Stock Alert", val: inventoryStats.lowStock, icon: AlertTriangle, color: "bg-amber-50 text-amber-600" },
          { label: "Out of Stock", val: inventoryStats.outOfStock, icon: PackageX, color: "bg-red-50 text-red-600" },
          { label: "Total Stock Value", val: formatCurrency(inventoryStats.inventoryValue), icon: DollarSign, color: "bg-green-50 text-green-600" },
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

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search SKU, product name, or warehouse location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field text-xs pl-10 py-2"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none pb-1 sm:pb-0">
          {["all", "in-stock", "low-stock", "out-of-stock"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all shrink-0 ${
                statusFilter === st ? "bg-secondary text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {st.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Stock Level</th>
                <th>Location</th>
                <th>Unit Cost</th>
                <th>Stock Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 15).map((item) => (
                <tr key={item.sku}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <img src={item.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover bg-slate-50" />
                      <span className="font-bold text-primary max-w-xs truncate">{item.name}</span>
                    </div>
                  </td>
                  <td className="font-mono text-xs text-slate-500">{item.sku}</td>
                  <td><span className="badge badge-info capitalize">{item.category}</span></td>
                  <td className="font-bold text-slate-800">{item.stock} units</td>
                  <td className="text-xs font-mono text-slate-500">{item.location}</td>
                  <td className="text-xs">{formatCurrency(item.unitCost)}</td>
                  <td className="font-bold text-primary">{formatCurrency(item.stockValue)}</td>
                  <td>
                    <span className={`badge ${item.stockStatus === "In Stock" ? "badge-success" : item.stockStatus === "Low Stock" ? "badge-warning" : "badge-danger"}`}>
                      {item.stockStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
