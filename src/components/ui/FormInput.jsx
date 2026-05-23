import { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

const FormInput = forwardRef(({
  label,
  id,
  type = 'text',
  placeholder,
  error,
  hint,
  icon: Icon,
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#BFDBF7]/80">
          {label}
          {required && <span className="text-[#E1E5F2] ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1F7A8C]/70 pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          placeholder={placeholder}
          className={cn(
            'w-full bg-[#033A4E]/80 border rounded-xl px-4 py-3 text-[#BFDBF7] placeholder-[#BFDBF7]/30',
            'transition-all duration-200 outline-none text-sm',
            'focus:border-[#1F7A8C] focus:ring-2 focus:ring-[#1F7A8C]/20',
            Icon && 'pl-10',
            error
              ? 'border-[#1F7A8C] ring-2 ring-[#1F7A8C]/20'
              : 'border-[#1F7A8C]/20 hover:border-[#1F7A8C]/40',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-[#BFDBF7]/60 flex items-center gap-1">
          <span className="text-[#1F7A8C]">⚠</span> {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-[#BFDBF7]/40">{hint}</p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export function FormSelect({ label, id, options = [], error, icon: Icon, required = false, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#BFDBF7]/80">
          {label}
          {required && <span className="text-[#E1E5F2] ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1F7A8C]/70 pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <select
          id={id}
          className={cn(
            'w-full bg-[#033A4E]/80 border rounded-xl px-4 py-3 text-[#BFDBF7]',
            'transition-all duration-200 outline-none text-sm appearance-none cursor-pointer',
            'focus:border-[#1F7A8C] focus:ring-2 focus:ring-[#1F7A8C]/20',
            Icon && 'pl-10',
            error
              ? 'border-[#1F7A8C] ring-2 ring-[#1F7A8C]/20'
              : 'border-[#1F7A8C]/20 hover:border-[#1F7A8C]/40',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt} className="bg-[#033A4E]">
              {opt.label ?? opt}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#1F7A8C]/70">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 8L1 3h10L6 8z" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-[#BFDBF7]/60"><span className="text-[#1F7A8C]">⚠</span> {error}</p>}
    </div>
  );
}

export function FormTextarea({ label, id, error, required = false, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#BFDBF7]/80">
          {label}
          {required && <span className="text-[#E1E5F2] ml-1">*</span>}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          'w-full bg-[#033A4E]/80 border rounded-xl px-4 py-3 text-[#BFDBF7] placeholder-[#BFDBF7]/30',
          'transition-all duration-200 outline-none text-sm resize-none',
          'focus:border-[#1F7A8C] focus:ring-2 focus:ring-[#1F7A8C]/20',
          error
            ? 'border-[#1F7A8C] ring-2 ring-[#1F7A8C]/20'
            : 'border-[#1F7A8C]/20 hover:border-[#1F7A8C]/40',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[#BFDBF7]/60"><span className="text-[#1F7A8C]">⚠</span> {error}</p>}
    </div>
  );
}

export default FormInput;
