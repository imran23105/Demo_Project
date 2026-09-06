import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { AiFillHeart, AiFillStar } from 'react-icons/ai';
import { formatCurrency, getDiscountPercent } from '../../utils/formatCurrency';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';

const StarRating = ({ rating, size = 12 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star}>
        {star <= Math.round(rating)
          ? <AiFillStar size={size} className="text-amber-400" />
          : <FiStar size={size} className="text-gray-300" />
        }
      </span>
    ))}
  </div>
);

const ProductCard = ({ product, compact = false }) => {
  const [imgError, setImgError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discountPercent = getDiscountPercent(product.price, product.discountPrice);
  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    await addToCart(product, 1);
    setIsAddingToCart(false);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  };

  if (compact) {
    return (
      <Link to={`/product/${product._id}`} className="product-card block p-3">
        <div className="relative mb-2">
          <img
            src={imgError ? '/placeholder.jpg' : product.images?.[0]?.url}
            alt={product.title}
            onError={() => setImgError(true)}
            className="w-full h-32 object-cover rounded-lg bg-gray-100"
          />
          {discountPercent > 0 && (
            <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              -{discountPercent}%
            </span>
          )}
        </div>
        <h3 className="text-xs font-medium text-gray-800 line-clamp-2 mb-1">{product.title}</h3>
        <div className="flex items-center gap-1 mb-2">
          <StarRating rating={product.ratings} size={10} />
          <span className="text-[10px] text-gray-400">({product.numReviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-navy text-sm">{formatCurrency(effectivePrice)}</span>
            {discountPercent > 0 && (
              <span className="text-xs text-gray-400 line-through ml-1">{formatCurrency(product.price)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock === 0}
            className="w-7 h-7 bg-navy text-white rounded-lg flex items-center justify-center hover:bg-navy-dark transition-colors disabled:opacity-50"
          >
            <FiShoppingCart size={13} />
          </button>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="product-card"
    >
      <Link to={`/product/${product._id}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50">
          <img
            src={imgError ? 'https://via.placeholder.com/300x300?text=No+Image' : product.images?.[0]?.url}
            alt={product.title}
            onError={() => setImgError(true)}
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discountPercent > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                -{discountPercent}%
              </span>
            )}
            {product.isTrending && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                Trending
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                Best Seller
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                Out of Stock
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            {wishlisted
              ? <AiFillHeart size={16} className="text-red-500" />
              : <FiHeart size={16} className="text-gray-500" />
            }
          </button>

          {/* Quick Add overlay */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock === 0}
              className="w-full bg-navy text-white py-2.5 text-sm font-semibold hover:bg-navy-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <FiShoppingCart size={15} />
              {isAddingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Quick Add'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          {product.brand && (
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{product.brand}</p>
          )}
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">{product.title}</h3>

          <div className="flex items-center gap-1.5 mb-3">
            <StarRating rating={product.ratings} />
            <span className="text-xs text-gray-500">({product.numReviews})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-navy">{formatCurrency(effectivePrice)}</span>
              {discountPercent > 0 && (
                <span className="text-xs text-gray-400 line-through">{formatCurrency(product.price)}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock === 0}
              className="w-8 h-8 bg-navy text-white rounded-lg flex items-center justify-center hover:bg-navy-dark transition-colors disabled:opacity-50"
            >
              {isAddingToCart ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiShoppingCart size={15} />
              )}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
