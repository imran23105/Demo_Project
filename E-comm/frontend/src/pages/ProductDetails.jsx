import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiShare2, FiShield, FiTruck, FiRefreshCw } from 'react-icons/fi';
import { AiFillStar, AiFillHeart } from 'react-icons/ai';
import { formatCurrency, getDiscountPercent } from '../utils/formatCurrency';
import { productApi } from '../services/productApi';
import ProductGallery from '../components/product/ProductGallery';
import ProductGrid from '../components/product/ProductGrid';
import { PageLoader } from '../components/common/Loader';
import useCart from '../hooks/useCart';
import useWishlist from '../hooks/useWishlist';
import toast from 'react-hot-toast';

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <AiFillStar key={s} size={16} className={s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'} />
    ))}
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    setIsLoading(true);
    window.scrollTo(0, 0);
    Promise.all([
      productApi.getProductById(id),
      productApi.getRelatedProducts(id),
    ])
      .then(([{ data: p }, { data: r }]) => {
        setProduct(p.data);
        setRelated(r.data || []);
      })
      .catch(() => navigate('/shop'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <PageLoader />;
  if (!product) return null;

  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discountPercent = getDiscountPercent(product.price, product.discountPrice);
  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(product, quantity);
    setIsAdding(false);
  };

  return (
    <div className="container-custom py-4 sm:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 flex-wrap">
        <button onClick={() => navigate('/')} className="hover:text-slate-900 font-medium">Home</button>
        <span>/</span>
        <button onClick={() => navigate('/shop')} className="hover:text-slate-900 font-medium">Shop</button>
        {product.category && (
          <>
            <span>/</span>
            <button
              onClick={() => navigate(`/shop?category=${product.category._id || product.category}`)}
              className="hover:text-slate-900 font-medium"
            >
              {product.category.name || 'Category'}
            </button>
          </>
        )}
        <span>/</span>
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main Showcase Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Gallery Column */}
          <div className="lg:col-span-6">
            <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 flex items-center justify-center">
              <ProductGallery images={product.images} />
            </div>
          </div>

          {/* Info Column */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              {product.brand && (
                <div className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-gray-400 bg-gray-100 px-3 py-1 rounded-full mb-2">
                  {product.brand}
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 leading-tight">
                {product.title}
              </h1>

              {/* Rating & Badges */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <StarRating rating={product.ratings} />
                <span className="text-xs font-semibold text-slate-700">
                  {product.ratings} <span className="text-gray-400">({product.numReviews} verified reviews)</span>
                </span>
                {product.isBestSeller && (
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Best Seller
                  </span>
                )}
                {product.isTrending && (
                  <span className="bg-[#11161B] text-[#CEF04A] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    Trending
                  </span>
                )}
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-[#F3F3EE]/70 rounded-2xl p-4 border border-gray-200/70 flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-black text-slate-900 font-display">
                {formatCurrency(effectivePrice)}
              </span>
              {discountPercent > 0 && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="bg-brand-red text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm">
                    {discountPercent}% OFF
                  </span>
                </>
              )}
              <span className="text-[11px] text-gray-500 ml-auto">Inclusive of all taxes</span>
            </div>

            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              {product.shortDescription || product.description?.slice(0, 240)}
            </p>

            {/* Stock status pill */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700">Availability:</span>
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                  product.stock > 0
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-brand-red border border-red-200'
                }`}
              >
                {product.stock > 0 ? `✓ In Stock (${product.stock} units)` : '✗ Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-bold text-gray-700">Quantity:</span>
                <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-white text-slate-900 font-bold hover:bg-gray-200 transition-colors flex items-center justify-center text-sm shadow-sm"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-black text-xs text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-8 h-8 rounded-full bg-white text-slate-900 font-bold hover:bg-gray-200 transition-colors flex items-center justify-center text-sm shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isAdding || product.stock === 0}
                className="flex-1 py-3.5 px-6 rounded-full bg-[#11161B] hover:bg-brand-red text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FiShoppingCart size={16} />
                <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={async () => {
                  await handleAddToCart();
                  navigate('/checkout');
                }}
                disabled={product.stock === 0}
                className="flex-1 py-3.5 px-6 rounded-full bg-brand-red hover:bg-brand-redHover text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-50"
              >
                Buy Now
              </button>

              <button
                onClick={() => toggle(product)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                  wishlisted
                    ? 'bg-red-50 border-red-200 text-brand-red'
                    : 'border-gray-200 bg-white text-slate-700 hover:border-slate-800'
                }`}
                title="Wishlist"
              >
                {wishlisted ? <AiFillHeart size={20} /> : <FiHeart size={18} />}
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Product link copied!');
                }}
                className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-slate-700 hover:border-slate-800 transition-colors"
                title="Share"
              >
                <FiShare2 size={18} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100">
              {[
                { icon: <FiTruck size={18} className="text-brand-red" />, title: 'Free Delivery', desc: 'Over ₹500' },
                { icon: <FiRefreshCw size={18} className="text-brand-red" />, title: '7 Days Return', desc: 'Hassle Free' },
                { icon: <FiShield size={18} className="text-brand-red" />, title: '1 Year Warranty', desc: '100% Genuine' },
              ].map((b) => (
                <div key={b.title} className="flex flex-col items-center text-center p-2 rounded-2xl bg-gray-50/70 border border-gray-100">
                  <div className="mb-1">{b.icon}</div>
                  <span className="text-xs font-bold text-slate-900">{b.title}</span>
                  <span className="text-[10px] text-gray-500">{b.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Description & Reviews */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-12">
        <div className="flex gap-2 border-b border-gray-100 pb-3 mb-6">
          {['description', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-gray-500 hover:text-slate-900 hover:bg-gray-100'
              }`}
            >
              {tab === 'description' ? 'Product Overview' : `Reviews (${product.numReviews})`}
            </button>
          ))}
        </div>

        {activeTab === 'description' ? (
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            <p className="text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-100">
                <span className="text-xs font-bold text-slate-800 self-center mr-1">Tags:</span>
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-slate-700 rounded-full text-xs font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-sm py-4">
            <p>Customer reviews will be displayed here. Share your feedback after purchase!</p>
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="pt-4">
          <div className="mb-4">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
              SIMILAR PICKS
            </div>
            <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">
              You Might Also Like
            </h2>
          </div>
          <ProductGrid products={related.slice(0, 4)} />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
