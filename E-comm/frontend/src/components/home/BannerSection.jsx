import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const banners = [
  {
    id: 1,
    label: 'SUMMER SALE',
    title: 'Up To 50% Off\nOn Bestsellers',
    cta: 'Shop Sale',
    href: '/shop?sort=discountPercent',
    bg: '#1e3a5f',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80',
    textColor: 'text-white',
    ctaStyle: 'bg-white text-navy hover:bg-gray-100',
  },
  {
    id: 2,
    label: 'NEW ARRIVALS',
    title: 'Fresh Finds\nYou\'ll Love',
    cta: 'Explore Now',
    href: '/shop?sort=-createdAt',
    bg: '#f8f4f0',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    textColor: 'text-gray-800',
    ctaStyle: 'bg-navy text-white hover:bg-navy-dark',
  },
];

const BannerSection = () => (
  <section className="py-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {banners.map((banner, i) => (
        <motion.div
          key={banner.id}
          initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to={banner.href}
            className="relative flex items-center overflow-hidden rounded-2xl h-44 group"
            style={{ background: banner.bg }}
          >
            {/* Text */}
            <div className="relative z-10 p-6">
              <p className={`text-xs font-bold tracking-widest uppercase ${banner.textColor} opacity-70 mb-1`}>
                {banner.label}
              </p>
              <h3 className={`text-xl font-display font-bold leading-tight ${banner.textColor} mb-4 whitespace-pre-line`}>
                {banner.title}
              </h3>
              <span className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${banner.ctaStyle}`}>
                {banner.cta} →
              </span>
            </div>

            {/* Image */}
            <div className="absolute right-0 bottom-0 h-full flex items-end">
              <img
                src={banner.image}
                alt={banner.title}
                className="h-40 object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </section>
);

export default BannerSection;
