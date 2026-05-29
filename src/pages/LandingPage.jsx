import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Heart, ArrowRight, Zap, Clock, ShieldCheck, MapPin, Bell,
  Users, Droplets, Star
} from 'lucide-react';
import { features } from '../data/mockData';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };
const ICON_MAP = { Zap, Clock, ShieldCheck, MapPin, Bell, Heart };

export default function LandingPage() {
  const [dbStats, setDbStats] = useState({
    totalDonors: '—',
    livesSaved: '—',
    citiesCovered: '48+',
    avgResponseTime: '—'
  });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setDbStats(data))
      .catch(console.error);
  }, []);

  return (
    <div className="bg-gradient-hero dot-grid">

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left copy */}
            <motion.div variants={stagger} initial="hidden" animate="visible" className="text-center lg:text-left">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1F7A8C]/15 border border-[#1F7A8C]/30 text-sm text-[#BFDBF7] font-medium mb-8">
                <span className="w-2 h-2 bg-[#1F7A8C] rounded-full animate-pulse" />
                Emergency blood network — live 24/7
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display leading-tight mb-6 text-white">
                Every Second<br />
                <span className="gradient-text">Saves a Life</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-[#BFDBF7]/65 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                A real-time platform connecting patients in critical need with verified blood donors across India. Fast, trusted, and free.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/find-donors"
                  className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#1F7A8C] hover:bg-[#155E70] text-white font-bold text-base rounded-2xl transition-all shadow-xl shadow-[#1F7A8C]/30 hover:-translate-y-0.5"
                >
                  <Droplets size={18} className="group-hover:scale-110 transition-transform" />
                  Find Donors Now
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 border-2 border-[#BFDBF7]/30 hover:border-[#BFDBF7] text-[#BFDBF7] font-bold text-base rounded-2xl transition-all hover:-translate-y-0.5"
                >
                  <Heart size={18} />
                  Become a Donor
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-6 mt-10 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {['D', 'O', 'N', 'O', 'R'].map((l, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-[#1F7A8C] border-2 border-[#022B3A] flex items-center justify-center text-xs font-bold text-white">
                      {l}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#BFDBF7]/50">Thousands of verified donors ready to help</p>
              </motion.div>
            </motion.div>

            {/* Right — Demo card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative hidden lg:flex flex-col gap-4 max-w-md ml-auto"
            >
              {/* Emergency card */}
              <div className="glass rounded-3xl p-6 shadow-2xl">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-xs text-[#BFDBF7]/40 mb-1 uppercase tracking-wider">Emergency Request</p>
                    <h3 className="text-xl font-bold text-white">Critical Blood Needed</h3>
                    <p className="text-sm text-[#BFDBF7]/60 mt-1 flex items-center gap-1.5">
                      <MapPin size={12} /> City Hospital — Urgent
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-[#1F7A8C] rounded-2xl flex items-center justify-center shadow-lg float-anim">
                    <Droplets size={22} className="text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Units Needed', value: '2' },
                    { label: 'Urgency', value: 'Critical' },
                    { label: 'Response', value: '<5 min' },
                  ].map(item => (
                    <div key={item.label} className="bg-[#1F7A8C]/10 rounded-xl p-3 text-center border border-[#1F7A8C]/15">
                      <p className="text-base font-bold text-white">{item.value}</p>
                      <p className="text-xs text-[#BFDBF7]/40 mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
                <div className="w-full py-3 bg-[#1F7A8C] rounded-xl text-center text-white text-sm font-semibold">
                  Match donors instantly →
                </div>
              </div>

              {/* Floating stat */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="self-start glass-pale rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E1E5F2]/10 rounded-xl flex items-center justify-center">
                    <Users size={18} className="text-[#E1E5F2]" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">24/7</p>
                    <p className="text-xs text-[#BFDBF7]/50">Always Available</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="self-end glass-lavender rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1F7A8C]/20 rounded-xl flex items-center justify-center">
                    <Zap size={18} className="text-[#BFDBF7]" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">Fast</p>
                    <p className="text-xs text-[#BFDBF7]/50">Avg. Match Time</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────── */}
      <section className="py-20 border-y border-[#1F7A8C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { value: dbStats.totalDonors, label: 'Verified Donors', icon: Users, color: '#1F7A8C' },
              { value: dbStats.livesSaved, label: 'Lives Saved', icon: Heart, color: '#BFDBF7' },
              { value: dbStats.citiesCovered, label: 'Cities Covered', icon: MapPin, color: '#E1E5F2' },
              { value: dbStats.avgResponseTime, label: 'Avg. Response Time', icon: Zap, color: '#22909F' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label} custom={i} variants={fadeUp}
                className="bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl p-6 text-center group hover:border-[#1F7A8C]/35 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ background: `${stat.color}20`, border: `1px solid ${stat.color}30` }}>
                  <stat.icon size={22} style={{ color: stat.color }} />
                </div>
                <p className="text-3xl font-bold text-white font-display mb-1">{stat.value}</p>
                <p className="text-sm text-[#BFDBF7]/50">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
          <p className="text-center text-xs text-[#BFDBF7]/30 mt-6">Live statistics pulled from the database once connected.</p>
        </div>
      </section>

      {/* ── AWARENESS ────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E1E5F2]/10 border border-[#E1E5F2]/20 text-xs text-[#E1E5F2] font-medium mb-6">
                <Heart size={12} /> Blood Donation Awareness
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold font-display text-white mb-6">
                One Donation,<br />
                <span className="text-[#BFDBF7]">Three Lives</span> Saved
              </h2>
              <p className="text-[#BFDBF7]/55 leading-relaxed mb-8">
                A single blood donation can save up to three lives. In India, 40,000 units of blood are needed every day. Yet, only 7% of eligible people donate. Your decision to donate today can pull someone's family back from the edge of despair.
              </p>
              <div className="space-y-4">
                {[
                  { stat: '1 in 3', text: 'people will need a blood transfusion in their lifetime' },
                  { stat: '90 days', text: 'is the safe window — you can donate again after 3 months' },
                  { stat: '450 ml', text: 'is all it takes — a single donation that changes everything' },
                ].map(item => (
                  <div key={item.stat} className="flex items-center gap-4 p-4 rounded-xl bg-[#1F7A8C]/08 border border-[#1F7A8C]/15">
                    <div className="text-2xl font-bold text-[#1F7A8C] font-display flex-shrink-0 w-20">{item.stat}</div>
                    <p className="text-sm text-[#BFDBF7]/60">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 glass rounded-2xl p-6">
                  <p className="text-sm text-[#BFDBF7]/50 mb-4 font-medium">All Blood Groups Accepted</p>
                  <div className="grid grid-cols-4 gap-2">
                    {['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'].map(g => (
                      <div key={g} className="bg-[#1F7A8C]/15 border border-[#1F7A8C]/25 rounded-xl py-3 text-center">
                        <span className="text-sm font-bold text-white">{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-pale rounded-2xl p-6">
                  <p className="text-3xl font-bold text-white font-display">24/7</p>
                  <p className="text-sm text-[#BFDBF7]/50 mt-1">Emergency Support</p>
                </div>
                <div className="glass-lavender rounded-2xl p-6">
                  <p className="text-3xl font-bold text-white font-display">Free</p>
                  <p className="text-sm text-[#BFDBF7]/50 mt-1">Zero Platform Fee</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section className="py-24 border-b border-[#1F7A8C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-display text-white mb-4">
              How <span className="text-[#BFDBF7]">BloodLink</span> Works
            </h2>
            <p className="text-[#BFDBF7]/50">A simple, transparent process to save a life</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-[#1F7A8C]/40 to-transparent" />
            {[
              { step: '01', title: 'Request Posted', desc: 'Patient or hospital posts a verified emergency request.', icon: Bell },
              { step: '02', title: 'Instant Alert', desc: 'Nearby matching donors receive immediate notifications.', icon: Zap },
              { step: '03', title: 'Donor Accepts', desc: 'An available donor confirms and proceeds to donate.', icon: ShieldCheck },
              { step: '04', title: 'Life Saved', desc: 'Blood is donated, request fulfilled, and a life is saved.', icon: Heart },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative text-center group"
              >
                <div className="w-16 h-16 mx-auto bg-[#033A4E] border-2 border-[#1F7A8C]/30 rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:bg-[#1F7A8C]/20 group-hover:border-[#1F7A8C] transition-all duration-300 shadow-xl">
                  <s.icon size={24} className="text-[#BFDBF7]" />
                </div>
                <div className="text-4xl font-black font-display text-[#1F7A8C]/10 absolute top-0 left-1/2 -translate-x-1/2 -z-10 group-hover:text-[#1F7A8C]/20 transition-colors">
                  {s.step}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-[#BFDBF7]/50 px-2">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section className="py-24 bg-[#011E28]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1F7A8C]/12 border border-[#1F7A8C]/20 text-xs text-[#BFDBF7] font-medium mb-5">
              Platform Features
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold font-display text-white mb-4">
              Built for <span className="gradient-text">Emergencies</span>
            </h2>
            <p className="text-[#BFDBF7]/50 max-w-xl mx-auto">
              Every feature is designed with one goal — getting the right blood to the right patient as fast as possible.
            </p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => {
              const Icon = ICON_MAP[feature.icon] || Heart;
              return (
                <motion.div
                  key={feature.title} custom={i} variants={fadeUp}
                  className="group p-6 bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl hover:border-[#1F7A8C]/40 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1F7A8C]/05 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="w-12 h-12 bg-[#1F7A8C]/15 border border-[#1F7A8C]/25 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#1F7A8C]/25 transition-colors">
                      <Icon size={22} className="text-[#BFDBF7]" />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-[#BFDBF7]/50 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F7A8C] via-[#155E70] to-[#033A4E] p-12 text-center shadow-2xl shadow-[#1F7A8C]/20"
          >
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#BFDBF7]/08 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#E1E5F2]/05 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart size={32} className="text-white fill-white" />
              </div>
              <h2 className="text-4xl font-bold font-display text-white mb-4">Ready to Save a Life?</h2>
              <p className="text-[#BFDBF7]/70 text-lg mb-8 max-w-xl mx-auto">
                Join our donor network. Registration takes under 2 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white hover:bg-[#E1E5F2] text-[#022B3A] font-bold rounded-2xl transition-all hover:-translate-y-0.5 shadow-lg"
                >
                  Register as Donor
                </Link>
                <Link
                  to="/request-blood"
                  className="px-8 py-4 bg-transparent border-2 border-white/40 hover:border-white text-white font-bold rounded-2xl transition-all hover:-translate-y-0.5"
                >
                  Request Emergency Blood
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
