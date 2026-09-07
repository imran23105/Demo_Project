import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiAward } from 'react-icons/fi';
import ProductCard from '../product/ProductCard';
import { ProductCardSkeleton } from '../common/Loader';
import { productApi } from '../../services/productApi';

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productApi.getBestSellers()
      .then(({ data }) => setProducts(data.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="py-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
            <FiAward size={13} />
            <span>TOP RATED BY CUSTOMERS</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Best Sellers
          </h2>
        </div>
        <Link
          to="/shop?isBestSeller=true"
          className="text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-red flex items-center gap-1 bg-white px-4 py-2 rounded-full border border-gray-200/70 shadow-sm hover:shadow transition-all"
        >
          View All <FiChevronRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : products.slice(0, 5).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
        }
      </div>
    </section>
  );
};

export default BestSellers;
