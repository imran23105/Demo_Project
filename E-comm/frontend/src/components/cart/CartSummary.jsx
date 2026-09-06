import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { FiTag, FiCheck } from 'react-icons/fi';
import { selectSubtotal, selectShipping, selectTax, selectCoupon, setCoupon, removeCoupon } from '../../redux/slices/cartSlice';
import { cartApiService } from '../../services/productApi';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

const CartSummary = ({ onCheckout, isCheckout = false }) => {
  const dispatch = useDispatch();
  const subtotal = useSelector(selectSubtotal);
  const shipping = useSelector(selectShipping);
  const tax = useSelector(selectTax);
  const coupon = useSelector(selectCoupon);
  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const total = subtotal + shipping + tax - coupon.discount;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplying(true);
    try {
      const { data } = await cartApiService.applyCoupon(couponInput.toUpperCase());
      dispatch(setCoupon({ code: data.data.couponCode, discount: data.data.couponDiscount }));
      toast.success(data.message);
      setCouponInput('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon');
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await cartApiService.removeCoupon();
      dispatch(removeCoupon());
      toast.success('Coupon removed');
    } catch {
      dispatch(removeCoupon());
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-5">
      <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>

      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
            {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
          </span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (GST 18%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        {coupon.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-1"><FiTag size={13} /> Coupon ({coupon.code})</span>
            <span>-{formatCurrency(coupon.discount)}</span>
          </div>
        )}
        <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span className="text-navy">{formatCurrency(Math.max(total, 0))}</span>
        </div>
      </div>

      {/* Coupon */}
      {!isCheckout && (
        <div className="mb-4">
          {coupon.code ? (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <FiCheck size={14} className="text-green-600" />
              <span className="text-sm text-green-700 flex-1">{coupon.code} applied</span>
              <button onClick={handleRemoveCoupon} className="text-xs text-red-500 hover:text-red-700">Remove</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Coupon code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                className="input-field text-sm py-2 flex-1"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={isApplying}
                className="px-4 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy-dark transition-colors disabled:opacity-60"
              >
                {isApplying ? '...' : 'Apply'}
              </button>
            </div>
          )}
        </div>
      )}

      {shipping === 0 && subtotal > 0 && (
        <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2 mb-4">
          🎉 You qualify for free shipping!
        </p>
      )}
      {shipping > 0 && (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-4">
          Add ₹{formatCurrency(500 - subtotal)} more for free shipping
        </p>
      )}

      {onCheckout && (
        <button onClick={onCheckout} className="btn-primary w-full py-3 text-base">
          Proceed to Checkout →
        </button>
      )}
    </div>
  );
};

export default CartSummary;
