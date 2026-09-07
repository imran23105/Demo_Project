import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiTwitter, FiYoutube, FiArrowRight } from 'react-icons/fi';

const Footer = () => {
  const footerLinks = {
    'Categories': [
      { label: 'Refrigerators', href: '/shop?category=refrigerators' },
      { label: 'Washing Machines', href: '/shop?category=washing-machines' },
      { label: 'Air Conditioners', href: '/shop?category=air-conditioners' },
      { label: 'Kitchen Appliances', href: '/shop?category=kitchen-appliances' },
      { label: 'Televisions', href: '/shop?category=televisions' },
    ],
    'Quick Links': [
      { label: 'Home', href: '/' },
      { label: 'Shop All Deals', href: '/shop' },
      { label: 'Wishlist', href: '/wishlist' },
      { label: 'My Orders', href: '/orders' },
      { label: 'Contact Us', href: '/contact' },
    ],
    'Customer Care': [
      { label: 'Track Order', href: '/orders' },
      { label: 'Shipping & Delivery', href: '/contact' },
      { label: 'Warranty & Repairs', href: '/contact' },
      { label: 'Easy Returns Policy', href: '/contact' },
      { label: 'Terms & Privacy', href: '/contact' },
    ],
  };

  return (
    <footer className="mt-8 px-2 sm:px-4 pb-4">
      <div className="max-w-[1440px] mx-auto bg-[#11161B] text-gray-300 rounded-3xl p-6 sm:p-10 border border-white/10 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-8 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-red to-red-500 flex items-center justify-center shadow-md shadow-red-500/20">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <path d="M9 22V12h6v10" />
                </svg>
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl text-white tracking-tight">
                  Home<span className="text-brand-red">Kart</span>
                </div>
                <div className="text-[10px] text-gray-400 font-medium -mt-1 tracking-tight">
                  Smart Appliances. Better Living.
                </div>
              </div>
            </Link>

            <p className="text-xs sm:text-sm leading-relaxed text-gray-400 max-w-sm">
              Discover top-rated smart home appliances from verified brands with authentic warranty, fast doorstep delivery, and 24/7 technical support.
            </p>

            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-center gap-2.5">
                <FiMapPin size={14} className="text-[#CEF04A] flex-shrink-0" />
                <span>Express Towers, Nariman Point, Mumbai, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiPhone size={14} className="text-[#CEF04A] flex-shrink-0" />
                <span>+91 1800 200 4567 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiMail size={14} className="text-[#CEF04A] flex-shrink-0" />
                <span>support@homekart.in</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-2.5 pt-2">
              {[FiInstagram, FiFacebook, FiTwitter, FiYoutube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#CEF04A] hover:text-slate-950 flex items-center justify-center text-gray-300 transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-3">
              <h4 className="font-display font-extrabold text-white text-xs sm:text-sm tracking-wide uppercase">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-xs text-gray-400 hover:text-[#CEF04A] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter & Bottom Strip */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Stay in the Loop</h5>
            <p className="text-xs text-gray-400 mt-0.5">Subscribe for festive discounts and exclusive appliance deals.</p>
          </div>

          <form className="flex w-full md:w-auto gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email address..."
              className="px-4 py-2.5 rounded-full bg-white/10 text-white text-xs border border-white/10 focus:outline-none focus:border-[#CEF04A] w-full md:w-64 placeholder-gray-400"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#CEF04A] hover:bg-[#BDE032] text-slate-950 rounded-full text-xs font-black transition-all flex items-center gap-1 flex-shrink-0"
            >
              <span>Join</span>
              <FiArrowRight size={13} />
            </button>
          </form>
        </div>

        <div className="pt-6 mt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} HomeKart Smart Appliances. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>🔒 256-Bit SSL Encrypted</span>
            <span>•</span>
            <span>UPI | RuPay | Visa | Mastercard | Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
