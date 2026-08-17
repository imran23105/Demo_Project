import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { InstagramIcon } from "../common/Icons";
import { BRAND } from "../../utils/constants";

const footerLinks = {
  Shop: [
    { label: "Men", href: "/men" },
    { label: "Women", href: "/women" },
    { label: "Sneakers", href: "/sneakers" },
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Sale", href: "/sale" },
  ],
  "Customer Care": [
    { label: "Contact Us", href: "/contact" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Returns & Exchange", href: "/returns" },
    { label: "FAQ", href: "/faq" },
    { label: "Size Guide", href: "/size-guide" },
  ],
  Company: [
    { label: "About BRITA", href: "/about" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Blog", href: "/blog" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Newsletter Band */}
      <div className="bg-secondary/20 border-b border-white/10">
        <div className="container-max py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-lg">Join the BRITA Family</h3>
            <p className="text-slate-300 text-sm mt-1">Get exclusive deals, new arrivals & style tips straight to your inbox.</p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2 w-full md:w-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field bg-white/10 border-white/20 text-white placeholder:text-slate-400 w-full md:w-72"
            />
            <button type="submit" className="btn-accent shrink-0 flex items-center gap-2">
              Subscribe <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-max py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center">
                <span className="text-white font-heading font-black text-base">B</span>
              </div>
              <div>
                <span className="font-heading font-black text-lg leading-none block">BRITA</span>
                <span className="text-[9px] text-slate-400 tracking-[0.25em] leading-none block">FOOTWEARS</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-xs">
              Premium footwear crafted for comfort, style, and every step of your journey. Quality you can feel.
            </p>
            <div className="space-y-2 text-sm text-slate-400">
              <a href={`tel:${BRAND.phone}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={14} /> {BRAND.phone}
              </a>
              <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={14} /> {BRAND.email}
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={14} /> {BRAND.address}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-5">
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent hover:text-primary flex items-center justify-center transition-all"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href={`https://wa.me/${BRAND.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-green-500 flex items-center justify-center transition-all"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-white">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-slate-400 text-sm hover:text-white hover:translate-x-0.5 transition-all inline-flex items-center gap-1 group"
                    >
                      <span className="w-0 h-px bg-accent group-hover:w-3 transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-max py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} BRITA FOOTWEARS. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span>🔒 Secure Shopping</span>
            <span>🚚 Free Delivery above ₹999</span>
            <span>↩️ 30-Day Returns</span>
          </div>
          <div className="flex gap-2">
            {["visa", "mastercard", "upi", "gpay"].map((p) => (
              <div key={p} className="bg-white/10 rounded px-2 py-0.5 text-white text-[9px] uppercase font-bold tracking-wider">
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
