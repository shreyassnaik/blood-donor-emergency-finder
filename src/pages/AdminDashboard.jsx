/**
 * AdminDashboard
 *
 * All data should come from your FastAPI backend.
 * Suggested endpoints:
 *   GET /api/admin/stats              → overview stats
 *   GET /api/admin/users              → user management table
 *   GET /api/admin/requests/active    → active emergency requests
 *   GET /api/admin/analytics          → chart data for monthly/yearly trends
 *   GET /api/admin/blood-distribution → blood group breakdown
 */
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Users, Droplets, TrendingUp, AlertCircle, Shield,
  Activity, CheckCircle, Clock, Download, Database
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { StatsCard } from '../components/ui/Card';
import Table from '../components/ui/Table';
import { formatDate } from '../utils/helpers';

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const PIE_COLORS = ['#1F7A8C', '#BFDBF7', '#E1E5F2', '#22909F', '#155E70', '#BFDBF7', '#E1E5F2', '#22909F'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#033A4E] border border-[#1F7A8C]/25 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-xs text-[#BFDBF7]/50 mb-2">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-medium" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const userColumns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role', render: (val) => (
    <span className={`badge ${val === 'Donor' ? 'bg-[#1F7A8C]/20 text-[#BFDBF7]' : 'bg-[#E1E5F2]/15 text-[#E1E5F2]'}`}>{val}</span>
  )},
  { key: 'city', label: 'City' },
  { key: 'status', label: 'Status', render: (val) => (
    <span className={`badge ${val === 'active' ? 'bg-[#E1E5F2]/15 text-[#E1E5F2]' : 'bg-[#1F7A8C]/15 text-[#BFDBF7]/40'}`}>{val}</span>
  )},
  { key: 'joinDate', label: 'Joined', render: (val) => formatDate(val) },
];

