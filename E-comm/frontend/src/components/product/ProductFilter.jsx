import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-semibold text-sm text-gray-800">{title}</span>
        {isOpen ? <FiChevronUp size={16} className="text-gray-400" /> : <FiChevronDown size={16} className="text-gray-400" />}
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
};

const ProductFilter = ({ filters, onFilterChange, onReset, categories }) => {
  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹2,000', min: 500, max: 2000 },
    { label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
    { label: '₹5,000 - ₹15,000', min: 5000, max: 15000 },
    { label: 'Over ₹15,000', min: 15000, max: 999999 },
  ];

  const ratings = [4, 3, 2, 1];

  const sortOptions = [
    { label: 'Newest First', value: '-createdAt' },
    { label: 'Price: Low to High', value: 'price' },
    { label: 'Price: High to Low', value: '-price' },
    { label: 'Top Rated', value: '-ratings' },
    { label: 'Most Popular', value: '-numReviews' },
    { label: 'Biggest Discount', value: '-discountPercent' },
  ];

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.minRating;

  return (
    <div className="bg-white rounded-xl shadow-card p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button onClick={onReset} className="text-xs text-red-500 flex items-center gap-1 hover:text-red-700">
            <FiX size={12} /> Clear All
          </button>
        )}
      </div>

      {/* Sort */}
      <FilterSection title="Sort By">
        <select
          value={filters.sort || '-createdAt'}
          onChange={(e) => onFilterChange({ sort: e.target.value })}
          className="input-field text-sm py-2"
        >
          {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </FilterSection>

      {/* Category */}
      {categories?.length > 0 && (
        <FilterSection title="Category">
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={!filters.category}
                onChange={() => onFilterChange({ category: '' })}
                className="accent-navy"
              />
              <span className="text-sm text-gray-700">All Categories</span>
            </label>
            {categories.map((cat) => (
              <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === cat._id}
                  onChange={() => onFilterChange({ category: cat._id })}
                  className="accent-navy"
                />
                <span className="text-sm text-gray-700">{cat.name}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Price */}
      <FilterSection title="Price Range">
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="price" checked={!filters.minPrice} onChange={() => onFilterChange({ minPrice: '', maxPrice: '' })} className="accent-navy" />
            <span className="text-sm text-gray-700">All Prices</span>
          </label>
          {priceRanges.map((range) => (
            <label key={range.label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={filters.minPrice === String(range.min) && filters.maxPrice === String(range.max)}
                onChange={() => onFilterChange({ minPrice: String(range.min), maxPrice: String(range.max) })}
                className="accent-navy"
              />
              <span className="text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Minimum Rating">
        <div className="space-y-2">
          {ratings.map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === String(r)}
                onChange={() => onFilterChange({ minRating: String(r) })}
                className="accent-navy"
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: r }).map((_, i) => <AiFillStar key={i} size={14} className="text-amber-400" />)}
                <span className="text-sm text-gray-700">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};

export default ProductFilter;
