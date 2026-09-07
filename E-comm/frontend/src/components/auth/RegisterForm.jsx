import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/');
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

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
        <h1 className="text-2xl font-black text-slate-900 font-display">Create Account</h1>
        <p className="text-gray-500 mt-0.5 text-xs">Join HomeKart for premium smart appliances and verified warranties</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <FiUser size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              required
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className={`input-field pl-11 text-xs sm:text-sm ${errors.name ? 'border-red-400 ring-2 ring-red-100' : ''}`}
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
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
              onChange={(e) => update('email', e.target.value)}
              className={`input-field pl-11 text-xs sm:text-sm ${errors.email ? 'border-red-400 ring-2 ring-red-100' : ''}`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPwd ? 'text' : 'password'}
              required
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              className={`input-field pl-11 pr-11 text-xs sm:text-sm ${errors.password ? 'border-red-400 ring-2 ring-red-100' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-800"
            >
              {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Confirm Password
          </label>
          <div className="relative">
            <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              required
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={(e) => update('confirmPassword', e.target.value)}
              className={`input-field pl-11 text-xs sm:text-sm ${errors.confirmPassword ? 'border-red-400 ring-2 ring-red-100' : ''}`}
            />
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 rounded-full bg-brand-red hover:bg-brand-redHover text-white text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-60 mt-2"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-5">
        Already have an account?{' '}
        <Link to="/login" className="text-slate-900 font-bold hover:text-brand-red">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
};

export default RegisterForm;
