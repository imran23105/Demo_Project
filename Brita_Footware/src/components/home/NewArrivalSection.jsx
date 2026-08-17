import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "../product/ProductCard";
import { products } from "../../data/products";

export default function NewArrivalSection() {
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="flex items-end justify-between mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-secondary text-sm font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} /> Just Dropped
            </span>
            <h2 className="font-heading font-black text-3xl lg:text-4xl text-primary mt-2">New Arrivals</h2>
          </motion.div>
          <Link to="/new-arrivals" className="hidden sm:flex items-center gap-2 text-secondary font-semibold text-sm group hover:gap-3 transition-all">
            View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {newArrivals.map((product, i) => (
            <ProductCard key={product.id} product={product} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
