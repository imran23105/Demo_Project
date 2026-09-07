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
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <div className="pb-3 border-b border-gray-100 mb-4">
        <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
          PRICE DETAILS
        </div>
        <h3 className="font-display font-black text-lg text-slate-900">Order Summary</h3>
      </div>

      <div className="space-y-3 text-xs sm:text-sm mb-5">
        <div className="flex justify-between text-gray-600">
          <span>Items Total</span>
          <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Standard Delivery</span>
          <span className={shipping === 0 ? 'text-emerald-600 font-bold' : 'font-bold text-slate-900'}>
            {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
          </span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Estimated GST (18%)</span>
          <span className="font-bold text-slate-900">{formatCurrency(tax)}</span>
        </div>
        {coupon.discount > 0 && (
          <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl">
            <span className="flex items-center gap-1"><FiTag size={13} /> {coupon.code}</span>
            <span>-{formatCurrency(coupon.discount)}</span>
          </div>
        )}
        <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline font-black text-slate-900 text-base">
          <span>Grand Total</span>
          <span className="text-xl text-slate-900 font-display">
            {formatCurrency(Math.max(total, 0))}
          </span>
        </div>
      </div>

      {/* Coupon */}
      {!isCheckout && (
        <div className="mb-5">
          {coupon.code ? (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
              <FiCheck size={14} className="text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700 flex-1">{coupon.code} applied</span>
              <button
                onClick={handleRemoveCoupon}
                className="text-xs font-extrabold text-brand-red hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="PROMO CODE"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                className="input-field text-xs py-2.5 px-4 uppercase tracking-wider flex-1"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={isApplying}
                className="px-5 py-2.5 bg-[#11161B] hover:bg-brand-red text-white text-xs font-bold rounded-full transition-colors disabled:opacity-60 flex-shrink-0"
              >
                {isApplying ? '...' : 'Apply'}
              </button>
            </div>
          )}
        </div>
      )}

      {shipping === 0 && subtotal > 0 && (
        <p className="text-xs font-bold text-emerald-700 bg-emerald-50 rounded-2xl px-3.5 py-2 mb-4 text-center">
          🎉 You qualify for Free Delivery on this order!
        </p>
      )}

      {onCheckout && (
        <button
          onClick={onCheckout}
          className="w-full py-3.5 px-6 rounded-full bg-brand-red hover:bg-brand-redHover text-white text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>Proceed to Checkout</span>
          <span>→</span>
        </button>
      )}
    </div>
  );
};

export default CartSummary;
