import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { selectWishlistItems, selectIsWishlisted, toggleWishlistItem } from '../redux/slices/wishlistSlice';

const useWishlist = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectWishlistItems);

  const toggle = (product) => {
    const isWishlisted = items.some((p) => (p._id || p) === product._id);
    dispatch(toggleWishlistItem(product));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
  };

  const isWishlisted = (productId) => items.some((p) => (p._id || p) === productId);

  return { items, toggle, isWishlisted };
};

export default useWishlist;
