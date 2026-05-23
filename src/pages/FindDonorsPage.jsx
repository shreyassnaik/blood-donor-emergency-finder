/**
 * FindDonorsPage
 *
 * On FastAPI integration, replace the `donors` state with an API fetch:
 *   GET /api/donors?search=&bloodGroup=&city=&available=&sort=
 * Pass query params from the filter/search/sort state.
 */
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Star, Droplets, ArrowUpDown, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import SearchBar from '../components/ui/SearchBar';
import FilterPanel from '../components/ui/FilterPanel';
import { BloodGroupBadge } from '../components/ui/Card';

const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const FILTER_DEFS = [
  {
    key: 'bloodGroup',
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

const stagger = { visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function FindDonorsPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('rating');
  const [contactedId, setContactedId] = useState(null);

  /**
   * Replace this with API data: GET /api/donors?...
   * donors should be an array of donor objects from your backend.
   */
  const allDonors = [];

  const handleFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: val === 'all' ? undefined : val }));
  };

  const donors = useMemo(() => {
    let list = [...allDonors];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        d.name?.toLowerCase().includes(q) ||
        d.bloodGroup?.toLowerCase().includes(q) ||
        d.city?.toLowerCase().includes(q)
      );
    }
    if (filters.bloodGroup) list = list.filter(d => d.bloodGroup === filters.bloodGroup);
    if (filters.available === 'available') list = list.filter(d => d.available);
    if (filters.available === 'unavailable') list = list.filter(d => !d.available);
    list.sort((a, b) => {
      if (sort === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
      if (sort === 'donations') return (b.donationCount ?? 0) - (a.donationCount ?? 0);
      if (sort === 'name') return (a.name ?? '').localeCompare(b.name ?? '');
      return 0;
    });
    return list;
  }, [allDonors, search, filters, sort]);

  const handleContact = (donor) => {
    setContactedId(donor.id);
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
          Search and filter verified donors — data loads from your database
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
          {donors.length > 0
            ? <>Showing <span className="text-[#BFDBF7]/70 font-medium">{donors.length}</span> donor{donors.length !== 1 ? 's' : ''}</>
            : 'Connect to backend to load donors'}
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

      {/* Empty State */}
      {donors.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <div className="w-20 h-20 rounded-3xl bg-[#1F7A8C]/10 border border-[#1F7A8C]/15 flex items-center justify-center mx-auto mb-5">
            <Search size={32} className="text-[#1F7A8C]/40" />
          </div>
          <p className="text-[#BFDBF7]/50 text-lg font-medium mb-2">No donors yet</p>
          <p className="text-[#BFDBF7]/30 text-sm">
            Donor data will appear here once your FastAPI backend is connected.
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={stagger} initial="hidden" animate="visible"
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {donors.map(donor => (
            <motion.div key={donor.id} variants={fadeUp}>
              <DonorCard
                donor={donor}
                onContact={handleContact}
                isContacting={contactedId === donor.id}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function DonorCard({ donor, onContact, isContacting }) {
  const initials = donor.name
    ? donor.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'D';

  return (
    <div className="bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl overflow-hidden group hover:border-[#1F7A8C]/30 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-[#1F7A8C]/10">
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1F7A8C] to-[#155E70] flex items-center justify-center text-base font-bold text-white shadow-lg">
              {initials}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#033A4E] ${donor.available ? 'bg-[#E1E5F2]' : 'bg-[#1F7A8C]/40'}`} />
          </div>
          <BloodGroupBadge group={donor.bloodGroup} />
        </div>

        <h3 className="text-sm font-semibold text-white mb-1 truncate">{donor.name}</h3>
        <p className="text-xs text-[#BFDBF7]/40 flex items-center gap-1 mb-3">
          <MapPin size={10} className="text-[#1F7A8C]" /> {donor.city}
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-[#1F7A8C]/08 rounded-xl border border-[#1F7A8C]/10">
            <p className="text-base font-bold text-white">{donor.donationCount ?? '—'}</p>
            <p className="text-xs text-[#BFDBF7]/40 mt-0.5">Donations</p>
          </div>
          <div className="text-center p-2 bg-[#BFDBF7]/05 rounded-xl border border-[#BFDBF7]/10">
            <p className="text-base font-bold text-white flex items-center justify-center gap-0.5">
              <Star size={10} className="text-[#BFDBF7] fill-[#BFDBF7]" /> {donor.rating ?? '—'}
            </p>
            <p className="text-xs text-[#BFDBF7]/40 mt-0.5">Rating</p>
          </div>
          <div className={`text-center p-2 rounded-xl border ${donor.available ? 'bg-[#E1E5F2]/08 border-[#E1E5F2]/10' : 'bg-[#1F7A8C]/05 border-[#1F7A8C]/08'}`}>
            <p className={`text-xs font-bold ${donor.available ? 'text-[#E1E5F2]' : 'text-[#BFDBF7]/30'}`}>
              {donor.available ? '●' : '○'}
            </p>
            <p className="text-xs text-[#BFDBF7]/40 mt-0.5">{donor.available ? 'Ready' : 'Busy'}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={() => onContact(donor)}
          disabled={!donor.available || isContacting}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            isContacting
              ? 'bg-[#E1E5F2]/20 border border-[#E1E5F2]/30 text-[#E1E5F2]'
              : donor.available
              ? 'bg-[#1F7A8C] hover:bg-[#155E70] text-white shadow-md shadow-[#1F7A8C]/20'
              : 'bg-[#1F7A8C]/10 border border-[#1F7A8C]/15 text-[#BFDBF7]/30 cursor-not-allowed'
          }`}
        >
          {isContacting ? (
            <><span className="w-4 h-4 border-2 border-[#E1E5F2] border-t-transparent rounded-full animate-spin" /> Connecting...</>
          ) : (
            <><Phone size={14} /> {donor.available ? 'Contact Donor' : 'Unavailable'}</>
          )}
        </button>
      </div>
    </div>
  );
}
