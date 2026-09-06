import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { orderApi } from '../../services/orderApi';
import { productApi } from '../../services/productApi';
import { userApi } from '../../services/authApi';
import { formatCurrency } from '../../utils/formatCurrency';

const StatCard = ({ icon, title, value, change, color = 'blue', isLoading }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-card p-5">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${color}-100`}>
        <span className={`text-${color}-600`}>{icon}</span>
      </div>
      {change !== undefined && (
        <span className={`flex items-center gap-1 text-xs font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {change >= 0 ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
          {Math.abs(change)}%
        </span>
      )}
    </div>
    <div className="text-2xl font-bold text-gray-900">{isLoading ? '...' : value}</div>
    <div className="text-sm text-gray-500 mt-1">{title}</div>
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<FiShoppingBag size={20} />} title="Total Orders" value={stats.orders} change={12} color="blue" isLoading={isLoading} />
        <StatCard icon={<FiDollarSign size={20} />} title="Total Revenue" value={formatCurrency(stats.revenue)} change={8.2} color="green" isLoading={isLoading} />
        <StatCard icon={<FiPackage size={20} />} title="Products" value={stats.products} color="purple" isLoading={isLoading} />
        <StatCard icon={<FiUsers size={20} />} title="Customers" value={stats.users} change={4.5} color="orange" isLoading={isLoading} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-card p-5">
          <h3 className="font-bold text-gray-800 mb-4">Revenue This Week</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Line type="monotone" dataKey="revenue" stroke="#1e3a5f" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-card p-5">
          <h3 className="font-bold text-gray-800 mb-4">Orders Per Day</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-card p-5">
        <h3 className="font-bold text-gray-800 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Order #', 'Customer', 'Total', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left py-2 px-3 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-medium text-navy">#{order.orderNumber}</td>
                  <td className="py-2.5 px-3">{order.user?.name || 'Guest'}</td>
                  <td className="py-2.5 px-3 font-semibold">{formatCurrency(order.totalAmount)}</td>
                  <td className="py-2.5 px-3">
                    <span className={`badge ${
                      order.orderStatus === 'delivered' ? 'badge-success' :
                      order.orderStatus === 'cancelled' ? 'badge-danger' : 'badge-primary'
                    }`}>{order.orderStatus}</span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
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
