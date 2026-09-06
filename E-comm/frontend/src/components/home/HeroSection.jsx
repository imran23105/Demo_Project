import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const slides = [
  {
    id: 1,
    badge: 'NEW COLLECTION',
    title: 'Upgrade Your\nLifestyle Today',
    subtitle: 'Find the latest trends, top brands and exclusive deals all in one place.',
    cta: 'Shop Now',
    href: '/shop',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=80',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    id: 2,
    badge: 'SUMMER SALE',
    title: 'Up To 50% Off\nOn Top Brands',
    subtitle: 'Exclusive deals on electronics, fashion, beauty, and much more.',
    cta: 'Explore Deals',
    href: '/shop?sort=discountPercent',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=700&q=80',
    bg: '#0f2d4a',
    accent: '#f59e0b',
  },
  {
    id: 3,
    badge: 'NEW ARRIVALS',
    title: 'Fresh Finds\nYou\'ll Love',
    subtitle: 'Discover handpicked new arrivals updated every week.',
    cta: 'See New Arrivals',
    href: '/shop?sort=-createdAt',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=80',
    bg: '#1a3a5f',
    accent: '#22c55e',
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, next]);

  const slide = slides[current];

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{ background: slide.bg }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center min-h-[320px] md:min-h-[380px]"
        >
          {/* Text */}
          <div className="flex-1 px-8 py-10 md:py-0 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span
                className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4 inline-block"
                style={{ background: slide.accent + '30', color: slide.accent }}
              >
                {slide.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-display font-bold text-white leading-tight mb-3 whitespace-pre-line"
            >
              {slide.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-blue-200 text-sm mb-6 max-w-xs leading-relaxed"
            >
              {slide.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to={slide.href}
                className="inline-flex items-center gap-2 bg-white text-navy font-bold px-6 py-2.5 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm"
              >
                {slide.cta}
                <FiArrowRight size={16} />
              </Link>
            </motion.div>
          </div>

          {/* Image */}
          <div className="flex-1 flex items-end justify-center md:justify-end relative overflow-hidden">
            <motion.img
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              src={slide.image}
              alt={slide.title}
              className="h-64 md:h-80 object-cover object-top w-full md:w-auto md:max-w-sm"
            />
            {/* Decorative circle */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 bg-white" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm">
        <FiChevronLeft size={18} />
      </button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm">
        <FiChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
