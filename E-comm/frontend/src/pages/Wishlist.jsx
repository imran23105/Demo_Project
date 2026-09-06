import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { selectWishlistItems } from '../redux/slices/wishlistSlice';
import ProductCard from '../components/product/ProductCard';
import EmptyState from '../components/common/EmptyState';

const Wishlist = () => {
  const items = useSelector(selectWishlistItems);

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FiHeart className="text-red-500" /> Wishlist ({items.length})
      </h1>

      {items.length === 0 ? (
        <EmptyState
          icon="❤️"
          title="Your wishlist is empty"
          description="Save your favorite items here to buy them later."
          actionLabel="Browse Products"
          actionHref="/shop"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((product, i) => (
            <motion.div
              key={product._id || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
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
