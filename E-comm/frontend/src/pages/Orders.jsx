import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiEye, FiMapPin, FiX } from 'react-icons/fi';
import { selectIsAdmin } from '../redux/slices/authSlice';
import { orderApi } from '../services/orderApi';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import EmptyState from '../components/common/EmptyState';
import { Spinner } from '../components/common/Loader';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending: { label: 'Pending', badge: 'bg-amber-100 text-amber-800 border-amber-200', step: 0 },
  confirmed: { label: 'Confirmed', badge: 'bg-blue-100 text-blue-800 border-blue-200', step: 1 },
  processing: { label: 'Processing', badge: 'bg-purple-100 text-purple-800 border-purple-200', step: 2 },
  shipped: { label: 'Shipped', badge: 'bg-indigo-100 text-indigo-800 border-indigo-200', step: 3 },
  delivered: { label: 'Delivered', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', step: 4 },
  cancelled: { label: 'Cancelled', badge: 'bg-rose-100 text-rose-800 border-rose-200', step: -1 },
};

const TIMELINE_STEPS = ['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

const Orders = () => {
  const isAdmin = useSelector(selectIsAdmin);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = () => {
    setIsLoading(true);
    orderApi
      .getMyOrders()
      .then(({ data }) => setOrders(data.data || []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancellingId(orderId);
    try {
      await orderApi.cancelOrder(orderId, 'Cancelled by customer');
      toast.success('Order cancelled successfully');
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: 'cancelled' } : null));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {isAdmin && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-navy flex items-center gap-2">
              👑 Administrator View: Personal Orders vs Store Management
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">
              You are viewing your personal placed orders. To inspect and update all customer orders across the platform, visit the Admin Orders Panel.
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy text-white text-xs font-semibold rounded-lg hover:bg-navy-dark transition-all whitespace-nowrap shadow-sm"
          >
            Manage All Orders →
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track, review, or cancel your orders</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </span>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No orders yet"
          description="When you place an order, it'll show up here with live status tracking."
          actionLabel="Start Shopping"
          actionHref="/shop"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
            const canCancel = ['pending', 'confirmed'].includes(order.orderStatus);

            return (
              <div key={order._id} className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 bg-slate-50/70 border-b border-gray-100">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Order</span>
                    <p className="font-bold text-navy text-base">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border capitalize ${statusInfo.badge}`}>
                      {statusInfo.label}
                    </span>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">Total</span>
                      <p className="font-bold text-gray-900 text-base">{formatCurrency(order.totalAmount)}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar (if not cancelled) */}
                {order.orderStatus !== 'cancelled' ? (
                  <div className="px-5 py-3 bg-white border-b border-gray-50 hidden sm:block">
                    <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                      {TIMELINE_STEPS.map((stepName, i) => {
                        const isDone = i <= statusInfo.step;
                        const isCurrent = i === statusInfo.step;
                        return (
                          <div key={stepName} className="flex-1 flex items-center">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                  isDone ? 'bg-navy text-white' : 'bg-gray-200 text-gray-500'
                                } ${isCurrent ? 'ring-2 ring-navy/30 ring-offset-1 scale-110' : ''}`}
                              >
                                {isDone ? '✓' : i + 1}
                              </div>
                              <span className={`text-[10px] mt-1 ${isCurrent ? 'font-bold text-navy' : 'text-gray-400'}`}>
                                {stepName}
                              </span>
                            </div>
                            {i < TIMELINE_STEPS.length - 1 && (
                              <div className={`flex-1 h-0.5 mx-2 ${i < statusInfo.step ? 'bg-navy' : 'bg-gray-200'}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="px-5 py-2.5 bg-rose-50/50 border-b border-rose-100 text-rose-700 text-xs flex items-center gap-2">
                    <FiXCircle /> This order was cancelled.
                  </div>
                )}

                {/* Products Item List */}
                <div className="p-4 sm:p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/80 border border-gray-100">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                          alt={item.title}
                          className="w-14 h-14 object-cover rounded-md bg-white border border-gray-100"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-gray-800 line-clamp-1">{item.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Qty: {item.quantity} × {formatCurrency(item.price)}
                          </p>
                          <p className="text-xs font-bold text-navy">{formatCurrency(item.subtotal)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions & Payment Info */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                          order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {order.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Payment Pending'}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-navy hover:text-navy-dark px-3 py-1.5 border border-navy/20 hover:border-navy rounded-lg transition-colors"
                      >
                        <FiEye size={12} /> View Details
                      </button>
                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancellingId === order._id}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-1.5 border border-rose-200 hover:border-rose-400 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Order #{selectedOrder.orderNumber}</h3>
                  <p className="text-xs text-gray-500">Placed on {formatDate(selectedOrder.createdAt)}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Status Banner */}
              <div className="my-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500">Current Status</span>
                  <p className="text-sm font-bold capitalize text-navy">{selectedOrder.orderStatus}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Payment</span>
                  <p className="text-sm font-bold capitalize text-gray-900">{selectedOrder.paymentStatus}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Method</span>
                  <p className="text-sm font-bold uppercase text-gray-900">{selectedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2 mb-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Items in Order</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 text-sm">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded" />
                        <div>
                          <p className="font-medium text-xs text-gray-800 line-clamp-1">{item.title}</p>
                          <p className="text-[11px] text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-navy">{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="mb-4 p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-xs">
                  <h4 className="font-bold text-navy flex items-center gap-1.5 mb-1">
                    <FiMapPin size={12} /> Delivery Address
                  </h4>
                  <p className="font-semibold text-gray-800">{selectedOrder.shippingAddress.fullName} · {selectedOrder.shippingAddress.phone}</p>
                  <p className="text-gray-600 mt-0.5">
                    {selectedOrder.shippingAddress.addressLine1}
                    {selectedOrder.shippingAddress.addressLine2 ? `, ${selectedOrder.shippingAddress.addressLine2}` : ''}
                  </p>
                  <p className="text-gray-600">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}
                  </p>
                </div>
              )}

              {/* Summary Breakdown */}
              <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{selectedOrder.shippingCost === 0 ? 'FREE' : formatCurrency(selectedOrder.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (GST 18%)</span>
                  <span>{formatCurrency(selectedOrder.tax)}</span>
                </div>
                {selectedOrder.couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount ({selectedOrder.couponCode})</span>
                    <span>-{formatCurrency(selectedOrder.couponDiscount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-sm text-navy">
                  <span>Total Paid</span>
                  <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-navy text-white text-xs font-semibold rounded-lg hover:bg-navy-dark transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
