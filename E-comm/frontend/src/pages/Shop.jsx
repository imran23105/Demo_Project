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
    <div className="container-custom py-6">
      <div className="flex gap-6">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <ProductFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
              categories={categories}
            />
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {filters.search ? `Results for "${filters.search}"` : 'All Products'}
              </h1>
              {!isLoading && (
                <p className="text-sm text-gray-500">{meta?.total || 0} products found</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileFilter(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:border-navy"
              >
                <FiFilter size={16} /> Filter
              </button>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange({ sort: e.target.value })}
                className="input-field py-2 text-sm w-48"
              >
                <option value="-createdAt">Newest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-ratings">Top Rated</option>
                <option value="-numReviews">Most Popular</option>
              </select>
            </div>
          </div>

          <ProductGrid products={products} isLoading={isLoading} />
          <Pagination page={page} totalPages={meta?.totalPages || 1} onPageChange={setPage} />
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilter(false)} />
          <div className="absolute left-0 top-0 h-full w-80 bg-white p-5 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Filters</h3>
              <button onClick={() => setShowMobileFilter(false)}><FiX /></button>
            </div>
            <ProductFilter
              filters={filters}
              onFilterChange={(f) => { handleFilterChange(f); }}
              onReset={() => { handleReset(); setShowMobileFilter(false); }}
              categories={categories}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
