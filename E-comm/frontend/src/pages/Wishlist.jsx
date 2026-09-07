import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { selectWishlistItems } from '../redux/slices/wishlistSlice';
import ProductCard from '../components/product/ProductCard';
import EmptyState from '../components/common/EmptyState';

const Wishlist = () => {
  const items = useSelector(selectWishlistItems);

  return (
    <div className="container-custom py-6">
      <div className="bg-white rounded-3xl p-5 sm:p-6 mb-6 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-brand-red">
            SAVED ESSENTIALS
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display flex items-center gap-2">
            My Wishlist ({items.length})
          </h1>
        </div>
        <span className="text-xs font-bold px-3.5 py-1.5 bg-gray-100 text-slate-800 rounded-full">
          {items.length} {items.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="❤️"
          title="Your wishlist is empty"
          description="Save your favorite smart home appliances and essentials to order them anytime."
          actionLabel="Browse Appliances"
          actionHref="/shop"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {items.map((product, i) => (
            <motion.div
              key={product._id || i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
