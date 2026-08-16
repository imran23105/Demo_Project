import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, ShieldCheck, Copy } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { DEMO_CUSTOMER } from "../../utils/constants";
import toast from "react-hot-toast";

export default function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { customerLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = customerLogin(email, password);
    if (res.success) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      toast.error(res.error);
    }
  };

  const fillDemo = () => {
    setEmail(DEMO_CUSTOMER.email);
    setPassword(DEMO_CUSTOMER.password);
    toast.success("Filled demo credentials!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md bg-white rounded-3xl p-8 border border-white/20 shadow-premium"
    >
      <div className="text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center">
            <span className="text-white font-heading font-black text-lg">B</span>
          </div>
        </Link>
        <h1 className="font-heading font-black text-2xl text-primary">Customer Portal</h1>
        <p className="text-slate-500 text-xs mt-1">Sign in to manage orders, wishlist & account</p>
      </div>

      {/* Quick Demo Pill */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mb-6 text-xs text-amber-800 flex items-center justify-between">
        <div>
          <p className="font-bold">Demo Customer Credentials</p>
          <p className="font-mono text-[11px] mt-0.5">{DEMO_CUSTOMER.email} / {DEMO_CUSTOMER.password}</p>
        </div>
        <button
          onClick={fillDemo}
          id="fill-customer-demo-btn"
          className="btn-accent py-1.5 px-3 text-[11px] font-bold shrink-0 flex items-center gap-1"
        >
          <Copy size={12} /> Auto Fill
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              placeholder="customer@brita-demo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-10"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-10"
              required
            />
          </div>
        </div>

        <button type="submit" id="customer-login-submit" className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm">
          Sign In <ArrowRight size={16} />
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
        Are you the store owner?{" "}
        <Link to="/admin/login" className="text-secondary font-bold hover:underline">
          Go to Admin Login →
        </Link>
      </div>
    </motion.div>
  );
}
