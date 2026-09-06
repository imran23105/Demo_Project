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
      className="flex gap-3 bg-white border border-gray-100 rounded-xl p-3"
    >
      <img
        src={imageSrc || 'https://via.placeholder.com/80'}
        alt={title}
        className="w-16 h-16 object-cover rounded-lg flex-shrink-0 bg-gray-50"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight mb-1">{title}</h4>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-bold text-navy">{formatCurrency(effectivePrice)}</span>
          {item.discountPrice > 0 && item.discountPrice < item.price && (
            <span className="text-xs text-gray-400 line-through">{formatCurrency(item.price)}</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <QuantitySelector
            value={item.quantity}
            max={item.product?.stock || 99}
            onChange={(qty) => updateQuantity(item._id, qty)}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">{formatCurrency(subtotal)}</span>
            <button
              onClick={() => removeFromCart(item._id)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
