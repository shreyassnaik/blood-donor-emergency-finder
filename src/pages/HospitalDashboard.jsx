import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Droplets, Plus, Activity, 
  Clock, CheckCircle, AlertTriangle, Save,
  MapPin, Phone
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { StatsCard } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { BLOOD_GROUPS } from '../data/mockData';

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function HospitalDashboard() {
  const { user } = useApp();
  const [inventory, setInventory] = useState([]);
  const [communityRequests, setCommunityRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [fulfilling, setFulfilling] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    async function fetchData() {
      try {
        // Fetch Hospital Details
        const hRes = await fetch(`/api/hospitals/`);
        const allHospitals = await hRes.json();
        const myHospital = allHospitals.find(h => h.user_id === user.id);
        
        if (myHospital) {
          // Fetch inventory
          const invRes = await fetch(`/api/inventory/${myHospital.id}/`);
          if (invRes.ok) setInventory(await invRes.json());

          // Fetch nearby community requests
          const reqRes = await fetch(`/api/requests/?city=${encodeURIComponent(myHospital.city)}&status=open`);
          if (reqRes.ok) setCommunityRequests(await reqRes.json());
        }
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const handleFulfillFromStock = async (requestId) => {
    setFulfilling(requestId);
    try {
        const hRes = await fetch(`/api/hospitals/`);
        const allHospitals = await hRes.json();
        const myHospital = allHospitals.find(h => h.user_id === user.id);

        const res = await fetch(`/api/requests/${requestId}/fulfill-hospital?hospital_id=${myHospital.id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (res.ok) {
            toast.success("Request fulfilled using bank stock!");
            setCommunityRequests(prev => prev.filter(r => r.id !== requestId));
            // Refresh inventory
            const invRes = await fetch(`/api/inventory/${myHospital.id}`);
            if (invRes.ok) setInventory(await invRes.json());
        } else {
            const err = await res.json();
            toast.error(err.detail || "Fulfillment failed");
        }
    } catch (e) {
        toast.error("Network error");
    } finally {
        setFulfilling(null);
    }
  };

  const updateStock = async (group, units) => {
    setSaving(group);
    try {
        // Find hospital_id again or store it in state
        const hRes = await fetch(`/api/hospitals/`);
        const allHospitals = await hRes.json();
        const myHospital = allHospitals.find(h => h.user_id === user.id);

        const res = await fetch(`/api/inventory/${myHospital.id}/${encodeURIComponent(group)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ units_available: units })
        });
        if (res.ok) {
            toast.success(`${group} stock updated`);
            const updated = await res.json();
            setInventory(prev => {
                const idx = prev.findIndex(i => i.blood_group === group);
                if (idx > -1) {
                    const next = [...prev];
                    next[idx] = updated;
                    return next;
                }
                return [...prev, updated];
            });
        }
    } catch (e) {
        toast.error("Update failed");
    } finally {
        setSaving(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">Facility Dashboard</h1>
          <p className="text-sm text-[#BFDBF7]/50 mt-1 flex items-center gap-1.5">
            <Building2 size={13} className="text-[#1F7A8C]" /> {user?.name || 'Medical Facility'} · {user?.city}
          </p>
        </div>
        <Link to="/request-blood" state={{ hospital_id: inventory[0]?.hospital_id, hospital_name: user?.name, city: user?.city, phone: user?.phone }}>
          <Button icon={Plus} size="sm">Post Verified Request</Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={fadeUp}>
          <StatsCard label="Total Inventory" value={inventory.reduce((a, b) => a + b.units_available, 0)} icon={Droplets} color="#1F7A8C" />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatsCard label="Pending Donations" value="3" icon={Clock} color="#22909F" />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatsCard label="Matched Requests" value="12" icon={CheckCircle} color="#BFDBF7" />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatsCard label="Critical Shortage" value={inventory.filter(i => i.units_available < 2).length} icon={AlertTriangle} color="#E1E5F2" />
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#1F7A8C]/15 mb-6">
        {[
          { id: 'inventory', label: 'Blood Bank Inventory' },
          { id: 'community', label: `Community Needs (${communityRequests.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === tab.id ? 'text-[#BFDBF7]' : 'text-[#BFDBF7]/30 hover:text-[#BFDBF7]/60'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F7A8C]" />
            )}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'inventory' ? (
          <motion.div 
            key="inventory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Stock Management</h2>
              <span className="text-xs text-[#BFDBF7]/30 italic font-medium text-right">Update your facility's real-time reserves</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {BLOOD_GROUPS.map(group => {
                const stock = inventory.find(i => i.blood_group === group)?.units_available ?? 0;
                return (
                  <div key={group} className="p-4 rounded-xl bg-[#1F7A8C]/05 border border-[#1F7A8C]/10 flex flex-col items-center text-center hover:border-[#1F7A8C]/30 transition-colors">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm mb-3 ${
                      stock === 0 ? 'bg-[#1F7A8C]/10 text-[#BFDBF7]/20' : 'bg-[#1F7A8C] text-white shadow-lg shadow-[#1F7A8C]/20'
                    }`}>
                      {group}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                        <button 
                            onClick={() => updateStock(group, Math.max(0, stock - 1))}
                            className="w-7 h-7 rounded-lg bg-[#033A4E] border border-[#1F7A8C]/20 text-[#BFDBF7] flex items-center justify-center hover:bg-[#1F7A8C]/20 transition-colors"
                        >-</button>
                        <span className="text-lg font-bold text-white min-w-[2ch]">{stock}</span>
                        <button 
                            onClick={() => updateStock(group, stock + 1)}
                            className="w-7 h-7 rounded-lg bg-[#033A4E] border border-[#1F7A8C]/20 text-[#BFDBF7] flex items-center justify-center hover:bg-[#1F7A8C]/20 transition-colors"
                        >+</button>
                    </div>
                    <p className="text-[10px] uppercase tracking-wider text-[#BFDBF7]/30 font-bold">Units Available</p>
                    {saving === group && <motion.div layoutId="sav" className="mt-2 text-[10px] text-[#1F7A8C] animate-pulse font-medium">Saving...</motion.div>}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="community" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {communityRequests.length > 0 ? (
                communityRequests.map(req => {
                    const hasStock = (inventory.find(i => i.blood_group === req.blood_group)?.units_available ?? 0) >= req.units;
                    return (
                        <div key={req.id} className="bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl p-5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#1F7A8C] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                                    {req.blood_group}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-bold text-white">{req.patient_name}</p>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                            req.urgency === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-[#1F7A8C]/20 text-[#BFDBF7]'
                                        }`}>
                                            {req.urgency}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#BFDBF7]/40 flex items-center gap-3">
                                        <span className="flex items-center gap-1"><Droplets size={12} className="text-[#1F7A8C]" /> {req.units} units needed</span>
                                        <span className="flex items-center gap-1"><MapPin size={12} className="text-[#1F7A8C]" /> {req.hospital_name}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex-shrink-0 text-right">
                                {hasStock ? (
                                    <button 
                                        onClick={() => handleFulfillFromStock(req.id)}
                                        disabled={fulfilling === req.id}
                                        className="px-4 py-2 bg-[#E1E5F2] text-[#022B3A] text-xs font-black rounded-xl hover:bg-white transition-all shadow-lg disabled:opacity-50"
                                    >
                                        {fulfilling === req.id ? 'Fulfilling...' : 'Fulfill From Stock'}
                                    </button>
                                ) : (
                                    <div className="text-[10px] text-[#BFDBF7]/30 flex flex-col items-end gap-1">
                                        <span className="font-bold flex items-center gap-1"><AlertTriangle size={10} className="text-yellow-500/50" /> Insufficient Stock</span>
                                        <button 
                                            onClick={() => updateStock(req.blood_group, req.units)}
                                            className="text-[#1F7A8C] hover:underline"
                                        >Update stock to fulfill →</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl p-12 text-center">
                    <p className="text-[#BFDBF7]/30 text-sm italic">No emergency requests in {user?.city} at the moment.</p>
                </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
