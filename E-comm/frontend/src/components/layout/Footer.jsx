import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi';
import { MdLocalShipping, MdRefresh, MdSecurity, MdHeadsetMic } from 'react-icons/md';

const Footer = () => {
  const benefits = [
    { icon: <MdLocalShipping size={24} />, title: 'Free Shipping', desc: 'On orders over ₹500' },
    { icon: <MdRefresh size={24} />, title: 'Easy Returns', desc: 'Within 30 days' },
    { icon: <MdSecurity size={24} />, title: 'Secure Payments', desc: '100% protected' },
    { icon: <MdHeadsetMic size={24} />, title: '24/7 Support', desc: "We're here to help" },
  ];

  const footerLinks = {
    'Quick Links': [
      { label: 'Home', href: '/' },
      { label: 'Shop', href: '/shop' },
      { label: 'Wishlist', href: '/wishlist' },
      { label: 'My Orders', href: '/orders' },
      { label: 'Contact', href: '/contact' },
    ],
    'Categories': [
      { label: "Women's Fashion", href: '/shop?category=womens-fashion' },
      { label: "Men's Fashion", href: '/shop?category=mens-fashion' },
      { label: 'Electronics', href: '/shop?category=electronics' },
      { label: 'Beauty & Care', href: '/shop?category=beauty' },
      { label: 'Home & Living', href: '/shop?category=home-living' },
    ],
    'Customer Service': [
      { label: 'FAQ', href: '/contact' },
      { label: 'Shipping Policy', href: '/contact' },
      { label: 'Return Policy', href: '/contact' },
      { label: 'Privacy Policy', href: '/contact' },
      { label: 'Terms of Service', href: '/contact' },
    ],
  };

  return (
    <footer>
      {/* Benefits Bar */}
      <div className="bg-navy text-white">
        <div className="container-custom py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="flex items-center gap-3">
                <div className="text-blue-300 flex-shrink-0">{b.icon}</div>
                <div>
                  <div className="font-semibold text-sm">{b.title}</div>
                  <div className="text-blue-200 text-xs">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-gray-900 text-gray-300">
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <span className="text-navy font-bold text-sm">N</span>
                </div>
                <div className="font-display font-bold text-xl text-white tracking-wider">NEBULA</div>
              </Link>
              <p className="text-sm leading-relaxed mb-4 text-gray-400">
                Your one-stop destination for the latest trends in fashion, electronics, beauty, and more. 
                Discover thousands of products at unbeatable prices.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><FiMapPin size={14} className="text-blue-400" /><span>Mumbai, Maharashtra, India 400001</span></div>
                <div className="flex items-center gap-2"><FiPhone size={14} className="text-blue-400" /><span>+91 (123) 456-7890</span></div>
                <div className="flex items-center gap-2"><FiMail size={14} className="text-blue-400" /><span>support@nebula.com</span></div>
              </div>
              {/* Social Links */}
              <div className="flex gap-3 mt-5">
                {[FiInstagram, FiFacebook, FiTwitter, FiYoutube].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 bg-gray-700 hover:bg-navy rounded-lg flex items-center justify-center text-gray-300 hover:text-white transition-all">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-semibold text-white mb-4">{title}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.href} className="text-sm text-gray-400 hover:text-blue-300 transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="mt-10 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-semibold text-white">Subscribe to our newsletter</h4>
                <p className="text-sm text-gray-400">Get exclusive deals and updates directly in your inbox.</p>
              </div>
              <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2.5 rounded-lg bg-gray-700 text-white text-sm border border-gray-600 focus:outline-none focus:border-blue-400 w-full md:w-64"
                />
                <button type="submit" className="px-5 py-2.5 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-dark transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 py-4">
          <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
            <p>© 2025 Nebula E-Commerce. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>🔒 SSL Secured</span>
              <span>💳 Visa | Mastercard | UPI | Razorpay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
