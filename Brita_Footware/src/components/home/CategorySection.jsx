import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "../../data/categories";

export default function CategorySection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-secondary text-sm font-semibold uppercase tracking-wider">Browse</span>
          <h2 className="font-heading font-black text-3xl lg:text-4xl text-primary mt-2">
            Shop By Category
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <Link to={`/${cat.slug}`} className="block group">
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] shadow-card hover:shadow-card-hover transition-shadow duration-300">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                  {/* Label */}
                  <div className="absolute bottom-0 inset-x-0 p-3">
                    <h3 className="font-heading font-bold text-white text-sm leading-tight">{cat.name}</h3>
                    <p className="text-slate-300 text-[10px]">{cat.count} items</p>
                  </div>
                  {/* Hover Glow */}
                  <div className="absolute inset-0 ring-2 ring-transparent group-hover:ring-secondary/50 rounded-2xl transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
