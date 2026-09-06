import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiTag, FiGift } from 'react-icons/fi';
import { categoryApi } from '../../services/productApi';

const CATEGORY_ICONS = {
  "women's fashion": '👗',
  "men's fashion": '👔',
  'beauty & personal care': '💄',
  electronics: '📱',
  'home & living': '🏠',
  'sports & outdoors': '⚽',
  'toys & games': '🧸',
  automotive: '🚗',
  'books & stationery': '📚',
  'pet supplies': '🐾',
};

const Sidebar = ({ isShop = false, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const location = useLocation();

  useEffect(() => {
    categoryApi.getCategories()
      .then(({ data }) => setCategories(data.data || []))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-card">
      {/* Header */}
      <div className="bg-navy px-4 py-3 flex items-center justify-between">
        <h3 className="font-semibold text-white text-sm">Shop by Categories</h3>
      </div>

      {/* Categories */}
      <ul className="divide-y divide-gray-50">
        {categories.map((cat) => (
          <li key={cat._id}>
            <Link
              to={`/shop?category=${cat._id}`}
              onClick={onClose}
              onMouseEnter={() => setHoveredCategory(cat._id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-blue-50 hover:text-navy ${
                location.search.includes(cat._id) ? 'bg-blue-50 text-navy font-semibold' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-base">
                  {CATEGORY_ICONS[cat.name?.toLowerCase()] || cat.icon || '🏷️'}
                </span>
                <span>{cat.name}</span>
              </div>
              <FiChevronRight size={14} className={`transition-transform ${hoveredCategory === cat._id ? 'translate-x-0.5' : ''} text-gray-400`} />
            </Link>
          </li>
        ))}
      </ul>

      {/* Special Links */}
      <div className="border-t border-gray-100 py-2">
        <Link to="/shop?sort=discountPercent" className="flex items-center gap-3 px-4 py-2.5 text-sm text-orange-600 hover:bg-orange-50 transition-colors">
          <FiTag size={16} /> Top Offers
        </Link>
        <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <FiGift size={16} /> Gift Cards
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
