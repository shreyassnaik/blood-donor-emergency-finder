import { motion } from 'framer-motion';
import { MapPin, Phone, Star, CheckCircle } from 'lucide-react';
import { generateInitials, formatRelativeTime } from '../../utils/helpers';
import { BloodGroupBadge } from './Card';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function DonorCard({ donor, onContact, isContacting, delay = 0 }) {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl overflow-hidden group hover:border-[#1F7A8C]/30 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-[#1F7A8C20]"
    >
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1F7A8C] to-[#155E70] flex items-center justify-center text-base font-bold text-[#BFDBF7] shadow-lg shadow-[#1F7A8C40]">
              {generateInitials(donor.name)}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#033A4E] ${donor.available ? 'bg-[#E1E5F2]' : 'bg-[#1F7A8C]/40'}`} />
          </div>
          <BloodGroupBadge group={donor.blood_group} />
        </div>

        <h3 className="text-sm font-semibold text-[#BFDBF7] mb-1 truncate">{donor.name}</h3>
        <p className="text-xs text-[#BFDBF7]/40 flex items-center gap-1 mb-3">
          <MapPin size={10} className="text-[#1F7A8C]" /> {donor.city}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-[#1F7A8C]/08 rounded-xl border border-[#1F7A8C]/10">
            <p className="text-base font-bold text-[#BFDBF7]">{donor.donation_count}</p>
            <p className="text-xs text-[#BFDBF7]/40 mt-0.5">Donations</p>
          </div>
          <div className="text-center p-2 bg-[#BFDBF7]/08 rounded-xl border border-[#BFDBF7]/10">
            <p className="text-base font-bold text-[#BFDBF7] flex items-center justify-center gap-0.5">
              <Star size={11} className="text-[#BFDBF7] fill-[#BFDBF7]" />{donor.rating}
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

        <p className="text-xs text-[#BFDBF7]/30 mb-4">
          Last donated: {formatRelativeTime(donor.last_donation)}
        </p>
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={() => onContact?.(donor)}
          disabled={!donor.available || isContacting}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            isContacting
              ? 'bg-[#E1E5F2]/20 border border-[#E1E5F2]/30 text-[#E1E5F2]'
              : donor.available
              ? 'bg-[#1F7A8C] hover:bg-[#155E70] text-[#BFDBF7] shadow-md shadow-[#1F7A8C30]'
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
    </motion.div>
  );
}
