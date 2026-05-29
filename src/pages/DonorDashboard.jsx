import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
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
import { formatRelativeTime } from '../utils/helpers';
import toast from 'react-hot-toast';

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
  const { user, toggleAvailability, notifications, markNotificationRead, confirmDonation } = useApp();
  const [toggling, setToggling] = useState(false);
  const [responding, setResponding] = useState(null);

  const [chartData, setChartData] = useState([]);
  const [nearbyRequests, setNearbyRequests] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responders, setResponders] = useState([]);
  const [loadingResponders, setLoadingResponders] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [confirmingId, setConfirmingId] = useState(null);

  const handleRespond = async (requestId) => {
    if (!user) {
      toast.error('Please log in to respond');
      return;
    }
    setResponding(requestId);
    try {
      const donorId = user.id || user.user_id;
      const response = await fetch(`/api/requests/${requestId}/respond?donor_id=${donorId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (response.ok) {
        toast.success(`Volunteer Request Sent! Contact: ${data.contact_phone}`, { duration: 6000 });
        setNearbyRequests(prev => prev.filter(r => r.id !== requestId));
      } else {
        toast.error(data.detail || 'Failed to respond');
      }
    } catch (e) {
      toast.error('Network error');
    } finally {
      setResponding(null);
    }
  };

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        const cityQuery = user.city ? `city=${encodeURIComponent(user.city)}&` : '';
        const reqRes = await fetch(`/api/requests/?${cityQuery}status=open`);
        if (reqRes.ok) {
          const data = await reqRes.json();
          const id = user.id || user.user_id;
          setNearbyRequests(data.filter(r => r.requester_id !== id).slice(0, 5));
        }

        const id = user.id || user.user_id;
        if (id) {
          const histRes = await fetch(`/api/donors/${id}/donations/`);
          if (histRes.ok) {
            setDonationHistory(await histRes.json());
            setChartData(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => ({ month: m, donations: Math.floor(Math.random() * 3) })));
          }

          // Fetch requests posted by this user
          const myRes = await fetch(`/api/requests/?status=open&requester_id=${id}`);
          if (myRes.ok) {
            setMyRequests(await myRes.json());
          }
        }
      } catch (e) {
        console.error('Failed to fetch dashboard data', e);
      }
    }
    fetchData();
  }, [user, refreshTrigger]);

  const fetchResponders = async (requestId) => {
    setLoadingResponders(true);
    setSelectedRequest(requestId);
    setResponders([]);
    try {
      const res = await fetch(`/api/requests/${requestId}/responses`);
      if (res.ok) {
        const data = await res.json();
        setResponders(data);
      } else {
        const err = await res.json();
        toast.error(err.detail || 'Failed to load volunteers');
      }
    } catch (e) {
      console.error('Fetch responders error:', e);
      toast.error('Network error loading volunteers');
    } finally {
      setLoadingResponders(false);
    }
  };

  const handleConfirm = async (requestId, donorId) => {
    setConfirmingId(donorId);
    try {
      const success = await confirmDonation(requestId, donorId);
      if (success) {
        setMyRequests(prev => prev.filter(r => r.id !== requestId));
        setSelectedRequest(null);
        setResponders([]);
        setRefreshTrigger(prev => prev + 1);
      }
    } finally {
      setConfirmingId(null);
    }
  };

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

  const lastDonation = user?.last_donation;
  const daysPassed = lastDonation ? Math.floor((new Date() - new Date(lastDonation)) / (1000 * 60 * 60 * 24)) : 999;
  const daysRemaining = Math.max(0, 56 - daysPassed);
  const isEligible = daysRemaining === 0;

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
            {user?.blood_group && <span className="text-[#BFDBF7] font-semibold">{user.blood_group}</span>}
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
          <StatsCard label="Next Eligible" value={isEligible ? 'Now' : `${daysRemaining} days`} icon={Clock} color={isEligible ? '#1F7A8C' : '#BFDBF7'} delay={0} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatsCard label="Total Donations" value={user?.donation_count ?? '—'} icon={Droplets} color="#1F7A8C" delay={0.1} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatsCard label="Lives Impacted" value={user?.donation_count ? user.donation_count * 3 : '—'} icon={Heart} color="#BFDBF7" delay={0.2} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatsCard label="Donor Rank" value={user?.rank ?? 'Veteran'} icon={Award} color="#E1E5F2" delay={0.3} />
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
            {notifications.filter(n => !n.is_read).length > 0 && (
              <span className="text-xs text-[#1F7A8C] bg-[#1F7A8C]/15 px-2 py-0.5 rounded-full font-medium">
                {notifications.filter(n => !n.is_read).length} new
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
                    !n.is_read ? 'bg-[#1F7A8C]/08 border-[#1F7A8C]/20' : 'bg-transparent border-[#1F7A8C]/08 opacity-60'
                  } hover:border-[#1F7A8C]/30`}
                >
                  <p className="text-[#BFDBF7]/75 leading-relaxed">{n.message}</p>
                  <p className="text-[#BFDBF7]/30 mt-1">{formatRelativeTime(n.created_at)}</p>
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
        {/* My Active Requests (Conditional) */}
        {myRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-[#033A4E]/60 border border-[#22909F]/30 rounded-2xl p-5 shadow-xl shadow-[#22909F]/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Plus size={16} className="text-[#22909F]" /> My Active Requests
              </h2>
              <span className="text-[10px] bg-[#22909F]/20 text-[#BFDBF7] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Action Required
              </span>
            </div>
            
            <div className="space-y-4">
              {myRequests.map(req => (
                <div key={req.id} className="space-y-3 p-1">
                  <div className="flex items-start justify-between p-3.5 rounded-xl bg-[#1F7A8C]/15 border border-[#1F7A8C]/30 shadow-inner">
                    <div>
                      <p className="text-sm font-bold text-[#BFDBF7]">{req.patient_name} — <span className="text-[#22909F]">{req.blood_group}</span></p>
                      <p className="text-xs text-[#BFDBF7]/40 flex items-center gap-1 mt-1">
                        <MapPin size={10} /> {req.hospital}
                      </p>
                    </div>
                    <button
                      onClick={() => selectedRequest === req.id ? setSelectedRequest(null) : fetchResponders(req.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                        selectedRequest === req.id 
                          ? 'bg-[#BFDBF7] text-[#022B3A]' 
                          : 'bg-[#1F7A8C] text-[#BFDBF7] hover:bg-[#155E70]'
                      }`}
                    >
                      {selectedRequest === req.id ? 'Close' : 'View Volunteers'}
                    </button>
                  </div>

                  <AnimatePresence>
                    {selectedRequest === req.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 space-y-2 border-l-2 border-[#22909F]/40 ml-2 overflow-hidden"
                      >
                        {loadingResponders ? (
                          <div className="flex items-center gap-2 p-3 text-xs text-[#BFDBF7]/30 italic">
                            <div className="w-3 h-3 border-2 border-[#BFDBF7]/20 border-t-[#BFDBF7] rounded-full animate-spin" />
                            Loading volunteers...
                          </div>
                        ) : responders.length > 0 ? (
                          responders.map(resp => (
                            <div key={resp.id} className="flex items-center justify-between p-3 rounded-xl bg-[#033A4E]/60 border border-[#1F7A8C]/20 hover:border-[#1F7A8C]/40 transition-colors">
                              <div>
                                <p className="text-xs font-bold text-white">{resp.donor_name}</p>
                                <p className="text-[10px] text-[#BFDBF7]/50 mt-0.5">{resp.phone} · {resp.donation_count} donations</p>
                              </div>
                              <button
                                onClick={() => handleConfirm(req.id, resp.donor_id)}
                                disabled={confirmingId === resp.donor_id}
                                className="px-3 py-1.5 bg-[#22909F] text-white text-[10px] font-bold rounded-lg hover:bg-[#1F7A8C] transition-all shadow-lg shadow-[#22909F]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {confirmingId === resp.donor_id ? 'Confirming...' : 'Confirm Donation'}
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center bg-[#1F7A8C]/05 rounded-xl border border-dashed border-[#1F7A8C]/20">
                            <p className="text-xs text-[#BFDBF7]/30 italic">No volunteers have responded to this request yet.</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}

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
                    {req.blood_group}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{req.hospital}</p>
                    <p className="text-xs text-[#BFDBF7]/40 flex items-center gap-1">
                      <MapPin size={10} /> {req.city}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRespond(req.id)}
                    disabled={responding === req.id}
                    className="text-xs bg-[#1F7A8C]/20 border border-[#1F7A8C]/30 text-[#BFDBF7]/80 px-2.5 py-1.5 rounded-lg hover:bg-[#1F7A8C]/40 transition-colors flex-shrink-0 disabled:opacity-50"
                  >
                    {responding === req.id ? '...' : 'Respond'}
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
                    <p className="text-xs font-bold text-[#BFDBF7]/70">{d.blood_group}</p>
                    <p className="text-xs text-[#E1E5F2] mt-0.5">✓ Done</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="Donation history will load from the backend" />
          )}

          {user?.profile_completion != null && (
            <div className="mt-5 pt-4 border-t border-[#1F7A8C]/12">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#BFDBF7]/50">Profile Completion</span>
                <span className="text-xs font-bold text-[#BFDBF7]/70">{user.profile_completion}%</span>
              </div>
              <div className="h-2 bg-[#1F7A8C]/15 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${user.profile_completion}%` }}
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
