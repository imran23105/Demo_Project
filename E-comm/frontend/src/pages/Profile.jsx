import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiCamera, FiLock, FiMapPin, FiPlus, FiTrash2 } from 'react-icons/fi';
import { selectUser } from '../redux/slices/authSlice';
import { updateUser } from '../redux/slices/authSlice';
import { userApi } from '../services/authApi';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('phone', form.phone);
      const { data } = await userApi.updateProfile(formData);
      dispatch(updateUser(data.data));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      await userApi.updatePassword({ currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
      toast.success('Password updated!');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser size={16} /> },
    { id: 'security', label: 'Security', icon: <FiLock size={16} /> },
    { id: 'addresses', label: 'Addresses', icon: <FiMapPin size={16} /> },
  ];

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Account</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white rounded-xl shadow-card p-5">
          <div className="text-center mb-5">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-navy flex items-center justify-center text-white text-2xl font-bold overflow-hidden mx-auto">
                {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : user?.name?.charAt(0)}
              </div>
            </div>
            <h3 className="font-bold mt-3">{user?.name}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className={`badge mt-1 ${user?.role === 'admin' ? 'badge-primary' : 'badge-success'}`}>{user?.role}</span>
          </div>

          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-navy text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-card p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <h2 className="font-bold text-lg text-gray-900">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input value={user?.email} disabled className="input-field bg-gray-50 text-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 9999999999" className="input-field" />
                  </div>
                </div>
                <Button type="submit" isLoading={isLoading}>Save Changes</Button>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handlePasswordUpdate} className="space-y-5">
                <h2 className="font-bold text-lg text-gray-900">Change Password</h2>
                {[
                  { label: 'Current Password', key: 'currentPassword' },
                  { label: 'New Password', key: 'newPassword' },
                  { label: 'Confirm New Password', key: 'confirmPassword' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <input
                      type="password"
                      required
                      value={pwdForm[key]}
                      onChange={(e) => setPwdForm({ ...pwdForm, [key]: e.target.value })}
                      className="input-field"
                    />
                  </div>
                ))}
                <Button type="submit" isLoading={isLoading}>Update Password</Button>
              </form>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <h2 className="font-bold text-lg text-gray-900">My Addresses</h2>
                {user?.addresses?.length === 0 && (
                  <p className="text-gray-500 text-sm">No saved addresses yet.</p>
                )}
                {user?.addresses?.map((addr, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-sm">{addr.fullName} · {addr.phone}</p>
                        <p className="text-sm text-gray-500 mt-1">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}, {addr.city}, {addr.state} {addr.postalCode}</p>
                      </div>
                      {addr.isDefault && <span className="badge badge-primary">Default</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
