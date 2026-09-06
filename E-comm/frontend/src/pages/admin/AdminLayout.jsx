import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag, FiLogOut, FiMenu, FiX, FiLayers, FiExternalLink } from 'react-icons/fi';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <FiGrid size={18} />, end: true },
  { to: '/admin/products', label: 'Products', icon: <FiPackage size={18} /> },
  { to: '/admin/categories', label: 'Categories', icon: <FiLayers size={18} /> },
  { to: '/admin/orders', label: 'Orders', icon: <FiShoppingBag size={18} /> },
  { to: '/admin/users', label: 'Users', icon: <FiUsers size={18} /> },
  { to: '/admin/coupons', label: 'Coupons', icon: <FiTag size={18} /> },
];

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-navy text-white flex-shrink-0 flex flex-col transition-all duration-300 min-h-screen`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center flex-shrink-0">
            <span className="text-navy font-bold text-sm">N</span>
          </div>
          {sidebarOpen && <span className="font-display font-bold text-lg tracking-wider">NEBULA</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                  isActive ? 'bg-white text-navy font-semibold' : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-white/10 p-3">
          {sidebarOpen && (
            <div className="px-2 py-2 mb-2">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-blue-300 truncate">{user?.email}</p>
            </div>
          )}
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-blue-200 hover:bg-white/10 hover:text-white transition-all">
            <FiLogOut size={18} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <h1 className="font-semibold text-gray-800">Admin Panel</h1>
          <div className="ml-auto flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <FiExternalLink size={13} /> View Storefront
            </Link>
            <span className="text-sm text-gray-500">Welcome, {user?.name}</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
