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
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight">Appliance Catalog ({meta.total})</h1>
          <p className="text-xs text-gray-500 mt-1">Manage smart home appliances, stock levels and pricing</p>
        </div>
        <Link
          to="/admin/products/add"
          className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-brand-red hover:bg-brand-redHover text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all w-fit"
        >
          <FiPlus size={16} /> Add New Appliance
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <FiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by appliance title or brand..."
          className="input-field pl-11 text-xs sm:text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-[#11161B] text-white border-b border-black/5">
                <tr>
                  {['Appliance', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-gray-300">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-[#F3F3EE]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0]?.url} alt={p.title} className="w-12 h-12 object-contain p-1 rounded-2xl bg-[#F3F3EE] border border-black/5 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1 max-w-xs">{p.title}</p>
                          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{p.category?.name || '-'}</td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-mono font-bold text-slate-900">{formatCurrency(p.discountPrice || p.price)}</span>
                        {p.discountPrice > 0 && (
                          <span className="text-[11px] text-gray-400 line-through ml-1.5 font-mono">
                            {formatCurrency(p.price)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        p.stock > 10 ? 'bg-emerald-50 text-emerald-700' :
                        p.stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-brand-red'
                      }`}>
                        {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {p.isActive ? (
                          <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            Active
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            Draft
                          </span>
                        )}
                        {p.isTrending && (
                          <span className="bg-[#11161B] text-[#CEF04A] px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                            Trending
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Link to={`/admin/products/edit/${p._id}`} className="p-2 text-slate-700 hover:bg-gray-100 rounded-xl transition-colors">
                          <FiEdit2 size={15} />
                        </Link>
                        <button onClick={() => handleDelete(p._id, p.title)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
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

export default AdminProducts;
