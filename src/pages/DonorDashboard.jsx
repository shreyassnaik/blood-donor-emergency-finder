import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Droplets, Users, Award, Bell, Clock, MapPin,
  TrendingUp, Activity, Plus, CheckCircle, AlertCircle, ToggleLeft, ToggleRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useApp } from '../context/AppContext';
import { StatsCard } from '../components/ui/Card';
import Button from '../components/ui/Button';

/**
 * DonorDashboard
 *
 * All data (chartData, nearbyRequests, donationHistory) should be fetched
 * from your FastAPI backend once connected. Placeholders are shown below.
 *
 * Suggested endpoints:
 *   GET /api/donors/me             → user profile + stats
 *   GET /api/requests?nearby=true  → nearby blood requests
 *   GET /api/donations/history     → donor's donation history
 *   GET /api/notifications         → notifications list
 *   PATCH /api/donors/me/availability → toggle availability
 */

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#033A4E] border border-[#1F7A8C]/25 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-xs text-[#BFDBF7]/50 mb-1">{label}</p>
        <p className="text-sm font-bold text-[#BFDBF7]">{payload[0].value} donation{payload[0].value !== 1 ? 's' : ''}</p>
      </div>
    );
  }
  return null;
};

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function DonorDashboard() {
  const { user, toggleAvailability, notifications, markNotificationRead } = useApp();
  const [toggling, setToggling] = useState(false);

  // Replace with API data: GET /api/donations/history?chart=monthly
  const chartData = [];

  // Replace with API data: GET /api/requests?nearby=true&limit=5
  const nearbyRequests = [];

  // Replace with API data: GET /api/donations/history
  const donationHistory = [];

  const handleToggle = async () => {
    setToggling(true);
    await new Promise(r => setTimeout(r, 400));
    toggleAvailability();
    setToggling(false);
  };

  const EmptyState = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[#1F7A8C]/10 border border-[#1F7A8C]/15 flex items-center justify-center mb-3">
        <Droplets size={20} className="text-[#1F7A8C]/50" />
      </div>
      <p className="text-sm text-[#BFDBF7]/35">{message}</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <p className="text-sm text-[#BFDBF7]/40 mb-1">Welcome back 👋</p>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            {user?.name ?? 'Donor'}
          </h1>
          <p className="text-sm text-[#BFDBF7]/50 mt-1 flex items-center gap-1.5">
            {user?.city && <><MapPin size={13} className="text-[#1F7A8C]" /> {user.city}<span className="mx-2 text-[#1F7A8C]/30">·</span></>}
            {user?.bloodGroup && <span className="text-[#BFDBF7] font-semibold">{user.bloodGroup}</span>}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-5 py-3 bg-[#033A4E]/60 border border-[#1F7A8C]/20 rounded-2xl">
            <div className={`w-2.5 h-2.5 rounded-full transition-colors ${user?.available ? 'bg-[#E1E5F2] animate-pulse' : 'bg-[#1F7A8C]/40'}`} />
            <span className="text-sm text-[#BFDBF7]/70 font-medium">
              {user?.available ? 'Available' : 'Unavailable'}
            </span>
            <button
              onClick={handleToggle}
              disabled={toggling}
              aria-label="Toggle availability"
              className="text-[#1F7A8C] hover:text-[#22909F] transition-colors disabled:opacity-50"
            >
              {user?.available
                ? <ToggleRight size={28} className="text-[#E1E5F2]" />
                : <ToggleLeft size={28} />
              }
            </button>
          </div>
          <Link to="/request-blood">
            <Button icon={Plus} size="md">New Request</Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={fadeUp}>
          <StatsCard label="Total Donations" value={user?.donationCount ?? '—'} icon={Droplets} color="#1F7A8C" delay={0} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatsCard label="Lives Impacted" value={user?.donationCount ? user.donationCount * 3 : '—'} icon={Heart} color="#BFDBF7" delay={0.1} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatsCard label="Donor Rank" value={user?.rank ?? '—'} icon={Award} color="#E1E5F2" delay={0.2} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatsCard label="Profile Complete" value={user?.profileCompletion ? `${user.profileCompletion}%` : '—'} icon={Activity} color="#22909F" delay={0.3} />
        </motion.div>
      </motion.div>

      {/* Chart + Notifications */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-white">Donation Activity</h2>
              <p className="text-xs text-[#BFDBF7]/40 mt-0.5">Monthly history</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#BFDBF7]/40">
              <TrendingUp size={14} /> Connected to backend
            </div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="donationGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F7A8C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1F7A8C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F7A8C" strokeOpacity={0.08} />
                <XAxis dataKey="month" tick={{ fill: '#BFDBF7', opacity: 0.4, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#BFDBF7', opacity: 0.4, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#1F7A8C', strokeWidth: 1, strokeOpacity: 0.3 }} />
                <Area type="monotone" dataKey="donations" stroke="#1F7A8C" strokeWidth={2} fill="url(#donationGrad)" dot={{ fill: '#1F7A8C', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#BFDBF7' }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center">
              <p className="text-sm text-[#BFDBF7]/30">Chart data will load from the backend</p>
            </div>
          )}
        </motion.div>

        {/* Notifications Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Bell size={16} className="text-[#1F7A8C]" /> Notifications
            </h2>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="text-xs text-[#1F7A8C] bg-[#1F7A8C]/15 px-2 py-0.5 rounded-full font-medium">
                {notifications.filter(n => !n.read).length} new
              </span>
            )}
          </div>
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                    !n.read ? 'bg-[#1F7A8C]/08 border-[#1F7A8C]/20' : 'bg-transparent border-[#1F7A8C]/08 opacity-60'
                  } hover:border-[#1F7A8C]/30`}
                >
                  <p className="text-[#BFDBF7]/75 leading-relaxed">{n.message}</p>
                  <p className="text-[#BFDBF7]/30 mt-1">{n.time}</p>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState message="Notifications will appear here once connected to the backend" />
          )}
        </motion.div>
      </div>

      {/* Nearby Requests + History */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Nearby Requests</h2>
            <Link to="/find-donors" className="text-xs text-[#BFDBF7]/50 hover:text-[#BFDBF7] transition-colors">View all →</Link>
          </div>
          {nearbyRequests.length > 0 ? (
            <div className="space-y-3">
              {nearbyRequests.map(req => (
                <div key={req.id} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#1F7A8C]/05 border border-[#1F7A8C]/10 hover:border-[#1F7A8C]/25 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#1F7A8C] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {req.bloodGroup}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{req.hospital}</p>
                    <p className="text-xs text-[#BFDBF7]/40 flex items-center gap-1">
                      <MapPin size={10} /> {req.city}
                    </p>
                  </div>
                  <button className="text-xs bg-[#1F7A8C]/20 border border-[#1F7A8C]/30 text-[#BFDBF7]/80 px-2.5 py-1.5 rounded-lg hover:bg-[#1F7A8C]/40 transition-colors flex-shrink-0">
                    Respond
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="Nearby requests will load from the backend" />
          )}
        </motion.div>

        {/* Donation History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Donation History</h2>
            <span className="text-xs text-[#BFDBF7]/40">{donationHistory.length} records</span>
          </div>
          {donationHistory.length > 0 ? (
            <div className="space-y-3">
              {donationHistory.map((d, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1F7A8C]/05 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-[#E1E5F2]/10 border border-[#E1E5F2]/15 flex items-center justify-center flex-shrink-0">
                    <Droplets size={14} className="text-[#E1E5F2]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#BFDBF7]/80 truncate">{d.hospital}</p>
                    <p className="text-xs text-[#BFDBF7]/40">{d.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-[#BFDBF7]/70">{d.bloodGroup}</p>
                    <p className="text-xs text-[#E1E5F2] mt-0.5">✓ Done</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="Donation history will load from the backend" />
          )}

          {user?.profileCompletion != null && (
            <div className="mt-5 pt-4 border-t border-[#1F7A8C]/12">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#BFDBF7]/50">Profile Completion</span>
                <span className="text-xs font-bold text-[#BFDBF7]/70">{user.profileCompletion}%</span>
              </div>
              <div className="h-2 bg-[#1F7A8C]/15 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${user.profileCompletion}%` }}
                  transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-[#1F7A8C] to-[#BFDBF7] rounded-full"
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { to: '/find-donors', icon: Users, label: 'Find Donors', color: '#1F7A8C' },
          { to: '/request-blood', icon: AlertCircle, label: 'Emergency Request', color: '#22909F' },
          { to: '/profile', icon: Activity, label: 'Update Profile', color: '#BFDBF7' },
          { to: '#', icon: Clock, label: 'Donation Schedule', color: '#E1E5F2' },
        ].map(action => (
          <Link
            key={action.label}
            to={action.to}
            className="group p-4 bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl hover:border-[#1F7A8C]/30 hover:-translate-y-0.5 transition-all text-center"
          >
            <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
              style={{ background: `${action.color}15`, border: `1px solid ${action.color}25` }}>
              <action.icon size={18} style={{ color: action.color }} />
            </div>
            <p className="text-xs font-medium text-[#BFDBF7]/60 group-hover:text-[#BFDBF7] transition-colors">{action.label}</p>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
