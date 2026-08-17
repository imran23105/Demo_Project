import React from "react";
import { motion } from "framer-motion";
import { InstagramIcon } from "../common/Icons";

const galleryImages = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1584735175315-9d5df23be353?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=400&h=400&fit=crop",
];

export default function InstagramGallery() {
  return (
    <section className="section-padding bg-slate-50">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <InstagramIcon size={20} className="text-pink-500" />
            <span className="text-secondary text-sm font-semibold uppercase tracking-wider">@britafootwears</span>
          </div>
          <h2 className="font-heading font-black text-3xl text-primary">Style Showcase</h2>
          <p className="text-slate-500 text-sm mt-2">Follow us for daily style inspiration</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.03 }}
              className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
            >
              <img src={img} alt={`Instagram ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-all flex items-center justify-center">
                <InstagramIcon size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <InstagramIcon size={16} /> Follow @britafootwears
          </a>
        </div>
      </div>
    </section>
  );
}
