import React, { useState } from "react";
import { Layout, Image, Edit3, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function CMS() {
  const [heroTitle, setHeroTitle] = useState("Step Into Your Style");
  const [bannerText, setBannerText] = useState("UP TO 40% OFF – STEP INTO SOMETHING NEW");

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("CMS Content Updated!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-black text-2xl text-primary">Content Management System (CMS)</h2>
        <p className="text-slate-400 text-xs mt-0.5">Edit homepage banners, featured collections, announcements, and promotional copy.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
          <h3 className="font-heading font-bold text-base text-primary flex items-center gap-2">
            <Layout size={18} className="text-secondary" /> Hero Banner Settings
          </h3>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Headline Text</label>
            <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="input-field text-xs" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Subheading</label>
            <input type="text" defaultValue="Premium footwear designed for every step." className="input-field text-xs" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">CTA Button Text</label>
            <input type="text" defaultValue="Shop Now" className="input-field text-xs" />
          </div>
          <button type="submit" className="btn-primary text-xs py-2.5 px-6 flex items-center gap-2">
            <Check size={14} /> Save Hero Banner
          </button>
        </form>

        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
          <h3 className="font-heading font-bold text-base text-primary flex items-center gap-2">
            <Image size={18} className="text-accent" /> Promotional Offer Banner
          </h3>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Offer Banner Headline</label>
            <input type="text" value={bannerText} onChange={(e) => setBannerText(e.target.value)} className="input-field text-xs" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Discount Tagline</label>
            <input type="text" defaultValue="Grab your favorite pair before they're gone." className="input-field text-xs" />
          </div>
          <button type="submit" className="btn-accent text-xs py-2.5 px-6 flex items-center gap-2">
            <Check size={14} /> Save Promo Banner
          </button>
        </form>
      </div>
    </div>
  );
}
