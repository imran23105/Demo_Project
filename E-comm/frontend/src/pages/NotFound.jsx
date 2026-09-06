import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <div className="text-8xl mb-4">🔍</div>
      <h1 className="text-9xl font-display font-black text-navy opacity-10 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-xs mx-auto">Sorry, we couldn't find the page you're looking for.</p>
      <div className="flex gap-3 justify-center">
        <Link to="/" className="btn-primary">Go Home</Link>
        <Link to="/shop" className="btn-secondary">Browse Shop</Link>
      </div>
    </motion.div>
  </div>
);

export default NotFound;
