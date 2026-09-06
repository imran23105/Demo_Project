import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { authApi } from '../../services/authApi';
import toast from 'react-hot-toast';
import Button from '../common/Button';

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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FiMail size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
        <p className="text-gray-500 mt-2 text-sm">Enter your email and we'll send a reset link.</p>
      </div>

      {sent ? (
        <div className="text-center bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="text-4xl mb-3">✉️</div>
          <h3 className="font-semibold text-green-800 mb-1">Check your inbox!</h3>
          <p className="text-green-700 text-sm">We've sent a password reset link to <strong>{email}</strong></p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <FiMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <Button type="submit" fullWidth isLoading={isLoading} size="lg">Send Reset Link</Button>
        </form>
      )}

      <div className="text-center mt-6">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy">
          <FiArrowLeft size={14} /> Back to Login
        </Link>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
