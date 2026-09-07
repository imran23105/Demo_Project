import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { authApi } from '../../services/authApi';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
      toast.success('Reset email sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
      <div className="text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-gradient-to-tr from-brand-red to-red-500 rounded-2xl flex items-center justify-center shadow-md shadow-red-500/20">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <path d="M9 22V12h6v10" />
            </svg>
          </div>
          <span className="font-display font-black text-2xl text-slate-900 tracking-tight">
            Home<span className="text-brand-red">Kart</span>
          </span>
        </Link>
        <h1 className="text-2xl font-black text-slate-900 font-display">Forgot Password?</h1>
        <p className="text-gray-500 mt-0.5 text-xs">Enter your email and we'll send a password recovery link</p>
      </div>

      {sent ? (
        <div className="text-center bg-[#11161B] text-white rounded-3xl p-6 border border-white/10 shadow-lg">
          <div className="w-12 h-12 rounded-full bg-[#CEF04A]/20 text-[#CEF04A] flex items-center justify-center mx-auto mb-3 text-2xl">
            ✓
          </div>
          <h3 className="font-bold text-base text-white mb-1">Check your inbox!</h3>
          <p className="text-gray-400 text-xs">
            We've sent a recovery link to <span className="text-[#CEF04A] font-semibold">{email}</span>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <FiMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-11 text-xs sm:text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-full bg-brand-red hover:bg-brand-redHover text-white text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-60"
          >
            {isLoading ? 'Sending link...' : 'Send Reset Link'}
          </button>
        </form>
      )}

      <div className="text-center mt-6">
        <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-red transition-colors">
          <FiArrowLeft size={14} /> Back to Login
        </Link>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
