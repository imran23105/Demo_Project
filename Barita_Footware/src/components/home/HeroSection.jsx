import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    headline: "Step Into Your Style",
    subheading: "Premium footwear designed for every step.",
    badge: "New Collection 2025",
    cta: { label: "Shop Now", href: "/shop" },
    cta2: { label: "Explore Collection", href: "/new-arrivals" },
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&h=700&fit=crop",
    bg: "from-primary via-primary-800 to-secondary-900",
    accent: "#F59E0B",
  },
  {
    id: 2,
    headline: "Crafted For Champions",
    subheading: "Elite sneakers engineered for peak performance.",
    badge: "Sneakers Collection",
    cta: { label: "Shop Sneakers", href: "/sneakers" },
    cta2: { label: "View All", href: "/shop" },
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=700&h=700&fit=crop",
    bg: "from-slate-900 via-secondary-900 to-primary",
    accent: "#2563EB",
  },
  {
    id: 3,
    headline: "Elegance In Every Step",
    subheading: "Luxury women's footwear for the modern woman.",
    badge: "Women's Exclusive",
    cta: { label: "Shop Women", href: "/women" },
    cta2: { label: "New Arrivals", href: "/new-arrivals" },
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700&h=700&fit=crop",
    bg: "from-primary via-purple-950 to-primary-900",
    accent: "#EC4899",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center">
      {/* Animated Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.bg}`}
        />
      </AnimatePresence>

      {/* Geometric Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div
          className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full blur-2xl opacity-20"
          style={{ background: slide.accent }}
        />
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container-max relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${slide.id}`}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-6"
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: slide.accent }} />
                {slide.badge}
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-heading font-black text-white leading-[1.1] mb-4"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
              >
                {slide.headline.split(" ").map((word, i) => (
                  <span key={i} className={i === slide.headline.split(" ").length - 1 ? "block" : ""}>
                    {i === 1 ? (
                      <span className="relative">
                        {word}{" "}
                        <span
                          className="absolute -bottom-1 left-0 right-0 h-1 rounded-full opacity-60"
                          style={{ background: slide.accent }}
                        />
                      </span>
                    ) : (
                      word + " "
                    )}
                  </span>
                ))}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-slate-300 text-lg mb-8 max-w-md leading-relaxed"
              >
                {slide.subheading}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to={slide.cta.href}
                  id="hero-shop-btn"
                  className="btn-accent flex items-center gap-2 group"
                >
                  {slide.cta.label}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to={slide.cta2.href}
                  id="hero-explore-btn"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-white/30 text-white font-semibold font-heading hover:border-white hover:bg-white/10 transition-all"
                >
                  {slide.cta2.label}
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-8 mt-10 pt-8 border-t border-white/10"
              >
                {[
                  { value: "250+", label: "Products" },
                  { value: "4.8★", label: "Avg Rating" },
                  { value: "50K+", label: "Happy Customers" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="font-heading font-bold text-xl text-white">{stat.value}</div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Product Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`img-${slide.id}`}
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotate: 5 }}
              transition={{ duration: 0.6 }}
              className="relative flex items-center justify-center"
            >
              {/* Glow ring */}
              <div
                className="absolute w-80 h-80 rounded-full blur-3xl opacity-30"
                style={{ background: slide.accent }}
              />
              {/* Image card */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <div className="w-72 h-72 lg:w-96 lg:h-96 rounded-3xl overflow-hidden border border-white/20 shadow-premium">
                  <img
                    src={slide.image}
                    alt={slide.headline}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating badge */}
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -bottom-5 -right-5 bg-white rounded-2xl px-4 py-3 shadow-premium"
                >
                  <p className="text-xs text-slate-500 font-medium">Starting from</p>
                  <p className="font-heading font-black text-primary text-lg leading-tight">₹799</p>
                </motion.div>
                <motion.div
                  animate={{ x: [0, -6, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -left-4 bg-accent rounded-xl px-3 py-2 shadow-premium"
                >
                  <p className="text-primary font-heading font-bold text-sm">Up to 40% OFF</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
        <button
          onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
          className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <ChevronLeft size={14} />
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all rounded-full ${
                i === current ? "w-6 h-2 bg-accent" : "w-2 h-2 bg-white/40"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrent((c) => (c + 1) % slides.length)}
          className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </section>
  );
}
