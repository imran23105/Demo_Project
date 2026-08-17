import React, { useState } from "react";
import { Store, CreditCard, Truck, FileText, Share2, Check } from "lucide-react";
import { BRAND } from "../../utils/constants";
import toast from "react-hot-toast";

export default function Settings() {
  const [storeName, setStoreName] = useState(BRAND.name);
  const [email, setEmail] = useState(BRAND.email);
  const [phone, setPhone] = useState(BRAND.phone);
  const [address, setAddress] = useState(BRAND.address);
  const [gst, setGst] = useState(BRAND.gst);

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Store Settings Saved!");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-heading font-black text-2xl text-primary">Store & System Settings</h2>
        <p className="text-slate-400 text-xs mt-0.5">Configure store info, WhatsApp alerts, shipping parameters, GST, and payment gateways.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Info */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
          <h3 className="font-heading font-bold text-base text-primary flex items-center gap-2">
            <Store size={18} className="text-secondary" /> General Store Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Store Name</label>
              <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="input-field text-xs" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Support Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field text-xs" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Support Phone</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field text-xs" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">GST Number</label>
              <input type="text" value={gst} onChange={(e) => setGst(e.target.value)} className="input-field text-xs font-mono" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Store Warehouse Address</label>
            <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} className="input-field text-xs" />
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
          <h3 className="font-heading font-bold text-base text-primary flex items-center gap-2">
            <Truck size={18} className="text-accent" /> Shipping & Delivery Rules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Free Shipping Order Threshold (₹)</label>
              <input type="number" defaultValue={999} className="input-field text-xs" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Standard Shipping Charge (₹)</label>
              <input type="number" defaultValue={99} className="input-field text-xs" />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button type="submit" id="save-settings-btn" className="btn-primary px-8 py-3 flex items-center gap-2 text-sm font-bold shadow-glow-blue">
            <Check size={16} /> Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
}
