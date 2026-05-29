/**
 * FindDonorsPage
 *
 * On FastAPI integration, replace the `donors` state with an API fetch:
 *   GET /api/donors?search=&blood_group=&city=&available=&sort=
 * Pass query params from the filter/search/sort state.
 */
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Star, Droplets, ArrowUpDown, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import SearchBar from '../components/ui/SearchBar';
import FilterPanel from '../components/ui/FilterPanel';
import { BloodGroupBadge } from '../components/ui/Card';
import DonorCard from '../components/ui/DonorCard';
import { useApp } from '../context/AppContext';

const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const FILTER_DEFS = [
  {
    key: 'blood_group',
    label: 'Blood Group',
    options: BLOOD_GROUPS.map(g => ({ value: g, label: g })),
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

export default function FindDonorsPage() {
  const { user } = useApp();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('rating');
  const [contactedId, setContactedId] = useState(null);
  const [allDonors, setAllDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDonors() {
      setLoading(true);
      try {
        const response = await fetch('/api/donors');
        if (response.ok) {
          const data = await response.json();
          setAllDonors(data);
        }
      } catch (err) {
        toast.error('Failed to load donors');
      } finally {
        setLoading(false);
      }
    }
    fetchDonors();
  }, []);

  const handleFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: val === 'all' ? undefined : val }));
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
    if (filters.blood_group) list = list.filter(d => d.blood_group === filters.blood_group);
    if (filters.available === 'available') list = list.filter(d => d.available);
    if (filters.available === 'unavailable') list = list.filter(d => !d.available);
    list.sort((a, b) => {
      if (sort === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
      if (sort === 'donations') return (b.donation_count ?? 0) - (a.donation_count ?? 0);
      if (sort === 'name') return (a.name ?? '').localeCompare(b.name ?? '');
      return 0;
    });
    return list;
  }, [allDonors, search, filters, sort]);

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

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar
          className="flex-1"
          placeholder="Search by name, blood group, or city..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />
        <FilterPanel
          filters={FILTER_DEFS}
          activeFilters={filters}
          onFilterChange={handleFilter}
        />
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
      </div>

      {/* Results info */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[#BFDBF7]/40">
          {loading ? 'Loading donors...' : donors.length > 0
            ? <>Showing <span className="text-[#BFDBF7]/70 font-medium">{donors.length}</span> donor{donors.length !== 1 ? 's' : ''}</>
            : 'No donors found with current filters'}
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
      ) : donors.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <div className="w-20 h-20 rounded-3xl bg-[#1F7A8C]/10 border border-[#1F7A8C]/15 flex items-center justify-center mx-auto mb-5">
            <Search size={32} className="text-[#1F7A8C]/40" />
          </div>
          <p className="text-[#BFDBF7]/50 text-lg font-medium mb-2">No donors found</p>
          <p className="text-[#BFDBF7]/30 text-sm">
            Try adjusting your search or filters to find more volunteers.
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={stagger} initial="hidden" animate="visible"
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {donors.map((donor) => (
            <DonorCard
              key={donor.user_id || donor.id}
              donor={donor}
              onContact={handleContact}
              isContacting={contactedId === (donor.user_id || donor.id)}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
