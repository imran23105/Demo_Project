import { useEffect, useState } from 'react';
import { couponApi } from '../../services/orderApi';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { formatDate } from '../../utils/formatDate';
import { Spinner } from '../../components/common/Loader';
import Button from '../../components/common/Button';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '',
    maxUses: '', expiresAt: '', isActive: true,
  });

  const fetch = async () => {
    setIsLoading(true);
    try { const { data } = await couponApi.getCoupons(); setCoupons(data.data || []); }
    catch {} finally { setIsLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await couponApi.createCoupon({ ...form, code: form.code.toUpperCase() });
      toast.success('Coupon created!');
      setShowForm(false);
      setForm({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxUses: '', expiresAt: '', isActive: true });
      fetch();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id, code) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    try { await couponApi.deleteCoupon(id); toast.success('Deleted'); fetch(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight">Promotional Coupons</h1>
          <p className="text-xs text-gray-500 mt-1">Manage marketing discount codes and promotional vouchers</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-brand-red hover:bg-brand-redHover text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all w-fit"
        >
          <FiPlus size={16} /> Add Coupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-black/5 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-black font-display text-slate-900">Create New Coupon</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Coupon Code *</label>
              <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="input-field font-mono text-xs sm:text-sm" placeholder="SMART50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Discount Type</label>
              <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="input-field text-xs sm:text-sm">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Discount Value *</label>
              <input type="number" required value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className="input-field text-xs sm:text-sm" min="1" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Min Order (₹)</label>
              <input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} className="input-field text-xs sm:text-sm" min="0" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Max Uses</label>
              <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} className="input-field text-xs sm:text-sm" min="1" placeholder="Unlimited" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Expires At</label>
              <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="input-field text-xs sm:text-sm" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSaving} className="py-2.5 px-6 rounded-full bg-brand-red hover:bg-brand-redHover text-white text-xs font-bold shadow-sm transition-all disabled:opacity-60">
              {isSaving ? 'Saving...' : 'Create Coupon'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="py-2.5 px-5 rounded-full border border-gray-200 text-slate-700 hover:bg-gray-100 text-xs font-bold transition-all">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-[#11161B] text-white border-b border-black/5">
                <tr>
                  {['Code', 'Type', 'Value', 'Min Order', 'Redemptions', 'Expires', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-gray-300">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-[#F3F3EE]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 bg-gray-50/50 rounded-xl">{c.code}</td>
                    <td className="py-3 px-4 capitalize text-slate-700 font-semibold">{c.discountType}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                    <td className="py-3 px-4 text-slate-600">{c.minOrderAmount ? `₹${c.minOrderAmount}` : 'None'}</td>
                    <td className="py-3 px-4 font-mono text-xs">{c.currentUses ?? c.usedCount ?? 0} / {c.maxUses || c.usageLimit || '∞'}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{c.expiresAt ? formatDate(c.expiresAt) : 'Permanent'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${c.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-brand-red'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleDelete(c._id, c.code)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <FiTrash2 size={15} />
                      </button>
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

export default AdminCoupons;
