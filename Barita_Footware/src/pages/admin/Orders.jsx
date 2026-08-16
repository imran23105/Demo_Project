import React, { useState } from "react";
import { Search, Eye, CheckCircle2, Clock, X, ChevronRight } from "lucide-react";
import { orders as initialOrders } from "../../data/orders";
import { formatCurrency } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const [orderList, setOrderList] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = orderList.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" ? true : o.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const handleStatusChange = (orderId, newStatus) => {
    setOrderList(
      orderList.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    toast.success(`Order ${orderId} updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-black text-2xl text-primary">Enterprise Order Management</h2>
        <p className="text-slate-400 text-xs mt-0.5">Track fulfillment, timeline updates, customer orders, and status flows.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search order ID or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field text-xs pl-10 py-2"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field text-xs py-2 w-full sm:w-48"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Products</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 15).map((o) => (
                <tr key={o.id} className="cursor-pointer" onClick={() => setSelectedOrder(o)}>
                  <td className="font-mono font-bold text-secondary">{o.id}</td>
                  <td>
                    <p className="font-bold text-primary text-xs">{o.customer.name}</p>
                    <p className="text-[10px] text-slate-400">{o.customer.email}</p>
                  </td>
                  <td className="text-xs">{new Date(o.date).toLocaleDateString("en-IN")}</td>
                  <td className="text-xs">{o.products.length} item(s)</td>
                  <td className="font-bold text-primary">{formatCurrency(o.total)}</td>
                  <td className="text-xs">{o.payment}</td>
                  <td>
                    <span className={`badge ${o.status === "Delivered" ? "badge-success" : o.status === "Cancelled" ? "badge-danger" : "badge-warning"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); }}
                      className="btn-ghost p-1.5 text-secondary hover:bg-secondary/10 text-xs flex items-center gap-1 font-semibold"
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-bold text-lg text-primary">Order {selectedOrder.id}</h3>
                <p className="text-xs text-slate-400">Placed on {new Date(selectedOrder.date).toLocaleString("en-IN")}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-primary"><X size={18} /></button>
            </div>

            {/* Timeline Stepper */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Order Status Timeline</p>
              <div className="flex items-center justify-between relative bg-slate-50 p-4 rounded-2xl border border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-none gap-3">
                {["Placed", "Confirmed", "Processing", "Packed", "Shipped", "Delivered"].map((stepLabel, idx) => {
                  const stepIndex = ["Placed", "Confirmed", "Processing", "Packed", "Shipped", "Delivered"].indexOf(selectedOrder.status);
                  const isDone = idx <= (stepIndex >= 0 ? stepIndex : 1);
                  return (
                    <div key={stepLabel} className="flex flex-col items-center z-10 text-center shrink-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isDone ? "bg-secondary text-white" : "bg-slate-200 text-slate-400"}`}>
                        {isDone ? <CheckCircle2 size={14} /> : idx + 1}
                      </div>
                      <span className="text-[10px] mt-1 font-semibold text-slate-600">{stepLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Change Status Dropdown */}
            <div className="flex items-center gap-3 bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
              <span className="text-xs font-bold text-amber-900">Update Status:</span>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                className="input-field text-xs py-1.5 w-48 bg-white font-semibold"
              >
                {["Pending", "Confirmed", "Processing", "Packed", "Shipped", "Delivered", "Cancelled", "Returned"].map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Order Items */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Order Products</p>
              <div className="space-y-2">
                {selectedOrder.products.map((p, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl text-xs">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-white" />
                      <div>
                        <p className="font-bold text-primary">{p.name}</p>
                        <p className="text-slate-400">Size: {p.size} | Color: {p.color} | Qty: {p.qty}</p>
                      </div>
                    </div>
                    <span className="font-bold text-primary">{formatCurrency(p.price * p.qty)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Payment info */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <p className="font-bold text-slate-500 uppercase tracking-wider mb-1">Customer & Address</p>
                <p className="font-bold text-primary">{selectedOrder.customer.name}</p>
                <p className="text-slate-600">{selectedOrder.address.line}, {selectedOrder.address.city}, {selectedOrder.address.state}</p>
                <p className="text-slate-500 mt-1">Phone: {selectedOrder.customer.phone}</p>
              </div>
              <div>
                <p className="font-bold text-slate-500 uppercase tracking-wider mb-1">Payment Summary</p>
                <p className="text-slate-600">Method: <strong>{selectedOrder.payment}</strong></p>
                <p className="text-slate-600">Status: <strong className="text-green-600">{selectedOrder.paymentStatus}</strong></p>
                <p className="font-heading font-black text-sm text-primary mt-2">Total: {formatCurrency(selectedOrder.total)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
