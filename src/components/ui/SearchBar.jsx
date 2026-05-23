import { Search, X } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar({
  placeholder = 'Search...',
  value,
  onChange,
  onClear,
  className = '',
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div className={`
        flex items-center gap-3 bg-[#033A4E]/80 border rounded-xl px-4 py-3
        transition-all duration-200
        ${focused
          ? 'border-[#1F7A8C] ring-2 ring-[#1F7A8C]/20'
          : 'border-[#1F7A8C]/20 hover:border-[#1F7A8C]/40'}
      `}>
        <Search size={16} className={`flex-shrink-0 transition-colors ${focused ? 'text-[#1F7A8C]' : 'text-[#BFDBF7]/30'}`} />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-sm text-[#BFDBF7] placeholder-[#BFDBF7]/30 outline-none"
          aria-label={placeholder}
        />
        {value && (
          <button
            onClick={onClear}
            aria-label="Clear search"
            className="text-[#BFDBF7]/30 hover:text-[#BFDBF7]/70 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
