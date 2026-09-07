import { useEffect, useState } from 'react';
import { userApi } from '../../services/authApi';
import toast from 'react-hot-toast';
import { Spinner } from '../../components/common/Loader';
import { formatDate } from '../../utils/formatDate';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = async () => {
    setIsLoading(true);
    try { const { data } = await userApi.getAllUsers({ limit: 20 }); setUsers(data.data || []); }
    catch {} finally { setIsLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const toggleStatus = async (id) => {
    try { await userApi.toggleUserStatus(id); toast.success('User status updated'); fetch(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight">Registered Customers ({users.length})</h1>
        <p className="text-xs text-gray-500 mt-1">Manage user permissions, roles and account access</p>
      </div>
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-[#11161B] text-white border-b border-black/5">
                <tr>
                  {['Customer Profile', 'Account Role', 'Access Status', 'Registered Date', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-gray-300">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-[#F3F3EE]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#11161B] text-white flex items-center justify-center font-bold text-xs ring-2 ring-black/5">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <p className="text-[11px] text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        user.role === 'admin' ? 'bg-[#11161B] text-[#CEF04A]' : 'bg-gray-100 text-slate-700'
                      }`}>{user.role}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        user.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-brand-red'
                      }`}>{user.isActive ? 'Active' : 'Blocked'}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{formatDate(user.createdAt)}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleStatus(user._id)}
                        className={`text-xs px-3.5 py-1 rounded-full font-bold transition-all ${
                          user.isActive
                            ? 'bg-red-50 text-brand-red hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {user.isActive ? 'Restrict Access' : 'Restore Access'}
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

export default AdminUsers;
