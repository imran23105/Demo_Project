import { createSlice } from '@reduxjs/toolkit';

const wishlistFromStorage = localStorage.getItem('wishlist')
  ? JSON.parse(localStorage.getItem('wishlist'))
  : [];

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: wishlistFromStorage,
    isLoading: false,
  },
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
      localStorage.setItem('wishlist', JSON.stringify(action.payload));
    },
    toggleWishlistItem: (state, action) => {
      const product = action.payload;
      const idx = state.items.findIndex((p) => (p._id || p) === (product._id || product));
      if (idx !== -1) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(product);
      }
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('wishlist');
    },
    setWishlistLoading: (state, action) => { state.isLoading = action.payload; },
  },
});

export const { setWishlist, toggleWishlistItem, clearWishlist, setWishlistLoading } = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectIsWishlisted = (productId) => (state) =>
  state.wishlist.items.some((p) => (p._id || p) === productId);

export default wishlistSlice.reducer;
