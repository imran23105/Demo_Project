import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiX, FiChevronDown, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
import { MdCompareArrows } from 'react-icons/md';
import { selectCartItemCount } from '../../redux/slices/cartSlice';
import { selectWishlistItems } from '../../redux/slices/wishlistSlice';
import { selectUser, selectIsAuthenticated, selectIsAdmin } from '../../redux/slices/authSlice';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import { productApi } from '../../services/productApi';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toggleCart } = useCart();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const cartCount = useSelector(selectCartItemCount);
  const wishlistItems = useSelector(selectWishlistItems);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 400);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Live search
  useEffect(() => {
    if (debouncedSearch.length < 2) { setSearchResults([]); return; }
    setIsSearching(true);
    productApi.getProducts({ search: debouncedSearch, limit: 6 })
      .then(({ data }) => setSearchResults(data.data || []))
      .catch(() => setSearchResults([]))
      .finally(() => setIsSearching(false));
  }, [debouncedSearch]);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'Deals', href: '/shop?sort=discountPercent' },
    { label: 'New Arrivals', href: '/shop?sort=-createdAt' },
    { label: 'Brands', href: '/shop' },
    { label: 'Inspiration', href: '/shop' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-nav">
      {/* Admin Quick Switch Bar */}
      {isAdmin && (
        <div className="bg-slate-900 text-white text-xs py-1.5 px-4 border-b border-white/10">
          <div className="container-custom flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-coral text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide">ADMINISTRATOR</span>
              <span className="hidden sm:inline text-slate-300">You are browsing the customer store as Admin ({user?.email}).</span>
            </div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 bg-white text-navy font-semibold px-2.5 py-0.5 rounded text-xs hover:bg-slate-100 transition-colors"
            >
              <FiSettings size={12} /> Go to Admin Dashboard →
            </Link>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="container-custom">
        <div className="flex items-center gap-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-navy rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <div>
              <div className="font-display font-bold text-xl text-navy tracking-wider">NEBULA</div>
              <div className="text-[9px] text-gray-400 -mt-1 tracking-widest uppercase">Live Better. Every Day.</div>
            </div>
          </Link>

          {/* Search Bar */}
          <div ref={searchRef} className="flex-1 max-w-xl relative mx-4">
            <form onSubmit={handleSearch}>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-navy focus-within:ring-2 focus-within:ring-navy/20 transition-all">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
                  onFocus={() => setShowSearch(true)}
                  placeholder="Search for products, brands and more..."
                  className="flex-1 px-4 py-2.5 text-sm outline-none bg-white text-gray-700"
                />
                <button type="submit" className="px-4 py-2.5 bg-navy text-white hover:bg-navy-dark transition-colors">
                  <FiSearch size={18} />
                </button>
              </div>
            </form>

            {/* Search Dropdown */}
            <AnimatePresence>
              {showSearch && (searchResults.length > 0 || isSearching) && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
                  ) : (
                    <ul>
                      {searchResults.map((product) => (
                        <li key={product._id}>
                          <button
                            onClick={() => { navigate(`/product/${product._id}`); setShowSearch(false); setSearchQuery(''); }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                          >
                            <img src={product.images?.[0]?.url || '/placeholder.jpg'} alt={product.title} className="w-10 h-10 object-cover rounded-lg" />
                            <div>
                              <div className="text-sm font-medium text-gray-800 line-clamp-1">{product.title}</div>
                              <div className="text-xs text-navy font-semibold">
                                ₹{product.discountPrice || product.price}
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative flex flex-col items-center p-2 text-gray-600 hover:text-navy transition-colors">
              <FiHeart size={22} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
              <span className="text-[10px] mt-0.5 hidden sm:block">Wishlist</span>
            </Link>

            {/* Compare (decorative) */}
            <button className="flex flex-col items-center p-2 text-gray-600 hover:text-navy transition-colors hidden md:flex">
              <MdCompareArrows size={22} />
              <span className="text-[10px] mt-0.5">Compare</span>
            </button>

            {/* Cart */}
            <button onClick={toggleCart} className="relative flex flex-col items-center p-2 text-gray-600 hover:text-navy transition-colors">
              <FiShoppingCart size={22} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-navy text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="text-[10px] mt-0.5 hidden sm:block">Cart</span>
            </button>

            {/* Admin Panel Quick Link */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy text-white text-xs font-semibold rounded-lg hover:bg-navy-dark transition-all shadow-sm mr-1"
              >
                <FiSettings size={14} />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* User Menu */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex flex-col items-center p-2 text-gray-600 hover:text-navy transition-colors"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <FiUser size={22} />
                )}
                <span className="text-[10px] mt-0.5 hidden sm:block">
                  {isAuthenticated ? user?.name?.split(' ')[0] : 'Account'}
                </span>
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-3 bg-gray-50 border-b">
                          <p className="font-semibold text-sm text-gray-800">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-navy">
                            <FiSettings size={16} /> My Profile
                          </Link>
                          <Link to="/orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-navy">
                            <FiPackage size={16} /> My Orders
                          </Link>
                          <Link to="/wishlist" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-navy">
                            <FiHeart size={16} /> Wishlist
                          </Link>
                          {isAdmin && (
                            <Link to="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-navy font-semibold hover:bg-blue-50">
                              <FiSettings size={16} /> Admin Dashboard
                            </Link>
                          )}
                          <button onClick={() => { logout(); setShowUserMenu(false); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                            <FiLogOut size={16} /> Logout
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="py-2">
                        <Link to="/login" onClick={() => setShowUserMenu(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium">Sign In</Link>
                        <Link to="/register" onClick={() => setShowUserMenu(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">Create Account</Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="lg:hidden p-2 text-gray-600">
              {showMobileMenu ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="hidden lg:block bg-gray-50 border-t border-gray-100">
        <div className="container-custom flex items-center justify-between py-2">
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-gray-700 hover:text-navy transition-colors py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>📞</span>
            <span>Support: (123) 456-7890</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100"
          >
            <nav className="container-custom py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setShowMobileMenu(false)}
                  className="px-2 py-2.5 text-sm font-medium text-gray-700 hover:text-navy rounded-lg hover:bg-gray-50"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
