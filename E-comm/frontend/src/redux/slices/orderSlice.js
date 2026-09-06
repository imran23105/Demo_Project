import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  order: null,
  isLoading: false,
  error: null,
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload.data || [];
      state.meta = action.payload.meta || initialState.meta;
    },
    setOrder: (state, action) => { state.order = action.payload; },
    addOrder: (state, action) => { state.orders.unshift(action.payload); },
    setLoading: (state, action) => { state.isLoading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
    clearError: (state) => { state.error = null; },
  },
});

export const { setOrders, setOrder, addOrder, setLoading, setError, clearError } = orderSlice.actions;

export const selectOrders = (state) => state.orders.orders;
export const selectOrder = (state) => state.orders.order;
export const selectOrderLoading = (state) => state.orders.isLoading;
export const selectOrderMeta = (state) => state.orders.meta;

export default orderSlice.reducer;
