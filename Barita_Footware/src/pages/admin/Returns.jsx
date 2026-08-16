import React from "react";
import { RotateCcw, DollarSign, CheckCircle2, Clock } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

const mockReturns = [
  { id: "#RET102", orderId: "#BRI10412", customer: "Rahul Kumar", product: "Urban Stride Pro", amount: 2499, status: "Approved", date: "2025-08-15" },
  { id: "#RET101", orderId: "#BRI10344", customer: "Amit Gupta", product: "Metro Runner X", amount: 1899, status: "Pending", date: "2025-08-14" },
  { id: "#RET100", orderId: "#BRI10290", customer: "Pooja Mehta", product: "Blossom Pump Deluxe", amount: 1599, status: "Refunded", date: "2025-08-12" },
];

export default function Returns() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-black text-2xl text-primary">Returns & Refunds Dashboard</h2>
        <p className="text-slate-400 text-xs mt-0.5">Manage customer return requests, inspect reasons, and process automated refunds.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Pending Returns", val: "17", color: "bg-amber-50 text-amber-600" },
          { label: "Approved Returns", val: "42", color: "bg-blue-50 text-secondary" },
          { label: "Total Refunded", val: formatCurrency(84500), color: "bg-green-50 text-green-600" },
          { label: "Return Rate", val: "2.4%", color: "bg-purple-50 text-purple-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card">
            <p className="text-[10px] text-slate-400 font-medium">{s.label}</p>
            <p className="font-heading font-bold text-lg text-primary">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Return ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Refund Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockReturns.map((r) => (
                <tr key={r.id}>
                  <td className="font-mono font-bold text-primary">{r.id}</td>
                  <td className="font-mono text-xs text-secondary">{r.orderId}</td>
                  <td className="font-bold text-slate-800 text-xs">{r.customer}</td>
                  <td className="text-xs">{r.product}</td>
                  <td className="font-bold text-primary">{formatCurrency(r.amount)}</td>
                  <td>
                    <span className={`badge ${r.status === "Refunded" ? "badge-success" : r.status === "Approved" ? "badge-info" : "badge-warning"}`}>
                      {r.status}
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
