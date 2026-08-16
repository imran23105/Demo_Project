import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, Shield, Truck, RotateCcw, ChevronRight, Plus, Minus } from "lucide-react";
import { products } from "../../data/products";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { formatCurrency } from "../../utils/formatCurrency";
import ProductCard from "../../components/product/ProductCard";
import toast from "react-hot-toast";

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug) || products[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("description");

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error("Please select a size"); return; }
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const colorMap = { Black: "#000", White: "#f5f5f5", Brown: "#8B4513", Navy: "#000080", Grey: "#808080", Red: "#DC2626", Blue: "#2563EB", Beige: "#F5F5DC", Olive: "#808000", Tan: "#D2B48C" };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="container-max py-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link to="/" className="hover:text-secondary">Home</Link>
            <ChevronRight size={12} />
            <Link to="/shop" className="hover:text-secondary">Shop</Link>
            <ChevronRight size={12} />
            <Link to={`/${product.category}`} className="hover:text-secondary capitalize">{product.category}</Link>
            <ChevronRight size={12} />
            <span className="text-primary font-medium truncate max-w-40">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container-max py-8">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative rounded-3xl overflow-hidden bg-slate-50 aspect-square"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
              />
              {product.discount > 0 && (
                <span className="absolute top-4 left-4 badge bg-danger text-white text-xs">{product.discount}% OFF</span>
              )}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${
                  wishlisted ? "bg-danger text-white" : "bg-white text-slate-400 hover:text-danger"
                }`}
              >
                <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
              </button>
            </motion.div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i ? "border-secondary shadow-md" : "border-transparent hover:border-slate-200"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-info capitalize">{product.category}</span>
                {product.isNew && <span className="badge bg-secondary text-white">NEW</span>}
                {product.isBestSeller && <span className="badge bg-accent text-primary">BESTSELLER</span>}
              </div>
              <h1 className="font-heading font-black text-2xl lg:text-3xl text-primary leading-tight">{product.name}</h1>
              <p className="text-xs text-slate-400 mt-1">SKU: {product.sku}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating) ? "text-accent fill-accent" : "text-slate-200 fill-slate-200"} />
                ))}
              </div>
              <span className="font-semibold text-sm text-primary">{product.rating}</span>
              <span className="text-sm text-slate-400">({product.reviewCount?.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 py-4 border-y border-slate-100">
              <span className="font-heading font-black text-3xl text-primary">{formatCurrency(product.price)}</span>
              {product.mrp > product.price && (
                <>
                  <span className="text-lg text-slate-400 line-through">{formatCurrency(product.mrp)}</span>
                  <span className="badge bg-green-100 text-green-700 font-bold">Save {formatCurrency(product.mrp - product.price)}</span>
                </>
              )}
            </div>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-primary mb-2.5">Color: <span className="font-normal text-slate-500">{selectedColor}</span></p>
                <div className="flex gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      title={c}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c ? "border-secondary scale-110 shadow-md" : "border-transparent hover:border-slate-300"}`}
                      style={{ background: colorMap[c] || "#999" }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-sm font-semibold text-primary">Size: <span className="font-normal text-slate-500">{selectedSize || "Select"}</span></p>
                  <button className="text-xs text-secondary hover:underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-12 h-12 rounded-xl text-sm font-semibold border-2 transition-all ${
                        selectedSize === s
                          ? "border-secondary bg-secondary text-white shadow-glow-blue"
                          : "border-slate-200 text-slate-600 hover:border-secondary hover:text-secondary"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <p className="text-sm font-semibold text-primary">Qty:</p>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-600">
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-primary">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-600">
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-xs text-slate-400">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
            </div>

            {/* CTAs */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                id="add-to-cart-btn"
                disabled={product.stock === 0}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} /> Add to Cart
              </button>
              <Link
                to="/checkout"
                onClick={handleAddToCart}
                id="buy-now-btn"
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                Buy Now
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Shield, label: "Secure Payment" },
                { icon: Truck, label: "Free Shipping ₹999+" },
                { icon: RotateCcw, label: "30-Day Returns" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Icon size={15} className="text-secondary" />
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">{label}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="border border-slate-100 rounded-2xl overflow-hidden">
              <div className="flex border-b border-slate-100">
                {["description", "material", "shipping", "returns"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-3 text-xs font-semibold capitalize transition-all ${
                      tab === t ? "bg-secondary text-white" : "text-slate-500 hover:text-primary hover:bg-slate-50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="p-4 text-sm text-slate-600 leading-relaxed">
                {tab === "description" && <p>{product.description}</p>}
                {tab === "material" && (
                  <div>
                    <p><strong>Material:</strong> {product.material}</p>
                    <ul className="mt-2 space-y-1">
                      {product.features?.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs"><span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {tab === "shipping" && <p>{product.shippingInfo}</p>}
                {tab === "returns" && <p>{product.returnPolicy}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading font-black text-2xl text-primary mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 0.1} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
