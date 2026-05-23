import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Heart, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import FormInput from '../components/ui/FormInput';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    login(form);
    toast.success('Welcome back! 🩸', { style: { background: '#033A4E', color: '#BFDBF7', border: '1px solid #1F7A8C' } });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-[#022B3A]">
      {/* Left — Illustration panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#1F7A8C] via-[#155E70] to-[#022B3A] flex-col items-center justify-center p-12">
        {/* Decoration circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#BFDBF7]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E1E5F2]/10 rounded-full blur-3xl" />

        <div className="relative text-center max-w-sm">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="w-12 h-12 bg-[#BFDBF7]/10 rounded-2xl flex items-center justify-center border border-[#BFDBF7]/20">
              <Heart size={24} className="text-[#BFDBF7] fill-[#BFDBF7]" />
            </div>
            <span className="text-2xl font-bold font-display text-[#BFDBF7]">BloodLink</span>
          </div>

          {/* Hero illustration placeholder */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-48 h-48 mx-auto mb-10 relative"
          >
            <div className="absolute inset-0 bg-[#BFDBF7]/05 rounded-full blur-2xl" />
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="text-8xl">🩸</div>
            </div>
          </motion.div>

          <h2 className="text-3xl font-bold font-display text-[#BFDBF7] mb-4">
            Welcome Back, Hero
          </h2>
          <p className="text-[#BFDBF7]/60 text-sm leading-relaxed">
            Your community needs you. Sign in to check nearby requests, update your availability, and save lives today.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-10">
            {[
              { value: '234', label: 'Active Requests' },
              { value: '4.2 min', label: 'Avg Response' },
            ].map(s => (
              <div key={s.label} className="bg-[#BFDBF7]/05 border border-[#BFDBF7]/10 rounded-2xl p-4">
                <p className="text-2xl font-bold text-[#BFDBF7] font-display">{s.value}</p>
                <p className="text-xs text-[#BFDBF7]/50 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-[#1F7A8C] rounded-xl flex items-center justify-center">
              <Heart size={16} className="text-[#BFDBF7] fill-[#BFDBF7]" />
            </div>
            <span className="text-xl font-bold font-display text-[#BFDBF7]">Blood<span className="text-[#BFDBF7]">Link</span></span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold font-display text-[#BFDBF7] mb-2">Sign In</h1>
            <p className="text-[#BFDBF7]/50 text-sm">Don't have an account? <Link to="/register" className="text-[#BFDBF7] hover:text-[#E1E5F2] font-medium transition-colors">Create one</Link></p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <FormInput
              label="Email Address"
              id="email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={form.email}
              onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }}
              error={errors.email}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-sm font-medium text-[#BFDBF7]/80">
                  Password <span className="text-[#E1E5F2]">*</span>
                </label>
                <Link to="#" className="text-xs text-[#BFDBF7] hover:text-[#E1E5F2] transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1F7A8C]/70">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }}
                  className={`w-full bg-[#033A4E]/80 border rounded-xl pl-10 pr-10 py-3 text-[#BFDBF7] placeholder-[#BFDBF7]/30 text-sm outline-none transition-all ${
                    errors.password ? 'border-[#1F7A8C] ring-2 ring-[#1F7A8C]/20' : 'border-[#1F7A8C]/20 hover:border-[#1F7A8C]/40 focus:border-[#1F7A8C] focus:ring-2 focus:ring-[#1F7A8C]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#BFDBF7]/30 hover:text-[#BFDBF7]/60 transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-[#BFDBF7]/60 mt-1.5"><span className="text-[#1F7A8C]">⚠</span> {errors.password}</p>}
            </div>

            <div className="flex items-center gap-3">
              <input
                id="remember"
                type="checkbox"
                checked={form.remember}
                onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
                className="w-4 h-4 rounded border-[#1F7A8C]/30 bg-[#033A4E] accent-[#1F7A8C] cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-[#BFDBF7]/60 cursor-pointer">Remember me for 30 days</label>
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading} icon={ArrowRight} iconPosition="right">
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#1F7A8C]/15" />
            <span className="text-xs text-[#BFDBF7]/30">or continue with</span>
            <div className="flex-1 h-px bg-[#1F7A8C]/15" />
          </div>

          {/* Social placeholders */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Google', emoji: '🔵' },
              { label: 'GitHub', emoji: '⚫' },
            ].map(s => (
              <button
                key={s.label}
                type="button"
                onClick={() => toast('Social login coming soon!', { icon: '🔗', style: { background: '#033A4E', color: '#BFDBF7', border: '1px solid #1F7A8C' } })}
                className="flex items-center justify-center gap-2.5 py-3 border border-[#1F7A8C]/20 rounded-xl text-sm text-[#BFDBF7]/60 hover:text-[#BFDBF7] hover:border-[#1F7A8C]/40 hover:bg-[#1F7A8C]/05 transition-all"
              >
                <span>{s.emoji}</span> {s.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
