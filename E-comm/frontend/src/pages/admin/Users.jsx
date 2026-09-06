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
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Users ({users.length})</h1>
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        {isLoading ? <div className="flex justify-center py-12"><Spinner size="lg" /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['User', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-bold text-xs">
                        {user.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-success'}`}>{user.role}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>{user.isActive ? 'Active' : 'Blocked'}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{formatDate(user.createdAt)}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => toggleStatus(user._id)} className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${user.isActive ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}>
                      {user.isActive ? 'Block' : 'Unblock'}
                    </button>
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

export default AdminUsers;
