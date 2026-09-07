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
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight">Orders Fulfillment ({orders.length})</h1>
        <p className="text-xs text-gray-500 mt-1">Track appliance orders, payments, and delivery milestones</p>
      </div>

      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-[#11161B] text-white border-b border-black/5">
                <tr>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Update Status'].map((h) => (
                    <th key={h} className="text-left py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-gray-300 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#F3F3EE]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">#{order.orderNumber}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{order.user?.name || 'Guest Customer'}</p>
                      <p className="text-[11px] text-gray-500">{order.user?.email}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-semibold">{order.items?.length || 0} pcs</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{formatCurrency(order.totalAmount)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>{order.paymentStatus}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        order.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                        order.orderStatus === 'cancelled' ? 'bg-red-50 text-brand-red' : 'bg-blue-50 text-blue-700'
                      }`}>{order.orderStatus}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap text-xs">{formatDate(order.createdAt)}</td>
                    <td className="py-3 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="text-xs bg-[#F3F3EE] border border-black/10 rounded-full px-3 py-1 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-red cursor-pointer"
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
