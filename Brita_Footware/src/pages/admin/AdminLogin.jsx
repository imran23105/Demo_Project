import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, ArrowRight, Copy } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { DEMO_ADMIN } from "../../utils/constants";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = adminLogin(email, password);
    if (res.success) {
      toast.success("Welcome, Admin!");
      navigate("/admin/dashboard");
    } else {
      toast.error(res.error);
    }
  };

  const fillDemo = () => {
    setEmail(DEMO_ADMIN.email);
    setPassword(DEMO_ADMIN.password);
    toast.success("Filled owner credentials!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-900 to-secondary-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-glow-blue">
            <Shield size={24} className="text-white" />
          </div>
          <h1 className="font-heading font-black text-2xl text-primary">Store Owner Login</h1>
          <p className="text-slate-500 text-xs mt-1">BRITA FOOTWEARS Admin Portal</p>
        </div>

        {/* Credentials Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 mb-6 text-xs text-blue-900 flex items-center justify-between">
          <div>
            <p className="font-bold">Store Owner Credentials</p>
            <p className="font-mono text-[11px] mt-0.5">{DEMO_ADMIN.email} / {DEMO_ADMIN.password}</p>
          </div>
          <button
            onClick={fillDemo}
            id="fill-admin-demo-btn"
            className="btn-primary py-1.5 px-3 text-[11px] font-bold shrink-0 flex items-center gap-1"
          >
            <Copy size={12} /> Auto Fill
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Owner Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="owner@brita-demo.com"
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

          <button
            type="submit"
            id="admin-login-submit"
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm font-bold shadow-glow-blue"
          >
            Access Dashboard <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          <Link to="/" className="hover:text-primary">← Back to Storefront</Link>
        </div>
      </motion.div>
    </div>
  );
}
