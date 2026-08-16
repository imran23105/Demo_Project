import React from "react";
import { Tag, Plus, Check, Clock } from "lucide-react";
import { coupons } from "../../data/coupons";

export default function Coupons() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading font-black text-2xl text-primary">Coupons & Offer Campaigns</h2>
          <p className="text-slate-400 text-xs mt-0.5">Manage promo codes, discount percentages, limits, and usage statistics.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-xs py-2.5">
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono font-black text-lg text-secondary tracking-wider">{c.code}</span>
                <p className="text-xs text-slate-500 mt-0.5">{c.description}</p>
              </div>
              <span className={`badge ${c.status === "Active" ? "badge-success" : "badge-danger"}`}>{c.status}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 text-slate-600">
              <p>Min Order: <strong>₹{c.minOrder}</strong></p>
              <p>Max Discount: <strong>₹{c.maxDiscount}</strong></p>
              <p>Expiry: <strong>{c.expiry}</strong></p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Usage</span>
                <span>{c.used} / {c.limit}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: `${(c.used / c.limit) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
