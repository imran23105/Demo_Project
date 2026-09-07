import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronRight } from 'react-icons/fi';
import { categoryApi } from '../../services/productApi';

const CATEGORY_IMAGES = {
  "women's fashion": 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=120&q=80',
  "men's fashion": 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=120&q=80',
  'beauty & personal care': 'https://images.unsplash.com/photo-1586495777744-4e6232bf5e6b?w=120&q=80',
  electronics: 'https://images.unsplash.com/photo-1593344484962-796055d4a3a4?w=120&q=80',
  'home & living': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&q=80',
  'sports & outdoors': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=120&q=80',
  'toys & games': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&q=80',
  automotive: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=120&q=80',
  'books & stationery': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120&q=80',
  'pet supplies': 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=120&q=80',
};

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryApi.getCategories()
      .then(({ data }) => setCategories(data.data || []))
      .catch(() => {});
  }, []);

  return (
    <section className="py-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
            EXPLORE COLLECTIONS
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Browse By Categories
          </h2>
        </div>
        <Link
          to="/shop"
          className="text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-red flex items-center gap-1 bg-white px-4 py-2 rounded-full border border-gray-200/70 shadow-sm hover:shadow transition-all"
        >
          View All <FiChevronRight size={14} />
        </Link>
      </div>

      <div className="flex gap-3.5 overflow-x-auto pb-3 pt-1 scrollbar-hide -mx-1 px-1">
        {categories.map((cat, i) => (
          <motion.div
            key={cat._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex-shrink-0"
          >
            <Link
              to={`/shop?category=${cat._id}`}
              className="group flex flex-col items-center p-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 w-24 sm:w-28 text-center"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-gray-50 mb-2.5 p-1 border border-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <img
                  src={cat.image || CATEGORY_IMAGES[cat.name?.toLowerCase()] || `https://ui-avatars.com/api/?name=${cat.name}&background=11161b&color=cef04a&size=100`}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <span className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-brand-red transition-colors">
                {cat.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
