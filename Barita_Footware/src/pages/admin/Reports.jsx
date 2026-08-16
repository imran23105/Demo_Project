import React, { useState } from "react";
import { BarChart3, Calendar, Download, TrendingUp } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { reportsData } from "../../data/reports";
import { formatCurrency } from "../../utils/formatCurrency";

export default function Reports() {
  const [range, setRange] = useState("month");
  const data = reportsData[range] || reportsData.month;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-heading font-black text-2xl text-primary">Advanced Business Reports</h2>
          <p className="text-slate-400 text-xs mt-0.5">Filter sales, orders, AOV, conversion rates, and profit per period.</p>
        </div>

        {/* Date Filter Buttons */}
        <div className="flex bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
          {["today", "week", "month", "year"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                range === r ? "bg-secondary text-white shadow-glow-blue" : "text-slate-600 hover:text-primary"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", val: formatCurrency(data.revenue) },
          { label: "Total Orders", val: data.orders },
          { label: "Average Order Value (AOV)", val: formatCurrency(data.aov) },
          { label: "Net Profit", val: formatCurrency(data.profit) },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
            <p className="text-xs text-slate-400 font-medium mb-1">{m.label}</p>
            <p className="font-heading font-black text-2xl text-primary leading-tight">{m.val}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
        <h3 className="font-heading font-bold text-lg text-primary mb-4">Period Sales Performance</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.daily || data.monthly || data.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey={data.monthly ? "month" : "day"} stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₹${v/1000}K`} />
              <Tooltip formatter={(v) => [formatCurrency(v), "Revenue"]} />
              <Bar dataKey="revenue" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
