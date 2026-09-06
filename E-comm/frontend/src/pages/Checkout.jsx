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
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                i === step ? 'bg-navy text-white' : i < step ? 'bg-green-600 text-white cursor-pointer' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {i < step ? <FiCheck size={14} /> : <span>{i + 1}</span>}
              {s}
            </button>
            {i < STEPS.length - 1 && <div className={`h-0.5 w-8 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-card p-6">
            {step === 0 && (
              <div className="space-y-6">
                <ShippingForm value={shippingAddress} onChange={setShippingAddress} savedAddresses={savedAddresses} />
                <button
                  onClick={() => {
                    const err = validateAddress();
                    if (err) {
                      toast.error(err);
                      return;
                    }
                    setStep(1);
                  }}
                  className="btn-primary w-full py-3"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <PaymentMethod value={paymentMethod} onChange={setPaymentMethod} />
                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="btn-secondary flex-1 py-3">← Back</button>
                  <button onClick={() => setStep(2)} className="btn-primary flex-1 py-3">Review Order →</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="font-bold text-gray-900">Order Review</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => {
                    const price = item.discountPrice > 0 ? item.discountPrice : item.price;
                    return (
                      <div key={item._id} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                        <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
                        <div className="flex-1">
                          <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatCurrency(price)}</p>
                        </div>
                        <span className="text-sm font-bold text-navy">{formatCurrency(price * item.quantity)}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-sm space-y-1">
                  <div className="flex justify-between"><span>Ship to:</span><span className="font-medium">{shippingAddress.city}, {shippingAddress.state}</span></div>
                  <div className="flex justify-between"><span>Payment:</span><span className="font-medium capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}</span></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">← Back</button>
                  <button onClick={handlePlaceOrder} disabled={isPlacing} className="btn-primary flex-1 py-3">
                    {isPlacing ? 'Placing Order...' : `Place Order • ${formatCurrency(total)}`}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white rounded-xl shadow-card p-5 h-fit sticky top-24">
          <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Tax (GST 18%)</span><span>{formatCurrency(tax)}</span></div>
            {coupon.discount > 0 && <div className="flex justify-between text-green-600"><span>Coupon Discount</span><span>-{formatCurrency(coupon.discount)}</span></div>}
            <div className="border-t pt-2 flex justify-between font-bold text-base"><span>Total</span><span className="text-navy">{formatCurrency(total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
