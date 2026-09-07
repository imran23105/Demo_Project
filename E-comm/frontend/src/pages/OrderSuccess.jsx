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
    <div className="container-custom py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto text-center"
      >
        {/* Success Animation Circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm"
        >
          <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </motion.div>

        <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-2">
          ORDER CONFIRMED
        </span>

        <h1 className="text-3xl font-display font-black text-slate-900 mb-2">
          Thank You For Your Order! 🎉
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mb-6 max-w-md mx-auto">
          Your appliance order has been received and is being prepared for express delivery.
        </p>

        {order && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 text-left mb-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Order Number</p>
                <p className="font-display font-black text-slate-900 text-sm sm:text-base">#{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase font-bold">Placed On</p>
                <p className="font-semibold text-xs text-slate-700">{formatDate(order.createdAt)}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50/70 p-2.5 rounded-2xl border border-gray-100">
                  <img
                    src={item.image || 'https://via.placeholder.com/60'}
                    alt={item.title}
                    className="w-12 h-12 object-contain rounded-xl bg-white p-1 border border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                    <p className="text-[11px] text-gray-500">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline font-black text-slate-900">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Total Amount Paid</span>
              <span className="font-display text-xl">{formatCurrency(order.totalAmount)}</span>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : '✓ Paid Online (Razorpay)'}
              </span>
              <span className="text-xs font-bold text-slate-800 bg-gray-100 px-3 py-1 rounded-full capitalize">
                Status: {order.orderStatus}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            to="/orders"
            className="px-6 py-3 rounded-full bg-[#11161B] hover:bg-brand-red text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2"
          >
            <FiList size={15} /> Track in My Orders
          </Link>
          <Link
            to="/"
            className="px-6 py-3 rounded-full bg-white hover:bg-gray-50 text-slate-900 border border-gray-200 text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <FiHome size={15} /> Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
