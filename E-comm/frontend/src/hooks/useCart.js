import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { selectCartItems, selectCartTotal, selectCartItemCount, selectIsCartOpen, selectSubtotal, selectShipping, selectTax, selectCoupon, setCart, addItemLocally, removeItemLocally, updateQuantityLocally, clearCartLocally, openCart, closeCart, toggleCart } from '../redux/slices/cartSlice';
import { cartApiService } from '../services/productApi';
import { selectIsAuthenticated } from '../redux/slices/authSlice';

const useCart = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartItemCount);
  const isOpen = useSelector(selectIsCartOpen);
  const subtotal = useSelector(selectSubtotal);
  const shipping = useSelector(selectShipping);
  const tax = useSelector(selectTax);
  const coupon = useSelector(selectCoupon);

  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        const { data } = await cartApiService.addToCart(product._id, quantity);
        dispatch(setCart(data.data));
        dispatch(openCart());
        toast.success(`${product.title} added to cart!`);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to add to cart');
      }
    } else {
      dispatch(addItemLocally({ product, quantity }));
      dispatch(openCart());
      toast.success(`${product.title} added to cart!`);
    }
  };

  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        const { data } = await cartApiService.removeItem(itemId);
        dispatch(setCart(data.data));
      } catch { dispatch(removeItemLocally(itemId)); }
    } else {
      dispatch(removeItemLocally(itemId));
    }
    toast.success('Item removed');
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return removeFromCart(itemId);
    if (isAuthenticated) {
      try {
        const { data } = await cartApiService.updateItem(itemId, quantity);
        dispatch(setCart(data.data));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Update failed');
      }
    } else {
      dispatch(updateQuantityLocally({ itemId, quantity }));
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try { await cartApiService.clearCart(); } catch {}
    }
    dispatch(clearCartLocally());
  };

  const fetchCart = async () => {
    if (isAuthenticated) {
      try {
        const { data } = await cartApiService.getCart();
        dispatch(setCart(data.data));
      } catch {}
    }
  };

  return {
    items, total, itemCount, isOpen, subtotal, shipping, tax, coupon,
    addToCart, removeFromCart, updateQuantity, clearCart, fetchCart,
    openCart: () => dispatch(openCart()),
    closeCart: () => dispatch(closeCart()),
    toggleCart: () => dispatch(toggleCart()),
  };
};

export default useCart;
