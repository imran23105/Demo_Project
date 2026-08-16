import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) { toast.error("Please enter a valid email"); return; }
    setSubmitted(true);
    toast.success("You're subscribed! 🎉");
    setEmail("");
  };

  return (
    <section className="py-16 bg-gradient-to-r from-secondary via-secondary-600 to-primary overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      </div>
      <div className="container-max relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold uppercase tracking-widest mb-4">
              Newsletter
            </span>
            <h2 className="font-heading font-black text-white text-3xl lg:text-4xl mb-3">
              Get Exclusive Offers
            </h2>
            <p className="text-blue-100 text-base mb-8">
              Subscribe and get 10% off your first order, plus weekly style drops.
            </p>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-3 bg-white/15 rounded-2xl py-4 px-6 text-white font-semibold"
              >
                <CheckCircle size={20} className="text-green-300" />
                You're subscribed! Check your inbox for your discount code.
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field bg-white/15 border-white/30 text-white placeholder:text-blue-200 flex-1"
                />
                <button type="submit" className="btn-accent shrink-0 flex items-center gap-2 group">
                  Subscribe
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}

            <p className="text-blue-200 text-xs mt-4">
              No spam, ever. Unsubscribe anytime. By subscribing you agree to our Privacy Policy.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
