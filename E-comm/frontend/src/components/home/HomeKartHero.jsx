import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiTv,
  FiCoffee,
  FiHome,
  FiZap,
  FiAward,
  FiWind,
  FiShoppingBag,
  FiActivity,
  FiHeart,
  FiBookOpen,
  FiCompass,
  FiTag,
} from 'react-icons/fi';
import { TbFridge, TbWashMachine } from 'react-icons/tb';
import { LuCookingPot } from 'react-icons/lu';
import { categoryApi } from '../../services/productApi';

const getCategoryIcon = (name = '', slug = '') => {
  const s = (name + ' ' + slug).toLowerCase();
  if (s.includes('fridge') || s.includes('refrigerat')) return TbFridge;
  if (s.includes('wash') || s.includes('laundry')) return TbWashMachine;
  if (s.includes('air') || s.includes('wind') || s.includes('ac')) return FiWind;
  if (s.includes('kitchen') || s.includes('cook')) return LuCookingPot;
  if (s.includes('tv') || s.includes('electronic')) return FiTv;
  if (s.includes('women') || s.includes('fashion')) return FiShoppingBag;
  if (s.includes('beauty')) return FiHeart;
  if (s.includes('home') || s.includes('living')) return FiHome;
  if (s.includes('sport')) return FiActivity;
  if (s.includes('auto')) return FiCompass;
  if (s.includes('book')) return FiBookOpen;
  return FiTag;
};

const DEFAULT_CATEGORIES = [
  { _id: 'electronics', name: 'Electronics', slug: 'electronics' },
  { _id: 'home-living', name: 'Home & Living', slug: 'home-living' },
  { _id: 'womens-fashion', name: "Women's Fashion", slug: 'womens-fashion' },
  { _id: 'mens-fashion', name: "Men's Fashion", slug: 'mens-fashion' },
  { _id: 'beauty', name: 'Beauty & Care', slug: 'beauty' },
  { _id: 'sports', name: 'Sports & Outdoors', slug: 'sports' },
  { _id: 'toys-games', name: 'Toys & Games', slug: 'toys-games' },
  { _id: 'automotive', name: 'Automotive', slug: 'automotive' },
];

const HERO_SLIDES = [
  {
    tag: 'MODERN HOMES • SMARTER LIVING',
    titleMain: 'Bring Home\nA Smarter',
    titleHighlight: 'Tomorrow',
    subtitle: 'Latest appliances & top picks. Trusted brands. Unmatched deals.',
    ctaText: 'Shop Now',
    ctaHref: '/shop',
    image: '/assets/hero_smart_appliances.jpg',
  },
  {
    tag: 'FESTIVE SPECIAL • UP TO 60% OFF',
    titleMain: 'Intelligent Living,\nEffortless',
    titleHighlight: 'Comfort',
    subtitle: 'Upgrade your home with modern electronics & top-rated smart essentials.',
    ctaText: 'Explore Deals',
    ctaHref: '/shop?sort=discountPercent',
    image: '/assets/promo_mega_sale.jpg',
  },
];

