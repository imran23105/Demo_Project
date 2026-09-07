import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const authData = await login(form);
      if (authData?.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch {
      // error handled in hook
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
        <h1 className="text-2xl font-black text-slate-900 font-display">Welcome Back!</h1>
        <p className="text-gray-500 mt-0.5 text-xs">Sign in to manage your smart home appliances & orders</p>
      </div>

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
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field pl-11 text-xs sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPwd ? 'text' : 'password'}
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field pl-11 pr-11 text-xs sm:text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-800"
            >
              {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-slate-700 hover:text-brand-red font-bold">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 rounded-full bg-brand-red hover:bg-brand-redHover text-white text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-60"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        {/* Demo credentials */}
        <div className="bg-[#11161B] text-white rounded-2xl p-3.5 text-xs border border-white/10 space-y-1">
          <p className="font-extrabold text-[#CEF04A] text-[11px] uppercase tracking-wider">Demo Credentials:</p>
          <p className="text-gray-300">Admin: <span className="font-mono text-white">admin@nebula.com</span> / password123</p>
          <p className="text-gray-300">User: <span className="font-mono text-white">john@example.com</span> / password123</p>
        </div>
      </form>

      <p className="text-center text-xs text-gray-500 mt-5">
        Don't have an account?{' '}
        <Link to="/register" className="text-slate-900 font-bold hover:text-brand-red">
          Create account
        </Link>
      </p>
    </motion.div>
  );
};

export default LoginForm;
