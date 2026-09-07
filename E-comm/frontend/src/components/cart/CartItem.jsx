import { motion } from 'framer-motion';
import { FiTrash2 } from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatCurrency';
import useCart from '../../hooks/useCart';
import QuantitySelector from './QuantitySelector';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();
  const effectivePrice = item.discountPrice > 0 ? item.discountPrice : item.price;
  const subtotal = effectivePrice * item.quantity;
  const imageSrc = item.image || item.product?.images?.[0]?.url || '';
  const title = item.title || item.product?.title || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      layout
      className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all items-center"
    >
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 p-1 flex items-center justify-center">
        <img
          src={imageSrc || 'https://via.placeholder.com/100'}
          alt={title}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug mb-1">
          {title}
        </h4>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-sm sm:text-base font-black text-slate-900 font-display">
            {formatCurrency(effectivePrice)}
          </span>
          {item.discountPrice > 0 && item.discountPrice < item.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatCurrency(item.price)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <QuantitySelector
            value={item.quantity}
            max={item.product?.stock || 99}
            onChange={(qty) => updateQuantity(item._id, qty)}
          />
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500">Subtotal:</span>
            <span className="text-sm font-extrabold text-slate-900">{formatCurrency(subtotal)}</span>
            <button
              onClick={() => removeFromCart(item._id)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-brand-red hover:bg-red-50 transition-colors"
              title="Remove item"
            >
              <FiTrash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
