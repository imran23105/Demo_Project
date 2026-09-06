import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiHome, FiList } from 'react-icons/fi';
import { orderApi } from '../services/orderApi';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    orderApi.getOrderById(id).then(({ data }) => setOrder(data.data)).catch(() => {});
  }, [id]);

  return (
    <div className="container-custom py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </motion.div>

        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Order Placed! 🎉</h1>
        <p className="text-gray-500 mb-6">Thank you for your purchase. We'll send you a confirmation email shortly.</p>

        {order && (
          <div className="bg-white rounded-2xl shadow-card p-6 text-left mb-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400">Order Number</p>
                <p className="font-bold text-navy">{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Order Date</p>
                <p className="font-medium text-sm">{formatDate(order.createdAt)}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {order.items?.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg bg-gray-100" />
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between">
              <span className="font-semibold">Total Paid</span>
              <span className="font-bold text-navy text-lg">{formatCurrency(order.totalAmount)}</span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <div className={`badge ${order.paymentMethod === 'cod' ? 'badge-warning' : 'badge-success'}`}>
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}
              </div>
              <div className="badge badge-primary">{order.orderStatus}</div>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Link to="/orders" className="btn-primary flex items-center gap-2">
            <FiList size={16} /> My Orders
          </Link>
          <Link to="/" className="btn-secondary flex items-center gap-2">
            <FiHome size={16} /> Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
