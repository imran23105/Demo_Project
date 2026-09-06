import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartItems, selectIsCartOpen, selectSubtotal, selectCartItemCount } from '../../redux/slices/cartSlice';
import useCart from '../../hooks/useCart';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import EmptyState from '../common/EmptyState';

const CartDrawer = () => {
  const isOpen = useSelector(selectIsCartOpen);
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);
  const itemCount = useSelector(selectCartItemCount);
  const { closeCart } = useCart();

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <FiShoppingBag size={20} className="text-navy" />
                <h2 className="font-bold text-gray-900">Your Cart</h2>
                {itemCount > 0 && (
                  <span className="bg-navy text-white text-xs font-bold px-2 py-0.5 rounded-full">{itemCount}</span>
                )}
              </div>
              <button onClick={closeCart} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <FiX size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <EmptyState
                  icon="🛒"
                  title="Your cart is empty"
                  description="Add items to your cart and they'll appear here."
                  actionLabel="Start Shopping"
                  actionHref="/shop"
                  onAction={closeCart}
                />
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem key={item._id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-5 bg-gray-50">
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                  <span className="font-bold text-gray-900">₹{subtotal?.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-xs text-gray-400 mb-4">Taxes and shipping calculated at checkout</p>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full text-center py-3 text-base"
                >
                  Proceed to Checkout →
                </Link>
                <button onClick={closeCart} className="w-full text-center text-sm text-gray-500 mt-3 hover:text-navy transition-colors">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;
