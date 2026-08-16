import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Heart, Search, User, Menu, X, ChevronDown,
  Phone, MapPin, MessageCircle,
} from "lucide-react";
import { InstagramIcon } from "../common/Icons";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Sneakers", href: "/sneakers" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Sale", href: "/sale", highlight: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const { customer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-white text-xs py-2 hidden md:block">
        <div className="container-max flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone size={11} /> +91 98765 43210
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={11} /> Mumbai, India
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-300">
            <span>Free shipping on orders above ₹999</span>
            <span className="mx-3 text-slate-600">|</span>
            <span>Easy 30-day returns</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
              <InstagramIcon size={13} />
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
              <MessageCircle size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100"
            : "bg-white/95 backdrop-blur-md"
        }`}
      >
        <div className="container-max">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-heading font-black text-sm">B</span>
              </div>
              <div>
                <span className="font-heading font-black text-primary text-base tracking-tight leading-none block">
                  BRITA
                </span>
                <span className="text-[9px] text-slate-400 font-medium tracking-[0.2em] leading-none block">
                  FOOTWEARS
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.href
                      ? "text-secondary bg-secondary/5"
                      : link.highlight
                      ? "text-danger font-semibold hover:bg-red-50"
                      : "text-slate-600 hover:text-primary hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                id="nav-search-btn"
                className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-all"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                id="nav-wishlist-btn"
                className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-all relative"
              >
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length > 9 ? "9+" : wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                id="nav-cart-btn"
                className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-all relative"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-secondary text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </motion.span>
                )}
              </Link>

              {/* Account */}
              <Link
                to={customer ? "/dashboard" : "/login"}
                id="nav-account-btn"
                className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-all"
              >
                {customer ? (
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">
                      {customer.name.charAt(0)}
                    </span>
                  </div>
                ) : (
                  <User size={20} />
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                id="nav-mobile-menu-btn"
                className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-all"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border-t border-slate-100 bg-white"
            >
              <div className="container-max py-4">
                <form onSubmit={handleSearch} className="flex gap-3">
                  <input
                    id="nav-search-input"
                    type="text"
                    placeholder="Search shoes, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="input-field flex-1"
                  />
                  <button type="submit" className="btn-primary px-6">
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="btn-ghost"
                  >
                    <X size={18} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      link.highlight
                        ? "text-danger font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-slate-100 pt-3 mt-3">
                  <Link
                    to={customer ? "/dashboard" : "/login"}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <User size={16} />
                    {customer ? `Hi, ${customer.name.split(" ")[0]}` : "Login / Register"}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
