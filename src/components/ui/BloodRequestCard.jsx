import { MapPin, Clock } from 'lucide-react';
import { getUrgencyConfig, formatRelativeTime } from '../../utils/helpers';

export default function BloodRequestCard({ request, onRespond }) {
  const urg = getUrgencyConfig(request.urgency);
  const isFulfilled = request.status === 'fulfilled';

  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl border transition-all ${
      isFulfilled
        ? 'opacity-60 border-[#1F7A8C]/08 bg-transparent'
        : 'border-[#1F7A8C]/15 bg-[#1F7A8C]/05 hover:border-[#1F7A8C]/25'
    }`}>
      {/* Blood Group Badge */}
      <div className="w-12 h-12 rounded-xl bg-[#1F7A8C] flex items-center justify-center text-sm font-bold text-[#BFDBF7] flex-shrink-0 shadow-md shadow-[#1F7A8C40]">
        {request.bloodGroup}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="text-sm font-semibold text-[#BFDBF7] truncate">{request.patientName}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${urg.bg} ${urg.text} ${urg.border}`}>
            {urg.label}
          </span>
        </div>
        <p className="text-xs text-[#BFDBF7]/40 flex items-center gap-1 mb-1">
          <MapPin size={10} className="text-[#1F7A8C]" /> {request.hospital}
        </p>
        <p className="text-xs text-[#BFDBF7]/30 flex items-center gap-1">
          <Clock size={10} /> {formatRelativeTime(request.createdAt)} · {request.units} unit{request.units > 1 ? 's' : ''} needed
        </p>
      </div>

      {/* Action */}
      <div className="flex-shrink-0">
        {isFulfilled ? (
          <span className="text-xs text-[#E1E5F2] font-medium flex items-center gap-1">
            ✓ Fulfilled
          </span>
        ) : (
          <button
            onClick={() => onRespond?.(request)}
            className="text-xs bg-[#1F7A8C]/20 border border-[#1F7A8C]/30 text-[#BFDBF7]/80 px-3 py-1.5 rounded-xl hover:bg-[#1F7A8C]/40 hover:text-[#BFDBF7] transition-all font-medium"
          >
            Respond
          </button>
        )}
      </div>
    </div>
  );
}
