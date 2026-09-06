import { useEffect, useState } from 'react';
import { orderApi } from '../../services/orderApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';
import { Spinner } from '../../components/common/Loader';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_STYLES = { pending: 'badge-warning', processing: 'badge-primary', shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-danger' };

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = async () => {
    setIsLoading(true);
    try { const { data } = await orderApi.getAllOrders({ limit: 20 }); setOrders(data.data || []); }
    catch {} finally { setIsLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await orderApi.updateOrderStatus(id, status);
      toast.success(`Order status updated to ${status}`);
      fetch();
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Orders ({orders.length})</h1>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Update'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-navy whitespace-nowrap">#{order.orderNumber}</td>
                  <td className="py-3 px-4">
                    <p>{order.user?.name || 'Guest'}</p>
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{order.items?.length || 0}</td>
                  <td className="py-3 px-4 font-semibold">{formatCurrency(order.totalAmount)}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>{order.paymentStatus}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${STATUS_STYLES[order.orderStatus] || 'badge-primary'}`}>{order.orderStatus}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-navy"
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
