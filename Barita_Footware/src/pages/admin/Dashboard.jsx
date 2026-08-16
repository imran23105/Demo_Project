import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign, ShoppingCart, Users, Package, AlertTriangle, TrendingUp,
  ArrowUpRight, ArrowDownRight, PackageX, Activity, Sparkles,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from "recharts";
import { monthlyFinance, categoryRevenue, todayStats } from "../../data/finance";
import { topSellingProducts, orderStatusCounts } from "../../data/reports";
import { orders } from "../../data/orders";
import { formatCurrency, formatCurrencyShort } from "../../utils/formatCurrency";

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState("30 Days");

  const kpis = [
    { label: "Total Revenue", value: formatCurrency(2485000), change: "+18.4%", isPos: true, icon: DollarSign, color: "bg-blue-50 text-secondary" },
    { label: "Today's Sales", value: formatCurrency(todayStats.revenue), change: "+8.2%", isPos: true, icon: TrendingUp, color: "bg-green-50 text-green-600" },
    { label: "Total Orders", value: "500", change: "+12.1%", isPos: true, icon: ShoppingCart, color: "bg-purple-50 text-purple-600" },
    { label: "Customers", value: "1,200", change: "+24.5%", isPos: true, icon: Users, color: "bg-amber-50 text-amber-600" },
    { label: "Products", value: "250", change: "Active", isPos: true, icon: Package, color: "bg-indigo-50 text-indigo-600" },
    { label: "Low Stock Alert", value: "18", change: "Needs Action", isPos: false, icon: AlertTriangle, color: "bg-yellow-50 text-yellow-600" },
    { label: "Out Of Stock", value: "7", change: "Critical", isPos: false, icon: PackageX, color: "bg-red-50 text-red-600" },
    { label: "Net Profit", value: formatCurrency(892000), change: "+14.8%", isPos: true, icon: Activity, color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary via-primary-800 to-secondary rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-bold mb-2">
            <Sparkles size={12} /> Executive Overview
          </div>
          <h2 className="font-heading font-black text-2xl">BRITA Business Analytics</h2>
          <p className="text-slate-300 text-xs mt-1">Real-time performance metrics across sales, inventory, and profit.</p>
        </div>

        {/* Time Filters */}
        <div className="flex bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20">
          {["Today", "7 Days", "30 Days", "6 Months", "1 Year"].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFilter(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeFilter === tf ? "bg-white text-primary shadow-sm" : "text-slate-300 hover:text-white"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card hover:shadow-card-hover transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">{kpi.label}</span>
                <div className={`w-9 h-9 rounded-xl ${kpi.color} flex items-center justify-center`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="font-heading font-black text-2xl text-primary leading-none mb-2">{kpi.value}</div>
              <div className="flex items-center gap-1 text-xs">
                {kpi.isPos ? (
                  <span className="text-green-600 font-semibold flex items-center"><ArrowUpRight size={14} />{kpi.change}</span>
                ) : (
                  <span className="text-red-500 font-semibold flex items-center"><ArrowDownRight size={14} />{kpi.change}</span>
                )}
                <span className="text-slate-400 text-[10px]">vs last period</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row 1: Revenue Overview & Sales by Category */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Overview Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading font-bold text-lg text-primary">Revenue & Net Profit Trend</h3>
              <p className="text-xs text-slate-400">Monthly financial performance breakdown</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-secondary inline-block" /> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-accent inline-block" /> Net Profit</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyFinance}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => formatCurrencyShort(v)} />
                <Tooltip formatter={(value) => [formatCurrency(value), ""]} />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#revGrad)" name="Revenue" />
                <Area type="monotone" dataKey="netProfit" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#profitGrad)" name="Net Profit" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col">
          <h3 className="font-heading font-bold text-lg text-primary mb-1">Sales by Category</h3>
          <p className="text-xs text-slate-400 mb-4">Revenue distribution across categories</p>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryRevenue}
                  dataKey="revenue"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {categoryRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [formatCurrency(v), "Revenue"]} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Order Status Analytics & Top Selling Products */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Status Cards */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
          <h3 className="font-heading font-bold text-lg text-primary mb-4">Order Status Breakdown</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(orderStatusCounts).map(([status, count]) => {
              const bgMap = {
                Pending: "bg-amber-50 text-amber-700 border-amber-100",
                Confirmed: "bg-blue-50 text-blue-700 border-blue-100",
                Processing: "bg-indigo-50 text-indigo-700 border-indigo-100",
                Packed: "bg-purple-50 text-purple-700 border-purple-100",
                Shipped: "bg-cyan-50 text-cyan-700 border-cyan-100",
                Delivered: "bg-green-50 text-green-700 border-green-100",
                Cancelled: "bg-red-50 text-red-700 border-red-100",
                Returned: "bg-orange-50 text-orange-700 border-orange-100",
              };
              return (
                <div key={status} className={`p-3 rounded-2xl border ${bgMap[status] || "bg-slate-50 text-slate-700"}`}>
                  <p className="text-[11px] font-medium">{status}</p>
                  <p className="font-heading font-black text-xl leading-tight mt-0.5">{count}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
          <h3 className="font-heading font-bold text-lg text-primary mb-4">Top Selling Footwear</h3>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topSellingProducts.slice(0, 5).map((p) => (
                  <tr key={p.sku}>
                    <td className="font-bold text-secondary">#{p.rank}</td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <img src={p.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-slate-50" />
                        <div>
                          <p className="font-bold text-primary text-xs">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-info">{p.category}</span></td>
                    <td className="font-semibold">{p.units}</td>
                    <td className="font-bold text-primary">{formatCurrency(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
