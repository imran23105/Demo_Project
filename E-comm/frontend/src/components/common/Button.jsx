import { motion } from 'framer-motion';
import { Spinner } from './Loader';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm';

  const variants = {
    primary: 'bg-brand-red text-white hover:bg-brand-redHover hover:shadow-md shadow-red-500/20',
    secondary: 'bg-white text-slate-900 border border-gray-200 hover:border-slate-800 hover:bg-gray-50',
    accent: 'bg-[#CEF04A] text-slate-950 hover:bg-[#BDE032] font-black',
    dark: 'bg-[#11161B] text-white hover:bg-brand-red',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-gray-700 hover:bg-gray-100 shadow-none',
    outline: 'text-gray-700 border border-gray-300 bg-white hover:border-slate-900 hover:text-slate-900',
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Spinner size="sm" className="border-t-white" />
      ) : leftIcon ? (
        leftIcon
      ) : null}
      {children}
      {!isLoading && rightIcon && rightIcon}
    </motion.button>
  );
};

export default Button;
