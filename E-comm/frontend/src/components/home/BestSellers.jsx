import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';
import { productApi } from '../../services/productApi';
import { formatCurrency, getDiscountPercent } from '../../utils/formatCurrency';
import { ProductCardSkeleton } from '../common/Loader';
import useCart from '../../hooks/useCart';

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    productApi.getBestSellers()
      .then(({ data }) => setProducts(data.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="section-title">Best Sellers 🏆</h2>
          <p className="section-subtitle">Products loved by thousands of customers.</p>
        </div>
        <Link to="/shop?isBestSeller=true" className="text-sm text-navy font-semibold flex items-center gap-1 hover:gap-2 transition-all">
          View All <FiChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.slice(0, 4).map((product) => {
              const price = product.discountPrice > 0 ? product.discountPrice : product.price;
              const discount = getDiscountPercent(product.price, product.discountPrice);
              return (
                <div key={product._id} className="product-card p-3">
                  <Link to={`/product/${product._id}`} className="block">
                    <div className="relative mb-2">
                      <img src={product.images?.[0]?.url} alt={product.title} className="w-full h-36 object-cover rounded-lg bg-gray-50" />
                      {discount > 0 && <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">-{discount}%</span>}
                    </div>
                    <h3 className="text-xs font-medium line-clamp-2 mb-1">{product.title}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <AiFillStar size={11} className="text-amber-400" />
                      <span className="text-[10px] text-gray-500">{product.ratings} ({product.numReviews})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-navy text-sm">{formatCurrency(price)}</span>
                    </div>
                  </Link>
                  <button onClick={() => addToCart(product)} className="w-full mt-2 py-1.5 bg-navy text-white text-xs font-semibold rounded-lg hover:bg-navy-dark transition-colors">
                    Add to Cart
                  </button>
                </div>
              );
            })
        }
      </div>
    </section>
  );
};

export default BestSellers;
