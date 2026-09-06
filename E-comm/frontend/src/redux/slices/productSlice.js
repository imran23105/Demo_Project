import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  product: null,
  relatedProducts: [],
  trending: [],
  featured: [],
  bestSellers: [],
  isLoading: false,
  error: null,
  meta: { page: 1, limit: 12, total: 0, totalPages: 0 },
  filters: { category: '', brand: '', minPrice: '', maxPrice: '', minRating: '', sort: '-createdAt', search: '' },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload.data || [];
      state.meta = action.payload.meta || initialState.meta;
    },
    setProduct: (state, action) => { state.product = action.payload; },
    setRelatedProducts: (state, action) => { state.relatedProducts = action.payload; },
    setTrending: (state, action) => { state.trending = action.payload; },
    setFeatured: (state, action) => { state.featured = action.payload; },
    setBestSellers: (state, action) => { state.bestSellers = action.payload; },
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    resetFilters: (state) => { state.filters = initialState.filters; },
    setLoading: (state, action) => { state.isLoading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
    clearError: (state) => { state.error = null; },
  },
});

export const {
  setProducts, setProduct, setRelatedProducts, setTrending, setFeatured, setBestSellers,
  setFilters, resetFilters, setLoading, setError, clearError,
} = productSlice.actions;

export const selectProducts = (state) => state.products.products;
export const selectProduct = (state) => state.products.product;
export const selectProductMeta = (state) => state.products.meta;
export const selectProductFilters = (state) => state.products.filters;
export const selectTrending = (state) => state.products.trending;
export const selectFeatured = (state) => state.products.featured;
export const selectBestSellers = (state) => state.products.bestSellers;
export const selectProductLoading = (state) => state.products.isLoading;

export default productSlice.reducer;
