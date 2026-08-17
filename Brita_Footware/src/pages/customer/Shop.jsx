import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown, Grid3x3, LayoutList } from "lucide-react";
import ProductCard from "../../components/product/ProductCard";
import MiniHero from "../../components/common/MiniHero";
import { products } from "../../data/products";
import { categories } from "../../data/categories";

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest First" },
  { value: "best-selling", label: "Best Selling" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
];

export default function Shop({ category: propCategory, isNew, isSale }) {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const [filters, setFilters] = useState({
    category: propCategory || "",
    minPrice: 0,
    maxPrice: 10000,
    sizes: [],
    colors: [],
    inStockOnly: false,
  });
  const [sort, setSort] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [gridView, setGridView] = useState("grid");
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const filtered = useMemo(() => {
    let list = [...products];
    if (isNew) list = list.filter((p) => p.isNew);
    if (isSale) list = list.filter((p) => p.discount > 0);
    if (filters.category) list = list.filter((p) => p.category === filters.category);
    if (filters.inStockOnly) list = list.filter((p) => p.stock > 0);
    if (filters.sizes.length) list = list.filter((p) => p.sizes?.some((s) => filters.sizes.includes(s)));
    if (filters.colors.length) list = list.filter((p) => p.colors?.some((c) => filters.colors.includes(c)));
    list = list.filter((p) => p.price >= filters.minPrice && p.price <= filters.maxPrice);
    if (searchQuery) list = list.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));

    switch (sort) {
      case "newest": list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      case "best-selling": list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0)); break;
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
    }
    return list;
  }, [filters, sort, searchQuery, isNew, isSale]);

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  const toggleFilter = (key, val) => {
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter((x) => x !== val) : [...f[key], val],
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: propCategory || "", minPrice: 0, maxPrice: 10000, sizes: [], colors: [], inStockOnly: false });
    setPage(1);
  };

  const activeFilterCount = [
    filters.category && !propCategory ? 1 : 0,
    filters.sizes.length,
    filters.colors.length,
    filters.inStockOnly ? 1 : 0,
    (filters.minPrice > 0 || filters.maxPrice < 10000) ? 1 : 0,
  ].reduce((s, n) => s + n, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mini Hero Banner */}
      <MiniHero
        category={propCategory}
        isNew={isNew}
        isSale={isSale}
        searchQuery={searchQuery}
        count={filtered.length}
      />

      <div className="container-max py-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            id="filter-toggle-btn"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              activeFilterCount > 0 ? "border-secondary bg-secondary/5 text-secondary" : "border-slate-200 bg-white text-slate-600 hover:border-secondary hover:text-secondary"
            }`}
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-secondary text-white text-xs rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-danger text-sm hover:text-red-700 transition-colors">
              <X size={14} /> Clear filters
            </button>
          )}

          <div className="flex items-center gap-3 ml-auto">
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                id="sort-select"
                className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-8 text-sm text-slate-700 focus:outline-none focus:border-secondary cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setGridView("grid")}
                className={`p-2.5 ${gridView === "grid" ? "bg-secondary text-white" : "text-slate-400 hover:text-slate-600"}`}
              ><Grid3x3 size={16} /></button>
              <button
                onClick={() => setGridView("list")}
                className={`p-2.5 ${gridView === "list" ? "bg-secondary text-white" : "text-slate-400 hover:text-slate-600"}`}
              ><LayoutList size={16} /></button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, x: -20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 260 }}
                exit={{ opacity: 0, x: -20, width: 0 }}
                transition={{ duration: 0.25 }}
                className="shrink-0 overflow-hidden"
              >
                <div className="w-64 bg-white rounded-2xl border border-slate-100 p-5 space-y-6 sticky top-24">
                  <h3 className="font-heading font-bold text-sm text-primary uppercase tracking-wide">Filters</h3>

                  {/* Category */}
                  {!propCategory && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Category</h4>
                      <div className="space-y-2">
                        {categories.map((cat) => (
                          <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={filters.category === cat.slug}
                              onChange={() => setFilters((f) => ({ ...f, category: f.category === cat.slug ? "" : cat.slug }))}
                              className="w-4 h-4 accent-secondary"
                            />
                            <span className="text-sm text-slate-600 group-hover:text-primary">{cat.name}</span>
                            <span className="ml-auto text-xs text-slate-400">{cat.count}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price Range */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                      Price Range: ₹{filters.minPrice} – ₹{filters.maxPrice}
                    </h4>
                    <input
                      type="range"
                      min={0}
                      max={10000}
                      step={100}
                      value={filters.maxPrice}
                      onChange={(e) => setFilters((f) => ({ ...f, maxPrice: +e.target.value }))}
                    />
                  </div>

                  {/* Sizes */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Size</h4>
                    <div className="flex flex-wrap gap-2">
                      {[6, 7, 8, 9, 10, 11, 12].map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleFilter("sizes", s)}
                          className={`w-9 h-9 rounded-lg text-xs font-semibold border transition-all ${
                            filters.sizes.includes(s)
                              ? "border-secondary bg-secondary text-white"
                              : "border-slate-200 text-slate-600 hover:border-secondary"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Color</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Black","White","Brown","Navy","Grey","Red"].map((c) => (
                        <button
                          key={c}
                          onClick={() => toggleFilter("colors", c)}
                          title={c}
                          className={`w-7 h-7 rounded-full border-2 transition-all ${
                            filters.colors.includes(c) ? "border-secondary scale-110" : "border-transparent hover:border-slate-300"
                          }`}
                          style={{
                            background: { Black: "#000", White: "#fff", Brown: "#8B4513", Navy: "#000080", Grey: "#808080", Red: "#DC2626" }[c],
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* In stock */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStockOnly}
                      onChange={(e) => setFilters((f) => ({ ...f, inStockOnly: e.target.checked }))}
                      className="w-4 h-4 accent-secondary"
                    />
                    <span className="text-sm text-slate-600">In Stock Only</span>
                  </label>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">👟</p>
                <h3 className="font-heading font-bold text-xl text-primary mb-2">No products found</h3>
                <p className="text-slate-500 mb-4">Try adjusting your filters.</p>
                <button onClick={clearFilters} className="btn-secondary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className={`grid gap-4 ${gridView === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
                  {paginated.map((p, i) => (
                    <ProductCard key={p.id} product={p} delay={Math.min(i, 8) * 0.04} />
                  ))}
                </div>
                {hasMore && (
                  <div className="text-center mt-10">
                    <button onClick={() => setPage((p) => p + 1)} className="btn-secondary px-10">
                      Load More ({filtered.length - paginated.length} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
