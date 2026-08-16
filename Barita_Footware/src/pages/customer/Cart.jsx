import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Plus, Minus } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";
import MiniHero from "../../components/common/MiniHero";
import toast from "react-hot-toast";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, totalMRP, totalDiscount, shipping, total, totalItems } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode) return;
    const code = couponCode.trim().toUpperCase();
    if (code === "WELCOME10") {
      const disc = Math.round(subtotal * 0.1);
      setDiscountApplied(disc);
      setAppliedCode(code);
      toast.success("Coupon WELCOME10 applied (10% OFF)");
    } else if (code === "BRITA20" && subtotal >= 1999) {
      const disc = Math.round(subtotal * 0.2);
      setDiscountApplied(disc);
      setAppliedCode(code);
      toast.success("Coupon BRITA20 applied (20% OFF)");
    } else if (code === "FLAT500" && subtotal >= 2999) {
      setDiscountApplied(500);
      setAppliedCode(code);
      toast.success("Coupon FLAT500 applied (₹500 OFF)");
    } else {
      toast.error("Invalid coupon or minimum cart value not met");
    }
  };

  const finalTotal = Math.max(0, total - discountApplied);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md px-4"
        >
          <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6 text-secondary">
            <ShoppingBag size={48} />
          </div>
          <h2 className="font-heading font-black text-2xl text-primary mb-2">Your Cart is Empty</h2>
          <p className="text-slate-500 text-sm mb-6">Looks like you haven't added anything to your cart yet. Explore our latest footwear collection!</p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            Start Shopping <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <MiniHero pageType="cart" count={totalItems} />

      <div className="container-max py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.cartItemId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-card flex gap-4 sm:gap-6 items-center"
                >
                  <Link to={`/product/${item.slug}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.slug}`} className="font-heading font-bold text-base text-primary hover:text-secondary truncate block">
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>Size: <strong>{item.size}</strong></span>
                      <span>Color: <strong>{item.color}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-heading font-bold text-base text-primary">{formatCurrency(item.price)}</span>
                      {item.mrp > item.price && (
                        <span className="text-xs text-slate-400 line-through">{formatCurrency(item.mrp)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 shrink-0">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="p-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-primary">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-slate-400 hover:text-danger p-2 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex justify-between items-center pt-2">
              <button onClick={clearCart} className="text-xs text-slate-500 hover:text-danger font-medium transition-colors">
                Clear Cart
              </button>
              <Link to="/shop" className="text-xs text-secondary font-semibold hover:underline">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Cart Summary */}
          <div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card sticky top-24 space-y-6">
              <h2 className="font-heading font-bold text-lg text-primary">Order Summary</h2>

              {/* Coupon */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Coupon Code (WELCOME10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="input-field text-xs pl-9 py-2.5 uppercase"
                  />
                </div>
                <button type="submit" className="btn-secondary px-4 text-xs font-semibold shrink-0 py-2.5">
                  Apply
                </button>
              </form>

              {appliedCode && (
                <div className="flex items-center justify-between bg-green-50 text-green-700 p-2.5 rounded-xl text-xs font-medium">
                  <span>Code <strong>{appliedCode}</strong> applied</span>
                  <button onClick={() => { setAppliedCode(""); setDiscountApplied(0); }} className="text-slate-400 hover:text-danger">
                    Remove
                  </button>
                </div>
              )}

              {/* Breakdown */}
              <div className="space-y-3 text-sm border-t border-slate-100 pt-4">
                <div className="flex justify-between text-slate-600">
                  <span>Total MRP</span>
                  <span>{formatCurrency(totalMRP)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Bag Discount</span>
                  <span className="text-green-600">-{formatCurrency(totalDiscount)}</span>
                </div>
                {discountApplied > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Coupon Discount</span>
                    <span className="text-green-600">-{formatCurrency(discountApplied)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Shipping Fee</span>
                  <span>{shipping === 0 ? <span className="text-green-600 font-medium">FREE</span> : formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between font-heading font-black text-lg text-primary pt-3 border-t border-slate-100">
                  <span>Total Amount</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout", { state: { discountApplied, appliedCode } })}
                id="proceed-checkout-btn"
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm font-semibold shadow-glow-blue"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
                <ShieldCheck size={16} className="text-green-500" />
                <span>100% Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
