import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronRight } from 'react-icons/fi';
import { productApi } from '../../services/productApi';
import { SkeletonBox } from '../common/Loader';

const COLLECTION_COLORS = ['#e8f4fd', '#fef3c7', '#f0fdf4', '#fdf4ff'];

const FeaturedCollections = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productApi.getFeatured()
      .then(({ data }) => setProducts(data.data?.slice(0, 4) || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="section-title">Featured Collections</h2>
          <p className="section-subtitle">Carefully curated collections just for you.</p>
        </div>
        <Link to="/shop?isFeatured=true" className="text-sm text-navy font-semibold flex items-center gap-1 hover:gap-2 transition-all">
          View All <FiChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBox key={i} className="h-36 rounded-xl" />
            ))
          : products.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/product/${product._id}`}
                  className="relative flex flex-col justify-end h-36 rounded-xl overflow-hidden group"
                  style={{ background: COLLECTION_COLORS[i % COLLECTION_COLORS.length] }}
                >
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="relative p-3">
                    <p className="text-white font-semibold text-sm leading-tight">{product.title}</p>
                    <p className="text-blue-200 text-xs mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore →
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))
        }
      </div>
    </section>
  );
};

export default FeaturedCollections;