const EmptyChart = ({ label }) => (
  <div className="flex flex-col items-center justify-center h-[220px]">
    <Database size={28} className="text-[#1F7A8C]/30 mb-3" />
    <p className="text-sm text-[#BFDBF7]/30">{label}</p>
  </div>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  /**
   * Replace all of the following with real API responses.
   * Example: const [stats, setStats] = useState(null);
   *          useEffect(() => { fetch('/api/admin/stats').then(…).then(setStats) }, []);
   */
  const overviewStats = null;      // GET /api/admin/stats
  const monthlyData = [];          // GET /api/admin/analytics/monthly
  const bloodDistribution = [];    // GET /api/admin/blood-distribution
  const users = [];                // GET /api/admin/users
  const activeEmergencies = [];    // GET /api/admin/requests/active

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'User Management' },
    { id: 'emergencies', label: 'Active Emergencies' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} className="text-[#BFDBF7]" />
            <span className="text-xs text-[#BFDBF7]/60 font-medium uppercase tracking-wider">Admin Panel</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white">System Dashboard</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1F7A8C]/15 border border-[#1F7A8C]/25 rounded-xl text-sm text-[#BFDBF7]/70 hover:text-[#BFDBF7] transition-colors">
          <Download size={14} /> Export Report
        </button>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#1F7A8C] text-white shadow-md shadow-[#1F7A8C]/20'
                : 'text-[#BFDBF7]/50 hover:text-[#BFDBF7] hover:bg-[#1F7A8C]/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {activeTab === 'overview' && (
        <>
          <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div variants={fadeUp}>
              <StatsCard label="Total Donors" value={overviewStats?.totalDonors ?? '—'} icon={Users} color="#1F7A8C" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatsCard label="Active Requests" value={overviewStats?.activeRequests ?? '—'} icon={AlertCircle} color="#22909F" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatsCard label="Successful Donations" value={overviewStats?.successfulDonations ?? '—'} icon={CheckCircle} color="#BFDBF7" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatsCard label="Cities Covered" value={overviewStats?.citiesCovered ?? '—'} icon={Activity} color="#E1E5F2" />
            </motion.div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-white mb-1">Monthly Trends</h2>
              <p className="text-xs text-[#BFDBF7]/40 mb-5">Donations vs Requests</p>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="donGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1F7A8C" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#1F7A8C" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#BFDBF7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#BFDBF7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F7A8C" strokeOpacity={0.07} />
                    <XAxis dataKey="month" tick={{ fill: '#BFDBF7', opacity: 0.4, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#BFDBF7', opacity: 0.4, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend formatter={(val) => <span style={{ color: '#BFDBF7', opacity: 0.6, fontSize: 12 }}>{val}</span>} />
                    <Area type="monotone" dataKey="donations" name="Donations" stroke="#1F7A8C" strokeWidth={2} fill="url(#donGrad)" />
                    <Area type="monotone" dataKey="requests" name="Requests" stroke="#BFDBF7" strokeWidth={2} fill="url(#reqGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart label="Monthly trends will load from backend" />
              )}
            </div>

            <div className="bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-white mb-1">Blood Group Distribution</h2>
              <p className="text-xs text-[#BFDBF7]/40 mb-4">Donors by blood type</p>
              {bloodDistribution.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={bloodDistribution} dataKey="count" nameKey="group" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
                        {bloodDistribution.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#033A4E', border: '1px solid #1F7A8C', borderRadius: 12, color: '#BFDBF7', fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-1.5 mt-3">
                    {bloodDistribution.map((item, i) => (
                      <div key={item.group} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-xs text-[#BFDBF7]/60">{item.group} ({item.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <EmptyChart label="Distribution loads from backend" />
              )}
            </div>
          </div>

          <div className="bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-5">Quarterly Donation Volume</h2>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={monthlyData.filter((_, i) => i % 3 === 0)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F7A8C" strokeOpacity={0.07} />
                  <XAxis dataKey="month" tick={{ fill: '#BFDBF7', opacity: 0.4, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#BFDBF7', opacity: 0.4, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="donations" name="Donations" fill="#1F7A8C" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="requests" name="Requests" fill="#BFDBF7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart label="Chart data loads from backend" />
            )}
          </div>
        </>
      )}

      {/* ── User Management Tab ── */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[#BFDBF7]/50">
              {users.length > 0 ? `${users.length} users loaded` : 'User data loads from GET /api/admin/users'}
            </p>
          </div>
          <Table
            columns={userColumns}
            data={users}
            emptyMessage="No users yet — data will appear once the backend is connected"
          />
        </motion.div>
      )}

      {/* ── Emergencies Tab ── */}
      {activeTab === 'emergencies' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Critical', count: '—', color: '#1F7A8C' },
              { label: 'Urgent', count: '—', color: '#22909F' },
              { label: 'Moderate', count: '—', color: '#BFDBF7' },
            ].map(stat => (
              <div key={stat.label} className="p-5 rounded-2xl border text-center" style={{ background: `${stat.color}10`, borderColor: `${stat.color}25` }}>
                <p className="text-3xl font-bold font-display mb-1" style={{ color: stat.color }}>{stat.count}</p>
                <p className="text-sm text-[#BFDBF7]/60">{stat.label} Requests</p>
              </div>
            ))}
          </div>
          {activeEmergencies.length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle size={32} className="text-[#1F7A8C]/30 mx-auto mb-3" />
              <p className="text-sm text-[#BFDBF7]/30">Active emergency data loads from GET /api/admin/requests/active</p>
            </div>
          ) : (
            activeEmergencies.map(em => (
              <div key={em.id} className="flex items-center gap-4 p-4 bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl hover:border-[#1F7A8C]/25 transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#1F7A8C] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {em.bloodGroup}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{em.hospital}</p>
                  <p className="text-xs text-[#BFDBF7]/40">{em.city} · {em.createdAt}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-[#E1E5F2]">{em.responses ?? 0}</p>
                  <p className="text-xs text-[#BFDBF7]/30">responses</p>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}

      {/* ── Analytics Tab ── */}
      {activeTab === 'analytics' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Avg Response Time', value: '—', icon: Clock, color: '#1F7A8C' },
              { label: 'Match Success Rate', value: '—', icon: CheckCircle, color: '#BFDBF7' },
              { label: 'Monthly Growth', value: '—', icon: TrendingUp, color: '#E1E5F2' },
              { label: 'Active Donors', value: '—', icon: Users, color: '#22909F' },
            ].map(s => (
              <StatsCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} />
            ))}
          </div>
          <div className="bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-5">Annual Donation Volume</h2>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F7A8C" strokeOpacity={0.07} />
                  <XAxis dataKey="month" tick={{ fill: '#BFDBF7', opacity: 0.4, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#BFDBF7', opacity: 0.4, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="donations" name="Donations" fill="#1F7A8C" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart label="Annual chart loads from backend analytics endpoint" />
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
