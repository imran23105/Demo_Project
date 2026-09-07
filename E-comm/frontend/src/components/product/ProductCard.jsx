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
      <Link
        to={`/product/${product._id}`}
        className="group block p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200"
      >
        <div className="relative mb-2.5 overflow-hidden rounded-xl bg-gray-50 aspect-square">
          <img
            src={imgError ? '/placeholder.jpg' : product.images?.[0]?.url}
            alt={product.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discountPercent > 0 && (
            <span className="absolute top-1.5 left-1.5 bg-brand-red text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>
        <h3 className="text-xs font-bold text-slate-800 line-clamp-2 mb-1 group-hover:text-brand-red transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <StarRating rating={product.ratings} size={10} />
          <span className="text-[10px] text-gray-400">({product.numReviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-extrabold text-slate-900 text-sm">{formatCurrency(effectivePrice)}</span>
            {discountPercent > 0 && (
              <span className="text-[11px] text-gray-400 line-through ml-1">{formatCurrency(product.price)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock === 0}
            className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-brand-red transition-colors disabled:opacity-50 active:scale-95 shadow-sm"
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
      className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200/80 transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      <Link to={`/product/${product._id}`} className="block flex-1 flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-50/80 p-3 flex items-center justify-center aspect-[4/3]">
          <img
            src={imgError ? 'https://via.placeholder.com/300x300?text=No+Image' : product.images?.[0]?.url}
            alt={product.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
            {discountPercent > 0 && (
              <span className="bg-brand-red text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                -{discountPercent}%
              </span>
            )}
            {product.isTrending && (
              <span className="bg-[#11161B] text-[#CEF04A] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Trending
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Best Seller
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-gray-800 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 active:scale-95 transition-all text-slate-700"
          >
            {wishlisted
              ? <AiFillHeart size={16} className="text-brand-red" />
              : <FiHeart size={15} className="text-gray-500 hover:text-brand-red" />
            }
          </button>
        </div>

        {/* Info */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {product.brand && (
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                {product.brand}
              </p>
            )}
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 mb-1.5 group-hover:text-brand-red transition-colors leading-snug">
              {product.title}
            </h3>

            <div className="flex items-center gap-1.5 mb-3">
              <StarRating rating={product.ratings} size={11} />
              <span className="text-[11px] text-gray-400 font-medium">({product.numReviews})</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <div>
              <div className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                {formatCurrency(effectivePrice)}
              </div>
              {discountPercent > 0 && (
                <div className="text-[11px] text-gray-400 line-through leading-none">
                  {formatCurrency(product.price)}
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock === 0}
              className="h-9 px-3 bg-[#11161B] hover:bg-brand-red text-white rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all disabled:opacity-50 active:scale-95 shadow-sm"
              title="Add to Cart"
            >
              {isAddingToCart ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiShoppingCart size={13} />
                  <span className="hidden sm:inline text-[11px]">Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
