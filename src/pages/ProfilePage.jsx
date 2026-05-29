import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Droplets, Edit3, Save, X,
  Camera, Clock, Award, Heart, ToggleLeft, ToggleRight, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import FormInput, { FormSelect } from '../components/ui/FormInput';
import Button from '../components/ui/Button';
import { BLOOD_GROUPS, CITIES } from '../data/mockData';
import { formatDate, canDonateAgain, daysSinceDonation } from '../utils/helpers';

export default function ProfilePage() {
  const { user, updateProfile, toggleAvailability } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  // Replace with API data: GET /api/donations/history
  const donationHistory = [];

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    updateProfile(form);
    setSaving(false);
    setEditing(false);
    toast.success('Profile updated!', { style: { background: '#033A4E', color: '#BFDBF7', border: '1px solid #1F7A8C' } });
  };

  const handleCancel = () => {
    setForm({ ...user });
    setEditing(false);
  };

  const canDonate = canDonateAgain(user?.last_donation);
  const daysSince = daysSinceDonation(user?.last_donation);

  const tabs = [
    { id: 'info', label: 'Profile Info' },
    { id: 'history', label: 'Donation History' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 pb-12">
      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#1F7A8C] via-[#155E70] to-[#022B3A] rounded-3xl p-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#BFDBF7]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#E1E5F2]/08 rounded-full blur-3xl" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative group cursor-pointer flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-[#BFDBF7]/15 border-2 border-[#BFDBF7]/25 flex items-center justify-center text-3xl font-bold text-[#BFDBF7] shadow-xl">
              {user?.name?.charAt(0)}
            </div>
            <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={20} className="text-white" />
            </div>
            <div className={`absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full border-2 border-[#022B3A] ${user?.available ? 'bg-[#E1E5F2]' : 'bg-[#1F7A8C]/40'}`} />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold font-display text-[#BFDBF7] mb-1">{user?.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-[#BFDBF7]/60">
              <span className="flex items-center gap-1"><Mail size={13} /> {user?.email}</span>
              <span className="flex items-center gap-1"><MapPin size={13} /> {user?.city}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="px-3 py-1.5 bg-[#BFDBF7]/10 border border-[#BFDBF7]/15 rounded-xl text-sm font-bold text-[#BFDBF7]">
                {user?.blood_group}
              </span>
              <span className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${
                user?.available
                  ? 'bg-[#E1E5F2]/20 border-[#E1E5F2]/30 text-[#E1E5F2]'
                  : 'bg-[#1F7A8C]/20 border-[#1F7A8C]/30 text-[#BFDBF7]/50'
              }`}>
                {user?.available ? '● Available to Donate' : '○ Currently Unavailable'}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 sm:gap-6 flex-shrink-0">
            {[
              { value: user?.donation_count, label: 'Donations', icon: Droplets },
              { value: user?.donation_count * 3, label: 'Lives Saved', icon: Heart },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-[#BFDBF7] font-display">{s.value}</p>
                <p className="text-xs text-[#BFDBF7]/50 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Profile completion bar */}
        <div className="relative mt-6 pt-5 border-t border-[#BFDBF7]/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#BFDBF7]/50">Profile Completion</span>
            <span className="text-xs font-bold text-[#BFDBF7]/70">{user?.profile_completion}%</span>
          </div>
          <div className="h-1.5 bg-[#BFDBF7]/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${user?.profile_completion}%` }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-full bg-[#BFDBF7]/60 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[#1F7A8C] text-[#BFDBF7] shadow-md'
                : 'text-[#BFDBF7]/50 hover:text-[#BFDBF7] hover:bg-[#1F7A8C]/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Info Tab */}
      {activeTab === 'info' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-[#BFDBF7]">Personal Information</h2>
              {!editing ? (
                <Button variant="ghost" size="sm" icon={Edit3} onClick={() => setEditing(true)}>Edit</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" icon={X} onClick={handleCancel}>Cancel</Button>
                  <Button size="sm" icon={Save} loading={saving} onClick={handleSave}>Save</Button>
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {editing ? (
                <>
                  <FormInput label="Full Name" id="p-name" icon={User} value={form.name} onChange={e => set('name', e.target.value)} />
                  <FormInput label="Email" id="p-email" type="email" icon={Mail} value={form.email} onChange={e => set('email', e.target.value)} />
                  <FormInput label="Phone" id="p-phone" type="tel" icon={Phone} value={form.phone} onChange={e => set('phone', e.target.value)} />
                  <FormSelect label="City" id="p-city" icon={MapPin}
                    options={CITIES.map(c => ({ value: c, label: c }))}
                    value={form.city} onChange={e => set('city', e.target.value)} />
                  <FormInput label="Age" id="p-age" type="number" icon={User} value={form.age} onChange={e => set('age', e.target.value)} />
                  <FormInput label="Weight (kg)" id="p-weight" type="number" icon={User} value={form.weight} onChange={e => set('weight', e.target.value)} />
                </>
              ) : (
                <>
                  {[
                    { icon: User, label: 'Full Name', value: user?.name },
                    { icon: Mail, label: 'Email', value: user?.email },
                    { icon: Phone, label: 'Phone', value: user?.phone },
                    { icon: MapPin, label: 'City', value: user?.city },
                    { icon: User, label: 'Age', value: `${user?.age} years` },
                    { icon: User, label: 'Weight', value: `${user?.weight} kg` },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#1F7A8C]/05 border border-[#1F7A8C]/10">
                      <item.icon size={16} className="text-[#1F7A8C] flex-shrink-0" />
                      <div>
                        <p className="text-xs text-[#BFDBF7]/40">{item.label}</p>
                        <p className="text-sm font-medium text-[#BFDBF7]/80">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Blood group (non-editable) */}
            <div className="mt-5 pt-5 border-t border-[#1F7A8C]/10">
              <div className="flex items-center gap-3">
                <Droplets size={16} className="text-[#1F7A8C]" />
                <div>
                  <p className="text-xs text-[#BFDBF7]/40">Blood Group</p>
                  <p className="text-sm font-bold text-[#BFDBF7]">{user?.blood_group}</p>
                </div>
                <div className="ml-4 text-xs text-[#BFDBF7]/30 flex items-center gap-1">
                  <Shield size={11} /> Verified · Cannot be changed after registration
                </div>
              </div>
            </div>
          </div>

          {/* Donation Eligibility */}
          <div className={`mt-4 p-5 rounded-2xl border ${canDonate ? 'bg-[#E1E5F2]/08 border-[#E1E5F2]/20' : 'bg-[#1F7A8C]/08 border-[#1F7A8C]/20'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${canDonate ? 'bg-[#E1E5F2]/15' : 'bg-[#1F7A8C]/15'}`}>
                <Clock size={18} className={canDonate ? 'text-[#E1E5F2]' : 'text-[#1F7A8C]'} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${canDonate ? 'text-[#E1E5F2]' : 'text-[#BFDBF7]/70'}`}>
                  {canDonate ? '✓ Eligible to Donate' : '⏳ Recovery Period Active'}
                </p>
                <p className="text-xs text-[#BFDBF7]/40 mt-0.5">
                  {canDonate
                    ? `Last donated ${daysSince} days ago. You can donate again!`
                    : `Last donated ${daysSince} days ago. Wait ${90 - (daysSince ?? 0)} more days.`
                  }
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'history' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white">Donation History</h2>
              <span className="text-xs text-[#BFDBF7]/40">{donationHistory.length} records</span>
            </div>
            {donationHistory.length > 0 ? (
              <div className="space-y-3">
                {donationHistory.map((d, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[#1F7A8C]/05 border border-[#1F7A8C]/10 hover:border-[#1F7A8C]/20 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#1F7A8C]/20 flex items-center justify-center flex-shrink-0">
                      <Droplets size={16} className="text-[#1F7A8C]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#BFDBF7]/80">{d.hospital}</p>
                      <p className="text-xs text-[#BFDBF7]/40">{formatDate(d.date)} · {d.blood_group}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-[#E1E5F2]">✓ Completed</p>
                      <p className="text-xs text-[#BFDBF7]/30 mt-0.5">1 unit</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#1F7A8C]/10 border border-[#1F7A8C]/15 flex items-center justify-center mb-4">
                  <Droplets size={22} className="text-[#1F7A8C]/40" />
                </div>
                <p className="text-sm text-[#BFDBF7]/40 mb-1">No donation history yet</p>
                <p className="text-xs text-[#BFDBF7]/25">Your records will appear here once connected to the backend</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Availability */}
          <div className="bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-[#BFDBF7] mb-4">Availability Settings</h2>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#1F7A8C]/08 border border-[#1F7A8C]/12">
              <div>
                <p className="text-sm font-medium text-[#BFDBF7]/80">Available to Donate</p>
                <p className="text-xs text-[#BFDBF7]/40 mt-0.5">Toggle your availability for emergency requests</p>
              </div>
              <button onClick={toggleAvailability} className="text-[#1F7A8C] hover:text-[#22909F] transition-colors" aria-label="Toggle availability">
                {user?.available
                  ? <ToggleRight size={36} className="text-[#E1E5F2]" />
                  : <ToggleLeft size={36} />
                }
              </button>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-[#BFDBF7] mb-4">Notification Preferences</h2>
            <div className="space-y-3">
              {[
                { label: 'Emergency Alerts', desc: 'Get notified for critical blood requests nearby', enabled: true },
                { label: 'Donation Reminders', desc: 'Reminders when you are eligible to donate again', enabled: true },
                { label: 'Weekly Summary', desc: 'Weekly digest of donations in your city', enabled: false },
              ].map((pref, i) => (
                <div key={pref.label} className="flex items-center justify-between p-3.5 rounded-xl bg-[#1F7A8C]/05 border border-[#1F7A8C]/08">
                  <div>
                    <p className="text-sm font-medium text-[#BFDBF7]/80">{pref.label}</p>
                    <p className="text-xs text-[#BFDBF7]/40 mt-0.5">{pref.desc}</p>
                  </div>
                  <div className={`w-10 h-6 rounded-full border-2 transition-all cursor-pointer flex items-center ${
                    pref.enabled ? 'bg-[#E1E5F2]/20 border-[#E1E5F2]/40 justify-end' : 'bg-[#1F7A8C]/10 border-[#1F7A8C]/20 justify-start'
                  }`}>
                    <div className={`w-4 h-4 rounded-full mx-0.5 ${pref.enabled ? 'bg-[#E1E5F2]' : 'bg-[#1F7A8C]/40'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
