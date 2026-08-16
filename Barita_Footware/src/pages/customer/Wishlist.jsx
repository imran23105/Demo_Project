import React from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import ProductCard from "../../components/product/ProductCard";

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container-max">
        <h1 className="font-heading font-black text-3xl text-primary mb-2">My Wishlist</h1>
        <p className="text-slate-500 text-sm mb-8">{wishlist.length} saved items</p>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 max-w-md mx-auto">
            <div className="w-20 h-20 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={36} />
            </div>
            <h2 className="font-heading font-bold text-xl text-primary mb-2">Your wishlist is empty</h2>
            <p className="text-slate-500 text-sm mb-6">Explore our catalog and click the heart icon on any shoe to save it for later.</p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
              Explore Products <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
