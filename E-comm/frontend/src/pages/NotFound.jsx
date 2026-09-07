import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiShoppingBag } from 'react-icons/fi';

const NotFound = () => (
  <div className="min-h-[80vh] bg-[#F3F3EE] flex items-center justify-center px-4 py-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md bg-white rounded-3xl border border-black/5 shadow-xl p-8 sm:p-12"
    >
      <div className="w-20 h-20 bg-red-50 text-brand-red rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
        <span className="text-4xl">🔌</span>
      </div>
      <div className="text-7xl font-display font-black text-slate-900 tracking-tight mb-2">
        404
      </div>
      <h1 className="text-xl font-black text-slate-900 mb-2">Appliance Not Found</h1>
      <p className="text-xs sm:text-sm text-gray-500 mb-8 leading-relaxed">
        The smart appliance or page you are looking for seems to have been unplugged or moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-brand-red hover:bg-brand-redHover text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
        >
          <FiHome size={15} /> Return Home
        </Link>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#11161B] hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all"
        >
          <FiShoppingBag size={15} /> Browse Catalog
        </Link>
      </div>
    </motion.div>
  </div>
);

export default NotFound;
