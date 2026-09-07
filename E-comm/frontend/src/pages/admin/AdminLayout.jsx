import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag, FiLogOut, FiMenu, FiX, FiLayers, FiExternalLink } from 'react-icons/fi';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <FiGrid size={17} />, end: true },
  { to: '/admin/products', label: 'Products', icon: <FiPackage size={17} /> },
  { to: '/admin/categories', label: 'Categories', icon: <FiLayers size={17} /> },
  { to: '/admin/orders', label: 'Orders', icon: <FiShoppingBag size={17} /> },
  { to: '/admin/users', label: 'Users', icon: <FiUsers size={17} /> },
  { to: '/admin/coupons', label: 'Coupons', icon: <FiTag size={17} /> },
];

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#F3F3EE] flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-20'} bg-[#11161B] text-white flex-shrink-0 flex flex-col transition-all duration-300 min-h-screen border-r border-white/5`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-gradient-to-tr from-brand-red to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <path d="M9 22V12h6v10" />
            </svg>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <span className="font-display font-black text-lg text-white tracking-tight">
                Home<span className="text-brand-red">Kart</span>
              </span>
              <span className="block text-[9px] uppercase font-black tracking-widest text-[#CEF04A]">
                Admin Console
              </span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all text-xs sm:text-sm font-bold ${
                  isActive
                    ? 'bg-white/15 text-white shadow-sm border border-white/10'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="text-[#CEF04A]">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-white/10 p-4">
          {sidebarOpen && (
            <div className="px-2 py-2 mb-2">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-2.5 px-3 py-2.5 w-full rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <FiLogOut size={16} />
            {sidebarOpen && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-black/5 px-6 py-3.5 flex items-center gap-4 shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-slate-700"
          >
            {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">HomeKart Control System</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#11161B] text-white text-xs font-bold rounded-full hover:bg-slate-800 transition-colors shadow-sm"
            >
              <FiExternalLink size={13} className="text-[#CEF04A]" /> View Live Storefront
            </Link>
            <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700">
              <span>{user?.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
