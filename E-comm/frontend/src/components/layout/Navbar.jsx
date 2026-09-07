import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiChevronDown,
  FiLogOut,
  FiPackage,
  FiSettings,
  FiMapPin,
  FiSliders,
} from 'react-icons/fi';
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
    if (debouncedSearch.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    productApi
      .getProducts({ search: debouncedSearch, limit: 6 })
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

  return (
    <header className="sticky top-0 z-50 px-2 sm:px-4 pt-2">
      {/* Admin Quick Switch Bar */}
      {isAdmin && (
        <div className="max-w-[1440px] mx-auto mb-1.5 bg-slate-900 text-white text-xs py-1.5 px-4 rounded-xl flex items-center justify-between border border-white/10 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="bg-lime text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded tracking-wide">
              ADMIN MODE
            </span>
            <span className="hidden sm:inline text-slate-300">Logged in as {user?.email}</span>
          </div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 bg-white text-slate-900 font-bold px-2.5 py-0.5 rounded text-xs hover:bg-lime transition-colors"
          >
            <FiSettings size={12} /> Dashboard →
          </Link>
        </div>
      )}

      {/* Floating Pill Nav */}
      <div className="max-w-[1440px] mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-black/5 px-4 py-3">
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-red to-red-500 flex items-center justify-center shadow-md shadow-red-500/20">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <path d="M9 22V12h6v10" />
              </svg>
            </div>
            <div>
              <div className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight flex items-center gap-0.5">
                Home<span className="text-brand-red">Kart</span>
              </div>
              <div className="text-[10px] text-gray-400 font-medium -mt-1 tracking-tight hidden sm:block">
                Smart Appliances. Better Living.
              </div>
            </div>
          </Link>

          {/* Search Pill Input */}
          <div ref={searchRef} className="flex-1 max-w-xl relative hidden md:block">
            <form onSubmit={handleSearch}>
              <div className="flex items-center bg-[#F3F3EE] rounded-full border border-gray-200/80 px-4 py-2 hover:border-gray-300 focus-within:border-slate-800 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-800/10 transition-all">
                <FiSearch size={17} className="text-gray-400 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearch(true);
                  }}
                  onFocus={() => setShowSearch(true)}
                  placeholder="Search for appliances, brands, or what you need..."
                  className="flex-1 text-sm bg-transparent outline-none text-slate-800 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => navigate('/shop')}
                  title="Filter options"
                  className="p-1 rounded-full text-gray-400 hover:text-slate-900 hover:bg-gray-200/60 transition-colors"
                >
                  <FiSliders size={16} />
                </button>
              </div>
            </form>

            {/* Search Dropdown */}
            <AnimatePresence>
              {showSearch && (searchResults.length > 0 || isSearching) && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute top-full mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-gray-500">Searching appliances...</div>
                  ) : (
                    <ul className="divide-y divide-gray-50">
                      {searchResults.map((product) => (
                        <li key={product._id}>
                          <Link
                            to={`/product/${product._id}`}
                            onClick={() => setShowSearch(false)}
                            className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors"
                          >
                            <img
                              src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                              alt={product.title}
                              className="w-10 h-10 object-cover rounded-lg bg-gray-50"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-800 truncate">{product.title}</p>
                              <p className="text-[11px] text-gray-500">₹{product.price?.toLocaleString('en-IN')}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Header Navigation Icons / Info */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Deliver To Pill */}
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-full border border-gray-100 transition-colors">
              <FiMapPin className="text-brand-red" size={14} />
              <div className="text-left">
                <div className="text-[10px] text-gray-400 leading-tight">Deliver to</div>
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  India <FiChevronDown size={12} />
                </div>
              </div>
            </div>

            {/* User Account Pill */}
            <div ref={userMenuRef} className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-800 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-full border border-gray-100 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-[10px] text-gray-400 leading-none">Hi, {user?.name?.split(' ')[0]}</div>
                    <div className="font-bold text-slate-800 leading-tight flex items-center gap-0.5">
                      Account <FiChevronDown size={12} />
                    </div>
                  </div>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-800 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-full border border-gray-100 transition-colors"
                >
                  <FiUser size={15} className="text-gray-600" />
                  <div className="text-left hidden sm:block">
                    <div className="text-[10px] text-gray-400 leading-none">Hi, Guest</div>
                    <div className="font-bold text-slate-800 leading-tight flex items-center gap-0.5">
                      Account <FiChevronDown size={12} />
                    </div>
                  </div>
                </Link>
              )}

              {/* User Dropdown */}
              <AnimatePresence>
                {showUserMenu && isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-slate-50 hover:text-slate-900"
                      >
                        <FiUser size={14} /> My Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-slate-50 hover:text-slate-900"
                      >
                        <FiPackage size={14} /> My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-slate-50 hover:text-slate-900"
                      >
                        <FiHeart size={14} /> Wishlist ({wishlistItems.length})
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-brand-red hover:bg-red-50"
                        >
                          <FiSettings size={14} /> Admin Dashboard
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-gray-50 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <FiLogOut size={14} /> Log Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 p-2 sm:px-3 sm:py-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FiHeart size={18} className="text-slate-800" />
              <span className="hidden lg:inline text-xs font-medium text-slate-800">Wishlist</span>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:static sm:ml-1 w-4 h-4 sm:w-5 sm:h-5 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Icon & Badge */}
            <button
              onClick={toggleCart}
              className="relative flex items-center gap-1 text-xs font-semibold text-slate-800 p-2 sm:px-3.5 sm:py-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <div className="relative">
                <FiShoppingCart size={19} className="text-slate-800" />
                <span className="absolute -top-2 -right-2 bg-brand-red text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm shadow-red-500/30">
                  {cartCount}
                </span>
              </div>
              <span className="hidden lg:inline text-xs font-bold text-slate-800 ml-1">Cart</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-full text-slate-800 hover:bg-gray-100 md:hidden transition-colors"
            >
              {showMobileMenu ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearch}>
            <div className="flex items-center bg-[#F3F3EE] rounded-full border border-gray-200 px-3.5 py-2">
              <FiSearch size={16} className="text-gray-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search appliances, brands..."
                className="flex-1 text-xs bg-transparent outline-none text-slate-800"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-[1440px] mx-auto mt-2 bg-white rounded-2xl p-4 shadow-lg border border-black/5 md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-2 text-sm font-semibold text-slate-800">
              <Link to="/shop" onClick={() => setShowMobileMenu(false)} className="py-2 px-3 rounded-lg hover:bg-gray-50">
                All Appliances & Shop
              </Link>
              <Link to="/shop?category=electronics" onClick={() => setShowMobileMenu(false)} className="py-2 px-3 rounded-lg hover:bg-gray-50">
                Smart Electronics
              </Link>
              <Link to="/orders" onClick={() => setShowMobileMenu(false)} className="py-2 px-3 rounded-lg hover:bg-gray-50">
                My Orders
              </Link>
              <Link to="/wishlist" onClick={() => setShowMobileMenu(false)} className="py-2 px-3 rounded-lg hover:bg-gray-50">
                Wishlist ({wishlistItems.length})
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setShowMobileMenu(false)} className="py-2 px-3 rounded-lg text-brand-red font-bold hover:bg-red-50">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
