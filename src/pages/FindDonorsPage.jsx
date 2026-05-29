/**
 * FindDonorsPage
 *
 * On FastAPI integration, replace the `donors` state with an API fetch:
 *   GET /api/donors?search=&blood_group=&city=&available=&sort=
 * Pass query params from the filter/search/sort state.
 */
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Phone, MapPin, Star, Droplets, ArrowUpDown, Search, Building2, Users, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import SearchBar from '../components/ui/SearchBar';
import FilterPanel from '../components/ui/FilterPanel';
import { BloodGroupBadge } from '../components/ui/Card';
import DonorCard from '../components/ui/DonorCard';
import { useApp } from '../context/AppContext';
import { CITIES } from '../data/mockData';

const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const FILTER_DEFS = [
  {
    key: 'blood_group',
    label: 'Blood Group',
    options: BLOOD_GROUPS.map(g => ({ value: g, label: g })),
  },
  {
    key: 'city',
    label: 'City',
    options: CITIES.map(c => ({ value: c, label: c })),
  },
  {
    key: 'available',
    label: 'Availability',
    options: [
      { value: 'available', label: 'Available Now' },
      { value: 'unavailable', label: 'Unavailable' },
    ],
  },
];

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rating' },
  { value: 'donations', label: 'Most Donations' },
  { value: 'name', label: 'Name A–Z' },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.05 } 
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function FindDonorsPage() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [resourceType, setResourceType] = useState('donors'); // 'donors' or 'banks'
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('rating');
  const [contactedId, setContactedId] = useState(null);
  const [allDonors, setAllDonors] = useState([]);
  const [allBanks, setAllBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const bg = filters.blood_group || '';
        const city = filters.city || '';

        if (resourceType === 'donors') {
            const cityParam = city ? `city=${encodeURIComponent(city)}&` : '';
            const bgParam = bg ? `blood_group=${encodeURIComponent(bg)}&` : '';
            const response = await fetch(`/api/donors/?${cityParam}${bgParam}`);
            if (response.ok) {
              const data = await response.json();
              console.log('API Donors:', data);
              setAllDonors(data);
            }
        } else {
            const bankBg = bg || 'O+';
            const cityParam = city ? `city=${encodeURIComponent(city)}` : '';
            const response = await fetch(`/api/inventory/availability/search/?blood_group=${encodeURIComponent(bankBg)}${cityParam ? '&' + cityParam : ''}`);
            if (response.ok) {
              const data = await response.json();
              console.log('API Banks:', data);
              setAllBanks(data);
            }
        }
      } catch (err) {
        console.error('Fetch error:', err);
        toast.error('Failed to load resources');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [resourceType, filters.blood_group, filters.city]);

  const handleFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: val === 'all' ? undefined : val }));
  };

  const handleRequestFromBank = (bank) => {
    navigate('/request-blood', { 
        state: { 
            hospital_id: bank.hospital_id, 
            hospital_name: bank.hospital_name,
            city: bank.city,
            bloodGroup: filters.blood_group || 'O+',
            phone: bank.phone
        } 
    });
  };

  const donors = useMemo(() => {
    let list = [...allDonors];
    
    // Filter out the current user
    const currentId = user?.id || user?.user_id;
    if (currentId) {
      list = list.filter(d => d.user_id !== currentId);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        d.name?.toLowerCase().includes(q) ||
        d.blood_group?.toLowerCase().includes(q) ||
        d.city?.toLowerCase().includes(q)
      );
    }
    
    // Frontend secondary filtering (optional since backend does it now, but keeps it reactive)
    if (filters.blood_group) list = list.filter(d => d.blood_group === filters.blood_group);
    if (filters.city) list = list.filter(d => d.city === filters.city);
    if (filters.available === 'available') list = list.filter(d => d.available);
    if (filters.available === 'unavailable') list = list.filter(d => !d.available);
    
    list.sort((a, b) => {
      if (sort === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
      if (sort === 'donations') return (b.donation_count ?? 0) - (a.donation_count ?? 0);
      if (sort === 'name') return (a.name ?? '').localeCompare(b.name ?? '');
      return 0;
    });
    console.log('Final Render Donors:', list);
    return list;
  }, [allDonors, search, filters, sort, user]);

  const handleContact = (donor) => {
    const id = donor.user_id || donor.id;
    setContactedId(id);
    toast.success('Connecting to donor...', {
      icon: '📞',
      style: { background: '#033A4E', color: '#BFDBF7', border: '1px solid #1F7A8C' },
    });
    setTimeout(() => setContactedId(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold font-display text-white mb-2">Find Blood Donors</h1>
        <p className="text-[#BFDBF7]/50">
          Search and filter verified donors in your area
        </p>
      </motion.div>

      {/* Resource Toggle */}
      <div className="flex items-center p-1 bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl w-fit mb-8">
        {[
          { id: 'donors', label: 'Individual Donors', icon: Users },
          { id: 'banks', label: 'Hospital Blood Banks', icon: Building2 },
        ].map(type => (
          <button
            key={type.id}
            onClick={() => setResourceType(type.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              resourceType === type.id ? 'bg-[#1F7A8C] text-[#BFDBF7] shadow-lg shadow-[#1F7A8C30]' : 'text-[#BFDBF7]/40 hover:text-[#BFDBF7]/60'
            }`}
          >
            <type.icon size={16} />
            {type.label}
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar
          className="flex-1"
          placeholder={resourceType === 'donors' ? "Search donors..." : "Search blood banks..."}
          value={search}
          onChange={e => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />
        <FilterPanel
          filters={resourceType === 'donors' ? FILTER_DEFS : [FILTER_DEFS[0]]}
          activeFilters={filters}
          onFilterChange={handleFilter}
        />
        {resourceType === 'donors' && (
            <div className="relative">
                <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    aria-label="Sort donors"
                    className="appearance-none bg-[#033A4E]/80 border border-[#1F7A8C]/20 hover:border-[#1F7A8C]/40 text-[#BFDBF7]/70 text-sm rounded-xl pl-9 pr-4 py-3 outline-none cursor-pointer transition-all focus:border-[#1F7A8C]"
                >
                    {SORT_OPTIONS.map(o => (
                        <option key={o.value} value={o.value} className="bg-[#033A4E]">{o.label}</option>
                    ))}
                </select>
                <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1F7A8C]/60 pointer-events-none" />
            </div>
        )}
      </div>

      {/* Results info */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[#BFDBF7]/40">
          {loading ? 'Searching resources...' : 
           resourceType === 'donors' 
            ? donors.length > 0 ? <>Showing <span className="text-[#BFDBF7]/70 font-medium">{donors.length}</span> donor{donors.length !== 1 ? 's' : ''}</> : 'No donors found'
            : allBanks.length > 0 ? <>Showing <span className="text-[#BFDBF7]/70 font-medium">{allBanks.length}</span> blood bank{allBanks.length !== 1 ? 's' : ''}</> : `No blood banks found with ${filters.blood_group || 'A+'} stock`}
        </p>
        {Object.values(filters).some(Boolean) && (
          <button
            onClick={() => setFilters({})}
            className="text-xs text-[#BFDBF7]/50 hover:text-[#BFDBF7] transition-colors"
          >
            Clear filters ×
          </button>
        )}
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-[#1F7A8C]/20 border-t-[#1F7A8C] rounded-full animate-spin mb-4" />
          <p className="text-sm text-[#BFDBF7]/40">Searching our network...</p>
        </div>
      ) : resourceType === 'donors' ? (
        donors.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl bg-[#1F7A8C]/10 border border-[#1F7A8C]/15 flex items-center justify-center mx-auto mb-5">
              <Search size={32} className="text-[#1F7A8C]/40" />
            </div>
            <p className="text-[#BFDBF7]/50 text-lg font-medium mb-2">No donors found</p>
          </motion.div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="visible" className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {donors.map((donor) => (
              <DonorCard key={donor.user_id || donor.id} donor={donor} onContact={handleContact} isContacting={contactedId === (donor.user_id || donor.id)} />
            ))}
          </motion.div>
        )
      ) : (
        allBanks.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl bg-[#1F7A8C]/10 border border-[#1F7A8C]/15 flex items-center justify-center mx-auto mb-5">
              <Building2 size={32} className="text-[#1F7A8C]/40" />
            </div>
            <p className="text-[#BFDBF7]/50 text-lg font-medium mb-2">No blood banks with matching stock</p>
            <p className="text-[#BFDBF7]/30 text-sm">Select a different blood group or city to find available stock.</p>
          </motion.div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="visible" className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {allBanks.map((bank) => (
              <motion.div key={bank.hospital_id} variants={fadeUp} className="bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl p-5 hover:border-[#1F7A8C]/40 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1F7A8C]/20 flex items-center justify-center">
                    <Building2 size={20} className="text-[#1F7A8C]" />
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    bank.is_verified ? 'bg-[#E1E5F2]/15 text-[#E1E5F2]' : 'bg-[#1F7A8C]/10 text-[#BFDBF7]/30'
                  }`}>
                    {bank.is_verified ? 'Verified Bank' : 'Medical Facility'}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{bank.hospital_name}</h3>
                <p className="text-[10px] text-[#BFDBF7]/40 flex items-center gap-1 mb-4">
                  <MapPin size={10} /> {bank.city} · {bank.address}
                </p>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#1F7A8C]/08 border border-[#1F7A8C]/10 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#1F7A8C] text-white flex items-center justify-center text-xs font-bold">{filters.blood_group || 'O+'}</div>
                    <span className="text-[10px] text-[#BFDBF7]/40 uppercase font-black">Current Stock</span>
                  </div>
                  <span className="text-xl font-bold text-[#E1E5F2]">{bank.units_available} <span className="text-[10px] font-medium opacity-50">u</span></span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <a href={`tel:${bank.phone}`} className="py-2 bg-[#033A4E] border border-[#1F7A8C]/20 text-[#BFDBF7]/70 text-[10px] font-bold rounded-xl hover:bg-[#1F7A8C]/10 transition-colors flex items-center justify-center gap-1.5">
                        <Phone size={12} /> Call
                    </a>
                    <button 
                        onClick={() => handleRequestFromBank(bank)}
                        className="py-2 bg-[#1F7A8C] text-[#BFDBF7] text-[10px] font-bold rounded-xl hover:bg-[#155E70] transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-[#1F7A8C20]"
                    >
                        <Plus size={12} /> Request
                    </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )
      )}
    </div>
  );
}
