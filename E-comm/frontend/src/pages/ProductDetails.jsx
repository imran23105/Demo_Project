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
    <div className="container-custom py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Gallery */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <ProductGallery images={product.images} />
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          {product.brand && <p className="text-sm text-gray-400 uppercase tracking-widest font-medium">{product.brand}</p>}
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">{product.title}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <StarRating rating={product.ratings} />
            <span className="text-sm text-gray-600">{product.ratings} ({product.numReviews} reviews)</span>
            {product.isBestSeller && <span className="badge badge-success">Best Seller</span>}
            {product.isTrending && <span className="badge badge-warning">Trending</span>}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-navy">{formatCurrency(effectivePrice)}</span>
            {discountPercent > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatCurrency(product.price)}</span>
                <span className="bg-red-500 text-white text-sm font-bold px-2 py-0.5 rounded">-{discountPercent}%</span>
              </>
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">{product.shortDescription || product.description?.slice(0, 200)}</p>

          {/* Stock */}
          <div className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `✓ In Stock (${product.stock} units)` : '✗ Out of Stock'}
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 hover:bg-gray-100 transition-colors text-lg font-bold">−</button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-10 hover:bg-gray-100 transition-colors text-lg font-bold">+</button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0}
              className="btn-primary flex-1 py-3 text-base"
            >
              <FiShoppingCart size={18} />
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
              onClick={() => toggle(product)}
              className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                wishlisted ? 'bg-red-50 border-red-300 text-red-500' : 'border-gray-200 text-gray-500 hover:border-red-300'
              }`}
            >
              {wishlisted ? <AiFillHeart size={20} /> : <FiHeart size={20} />}
            </button>
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
              className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-navy transition-colors"
            >
              <FiShare2 size={20} />
            </button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
            {[
              { icon: <FiTruck size={18} className="text-navy" />, text: 'Free Shipping' },
              { icon: <FiRefreshCw size={18} className="text-navy" />, text: 'Easy Returns' },
              { icon: <FiShield size={18} className="text-navy" />, text: 'Secure Payment' },
            ].map((b) => (
              <div key={b.text} className="flex flex-col items-center gap-1 text-center">
                {b.icon}
                <span className="text-xs text-gray-600">{b.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="mb-12">
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {['description', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab ? 'border-navy text-navy' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'description' ? (
          <div className="prose prose-sm max-w-none text-gray-600">
            <p className="leading-relaxed">{product.description}</p>
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{tag}</span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="section-title mb-4">Related Products</h2>
          <ProductGrid products={related.slice(0, 4)} />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
