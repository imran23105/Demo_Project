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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', description: '', icon: '' }); }} leftIcon={<FiPlus size={16} />} size="sm">
          Add Category
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-5 space-y-4">
          <h3 className="font-semibold">{editId ? 'Edit Category' : 'New Category'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
              <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="👗" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" />
          </div>
          <div className="flex gap-3">
            <Button type="submit" isLoading={isSaving} size="sm">{editId ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        {isLoading ? <div className="flex justify-center py-12"><Spinner size="lg" /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Icon', 'Name', 'Slug', 'Products', 'Actions'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-xl">{cat.icon || '🏷️'}</td>
                  <td className="py-3 px-4 font-medium">{cat.name}</td>
                  <td className="py-3 px-4 text-gray-400">{cat.slug}</td>
                  <td className="py-3 px-4">{cat.productCount || 0}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <button onClick={() => startEdit(cat)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><FiEdit2 size={15} /></button>
                    <button onClick={() => handleDelete(cat._id, cat.name)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 size={15} /></button>
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

export default AdminCategories;
