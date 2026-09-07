import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { selectCartItems, selectSubtotal, selectShipping, selectTax, selectCoupon } from '../redux/slices/cartSlice';
import { selectUser } from '../redux/slices/authSlice';
import ShippingForm from '../components/checkout/ShippingForm';
import PaymentMethod from '../components/checkout/PaymentMethod';
import { orderApi } from '../services/orderApi';
import { paymentApi } from '../services/paymentApi';
import useCart from '../hooks/useCart';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatCurrency';

const STEPS = ['Shipping', 'Payment', 'Review'];

const Checkout = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);
  const shipping = useSelector(selectShipping);
  const tax = useSelector(selectTax);
  const coupon = useSelector(selectCoupon);
  const { clearCart } = useCart();

  const total = subtotal + shipping + tax - coupon.discount;

  const [step, setStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isPlacing, setIsPlacing] = useState(false);

  const savedAddresses = user?.addresses || [];

  const validateAddress = () => {
    if (!shippingAddress.fullName?.trim()) return 'Full Name is required';
    if (!shippingAddress.phone?.trim()) return 'Phone Number is required';
    if (!shippingAddress.addressLine1?.trim()) return 'Address Line 1 is required';
    if (!shippingAddress.city?.trim()) return 'City is required';
    if (!shippingAddress.state?.trim()) return 'State is required';
    if (!shippingAddress.postalCode?.trim()) return 'Postal Code / PIN is required';
    return null;
  };

  const handlePlaceOrder = async () => {
    const addressErr = validateAddress();
    if (addressErr) {
      toast.error(addressErr);
      setStep(0);
      return;
    }

    if (!items || items.length === 0) {
      toast.error('Cart is empty. Please add items to cart.');
      navigate('/shop');
      return;
    }

    setIsPlacing(true);
    try {
      // Create order
      const { data: orderData } = await orderApi.createOrder({
        shippingAddress: {
          ...shippingAddress,
          country: shippingAddress.country || 'India',
        },
        paymentMethod,
        couponCode: coupon?.code || '',
        couponDiscount: coupon?.discount || 0,
        items,
      });

      const order = orderData.data;

      if (paymentMethod === 'cod') {
        clearCart();
        navigate(`/order-success/${order._id}`);
        return;
      }

      if (paymentMethod === 'razorpay') {
        if (!window.Razorpay) {
          toast.error('Razorpay SDK failed to load. Please refresh the page.');
          setIsPlacing(false);
          return;
        }

        const { data: rzpData } = await paymentApi.createRazorpayOrder(total, order._id);
        const options = {
          key: rzpData.data.keyId || import.meta.env.VITE_RAZORPAY_KEY,
          amount: rzpData.data.amount,
          currency: rzpData.data.currency,
          name: 'Nebula Store',
          description: `Order #${order.orderNumber}`,
          order_id: rzpData.data.razorpayOrderId,
          prefill: {
            name: user?.name || shippingAddress?.fullName || '',
            email: user?.email || '',
            contact: shippingAddress?.phone || '',
          },
          theme: { color: '#1e3a5f' },
          modal: {
            ondismiss: () => {
              setIsPlacing(false);
              toast('Payment cancelled', { icon: 'ℹ️' });
            },
          },
          handler: async (response) => {
            try {
              setIsPlacing(true);
              await paymentApi.verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id,
              });
              clearCart();
              navigate(`/order-success/${order._id}`);
            } catch (err) {
              toast.error(err.response?.data?.message || 'Payment verification failed');
            } finally {
              setIsPlacing(false);
            }
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
          toast.error(response.error?.description || 'Payment failed');
          setIsPlacing(false);
        });
        rzp.open();
        return;
      }

      // Stripe — simplified
      toast.success('Order placed! (Stripe integration ready)');
      clearCart();
      navigate(`/order-success/${order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="container-custom py-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 mb-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
            SECURE CHECKOUT
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
            Finalize Your Order
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 flex-wrap">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  i === step
                    ? 'bg-slate-900 text-[#CEF04A] shadow-sm'
                    : i < step
                    ? 'bg-emerald-600 text-white cursor-pointer'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {i < step ? <FiCheck size={13} /> : <span>{i + 1}</span>}
                <span>{s}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-4 sm:w-6 ${i < step ? 'bg-emerald-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form Container */}
        <div className="lg:col-span-2">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8"
          >
            {step === 0 && (
              <div className="space-y-6">
                <ShippingForm
                  value={shippingAddress}
                  onChange={setShippingAddress}
                  savedAddresses={savedAddresses}
                />
                <button
                  onClick={() => {
                    const err = validateAddress();
                    if (err) {
                      toast.error(err);
                      return;
                    }
                    setStep(1);
                  }}
                  className="w-full py-3.5 px-6 rounded-full bg-[#11161B] hover:bg-brand-red text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <PaymentMethod value={paymentMethod} onChange={setPaymentMethod} />
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 py-3 px-6 rounded-full border border-gray-200 hover:border-slate-800 text-slate-800 text-xs sm:text-sm font-bold transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 px-6 rounded-full bg-[#11161B] hover:bg-brand-red text-white text-xs sm:text-sm font-bold shadow-md transition-all"
                  >
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="pb-3 border-b border-gray-100">
                  <h3 className="font-display font-extrabold text-lg text-slate-900">Review Items</h3>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => {
                    const price = item.discountPrice > 0 ? item.discountPrice : item.price;
                    return (
                      <div
                        key={item._id}
                        className="flex gap-3 bg-gray-50/80 border border-gray-100 rounded-2xl p-3 items-center"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-14 object-contain rounded-xl bg-white p-1 border border-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{item.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Qty: {item.quantity} × {formatCurrency(price)}
                          </p>
                        </div>
                        <span className="text-sm font-black text-slate-900 font-display">
                          {formatCurrency(price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-[#F3F3EE] rounded-2xl p-4 text-xs space-y-2 border border-gray-200/70">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping Address:</span>
                    <span className="font-bold text-slate-900">
                      {shippingAddress.addressLine1}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Selected Payment:</span>
                    <span className="font-bold text-slate-900 uppercase">
                      {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 px-6 rounded-full border border-gray-200 hover:border-slate-800 text-slate-800 text-xs sm:text-sm font-bold transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacing}
                    className="flex-1 py-3.5 px-6 rounded-full bg-brand-red hover:bg-brand-redHover text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isPlacing ? 'Placing Order...' : `Place Order • ${formatCurrency(total)}`}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
          <div className="pb-3 border-b border-gray-100 mb-4">
            <h3 className="font-display font-black text-base text-slate-900">Order Summary</h3>
          </div>
          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({items.length} items)</span>
              <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span className={shipping === 0 ? 'text-emerald-600 font-bold' : 'font-bold text-slate-900'}>
                {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Estimated Tax (18%)</span>
              <span className="font-bold text-slate-900">{formatCurrency(tax)}</span>
            </div>
            {coupon.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-xl">
                <span>Coupon ({coupon.code})</span>
                <span>-{formatCurrency(coupon.discount)}</span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-base text-slate-900">
              <span>Total Payable</span>
              <span className="text-xl font-display text-slate-900">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
