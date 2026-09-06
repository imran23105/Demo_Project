import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiZap } from 'react-icons/fi';
import ProductCard from '../product/ProductCard';
import { ProductCardSkeleton } from '../common/Loader';
import { productApi } from '../../services/productApi';

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productApi.getTrending()
      .then(({ data }) => setProducts(data.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="section-title flex items-center gap-2">
            Trending Right Now <FiZap className="text-amber-400" size={20} />
          </h2>
          <p className="section-subtitle">Top picks that everyone is loving this week.</p>
        </div>
        <Link to="/shop?isTrending=true" className="text-sm text-navy font-semibold flex items-center gap-1 hover:gap-2 transition-all">
          View All <FiChevronRight size={16} />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-44">
                <ProductCardSkeleton />
              </div>
            ))
          : products.map((product) => (
              <div key={product._id} className="flex-shrink-0 w-44">
                <ProductCard product={product} compact />
              </div>
            ))
        }
      </div>
    </section>
  );
};

export default TrendingProducts;
