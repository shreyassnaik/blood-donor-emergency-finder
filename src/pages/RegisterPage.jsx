import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, Droplets, Heart, Eye, EyeOff, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import FormInput, { FormSelect } from '../components/ui/FormInput';
import Button from '../components/ui/Button';
import { BLOOD_GROUPS, CITIES } from '../data/mockData';

const STEPS = ['Account', 'Personal', 'Donor Info'];

export default function RegisterPage() {
  const { login, registerUser } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', bloodGroup: '', city: '', role: 'donor',
  });
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validateStep = () => {
    const errs = {};
    if (step === 0) {
      if (!form.name.trim()) errs.name = 'Full name is required';
      if (!form.email) errs.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
      if (!form.password) errs.password = 'Password required';
      else if (form.password.length < 8) errs.password = 'Min 8 characters';
      if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    }
    if (step === 1) {
      if (!form.phone) errs.phone = 'Phone number required';
      else if (!/^\+?[\d\s-]{10,}$/.test(form.phone)) errs.phone = 'Valid phone number required';
      if (!form.city) errs.city = 'City is required';
    }
    if (step === 2 && form.role === 'donor') {
      if (!form.bloodGroup) errs.bloodGroup = 'Blood group required';
    }
    return errs;
  };

  const nextStep = () => {
    const errs = validateStep();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    // If not a donor, skip Step 2 (Donor Info) and go straight to submit or summary
    if (step === 1 && form.role !== 'donor') {
      handleSubmit({ preventDefault: () => {} });
      return;
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStep();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    
    const userData = {
      email: form.email,
      password: form.password,
      role: form.role
    };

    const registerResult = await registerUser(userData);
    
    if (registerResult && registerResult.id) {
      if (form.role === 'donor') {
        await fetch('/api/donors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: registerResult.id,
            name: form.name,
            blood_group: form.bloodGroup,
            city: form.city,
            phone: form.phone,
            available: true
          })
        });
      } else if (form.role === 'hospital') {
        await fetch('/api/hospitals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: registerResult.id,
            name: form.name,
            city: form.city,
            phone: form.phone,
            address: `Located in ${form.city}`
          })
        });
      }

      const loginSuccess = await login(form.email, form.password);
      if (loginSuccess) {
        toast.success('Account created! Welcome to BloodLink 🩸', { style: { background: '#033A4E', color: '#BFDBF7', border: '1px solid #1F7A8C' } });
        navigate('/dashboard');
      }
    }
    setLoading(false);
  };

  const stepContent = [
    // Step 0 — Account
    <div key="0" className="space-y-5">
      <FormInput label="Full Name" id="name" placeholder="Arjun Mehta" icon={User}
        value={form.name} onChange={e => set('name', e.target.value)} error={errors.name} required />
      <FormInput label="Email Address" id="reg-email" type="email" placeholder="you@example.com" icon={Mail}
        value={form.email} onChange={e => set('email', e.target.value)} error={errors.email} required />
      <div className="relative">
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="reg-pw" className="text-sm font-medium text-[#BFDBF7]/80">Password <span className="text-[#E1E5F2]">*</span></label>
        </div>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1F7A8C]/70"><Lock size={16} /></div>
          <input id="reg-pw" type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters"
            value={form.password} onChange={e => set('password', e.target.value)}
            className={`w-full bg-[#033A4E]/80 border rounded-xl pl-10 pr-10 py-3 text-[#BFDBF7] placeholder-[#BFDBF7]/30 text-sm outline-none transition-all ${errors.password ? 'border-[#1F7A8C] ring-2 ring-[#1F7A8C]/20' : 'border-[#1F7A8C]/20 hover:border-[#1F7A8C]/40 focus:border-[#1F7A8C] focus:ring-2 focus:ring-[#1F7A8C]/20'}`} />
          <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#BFDBF7]/30 hover:text-[#BFDBF7]/60 transition-colors" aria-label="Toggle password">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-[#BFDBF7]/60 mt-1.5"><span className="text-[#1F7A8C]">⚠</span> {errors.password}</p>}
      </div>
      <FormInput label="Confirm Password" id="confirm-pw" type={showPw ? 'text' : 'password'} placeholder="Repeat password" icon={Lock}
        value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} error={errors.confirmPassword} required />
    </div>,

    // Step 1 — Personal
    <div key="1" className="space-y-5">
      <FormInput label="Phone Number" id="phone" type="tel" placeholder="+91 98765 43210" icon={Phone}
        value={form.phone} onChange={e => set('phone', e.target.value)} error={errors.phone} required />
      <FormSelect label="City" id="city" icon={MapPin}
        options={[{ value: '', label: 'Select your city' }, ...CITIES.map(c => ({ value: c, label: c }))]}
        value={form.city} onChange={e => set('city', e.target.value)} error={errors.city} required />
      <div>
        <p className="text-sm font-medium text-[#BFDBF7]/80 mb-3">I am registering as <span className="text-[#E1E5F2]">*</span></p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'donor', label: 'Donor', emoji: '🩸', desc: 'Save lives' },
            { value: 'hospital', label: 'Hospital', emoji: '🏥', desc: 'Medical facility' },
            { value: 'requester', label: 'Recipient', emoji: '🤝', desc: 'Need blood' },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set('role', opt.value)}
              className={`p-3 rounded-2xl border-2 text-left transition-all ${
                form.role === opt.value
                  ? 'border-[#1F7A8C] bg-[#1F7A8C]/15'
                  : 'border-[#1F7A8C]/15 hover:border-[#1F7A8C]/35 bg-[#033A4E]/60'
              }`}
            >
              <div className="text-xl mb-1">{opt.emoji}</div>
              <p className="text-xs font-semibold text-[#BFDBF7]">{opt.label}</p>
              <p className="text-[10px] text-[#BFDBF7]/50 mt-0.5 leading-tight">{opt.desc}</p>
              {form.role === opt.value && (
                <div className="mt-1 w-4 h-4 bg-[#1F7A8C] rounded-full flex items-center justify-center">
                  <Check size={10} className="text-[#BFDBF7]" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>,

    // Step 2 — Donor Info
    <div key="2" className="space-y-5">
      <div>
        <p className="text-sm font-medium text-[#BFDBF7]/80 mb-3">Blood Group <span className="text-[#E1E5F2]">*</span></p>
        <div className="grid grid-cols-4 gap-2">
          {BLOOD_GROUPS.map(g => (
            <button
              key={g}
              type="button"
              onClick={() => set('bloodGroup', g)}
              className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                form.bloodGroup === g
                  ? 'border-[#1F7A8C] bg-[#1F7A8C] text-[#BFDBF7] shadow-lg shadow-[#1F7A8C40]'
                  : 'border-[#1F7A8C]/20 text-[#BFDBF7]/60 hover:border-[#1F7A8C]/50 hover:text-[#BFDBF7] bg-[#033A4E]/60'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        {errors.bloodGroup && <p className="text-xs text-[#BFDBF7]/60 mt-2"><span className="text-[#1F7A8C]">⚠</span> {errors.bloodGroup}</p>}
      </div>

      {/* Summary */}
      <div className="p-5 rounded-2xl bg-[#1F7A8C]/08 border border-[#1F7A8C]/15 space-y-2">
        <p className="text-xs text-[#BFDBF7]/40 uppercase tracking-wider mb-3 font-medium">Registration Summary</p>
        {[
          ['Name', form.name || '—'],
          ['Email', form.email || '—'],
          ['Phone', form.phone || '—'],
          ['City', form.city || '—'],
          ['Role', form.role === 'donor' ? 'Blood Donor' : 'Patient/Family'],
          ['Blood Group', form.bloodGroup || '—'],
        ].map(([label, val]) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="text-[#BFDBF7]/40">{label}</span>
            <span className="text-[#BFDBF7]/80 font-medium">{val}</span>
          </div>
        ))}
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen flex bg-[#022B3A]">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-[#1F7A8C] via-[#155E70] to-[#022B3A] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#BFDBF7]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E1E5F2]/08 rounded-full blur-3xl" />
        <div className="relative text-center max-w-xs">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 bg-[#BFDBF7]/10 rounded-2xl flex items-center justify-center border border-[#BFDBF7]/20">
              <Heart size={24} className="text-[#BFDBF7] fill-[#BFDBF7]" />
            </div>
            <span className="text-2xl font-bold font-display text-[#BFDBF7]">BloodLink</span>
          </div>
          <div className="text-7xl mb-8 float-anim">❤️</div>
          <h2 className="text-3xl font-bold font-display text-[#BFDBF7] mb-4">Join the Life-Saving Network</h2>
          <p className="text-[#BFDBF7]/60 text-sm leading-relaxed mb-10">
            2 minutes to sign up. A lifetime of impact. Every registered donor brings us closer to zero preventable blood-shortage deaths.
          </p>
          <div className="flex flex-col gap-3">
            {['✓ Instant emergency matching', '✓ Personal donation history', '✓ Real-time notifications', '✓ Verified donor badge'].map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-[#BFDBF7]/70">
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-[#1F7A8C] rounded-xl flex items-center justify-center">
              <Heart size={16} className="text-[#BFDBF7] fill-[#BFDBF7]" />
            </div>
            <span className="text-xl font-bold font-display text-[#BFDBF7]">Blood<span className="text-[#BFDBF7]">Link</span></span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold font-display text-[#BFDBF7] mb-2">Create Account</h1>
            <p className="text-[#BFDBF7]/50 text-sm">Already have one? <Link to="/login" className="text-[#BFDBF7] hover:text-[#E1E5F2] font-medium transition-colors">Sign in</Link></p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
                  i < step ? 'bg-[#E1E5F2] text-[#022B3A]' :
                  i === step ? 'bg-[#1F7A8C] text-[#BFDBF7] shadow-lg shadow-[#1F7A8C40]' :
                  'bg-[#1F7A8C]/15 text-[#BFDBF7]/30'
                }`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-[#BFDBF7]' : 'text-[#BFDBF7]/30'}`}>{s}</span>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-1 ${i < step ? 'bg-[#E1E5F2]/50' : 'bg-[#1F7A8C]/15'}`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={step < STEPS.length - 1 ? (e) => { e.preventDefault(); nextStep(); } : handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {stepContent[step]}
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <Button type="button" variant="ghost" size="lg" icon={ArrowLeft} onClick={() => setStep(s => s - 1)}>
                  Back
                </Button>
              )}
              {step < STEPS.length - 1 ? (
                <Button type="submit" fullWidth size="lg" icon={ArrowRight} iconPosition="right">
                  Continue
                </Button>
              ) : (
                <Button type="submit" fullWidth size="lg" loading={loading} icon={Heart} iconPosition="right">
                  Create Account
                </Button>
              )}
            </div>
          </form>

          <p className="text-xs text-[#BFDBF7]/30 text-center mt-6">
            By registering, you agree to our <a href="#" className="text-[#BFDBF7]/70 hover:text-[#BFDBF7]">Terms</a> and <a href="#" className="text-[#BFDBF7]/70 hover:text-[#BFDBF7]">Privacy Policy</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
