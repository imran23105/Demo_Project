import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, ShieldCheck, Truck, RefreshCw, Flame, Tag } from "lucide-react";

const HERO_DATA = {
  shop: {
    badge: "COMPLETE CATALOG",
    title: "Explore All Footwear",
    tagline: "Discover our full range of premium craftsmanship, timeless designs, and unmatched comfort.",
    bg: "from-slate-950 via-slate-900 to-indigo-950",
    accent: "#6366F1",
    glow: "bg-indigo-500/20",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
    tag: "250+ Models",
    icon: Sparkles,
  },
  men: {
    badge: "MEN'S ESSENTIALS",
    title: "Men's Footwear Collection",
    tagline: "Engineered for style, durability, and maximum performance across formal and casual occasions.",
    bg: "from-slate-950 via-blue-950 to-slate-900",
    accent: "#3B82F6",
    glow: "bg-blue-500/20",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop",
    tag: "Ergonomic & Durable",
    icon: ShieldCheck,
  },
  women: {
    badge: "WOMEN'S LUXURY",
    title: "Women's Footwear Collection",
    tagline: "Sleek contours, plush cushioning, and chic elegance designed to elevate your everyday outfit.",
    bg: "from-slate-950 via-purple-950 to-pink-950",
    accent: "#EC4899",
    glow: "bg-pink-500/20",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=600&fit=crop",
    tag: "Ultra-Light & Chic",
    icon: Sparkles,
  },
  sneakers: {
    badge: "STREET & ATHLETIC",
    title: "High-Performance Sneakers",
    tagline: "Futuristic cushion technology, vibrant colorways, and athletic endurance for non-stop action.",
    bg: "from-slate-950 via-slate-900 to-emerald-950",
    accent: "#10B981",
    glow: "bg-emerald-500/20",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=600&fit=crop",
    tag: "Max Shock Absorption",
    icon: Flame,
  },
  "new-arrivals": {
    badge: "SEASON 2025 DROPS",
    title: "Fresh New Arrivals",
    tagline: "Be the first to step into our latest seasonal releases and exclusive limited-edition drops.",
    bg: "from-slate-950 via-amber-950 to-slate-900",
    accent: "#F59E0B",
    glow: "bg-amber-500/20",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop",
    tag: "Exclusive Release",
    icon: Sparkles,
  },
  sale: {
    badge: "LIMITED TIME OFFERS",
    title: "Exclusive Sale & Discounts",
    tagline: "Unbeatable deals on top-tier footwear. Grab your favorite pairs up to 50% OFF today!",
    bg: "from-slate-950 via-red-950 to-rose-950",
    accent: "#EF4444",
    glow: "bg-red-500/20",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&h=600&fit=crop",
    tag: "Up to 50% OFF",
    icon: Tag,
  },
  wishlist: {
    badge: "SAVED ITEMS",
    title: "Your Wishlist",
    tagline: "Keep track of the footwear you love and purchase anytime with exclusive saved prices.",
    bg: "from-slate-950 via-pink-950 to-purple-950",
    accent: "#EC4899",
    glow: "bg-pink-500/20",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=600&fit=crop",
    tag: "Saved Shoes",
    icon: Sparkles,
  },
  cart: {
    badge: "SHOPPING BAG",
    title: "Review Your Cart",
    tagline: "You are just one step away from stepping into pure comfort and unmatched style.",
    bg: "from-slate-950 via-blue-950 to-indigo-950",
    accent: "#6366F1",
    glow: "bg-indigo-500/20",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=600&fit=crop",
    tag: "Express Checkout",
    icon: ShieldCheck,
  },
};

export default function MiniHero({ category, isNew, isSale, searchQuery, count, pageType }) {
  // Determine key
  let key = pageType || "shop";
  if (searchQuery) key = "shop";
  else if (isNew) key = "new-arrivals";
  else if (isSale) key = "sale";
  else if (category && HERO_DATA[category]) key = category;

  const data = HERO_DATA[key] || HERO_DATA.shop;

  const displayTitle = searchQuery ? `Search: "${searchQuery}"` : data.title;
  const displayTagline = searchQuery ? `Found ${count ?? 0} matching items for your query` : data.tagline;
  const displayBadge = searchQuery ? "SEARCH RESULTS" : data.badge;

  const IconComp = data.icon || Sparkles;

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${data.bg} text-white pt-8 pb-12 transition-all duration-500 border-b border-white/10 shadow-2xl`}>
      {/* Background Decorative Blur & Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 right-1/4 w-96 h-96 ${data.glow} rounded-full blur-3xl opacity-50`} />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-white/5 rounded-full blur-2xl" />
        
        {/* Subtle SVG Grid Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mini-hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mini-hero-grid)" />
        </svg>
      </div>

      <div className="container-max relative z-10">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium"
        >
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={12} className="text-slate-600" />
          <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
          {key !== "shop" && (
            <>
              <ChevronRight size={12} className="text-slate-600" />
              <span className="text-accent font-semibold capitalize">
                {searchQuery ? `Search: ${searchQuery}` : isNew ? "New Arrivals" : isSale ? "Sale" : category || key}
              </span>
            </>
          )}
        </motion.div>

        <div className="grid md:grid-cols-12 gap-6 items-center">
          {/* Main Text Content */}
          <div className="md:col-span-8 lg:col-span-7 space-y-4">
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold tracking-wider text-slate-200"
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: data.accent }} />
              <IconComp size={13} style={{ color: data.accent }} />
              <span>{displayBadge}</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight"
            >
              {displayTitle}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl"
            >
              {displayTagline}
            </motion.p>

            {/* Quick Feature Badges & Count */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium text-slate-300"
            >
              {count !== undefined && (
                <span className="px-3 py-1 bg-white/10 rounded-lg text-white font-bold border border-white/10">
                  {count} {count === 1 ? "Product" : "Products"}
                </span>
              )}
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                <Truck size={13} className="text-accent" /> Free Express Delivery
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                <ShieldCheck size={13} className="text-emerald-400" /> 100% Genuine
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                <RefreshCw size={13} className="text-sky-400" /> 30-Day Easy Return
              </span>
            </motion.div>
          </div>

          {/* Decorative Preview Image Card (Desktop / Tablet) */}
          <div className="hidden md:block md:col-span-4 lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative mx-auto max-w-xs lg:max-w-sm"
            >
              {/* Soft glow background */}
              <div
                className="absolute inset-0 rounded-3xl blur-2xl opacity-40 -z-10"
                style={{ backgroundColor: data.accent }}
              />

              {/* Floating Image Box */}
              <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-white/10 backdrop-blur-md p-2">
                <img
                  src={data.image}
                  alt={data.title}
                  className="w-full h-44 lg:h-52 object-cover rounded-xl transition-transform duration-500 hover:scale-105"
                />
                
                {/* Floating Tag */}
                <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: data.accent }} />
                  {data.tag}
                </div>

                <div className="p-3 text-center">
                  <p className="text-xs font-semibold text-slate-200">Brita Premium Quality</p>
                  <p className="text-[10px] text-slate-400">Designed in Italy • Crafted for Performance</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
