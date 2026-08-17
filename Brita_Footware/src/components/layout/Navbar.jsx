import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Heart, Search, User, Menu, X, ChevronDown,
  Phone, MapPin, MessageCircle, Flame, Sparkles, ArrowRight,
  TrendingUp, ShieldCheck, Truck, Star
} from "lucide-react";
import { InstagramIcon } from "../common/Icons";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/formatCurrency";

const ANNOUNCEMENTS = [
  "🔥 SPECIAL OFFER: FLAT 20% OFF WITH CODE: BRITA20",
  "🚚 FREE EXPRESS DELIVERY ON ORDERS OVER ₹999",
  "⚡ 24-HOUR DISPATCH & EASY 30-DAY RETURNS",
  "✨ NEW SEASON 2025 FOOTWEAR COLLECTION LIVE NOW",
];

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Sneakers", href: "/sneakers", badge: "HOT" },
  { label: "New Arrivals", href: "/new-arrivals", icon: Sparkles },
  { label: "Sale", href: "/sale", highlight: true, icon: Flame },
];

const TRENDING_SEARCHES = ["Air Sneakers", "Formal Shoes", "Women Sandals", "Running Shoes", "Loafers"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [announcementIdx, setAnnouncementIdx] = useState(0);

  const { totalItems, total } = useCart();
  const { wishlist } = useWishlist();
  const { customer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Announcement ticker effect
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleQuickSearch = (term) => {
    navigate(`/shop?q=${encodeURIComponent(term)}`);
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full font-sans select-none">
      {/* ── Top Announcement Bar ── */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white text-[11px] font-medium py-1.5 border-b border-white/10 shadow-sm hidden md:block">
        <div className="container-max flex items-center justify-between">
          {/* Support Info */}
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <Phone size={12} className="text-secondary" /> +91 98765 43210
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <MapPin size={12} className="text-accent" /> Mumbai, India
            </span>
          </div>

          {/* Animated Announcement Ticker */}
          <div className="overflow-hidden h-5 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={announcementIdx}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 text-amber-300 font-semibold tracking-wide"
              >
                <span>{ANNOUNCEMENTS[announcementIdx]}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-[10px]">Follow us:</span>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="p-1 rounded-full bg-white/5 hover:bg-pink-500/20 text-slate-300 hover:text-pink-400 transition-all"
              title="Instagram"
            >
              <InstagramIcon size={12} />
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="p-1 rounded-full bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 transition-all"
              title="WhatsApp"
            >
              <MessageCircle size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Navigation Bar ── */}
      <motion.nav
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-xl border-b border-slate-200/60 py-2.5"
            : "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-3.5"
        }`}
      >
        <div className="container-max">
          <div className="flex items-center justify-between">
            {/* ── Brand Logo ── */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-secondary via-indigo-500 to-accent opacity-75 blur-sm group-hover:opacity-100 transition-all duration-300" />
                <div className="relative w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center border border-white/20 shadow-md">
                  <span className="text-transparent bg-clip-text bg-gradient-to-tr from-white via-slate-100 to-amber-300 font-heading font-black text-xl tracking-tighter">
                    B
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-slate-900 text-lg tracking-tight leading-none group-hover:text-secondary transition-colors">
                  BRITA
                </span>
                <span className="text-[9px] font-bold text-slate-400 tracking-[0.25em] leading-none mt-1 uppercase">
                  LUXURY FOOTWEAR
                </span>
              </div>
            </Link>

            {/* ── Desktop Navigation Links ── */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/50 shadow-inner">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.href;
                const IconComp = link.icon;

                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? "text-slate-900 font-extrabold"
                        : link.highlight
                        ? "text-rose-600 hover:text-rose-700"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {/* Animated Active Pill Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 bg-white rounded-xl shadow-md border border-slate-200/60"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}

                    <span className="relative z-10 flex items-center gap-1.5">
                      {IconComp && (
                        <IconComp
                          size={14}
                          className={link.highlight ? "text-rose-500 animate-bounce" : "text-amber-500"}
                        />
                      )}
                      {link.label}
                      {link.badge && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm">
                          {link.badge}
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* ── Right Action Controls ── */}
            <div className="flex items-center gap-2">
              {/* Search Toggle Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(!searchOpen)}
                id="nav-search-btn"
                className={`p-2.5 rounded-xl transition-all duration-200 border ${
                  searchOpen
                    ? "bg-secondary text-white border-secondary shadow-md shadow-secondary/20"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/60"
                }`}
                title="Search products"
              >
                <Search size={18} />
              </motion.button>

              {/* Wishlist Button (Hidden on small mobile, accessible via drawer) */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
                <Link
                  to="/wishlist"
                  id="nav-wishlist-btn"
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-pink-50 hover:text-pink-600 text-slate-700 border border-slate-200/60 transition-all duration-200 relative flex items-center"
                  title="View Wishlist"
                >
                  <Heart size={18} />
                  {wishlist.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md border-2 border-white"
                    >
                      {wishlist.length > 9 ? "9+" : wishlist.length}
                    </motion.span>
                  )}
                </Link>
              </motion.div>

              {/* Cart Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/cart"
                  id="nav-cart-btn"
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-white/10 hover:shadow-lg hover:shadow-indigo-950/20 transition-all duration-200 flex items-center gap-2 relative group"
                  title="View Cart"
                >
                  <div className="relative">
                    <ShoppingBag size={18} className="text-slate-200 group-hover:text-amber-400 transition-colors" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 bg-amber-500 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-[9px] text-slate-400 font-semibold leading-none">CART</span>
                    <span className="text-xs font-bold text-amber-300 leading-tight">
                      {total > 0 ? formatCurrency(total) : "₹0"}
                    </span>
                  </div>
                </Link>
              </motion.div>

              {/* Customer Account Button (Hidden on small mobile, accessible via drawer) */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
                <Link
                  to={customer ? "/dashboard" : "/login"}
                  id="nav-account-btn"
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60 transition-all duration-200 flex items-center justify-center"
                  title={customer ? `Account: ${customer.name}` : "Sign In"}
                >
                  {customer ? (
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-secondary to-indigo-700 text-white font-bold text-[10px] flex items-center justify-center shadow-sm">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <User size={18} />
                  )}
                </Link>
              </motion.div>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                id="nav-mobile-menu-btn"
                className="lg:hidden p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Expandable Search Drawer Overlay ── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="border-t border-slate-200/60 bg-gradient-to-b from-slate-50 to-white shadow-xl overflow-hidden"
            >
              <div className="container-max py-5 space-y-4">
                <form onSubmit={handleSearch} className="flex gap-3 max-w-3xl mx-auto">
                  <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="nav-search-input"
                      type="text"
                      placeholder="Search shoes, sneakers, leather loafers, categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-secondary shadow-sm placeholder:text-slate-400"
                    />
                  </div>
                  <button type="submit" className="btn-primary px-7 py-3.5 text-xs font-bold rounded-2xl shrink-0 shadow-md">
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </form>

                {/* Trending Quick Search Badges */}
                <div className="flex items-center justify-center flex-wrap gap-2 text-xs text-slate-500 max-w-3xl mx-auto">
                  <span className="font-semibold text-slate-400 flex items-center gap-1">
                    <TrendingUp size={13} className="text-secondary" /> Trending:
                  </span>
                  {TRENDING_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleQuickSearch(term)}
                      className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-secondary hover:text-secondary font-medium transition-all shadow-xs"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Mobile Side Drawer Menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-200 bg-white overflow-hidden shadow-2xl"
            >
              <div className="px-4 py-5 space-y-2">
                {NAV_LINKS.map((link) => {
                  const isActive = location.pathname === link.href;
                  const IconComp = link.icon;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? "bg-slate-900 text-white shadow-md"
                          : link.highlight
                          ? "text-rose-600 bg-rose-50"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {IconComp && <IconComp size={16} className={link.highlight ? "text-rose-500" : "text-amber-500"} />}
                        {link.label}
                      </span>
                      {link.badge && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-500 text-white">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}

                <div className="border-t border-slate-100 pt-4 mt-3 space-y-2">
                  <Link
                    to="/wishlist"
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200"
                  >
                    <span className="flex items-center gap-3">
                      <Heart size={18} className="text-pink-500" />
                      My Wishlist
                    </span>
                    {wishlist.length > 0 && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-500 text-white">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>
                  <Link
                    to={customer ? "/dashboard" : "/login"}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200"
                  >
                    <User size={18} className="text-secondary" />
                    {customer ? `Welcome, ${customer.name.split(" ")[0]}` : "Customer Login / Register"}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
