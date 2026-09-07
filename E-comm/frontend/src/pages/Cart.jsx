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
    <div className="container-custom py-6">
      <div className="bg-white rounded-3xl p-5 sm:p-6 mb-6 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-slate-800 transition-colors"
          >
            <FiArrowLeft size={18} />
          </button>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              YOUR BAG
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              Shopping Cart ({items.length})
            </h1>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-bold text-brand-red flex items-center gap-1.5 hover:underline bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-full transition-colors"
          >
            <FiTrash2 size={13} /> Clear Bag
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          description="Browse our smart appliances and add your favorite picks!"
          actionLabel="Shop Catalog"
          actionHref="/shop"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>
          <div className="sticky top-24">
            <CartSummary onCheckout={() => navigate('/checkout')} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
