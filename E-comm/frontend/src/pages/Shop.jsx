import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiGrid, FiList, FiFilter, FiX } from 'react-icons/fi';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilter from '../components/product/ProductFilter';
import Pagination from '../components/common/Pagination';
import { productApi, categoryApi } from '../services/productApi';
import { setProducts, setFilters, selectProductMeta, selectProductFilters } from '../redux/slices/productSlice';
import useDebounce from '../hooks/useDebounce';

const Shop = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const meta = useSelector(selectProductMeta);

  const [products, setLocalProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [page, setPage] = useState(1);

  const [filters, setLocalFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    sort: searchParams.get('sort') || '-createdAt',
    search: searchParams.get('search') || '',
    isTrending: searchParams.get('isTrending') || '',
    isFeatured: searchParams.get('isFeatured') || '',
    isBestSeller: searchParams.get('isBestSeller') || '',
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  useEffect(() => {
    categoryApi.getCategories().then(({ data }) => setCategories(data.data || []));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters, page, debouncedSearch]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = { ...filters, search: debouncedSearch, page, limit: 12 };
      // Remove empty params
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const { data } = await productApi.getProducts(params);
      setLocalProducts(data.data || []);
      dispatch(setProducts(data));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setLocalFilters((f) => ({ ...f, ...newFilters }));
    setPage(1);
  };

  const handleReset = () => {
    setLocalFilters({ category: '', minPrice: '', maxPrice: '', minRating: '', sort: '-createdAt', search: '' });
    setPage(1);
  };

  return (
    <div className="container-custom py-4 sm:py-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 mb-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
            HOMEKART CATALOG
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight mt-0.5">
            {filters.search ? `Search results for "${filters.search}"` : 'Explore All Appliances & Products'}
          </h1>
          {!isLoading && (
            <p className="text-xs text-gray-500 mt-1">
              Showing <span className="font-bold text-slate-900">{meta?.total || products.length}</span> authentic products
            </p>
          )}
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => setShowMobileFilter(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold shadow-sm hover:bg-brand-red transition-colors"
          >
            <FiFilter size={15} /> Filters
          </button>

          <div className="flex items-center bg-[#F3F3EE] rounded-full px-3.5 py-1.5 border border-gray-200">
            <span className="text-xs text-gray-500 mr-2 font-medium hidden sm:inline">Sort:</span>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange({ sort: e.target.value })}
              className="bg-transparent text-xs font-bold text-slate-900 outline-none cursor-pointer"
            >
              <option value="-createdAt">✨ Newest First</option>
              <option value="price">💵 Price: Low to High</option>
              <option value="-price">💎 Price: High to Low</option>
              <option value="-ratings">⭐ Top Rated</option>
              <option value="-numReviews">🔥 Most Popular</option>
              <option value="-discountPercent">🏷️ Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-24">
            <ProductFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
              categories={categories}
            />
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          {/* Active Filter Chips */}
          {(filters.category || filters.minPrice || filters.maxPrice || filters.minRating || filters.search) && (
            <div className="flex items-center gap-2 flex-wrap mb-4 bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-gray-200/80">
              <span className="text-xs font-bold text-slate-700">Active Filters:</span>

              {filters.category && (
                <span className="inline-flex items-center gap-1.5 bg-[#11161B] text-[#CEF04A] text-xs font-bold px-3 py-1 rounded-full">
                  <span>{categories.find((c) => c._id === filters.category)?.name || 'Category'}</span>
                  <button onClick={() => handleFilterChange({ category: '' })}><FiX size={12} /></button>
                </span>
              )}

              {(filters.minPrice || filters.maxPrice) && (
                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-full">
                  <span>₹{filters.minPrice || 0} - ₹{filters.maxPrice || 'Any'}</span>
                  <button onClick={() => handleFilterChange({ minPrice: '', maxPrice: '' })}><FiX size={12} /></button>
                </span>
              )}

              {filters.minRating && (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full">
                  <span>★ {filters.minRating}+ Rating</span>
                  <button onClick={() => handleFilterChange({ minRating: '' })}><FiX size={12} /></button>
                </span>
              )}

              {filters.search && (
                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-full">
                  <span>"{filters.search}"</span>
                  <button onClick={() => handleFilterChange({ search: '' })}><FiX size={12} /></button>
                </span>
              )}

              <button
                onClick={handleReset}
                className="text-xs font-extrabold text-brand-red hover:underline ml-auto"
              >
                Reset All
              </button>
            </div>
          )}

          <ProductGrid products={products} isLoading={isLoading} />
          <div className="mt-8">
            <Pagination page={page} totalPages={meta?.totalPages || 1} onPageChange={setPage} />
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setShowMobileFilter(false)}
          />
          <div className="relative w-full max-w-xs bg-white h-full p-5 overflow-y-auto shadow-2xl z-10">
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-100">
              <h3 className="font-display font-extrabold text-lg text-slate-900">Filter Products</h3>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-slate-700"
              >
                <FiX size={16} />
              </button>
            </div>
            <ProductFilter
              filters={filters}
              onFilterChange={(f) => {
                handleFilterChange(f);
              }}
              onReset={() => {
                handleReset();
                setShowMobileFilter(false);
              }}
              categories={categories}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