const HomeKartHero = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryApi
      .getCategories()
      .then(({ data }) => {
        if (data.data && data.data.length > 0) {
          setCategories(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const displayCategories = categories.length > 0 ? categories.slice(0, 8) : DEFAULT_CATEGORIES;

  const nextSlide = () => setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  const slide = HERO_SLIDES[slideIndex];

  return (
    <section className="pt-3 pb-4">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* ─── 1. Left Dark Floating Category Card ─────────────────── */}
          <aside className="hidden lg:flex lg:col-span-3 xl:col-span-3 flex-col justify-between bg-[#11161B] text-white rounded-3xl p-3.5 shadow-xl border border-white/10">
            {/* Top All Categories Header Pill */}
            <Link
              to="/shop"
              className="group bg-[#CEF04A] hover:bg-[#BDE032] text-slate-950 font-extrabold text-xs tracking-wide py-2.5 px-3.5 rounded-2xl flex items-center justify-between transition-all duration-200 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <FiGrid size={15} />
                <span>All Categories</span>
              </div>
              <FiChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Dynamic Categories List from Backend */}
            <div className="py-2.5 space-y-1">
              {displayCategories.map((cat) => {
                const Icon = getCategoryIcon(cat.name, cat.slug);
                return (
                  <Link
                    key={cat._id}
                    to={`/shop?category=${cat._id}`}
                    className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-150 group"
                  >
                    <Icon size={16} className="text-gray-400 group-hover:text-[#CEF04A] transition-colors" />
                    <span className="truncate">{cat.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Bottom Deals Pill Button */}
            <Link
              to="/shop?sort=discountPercent"
              className="w-full bg-gradient-to-r from-brand-red to-red-600 hover:from-red-700 hover:to-red-600 text-white text-xs font-bold py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              <span>🔥</span>
              <span>Deals & Offers</span>
            </Link>
          </aside>

          {/* ─── 2. Center Big Showcase Hero Banner ──────────────────── */}
          <div className="lg:col-span-9 xl:col-span-7 relative bg-gradient-to-br from-[#EBF2EB] via-[#F4F7F2] to-[#FAFBF8] rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-white flex flex-col justify-between overflow-hidden min-h-[460px] md:min-h-[500px]">
            {/* Ambient Lighting Glows */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 left-10 w-72 h-72 bg-[#CEF04A]/30 rounded-full blur-3xl pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={slideIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1"
              >
                {/* Text Content */}
                <div className="md:col-span-6 space-y-4">
                  <span className="text-[11px] font-extrabold tracking-widest text-gray-500 uppercase block">
                    {slide.tag}
                  </span>

                  <h1 className="font-display font-black text-3xl sm:text-4xl md:text-[42px] leading-[1.12] text-slate-900 tracking-tight whitespace-pre-line">
                    {slide.titleMain}{' '}
                    <span className="text-[#387B2E] inline-block">{slide.titleHighlight}</span>
                  </h1>

                  <p className="text-xs sm:text-sm text-gray-600 max-w-sm leading-relaxed">
                    {slide.subtitle}
                  </p>

                  {/* CTA Pill Button */}
                  <div className="pt-2">
                    <Link
                      to={slide.ctaHref}
                      className="inline-flex items-center gap-3 bg-brand-red hover:bg-brand-redHover text-white font-bold text-xs sm:text-sm px-6 sm:px-7 py-3 rounded-full shadow-lg shadow-red-700/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 group"
                    >
                      <span>{slide.ctaText}</span>
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                        <FiArrowRight size={12} />
                      </div>
                    </Link>
                  </div>

                  {/* Handwritten Note Style Annotation */}
                  <div className="pt-1 flex items-center gap-2">
                    <span className="font-serif italic text-xs text-slate-700">Good Appliances Brighter Days</span>
                    <span className="text-red-500 text-sm">❤️</span>
                  </div>

                  {/* Social Proof Badges */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex -space-x-2 overflow-hidden">
                      <img
                        className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
                        alt="Customer 1"
                      />
                      <img
                        className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                        alt="Customer 2"
                      />
                      <img
                        className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80"
                        alt="Customer 3"
                      />
                      <img
                        className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                        src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80"
                        alt="Customer 4"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 leading-none">50K+</div>
                      <div className="text-[10px] text-gray-500 leading-tight">Happy Customers</div>
                    </div>
                  </div>
                </div>

                {/* Hero Showcase Image */}
                <div className="md:col-span-6 relative flex items-center justify-center">
                  <div className="relative w-full aspect-[4/3] max-w-md mx-auto">
                    <img
                      src={slide.image}
                      alt="Smart Appliances Showcase"
                      className="w-full h-full object-contain drop-shadow-2xl rounded-2xl"
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Controls: Prev / Next + Dots */}
            <div className="relative z-20 flex items-center justify-center gap-3 pt-4 border-t border-black/5 mt-4">
              <button
                onClick={prevSlide}
                className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-xs"
                title="Previous Slide"
              >
                <FiChevronLeft size={14} />
              </button>
              <div className="flex gap-1.5 items-center">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === slideIndex ? 'w-6 bg-[#387B2E]' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-xs"
                title="Next Slide"
              >
                <FiChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* ─── 3. Right Side Promo Cards (Hidden on sm, visible xl) ── */}
          <div className="hidden xl:flex xl:col-span-2 flex-col justify-between gap-4">
            {/* Top Card */}
            <Link
              to="/shop?category=kitchen-appliances"
              className="group relative bg-[#CEF04A] text-slate-900 rounded-3xl p-5 shadow-sm overflow-hidden flex flex-col justify-between min-h-[235px] hover:shadow-md hover:scale-[1.02] transition-all"
            >
              <div>
                <span className="text-[10px] font-bold tracking-widest text-slate-800 uppercase block mb-1">
                  PREMIUM ESSENTIALS
                </span>
                <h3 className="font-display font-extrabold text-lg text-slate-900 leading-tight">
                  Design Efficiency A Better You
                </h3>
              </div>
              <div className="flex items-center justify-between pt-4">
                <span className="text-xs font-bold text-slate-900">Explore Collection</span>
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <FiArrowRight size={13} />
                </div>
              </div>
            </Link>

            {/* Bottom Card */}
            <Link
              to="/shop"
              className="group relative bg-white rounded-3xl p-5 shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between min-h-[235px] hover:shadow-md hover:scale-[1.02] transition-all"
            >
              <div>
                <span className="text-[10px] font-bold tracking-widest text-brand-red uppercase block mb-1">
                  HOME MAKEOVER
                </span>
                <h3 className="font-display font-extrabold text-lg text-slate-900 leading-tight">
                  Upgrade Your Home Today
                </h3>
              </div>
              <div className="flex items-center justify-between pt-4">
                <span className="text-xs font-bold text-slate-900">View Products</span>
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <FiArrowRight size={13} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeKartHero;
