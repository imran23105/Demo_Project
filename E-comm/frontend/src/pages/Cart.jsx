import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { selectCartItems } from '../redux/slices/cartSlice';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyState from '../components/common/EmptyState';
import useCart from '../hooks/useCart';

const Cart = () => {
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const { clearCart } = useCart();

  return (
    <div className="container-custom py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart ({items.length})</h1>
        {items.length > 0 && (
          <button onClick={clearCart} className="ml-auto text-sm text-red-500 flex items-center gap-1 hover:text-red-700">
            <FiTrash2 size={14} /> Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          description="Browse our products and add something you love!"
          actionLabel="Shop Now"
          actionHref="/shop"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => <CartItem key={item._id} item={item} />)}
          </div>
          <div>
            <CartSummary onCheckout={() => navigate('/checkout')} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
