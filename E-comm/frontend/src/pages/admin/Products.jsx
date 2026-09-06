import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { productApi } from '../../services/productApi';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';
import { Spinner } from '../../components/common/Loader';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });

  const fetch = async () => {
    setIsLoading(true);
    try {
      const { data } = await productApi.getProducts({ search, page, limit: 10 });
      setProducts(data.data || []);
      setMeta(data.meta || {});
    } catch {}
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetch(); }, [search, page]);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await productApi.deleteProduct(id);
      toast.success('Product deleted');
      fetch();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products ({meta.total})</h1>
        <Link to="/admin/products/add" className="btn-primary text-sm">
          <FiPlus size={16} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search products..."
          className="input-field pl-9 text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]?.url} alt={p.title} className="w-10 h-10 object-cover rounded-lg bg-gray-100" />
                      <div>
                        <p className="font-medium line-clamp-1 max-w-xs">{p.title}</p>
                        <p className="text-xs text-gray-400">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{p.category?.name || '-'}</td>
                  <td className="py-3 px-4">
                    <div>
                      <span className="font-semibold text-navy">{formatCurrency(p.discountPrice || p.price)}</span>
                      {p.discountPrice > 0 && <span className="text-xs text-gray-400 line-through ml-1">{formatCurrency(p.price)}</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={p.stock > 0 ? 'text-green-600' : 'text-red-500'}>{p.stock}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {p.isActive ? <span className="badge badge-success">Active</span> : <span className="badge badge-danger">Inactive</span>}
                      {p.isTrending && <span className="badge badge-warning">Trending</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/products/edit/${p._id}`} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <FiEdit2 size={15} />
                      </Link>
                      <button onClick={() => handleDelete(p._id, p.title)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
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

export default AdminProducts;
