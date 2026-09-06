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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
        <Button onClick={() => setShowForm(true)} leftIcon={<FiPlus size={16} />} size="sm">Add Coupon</Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-5 space-y-4">
          <h3 className="font-semibold">New Coupon</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Code *</label>
              <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="input-field font-mono" placeholder="SAVE20" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Type</label>
              <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="input-field">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Value *</label>
              <input type="number" required value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className="input-field" min="1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Min Order (₹)</label>
              <input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} className="input-field" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Uses</label>
              <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} className="input-field" min="1" placeholder="Unlimited" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expires At</label>
              <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="input-field" />
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="submit" isLoading={isSaving} size="sm">Create Coupon</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        {isLoading ? <div className="flex justify-center py-12"><Spinner size="lg" /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Code', 'Type', 'Value', 'Min Order', 'Uses', 'Expires', 'Status', ''].map((h) => (
                  <th key={h} className="text-left py-3 px-4 font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono font-bold text-navy">{c.code}</td>
                  <td className="py-3 px-4 capitalize">{c.discountType}</td>
                  <td className="py-3 px-4 font-semibold">{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                  <td className="py-3 px-4">{c.minOrderAmount ? `₹${c.minOrderAmount}` : 'None'}</td>
                  <td className="py-3 px-4">{c.currentUses} / {c.maxUses || '∞'}</td>
                  <td className="py-3 px-4 text-gray-500">{c.expiresAt ? formatDate(c.expiresAt) : 'Never'}</td>
                  <td className="py-3 px-4"><span className={`badge ${c.isActive ? 'badge-success' : 'badge-danger'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleDelete(c._id, c.code)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 size={15} /></button>
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

export default AdminCoupons;
