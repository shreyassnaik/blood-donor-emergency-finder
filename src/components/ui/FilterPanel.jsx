import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function FilterPanel({ filters = [], onFilterChange, activeFilters = {}, className = '' }) {
  const [open, setOpen] = useState(false);

  const activeCount = Object.values(activeFilters).filter(v => v && v !== 'all').length;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`
          flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200
          ${open || activeCount > 0
            ? 'bg-[#1F7A8C]/20 border-[#1F7A8C] text-[#BFDBF7]'
            : 'bg-[#033A4E]/80 border-[#1F7A8C]/20 text-[#BFDBF7]/60 hover:border-[#1F7A8C]/40 hover:text-[#BFDBF7]/80'}
        `}
        aria-expanded={open}
        aria-label="Toggle filters"
      >
        <Filter size={15} />
        Filters
        {activeCount > 0 && (
          <span className="bg-[#1F7A8C] text-[#BFDBF7] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {activeCount}
          </span>
        )}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full mt-2 z-30 bg-[#033A4E] border border-[#1F7A8C]/20 rounded-2xl p-5 shadow-2xl shadow-black/50 min-w-72"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#BFDBF7]">Filter By</h3>
              {activeCount > 0 && (
                <button
                  onClick={() => {
                    filters.forEach(f => onFilterChange(f.key, 'all'));
                  }}
                  className="text-xs text-[#BFDBF7] hover:text-[#E1E5F2] transition-colors flex items-center gap-1"
                >
                  <X size={12} /> Clear all
                </button>
              )}
            </div>

            <div className="space-y-5">
              {filters.map((filter) => (
                <div key={filter.key}>
                  <p className="text-xs text-[#BFDBF7]/50 mb-2 font-medium uppercase tracking-wider">{filter.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {[{ value: 'all', label: 'All' }, ...filter.options].map((opt) => {
                      const val = opt.value ?? opt;
                      const lbl = opt.label ?? opt;
                      const active = (activeFilters[filter.key] || 'all') === val;
                      return (
                        <button
                          key={val}
                          onClick={() => onFilterChange(filter.key, val)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                            active
                              ? 'bg-[#1F7A8C] text-[#BFDBF7] shadow-sm'
                              : 'bg-[#1F7A8C]/10 text-[#BFDBF7]/50 hover:bg-[#1F7A8C]/20 hover:text-[#BFDBF7]/80 border border-[#1F7A8C]/15'
                          }`}
                        >
                          {lbl}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
