import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiX, FiFilter } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-3.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left group"
      >
        <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900 group-hover:text-brand-red transition-colors">
          {title}
        </span>
        {isOpen ? <FiChevronUp size={15} className="text-gray-400" /> : <FiChevronDown size={15} className="text-gray-400" />}
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

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.minRating;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-900 text-[#CEF04A] flex items-center justify-center">
            <FiFilter size={14} />
          </div>
          <h3 className="font-display font-extrabold text-sm text-slate-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs font-bold text-brand-red flex items-center gap-1 hover:underline"
          >
            <FiX size={12} /> Reset
          </button>
        )}
      </div>

      {/* Category */}
      {categories?.length > 0 && (
        <FilterSection title="Categories">
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            <label
              onClick={() => onFilterChange({ category: '' })}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                !filters.category ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-gray-50'
              }`}
            >
              <span>All Categories</span>
              {!filters.category && <span className="text-[#CEF04A] text-xs">✓</span>}
            </label>
            {categories.map((cat) => {
              const isSelected = filters.category === cat._id;
              return (
                <label
                  key={cat._id}
                  onClick={() => onFilterChange({ category: cat._id })}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    isSelected ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {isSelected && <span className="text-[#CEF04A] text-xs">✓</span>}
                </label>
              );
            })}
          </div>
        </FilterSection>
      )}

      {/* Price */}
      <FilterSection title="Price Range">
        <div className="space-y-1.5">
          <label
            onClick={() => onFilterChange({ minPrice: '', maxPrice: '' })}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              !filters.minPrice ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-gray-50'
            }`}
          >
            <span>All Prices</span>
            {!filters.minPrice && <span className="text-[#CEF04A] text-xs">✓</span>}
          </label>
          {priceRanges.map((range) => {
            const isSelected = filters.minPrice === String(range.min) && filters.maxPrice === String(range.max);
            return (
              <label
                key={range.label}
                onClick={() => onFilterChange({ minPrice: String(range.min), maxPrice: String(range.max) })}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  isSelected ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-gray-50'
                }`}
              >
                <span>{range.label}</span>
                {isSelected && <span className="text-[#CEF04A] text-xs">✓</span>}
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Customer Rating">
        <div className="space-y-1.5">
          {ratings.map((r) => {
            const isSelected = filters.minRating === String(r);
            return (
              <label
                key={r}
                onClick={() => onFilterChange({ minRating: String(r) })}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  isSelected ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {Array.from({ length: r }).map((_, i) => (
                      <AiFillStar key={i} size={13} />
                    ))}
                  </div>
                  <span>& Up</span>
                </div>
                {isSelected && <span className="text-[#CEF04A] text-xs">✓</span>}
              </label>
            );
          })}
        </div>
      </FilterSection>
    </div>
  );
};

export default ProductFilter;
