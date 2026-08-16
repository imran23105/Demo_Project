import React from "react";
import { DollarSign, TrendingUp, ArrowDownRight, ArrowUpRight, PieChart as PieIcon, CreditCard } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { monthlyFinance, expenseBreakdown } from "../../data/finance";
import { formatCurrency } from "../../utils/formatCurrency";

export default function Finance() {
  const latest = monthlyFinance[monthlyFinance.length - 1];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-black text-2xl text-primary">Financial & Profit Analytics Center</h2>
        <p className="text-slate-400 text-xs mt-0.5">Comprehensive profit & loss statements, COGS, margins, and operational expenses.</p>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Annual Gross Revenue", val: formatCurrency(monthlyFinance.reduce((s, m) => s + m.revenue, 0)), change: "+18.2%", color: "bg-blue-50 text-secondary" },
          { label: "Cost of Goods Sold (COGS)", val: formatCurrency(monthlyFinance.reduce((s, m) => s + m.cogs, 0)), change: "45% of Rev", color: "bg-red-50 text-red-600" },
          { label: "Gross Operating Profit", val: formatCurrency(monthlyFinance.reduce((s, m) => s + m.grossProfit, 0)), change: "+16.5%", color: "bg-green-50 text-green-600" },
          { label: "Net Profit Margin", val: formatCurrency(monthlyFinance.reduce((s, m) => s + m.netProfit, 0)), change: "24.8% Margin", color: "bg-amber-50 text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
            <p className="text-xs text-slate-400 font-medium mb-1">{s.label}</p>
            <p className="font-heading font-black text-2xl text-primary leading-tight">{s.val}</p>
            <p className="text-[11px] font-bold text-slate-500 mt-2">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue vs Expenses */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
          <h3 className="font-heading font-bold text-lg text-primary mb-1">Revenue vs. Operating Expenses</h3>
          <p className="text-xs text-slate-400 mb-6">Comparison of top-line revenue against total operating expenses</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyFinance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₹${v/1000}K`} />
                <Tooltip formatter={(v) => [formatCurrency(v), ""]} />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} name="Revenue" />
                <Area type="monotone" dataKey="operatingExpenses" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col">
          <h3 className="font-heading font-bold text-lg text-primary mb-1">Expense Breakdown</h3>
          <p className="text-xs text-slate-400 mb-4">Allocation of business expenditures</p>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={80}>
                  {expenseBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, "Percentage"]} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
