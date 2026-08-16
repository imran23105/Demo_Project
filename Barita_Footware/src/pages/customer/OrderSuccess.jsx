import React from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, Home, Download } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

export default function OrderSuccess() {
  const location = useLocation();
  const state = location.state;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { orderId, formData, cart, totalAmount, estimatedDelivery } = state;

  return (
    <div className="min-h-screen bg-slate-50 py-12 flex items-center justify-center">
      <div className="container-max max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-premium text-center"
        >
          {/* Success Checkmark Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-blue"
          >
            <CheckCircle size={48} />
          </motion.div>

          <span className="badge bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-2">
            ORDER CONFIRMED
          </span>
          <h1 className="font-heading font-black text-3xl text-primary mb-2">Thank You For Your Order!</h1>
          <p className="text-slate-500 text-sm mb-6">
            Order ID: <strong className="text-secondary font-mono">{orderId}</strong> • We've sent a receipt to {formData.email || "your email"}.
          </p>

          {/* Details Box */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left space-y-4 mb-8">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <p className="text-xs text-slate-400">Estimated Delivery</p>
                <p className="font-heading font-bold text-sm text-primary">{estimatedDelivery}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Amount</p>
                <p className="font-heading font-bold text-sm text-primary">{formatCurrency(totalAmount)}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Deliver To</p>
              <p className="text-sm font-bold text-primary">{formData.name}</p>
              <p className="text-xs text-slate-600">{formData.address}, {formData.city}, {formData.state} – {formData.pincode}</p>
              <p className="text-xs text-slate-600 mt-0.5">Phone: {formData.phone}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Items Purchased ({cart?.length})</p>
              <div className="space-y-2">
                {cart?.map((item) => (
                  <div key={item.cartItemId} className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium">{item.name} (Size: {item.size}) x{item.quantity}</span>
                    <span className="font-bold text-primary">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/dashboard" className="btn-primary flex items-center gap-2">
              <Package size={16} /> Track Order in Dashboard
            </Link>
            <Link to="/" className="btn-secondary flex items-center gap-2">
              <Home size={16} /> Return to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
