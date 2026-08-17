import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, CreditCard, ShieldCheck, Truck, ArrowLeft, Building, Wallet, Banknote } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

export default function Checkout() {
  const { cart, subtotal, shipping, total, clearCart } = useCart();
  const { customer } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const discountApplied = location.state?.discountApplied || 0;
  const finalTotal = Math.max(0, total - discountApplied);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    address: "42, Green Park Avenue",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
    deliveryOption: "standard", // standard | express
    paymentMethod: "upi", // upi | card | netbanking | cod
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      toast.error("Please fill in all required fields");
      return;
    }
    const orderId = `#BRI${Math.floor(10000 + Math.random() * 90000)}`;
    clearCart();
    toast.success("Order Placed Successfully!");
    navigate("/order-success", {
      state: {
        orderId,
        formData,
        cart,
        totalAmount: finalTotal + (formData.deliveryOption === "express" ? 150 : 0),
        estimatedDelivery: formData.deliveryOption === "express" ? "2 Business Days" : "4-5 Business Days",
      },
    });
  };

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container-max">
        {/* Stepper */}
        <div className="max-w-2xl mx-auto mb-8 px-2 sm:px-0">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-4 right-4 top-4 -translate-y-1/2 h-0.5 bg-slate-200 -z-1" />
            {[
              { id: 1, label: "Customer Info" },
              { id: 2, label: "Address" },
              { id: 3, label: "Payment" },
            ].map((s) => (
              <div key={s.id} className="flex flex-col items-center z-10 bg-slate-50 px-1 sm:px-3">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    step >= s.id ? "bg-secondary text-white shadow-glow-blue" : "bg-white text-slate-400 border border-slate-200"
                  }`}
                >
                  {step > s.id ? <CheckCircle2 size={16} /> : s.id}
                </div>
                <span className={`text-[10px] sm:text-xs mt-1 font-medium text-center ${step >= s.id ? "text-primary font-semibold" : "text-slate-400"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card">
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h2 className="font-heading font-bold text-lg text-primary">Customer Information</h2>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="John Doe" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Mobile Number *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="+91 9876543210" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Email Address *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button onClick={() => setStep(2)} className="btn-primary">Continue to Address →</button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h2 className="font-heading font-bold text-lg text-primary">Shipping Address</h2>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Flat / House No. / Building / Street *</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="input-field" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">City *</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} className="input-field" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">State *</label>
                      <input type="text" name="state" value={formData.state} onChange={handleChange} className="input-field" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Pincode *</label>
                      <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="input-field" />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-between">
                    <button onClick={() => setStep(1)} className="btn-ghost flex items-center gap-1"><ArrowLeft size={16} /> Back</button>
                    <button onClick={() => setStep(3)} className="btn-primary">Continue to Payment →</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  {/* Delivery Speed */}
                  <div>
                    <h3 className="font-heading font-bold text-sm text-primary mb-3">Delivery Options</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "standard", label: "Standard Delivery", desc: "4-5 business days", cost: "FREE" },
                        { id: "express", label: "Express Delivery", desc: "2 business days", cost: "₹150" },
                      ].map((opt) => (
                        <label
                          key={opt.id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                            formData.deliveryOption === opt.id ? "border-secondary bg-secondary/5" : "border-slate-100 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="deliveryOption"
                              checked={formData.deliveryOption === opt.id}
                              onChange={() => setFormData({ ...formData, deliveryOption: opt.id })}
                              className="accent-secondary"
                            />
                            <div>
                              <p className="text-sm font-bold text-primary">{opt.label}</p>
                              <p className="text-xs text-slate-500">{opt.desc}</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-secondary">{opt.cost}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <h3 className="font-heading font-bold text-sm text-primary mb-3">Payment Options</h3>
                    <div className="space-y-2">
                      {[
                        { id: "upi", label: "UPI (Google Pay, PhonePe, Paytm)", icon: Wallet },
                        { id: "card", label: "Credit / Debit Card", icon: CreditCard },
                        { id: "netbanking", label: "Net Banking", icon: Building },
                        { id: "cod", label: "Cash On Delivery (COD)", icon: Banknote },
                      ].map((pm) => {
                        const Icon = pm.icon;
                        return (
                          <label
                            key={pm.id}
                            className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                              formData.paymentMethod === pm.id ? "border-secondary bg-secondary/5" : "border-slate-100 bg-white"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="paymentMethod"
                                checked={formData.paymentMethod === pm.id}
                                onChange={() => setFormData({ ...formData, paymentMethod: pm.id })}
                                className="accent-secondary"
                              />
                              <Icon size={18} className="text-secondary" />
                              <span className="text-sm font-semibold text-primary">{pm.label}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center border-t border-slate-100">
                    <button onClick={() => setStep(2)} className="btn-ghost flex items-center gap-1"><ArrowLeft size={16} /> Back</button>
                    <button onClick={handlePlaceOrder} id="place-order-btn" className="btn-accent px-8 py-3.5 text-base font-bold shadow-lg">
                      Place Order • {formatCurrency(finalTotal + (formData.deliveryOption === "express" ? 150 : 0))}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Mini Cart Review */}
          <div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card sticky top-24 space-y-4">
              <h3 className="font-heading font-bold text-base text-primary border-b border-slate-100 pb-3">Order Summary ({cart.length})</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="flex items-center gap-3 text-xs">
                    <img src={item.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-50 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-primary truncate">{item.name}</p>
                      <p className="text-slate-400">Qty: {item.quantity} | Size: {item.size}</p>
                    </div>
                    <span className="font-bold text-primary">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                {discountApplied > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(discountApplied)}</span></div>}
                <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span></div>
                {formData.deliveryOption === "express" && <div className="flex justify-between"><span>Express Shipping</span><span>₹150</span></div>}
                <div className="flex justify-between font-heading font-black text-base text-primary pt-2 border-t border-slate-100">
                  <span>Total Payable</span>
                  <span>{formatCurrency(finalTotal + (formData.deliveryOption === "express" ? 150 : 0))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
