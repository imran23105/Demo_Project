import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { orderApi } from '../../services/orderApi';
import { productApi } from '../../services/productApi';
import { userApi } from '../../services/authApi';
import { formatCurrency } from '../../utils/formatCurrency';

const StatCard = ({ icon, title, value, change, color = 'blue', isLoading }) => (
  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-black/5 shadow-sm p-6 hover:shadow-md transition-all">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${color}-50`}>
        <span className={`text-${color}-600`}>{icon}</span>
      </div>
      {change !== undefined && (
        <span className={`inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full ${change >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-brand-red'}`}>
          {change >= 0 ? <FiArrowUp size={11} /> : <FiArrowDown size={11} />}
          {Math.abs(change)}%
        </span>
      )}
    </div>
    <div className="text-2xl sm:text-3xl font-black font-display text-slate-900">{isLoading ? '...' : value}</div>
    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">{title}</div>
  </motion.div>
);

// Static demo chart data
const revenueData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  revenue: Math.floor(Math.random() * 50000) + 10000,
  orders: Math.floor(Math.random() * 30) + 5,
}));

const Dashboard = () => {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, users: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      orderApi.getAllOrders({ limit: 5 }),
      productApi.getProducts({ limit: 1 }),
      userApi.getAllUsers({ limit: 1 }),
    ])
      .then(([ordersRes, productsRes, usersRes]) => {
        setRecentOrders(ordersRes.data.data || []);
        setStats((s) => ({
          ...s,
          orders: ordersRes.data.meta?.total || 0,
          products: productsRes.data.meta?.total || 0,
          users: usersRes.data.meta?.total || 0,
          revenue: ordersRes.data.data?.reduce((acc, o) => acc + o.totalAmount, 0) || 0,
        }));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-[1400px]">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight">Platform Overview</h1>
        <p className="text-xs text-gray-500 mt-1">Live metrics and performance dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard icon={<FiShoppingBag size={20} />} title="Total Orders" value={stats.orders} change={12} color="blue" isLoading={isLoading} />
        <StatCard icon={<FiDollarSign size={20} />} title="Total Revenue" value={formatCurrency(stats.revenue)} change={8.2} color="green" isLoading={isLoading} />
        <StatCard icon={<FiPackage size={20} />} title="Appliance Stock" value={stats.products} color="purple" isLoading={isLoading} />
        <StatCard icon={<FiUsers size={20} />} title="Active Customers" value={stats.users} change={4.5} color="orange" isLoading={isLoading} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base text-slate-900">Revenue Velocity</h3>
              <p className="text-xs text-gray-400">Past 7 days income tracking</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-red-50 text-brand-red px-2.5 py-1 rounded-full">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Line type="monotone" dataKey="revenue" stroke="#B8161D" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base text-slate-900">Order Volume</h3>
              <p className="text-xs text-gray-400">Daily appliance dispatch rate</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-gray-100 text-slate-700 px-2.5 py-1 rounded-full">Weekly</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#11161B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-slate-900">Recent Customer Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left py-3 px-3 text-gray-400 font-bold uppercase tracking-wider text-[11px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-[#F3F3EE]/50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">#{order.orderNumber}</td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{order.user?.name || 'Guest'}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{formatCurrency(order.totalAmount)}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      order.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                      order.orderStatus === 'cancelled' ? 'bg-red-50 text-brand-red' : 'bg-amber-50 text-amber-700'
                    }`}>{order.orderStatus}</span>
                  </td>
                  <td className="py-3 px-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
