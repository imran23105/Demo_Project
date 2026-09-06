import { createSlice, createSelector } from '@reduxjs/toolkit';

const cartFromStorage = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : { items: [], couponCode: '', couponDiscount: 0 };

const initialState = {
  items: cartFromStorage.items || [],
  couponCode: cartFromStorage.couponCode || '',
  couponDiscount: cartFromStorage.couponDiscount || 0,
  isOpen: false,
  isLoading: false,
};

const calculateTotals = (state) => {
  state.subtotal = state.items.reduce((total, item) => {
    const price = item.discountPrice > 0 ? item.discountPrice : item.price;
    return total + price * item.quantity;
  }, 0);
  state.totalItems = state.items.reduce((t, i) => t + i.quantity, 0);
  state.shippingCost = state.subtotal >= 500 ? 0 : 49;
  state.tax = Math.round(state.subtotal * 0.18);
  state.totalAmount = state.subtotal + state.shippingCost + state.tax - state.couponDiscount;
};

const saveCart = (state) => {
  localStorage.setItem('cart', JSON.stringify({
    items: state.items,
    couponCode: state.couponCode,
    couponDiscount: state.couponDiscount,
  }));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: { ...initialState, ...calculateTotals({ ...initialState }) || {} },
  reducers: {
    setCart: (state, action) => {
      const { items, couponCode, couponDiscount } = action.payload;
      state.items = items || [];
      state.couponCode = couponCode || '';
      state.couponDiscount = couponDiscount || 0;
      calculateTotals(state);
      saveCart(state);
    },
    addItemLocally: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.product._id === product._id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          _id: Date.now().toString(),
          product,
          quantity,
          price: product.price,
          discountPrice: product.discountPrice || 0,
          image: product.images?.[0]?.url || '',
          title: product.title,
        });
      }
      calculateTotals(state);
      saveCart(state);
    },
    removeItemLocally: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
      calculateTotals(state);
      saveCart(state);
    },
    updateQuantityLocally: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find((i) => i._id === itemId);
      if (item) item.quantity = quantity;
      calculateTotals(state);
      saveCart(state);
    },
    clearCartLocally: (state) => {
      state.items = [];
      state.couponCode = '';
      state.couponDiscount = 0;
      calculateTotals(state);
      localStorage.removeItem('cart');
    },
    setCoupon: (state, action) => {
      state.couponCode = action.payload.code;
      state.couponDiscount = action.payload.discount;
      calculateTotals(state);
      saveCart(state);
    },
    removeCoupon: (state) => {
      state.couponCode = '';
      state.couponDiscount = 0;
      calculateTotals(state);
      saveCart(state);
    },
    openCart: (state) => { state.isOpen = true; },
    closeCart: (state) => { state.isOpen = false; },
    toggleCart: (state) => { state.isOpen = !state.isOpen; },
    setCartLoading: (state, action) => { state.isLoading = action.payload; },
  },
});

export const {
  setCart, addItemLocally, removeItemLocally, updateQuantityLocally,
  clearCartLocally, setCoupon, removeCoupon,
  openCart, closeCart, toggleCart, setCartLoading,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.totalAmount;
export const selectCartItemCount = (state) => state.cart.totalItems;
export const selectIsCartOpen = (state) => state.cart.isOpen;
export const selectSubtotal = (state) => state.cart.subtotal;
export const selectShipping = (state) => state.cart.shippingCost;
export const selectTax = (state) => state.cart.tax;
export const selectCoupon = createSelector(
  [(state) => state.cart.couponCode, (state) => state.cart.couponDiscount],
  (code, discount) => ({ code, discount })
);

export default cartSlice.reducer;
