import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

export default function Card({ children, className = '', hover = false, glass = false, onClick }) {
  const base = cn(
    'rounded-2xl border transition-all duration-300',
    glass
      ? 'bg-[#1F7A8C]/05 backdrop-blur-xl border-[#1F7A8C]/15'
      : 'bg-[#033A4E]/60 border-[#1F7A8C]/15',
    hover && 'cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1F7A8C30] hover:border-[#1F7A8C]/30',
    className
  );

  if (onClick) {
    return (
      <motion.div
        className={base}
        onClick={onClick}
        whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(116,69,119,0.2)' }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={base}>{children}</div>;
}

export function StatsCard({ label, value, icon: Icon, trend, trendLabel, color = '#1F7A8C', delay = 0 }) {
  const isPositive = trend > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl p-5 relative overflow-hidden group hover:border-[#1F7A8C]/30 transition-all duration-300"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at top right, ${color}15 0%, transparent 60%)` }}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-[#BFDBF7]/50 font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-[#BFDBF7] font-display">{value}</p>
          {trend !== undefined && (
            <p className={`text-xs mt-2 font-medium ${isPositive ? 'text-[#E1E5F2]' : 'text-[#22909F]'}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className="p-3 rounded-xl"
            style={{ background: `${color}20`, border: `1px solid ${color}30` }}
          >
            <Icon size={22} style={{ color }} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function BloodGroupBadge({ group, size = 'md' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-12 h-12 text-sm', lg: 'w-16 h-16 text-base' };
  return (
    <div className={cn(
      'rounded-xl bg-[#1F7A8C] flex items-center justify-center font-bold text-[#BFDBF7] border border-[#22909F]/40 flex-shrink-0',
      sizes[size]
    )}>
      {group}
    </div>
  );
}
