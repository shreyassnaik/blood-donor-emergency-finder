import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Heart } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#022B3A] dot-grid flex items-center justify-center px-4">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1F7A8C]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#BFDBF7]/08 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-lg">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="relative mb-8"
        >
          <p className="text-[180px] font-black font-display leading-none select-none"
            style={{
              background: 'linear-gradient(135deg, #1F7A8C 0%, #22909F 40%, #BFDBF7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 40px rgba(116,69,119,0.4))'
            }}
          >
            404
          </p>

          {/* Floating blood drop */}
          <motion.div
            animate={{ y: [0, -16, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span className="text-6xl opacity-30">🩸</span>
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold font-display text-[#BFDBF7] mb-3">
            Page Not Found
          </h1>
          <p className="text-[#BFDBF7]/50 text-base leading-relaxed mb-8">
            The page you're looking for doesn't exist or has been moved. Let's get you back to saving lives.
          </p>

          {/* Pulse ring decoration */}
          <div className="flex justify-center mb-10">
            <div className="relative w-16 h-16">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border border-[#1F7A8C]/30"
                  animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                />
              ))}
              <div className="w-16 h-16 bg-[#1F7A8C]/20 border border-[#1F7A8C]/40 rounded-full flex items-center justify-center">
                <Heart size={24} className="text-[#1F7A8C]" />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#1F7A8C] hover:bg-[#155E70] text-[#BFDBF7] font-semibold rounded-2xl transition-all shadow-xl shadow-[#1F7A8C40] hover:-translate-y-0.5"
            >
              <Home size={16} /> Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2.5 px-7 py-3.5 bg-transparent border border-[#1F7A8C]/30 hover:border-[#1F7A8C] text-[#BFDBF7]/70 hover:text-[#BFDBF7] font-semibold rounded-2xl transition-all hover:-translate-y-0.5"
            >
              <ArrowLeft size={16} /> Go Back
            </button>
          </div>

          {/* Quick Links */}
          <div className="mt-10 pt-8 border-t border-[#1F7A8C]/12">
            <p className="text-xs text-[#BFDBF7]/30 mb-4">Quick links</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { to: '/find-donors', label: 'Find Donors' },
                { to: '/request-blood', label: 'Request Blood' },
                { to: '/register', label: 'Register' },
                { to: '/login', label: 'Login' },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#BFDBF7]/50 hover:text-[#BFDBF7] bg-[#1F7A8C]/08 border border-[#1F7A8C]/12 hover:border-[#BFDBF7]/20 transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
