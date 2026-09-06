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
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="section-title">Browse By Categories</h2>
          <p className="section-subtitle">Explore handpicked collections for every part of your life.</p>
        </div>
        <Link to="/shop" className="text-sm text-navy font-semibold flex items-center gap-1 hover:gap-2 transition-all">
          View All <FiChevronRight size={16} />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat, i) => (
          <motion.div
            key={cat._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/shop?category=${cat._id}`}
              className="flex flex-col items-center gap-2 min-w-[80px] group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-transparent group-hover:border-navy transition-all duration-200 shadow-card group-hover:shadow-card-hover">
                <img
                  src={cat.image || CATEGORY_IMAGES[cat.name?.toLowerCase()] || `https://ui-avatars.com/api/?name=${cat.name}&background=1e3a5f&color=fff&size=80`}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-xs text-center text-gray-700 font-medium leading-tight max-w-[72px] group-hover:text-navy transition-colors">
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
