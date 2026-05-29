import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmergencyBanner() {
  const [visible, setVisible] = useState(false);
  const [criticalRequests, setCriticalRequests] = useState([]);

  useEffect(() => {
    async function fetchCriticalRequests() {
      try {
        const response = await fetch('/api/requests?status=open');
        if (response.ok) {
          const data = await response.json();
          const critical = data.filter(r => r.urgency === 'critical');
          setCriticalRequests(critical);
          setVisible(critical.length > 0);
        }
      } catch (error) {
        console.error('Failed to fetch critical requests:', error);
      }
    }
    fetchCriticalRequests();
  }, []);

  const bloodGroups = [...new Set(criticalRequests.map(r => r.blood_group))].join(', ');

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#1F7A8C] via-[#155E70] to-[#1F7A8C] bg-[length:200%] animate-pulse-bg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  <AlertTriangle size={16} className="text-[#BFDBF7]" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#E1E5F2] rounded-full animate-ping" />
                </div>
                <p className="text-sm text-[#BFDBF7] font-medium truncate">
                  <span className="font-bold">{criticalRequests.length} Critical Request{criticalRequests.length !== 1 ? 's' : ''}</span> near you right now —
                  <span className="text-[#E1E5F2] ml-1">{bloodGroups}</span> needed urgently
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Link
                  to="/find-donors"
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#BFDBF7] bg-[#BFDBF7]/15 hover:bg-[#BFDBF7]/25 border border-[#BFDBF7]/20 px-3 py-1.5 rounded-lg transition-all"
                >
                  View All <ArrowRight size={12} />
                </Link>
                <button
                  onClick={() => setVisible(false)}
                  aria-label="Dismiss banner"
                  className="text-[#BFDBF7]/60 hover:text-[#BFDBF7] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
