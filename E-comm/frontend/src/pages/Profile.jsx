import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiMapPin, FiShield, FiCheckCircle } from 'react-icons/fi';
import { selectUser, updateUser } from '../redux/slices/authSlice';
import { userApi } from '../services/authApi';
import toast from 'react-hot-toast';

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
    { id: 'profile', label: 'Personal Info', icon: <FiUser size={16} /> },
    { id: 'security', label: 'Security & Login', icon: <FiLock size={16} /> },
    { id: 'addresses', label: 'Delivery Addresses', icon: <FiMapPin size={16} /> },
  ];

  return (
    <div className="min-h-[85vh] bg-[#F3F3EE] py-10 px-4">
      <div className="container-custom max-w-[1280px]">
        {/* Top Header Card */}
        <div className="bg-[#11161B] text-white rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-72 h-72 bg-gradient-to-br from-brand-red/20 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center gap-5 z-10 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full ring-4 ring-[#CEF04A]/30 bg-gradient-to-br from-brand-red to-red-600 flex items-center justify-center text-white text-3xl font-black shadow-lg overflow-hidden flex-shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || 'U'
              )}
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">{user?.name}</h1>
                <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  user?.role === 'admin' 
                    ? 'bg-[#CEF04A] text-[#11161B]' 
                    : 'bg-white/15 text-white'
                }`}>
                  {user?.role}
                </span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-1.5">
                <FiMail size={13} className="text-gray-500" /> {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 z-10">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/10 text-center">
              <span className="block text-[10px] uppercase font-bold text-gray-400">Account Status</span>
              <span className="text-xs font-black text-[#CEF04A] flex items-center gap-1 justify-center">
                <FiCheckCircle size={12} /> Verified
              </span>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Nav */}
          <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-4 sm:p-5 h-fit">
            <p className="text-[11px] uppercase font-black text-gray-400 tracking-wider px-3 mb-3">Account Settings</p>
            <nav className="space-y-1.5">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-[#11161B] text-white shadow-md'
                        : 'text-slate-700 hover:bg-[#F3F3EE] hover:text-slate-900'
                    }`}
                  >
                    <span className={isActive ? 'text-[#CEF04A]' : 'text-gray-400'}>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl border border-black/5 shadow-sm p-6 sm:p-8"
              >
                {activeTab === 'profile' && (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div>
                      <h2 className="text-xl font-black font-display text-slate-900">Personal Information</h2>
                      <p className="text-xs text-gray-500 mt-0.5">Manage your identity details and contact preferences</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                          Full Name
                        </label>
                        <div className="relative">
                          <FiUser size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="input-field pl-11 text-xs sm:text-sm"
                            placeholder="Your full name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                          Email Address
                        </label>
                        <div className="relative">
                          <FiMail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            value={user?.email || ''}
                            disabled
                            className="input-field pl-11 text-xs sm:text-sm bg-gray-100/70 text-gray-500 cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                          Phone Number
                        </label>
                        <div className="relative">
                          <FiPhone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="+91 99999 99999"
                            className="input-field pl-11 text-xs sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="py-3 px-8 rounded-full bg-brand-red hover:bg-brand-redHover text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-60"
                      >
                        {isLoading ? 'Saving changes...' : 'Save Profile Changes'}
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'security' && (
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div>
                      <h2 className="text-xl font-black font-display text-slate-900">Security & Password</h2>
                      <p className="text-xs text-gray-500 mt-0.5">Ensure your account is protected with a strong passphrase</p>
                    </div>

                    <div className="space-y-4 max-w-md">
                      {[
                        { label: 'Current Password', key: 'currentPassword' },
                        { label: 'New Password (min 6 characters)', key: 'newPassword' },
                        { label: 'Confirm New Password', key: 'confirmPassword' },
                      ].map(({ label, key }) => (
                        <div key={key}>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                            {label}
                          </label>
                          <div className="relative">
                            <FiLock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="password"
                              required
                              value={pwdForm[key]}
                              onChange={(e) => setPwdForm({ ...pwdForm, [key]: e.target.value })}
                              className="input-field pl-11 text-xs sm:text-sm"
                              placeholder="••••••••"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="py-3 px-8 rounded-full bg-brand-red hover:bg-brand-redHover text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-60"
                      >
                        {isLoading ? 'Updating password...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'addresses' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-black font-display text-slate-900">Delivery Addresses</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Saved shipping addresses for quick appliance delivery</p>
                      </div>
                    </div>

                    {(!user?.addresses || user?.addresses?.length === 0) ? (
                      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-3xl p-8">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                          <FiMapPin size={22} />
                        </div>
                        <p className="text-sm font-bold text-slate-800">No saved addresses yet</p>
                        <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                          Addresses you use during checkout will appear here automatically.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.addresses.map((addr, i) => (
                          <div key={i} className="border border-black/5 bg-[#F3F3EE]/50 rounded-2xl p-5 relative hover:border-black/15 transition-all">
                            <div className="flex items-start justify-between mb-2">
                              <p className="font-bold text-sm text-slate-900">{addr.fullName}</p>
                              {addr.isDefault && (
                                <span className="bg-[#11161B] text-[#CEF04A] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed mb-3">
                              {addr.addressLine1}
                              {addr.addressLine2 ? `, ${addr.addressLine2}` : ''},<br />
                              {addr.city}, {addr.state} - <span className="font-bold text-slate-800">{addr.postalCode}</span>
                            </p>
                            <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                              <FiPhone size={12} className="text-gray-400" /> {addr.phone}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
