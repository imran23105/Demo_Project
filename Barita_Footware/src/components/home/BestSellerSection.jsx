import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProductCard from "../product/ProductCard";
import { products } from "../../data/products";

export default function BestSellerSection() {
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-max">
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-secondary text-sm font-semibold uppercase tracking-wider">Most Popular</span>
            <h2 className="font-heading font-black text-3xl lg:text-4xl text-primary mt-2">Best Sellers</h2>
          </motion.div>
          <Link to="/shop" className="hidden sm:flex items-center gap-2 text-secondary font-semibold text-sm hover:gap-3 transition-all group">
            View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {bestSellers.map((product, i) => (
            <ProductCard key={product.id} product={product} delay={i * 0.05} />
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link to="/shop" className="btn-secondary inline-flex items-center gap-2">
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
