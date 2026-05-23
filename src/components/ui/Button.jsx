import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

const variants = {
  primary: 'bg-[#1F7A8C] hover:bg-[#155E70] text-[#BFDBF7] shadow-lg shadow-[#1F7A8C40]',
  secondary: 'bg-transparent border border-[#1F7A8C] text-[#1F7A8C] hover:bg-[#1F7A8C] hover:text-[#BFDBF7]',
  mint: 'bg-[#BFDBF7] hover:bg-[#1F7A8C] text-[#022B3A] shadow-lg shadow-[#BFDBF740]',
  green: 'bg-[#E1E5F2] hover:bg-[#E1E5F2] text-[#022B3A]',
  ghost: 'bg-transparent hover:bg-[#1F7A8C]/10 text-[#BFDBF7]/70 hover:text-[#BFDBF7]',
  danger: 'bg-[#1F7A8C]/80 hover:bg-[#1F7A8C] text-white border border-[#1F7A8C]',
  cream: 'bg-[#BFDBF7] hover:bg-[#A8C8E8] text-[#1F7A8C] font-semibold',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-2xl',
  xl: 'px-10 py-[18px] text-lg rounded-2xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer select-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
      )}
    </motion.button>
  );
}
