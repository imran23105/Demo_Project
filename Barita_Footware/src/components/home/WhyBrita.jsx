import React from "react";
import { motion } from "framer-motion";
import { Shield, Truck, RotateCcw, Lock, ThumbsUp } from "lucide-react";

const features = [
  {
    icon: ThumbsUp,
    title: "Premium Quality",
    desc: "Every pair crafted with the finest materials for lasting durability.",
    color: "from-secondary to-secondary-700",
    bg: "bg-secondary/10",
  },
  {
    icon: Shield,
    title: "Comfortable Fit",
    desc: "Memory foam insoles and ergonomic design for all-day comfort.",
    color: "from-green-500 to-green-700",
    bg: "bg-green-50",
  },
  {
    icon: Lock,
    title: "Secure Shopping",
    desc: "256-bit SSL encryption and trusted payment gateways.",
    color: "from-accent to-accent-600",
    bg: "bg-amber-50",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "Hassle-free 30-day returns and 7-day exchange policy.",
    color: "from-purple-500 to-purple-700",
    bg: "bg-purple-50",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Express delivery in 2-3 days across India. Free above ₹999.",
    color: "from-pink-500 to-pink-700",
    bg: "bg-pink-50",
  },
];

export default function WhyBrita() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-secondary text-sm font-semibold uppercase tracking-wider">Our Promise</span>
          <h2 className="font-heading font-black text-3xl lg:text-4xl text-primary mt-2">Why Choose BRITA?</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group text-center"
              >
                <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center`}>
                    <Icon size={16} className="text-white" />
                  </div>
                </div>
                <h3 className="font-heading font-bold text-base text-primary mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
