import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

export default function OfferBanner() {
  return (
    <section className="section-padding bg-primary overflow-hidden relative">
      {/* BG decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="container-max relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-danger/20 border border-danger/30 text-danger rounded-full px-4 py-1.5 text-sm font-semibold mb-5">
              <Zap size={14} className="fill-danger" /> Limited Time Offer
            </div>
            <h2 className="font-heading font-black text-white leading-tight mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
              UP TO{" "}
              <span className="text-accent">40% OFF</span>
              <br />
              STEP INTO SOMETHING NEW
            </h2>
            <p className="text-slate-300 text-base mb-6 max-w-md">
              Grab your favorite pair before they're gone. Exclusive discounts on premium collections — today only!
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/sale" id="offer-shop-btn" className="btn-accent flex items-center gap-2 group">
                Shop Sale <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/shop" className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-white/30 text-white font-semibold hover:border-white hover:bg-white/10 transition-all">
                Browse All
              </Link>
            </div>
            {/* Countdown */}
            <div className="flex items-center gap-4 mt-8">
              <p className="text-slate-400 text-sm">Offer ends in:</p>
              {["08", "24", "17"].map((val, i) => (
                <div key={i} className="text-center">
                  <div className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 min-w-[2.5rem]">
                    <span className="font-heading font-bold text-white text-lg leading-none">{val}</span>
                  </div>
                  <p className="text-slate-500 text-[9px] mt-1 uppercase tracking-wider">
                    {["Hrs", "Min", "Sec"][i]}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right – product collage */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-3"
          >
            {[
              { img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop", off: "30%", label: "Men's" },
              { img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=300&fit=crop", off: "40%", label: "Women's" },
              { img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=300&h=300&fit=crop", off: "25%", label: "Sneakers" },
              { img: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=300&h=300&fit=crop", off: "35%", label: "Sandals" },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="relative rounded-2xl overflow-hidden aspect-square group cursor-pointer"
              >
                <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
                <div className="absolute top-2 right-2 bg-danger text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.off} OFF
                </div>
                <div className="absolute bottom-2 left-2">
                  <p className="text-white text-xs font-semibold">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
