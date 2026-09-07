import { useEffect, useState } from 'react';
import { categoryApi } from '../../services/productApi';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Spinner } from '../../components/common/Loader';
import Button from '../../components/common/Button';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', icon: '' });
  const [isSaving, setIsSaving] = useState(false);

  const fetch = async () => {
    setIsLoading(true);
    try { const { data } = await categoryApi.getCategories(); setCategories(data.data || []); }
    catch {} finally { setIsLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k]));
      if (editId) { await categoryApi.updateCategory(editId, fd); toast.success('Category updated!'); }
      else { await categoryApi.createCategory(fd); toast.success('Category created!'); }
      setShowForm(false); setEditId(null); setForm({ name: '', description: '', icon: '' });
      fetch();
    } catch (e) { toast.error(e.response?.data?.message || 'Save failed'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try { await categoryApi.deleteCategory(id); toast.success('Deleted'); fetch(); }
    catch (e) { toast.error(e.response?.data?.message || 'Delete failed'); }
  };

  const startEdit = (cat) => {
    setEditId(cat._id);
    setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '' });
    setShowForm(true);
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight">Appliance Categories</h1>
          <p className="text-xs text-gray-500 mt-1">Organize appliances into department categories</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', description: '', icon: '' }); }}
          className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-brand-red hover:bg-brand-redHover text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all w-fit"
        >
          <FiPlus size={16} /> Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-black/5 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-black font-display text-slate-900">{editId ? 'Edit Category' : 'Create New Category'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Category Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field text-xs sm:text-sm" placeholder="e.g. Smart Cooling" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Icon (emoji)</label>
              <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="❄️" className="input-field text-xs sm:text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Description</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief overview of appliances in this category" className="input-field text-xs sm:text-sm" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSaving} className="py-2.5 px-6 rounded-full bg-brand-red hover:bg-brand-redHover text-white text-xs font-bold shadow-sm transition-all disabled:opacity-60">
              {isSaving ? 'Saving...' : editId ? 'Update Category' : 'Create Category'}
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
                  {['Icon', 'Category Name', 'Slug Identifier', 'Products', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-gray-300">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-[#F3F3EE]/50 transition-colors">
                    <td className="py-3 px-4 text-2xl">{cat.icon || '🏷️'}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{cat.name}</td>
                    <td className="py-3 px-4 font-mono text-gray-400 text-xs">{cat.slug}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-gray-100 text-slate-700 font-bold text-xs">
                        {cat.productCount || 0} items
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => startEdit(cat)} className="p-2 text-slate-700 hover:bg-gray-100 rounded-xl transition-colors">
                          <FiEdit2 size={15} />
                        </button>
                        <button onClick={() => handleDelete(cat._id, cat.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                          <FiTrash2 size={15} />
                        </button>
                      </div>
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

export default AdminCategories;
