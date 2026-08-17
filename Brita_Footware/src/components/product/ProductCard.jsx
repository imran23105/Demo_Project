import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { formatCurrency } from "../../utils/formatCurrency";

export default function ProductCard({ product, delay = 0 }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes?.[0] || 8, product.colors?.[0] || "Black");
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="card card-hover overflow-hidden">
          {/* Image */}
          <div className="relative product-image-zoom aspect-square bg-slate-50">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isNew && (
                <span className="badge bg-secondary text-white text-[10px]">NEW</span>
              )}
              {product.isBestSeller && (
                <span className="badge bg-accent text-primary text-[10px]">BESTSELLER</span>
              )}
              {product.discount > 0 && (
                <span className="badge bg-danger text-white text-[10px]">{product.discount}% OFF</span>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-all duration-200 ${
                wishlisted
                  ? "bg-danger text-white scale-110"
                  : "bg-white text-slate-400 opacity-0 group-hover:opacity-100"
              }`}
            >
              <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
            </button>

            {/* Quick Add */}
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                className="w-full py-2.5 bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-secondary transition-colors"
              >
                <ShoppingBag size={14} />
                Quick Add
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <p className="text-xs text-slate-400 capitalize mb-0.5 font-medium">{product.category}</p>
            <h3 className="font-heading font-semibold text-sm text-primary truncate leading-tight mb-1.5">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={10}
                    className={i < Math.floor(product.rating) ? "text-accent fill-accent" : "text-slate-200 fill-slate-200"}
                  />
                ))}
              </div>
              <span className="text-[10px] text-slate-400">({product.reviewCount?.toLocaleString()})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-base text-primary">
                {formatCurrency(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(product.mrp)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
