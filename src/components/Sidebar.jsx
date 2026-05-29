import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Droplets, Users, User, Heart,
  Settings, Bell, X, ChevronRight, Shield, LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/find-donors', icon: Users, label: 'Find Donors' },
  { to: '/request-blood', icon: Droplets, label: 'Request Blood' },
  { to: '/profile', icon: User, label: 'My Profile' },
];

const adminItems = [
  { to: '/admin', icon: Shield, label: 'Admin Panel' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1F7A8C]/15 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#1F7A8C] rounded-xl flex items-center justify-center shadow-lg shadow-[#1F7A8C40]">
            <Heart size={16} className="text-[#BFDBF7] fill-[#BFDBF7]" />
          </div>
          <span className="text-lg font-bold font-display text-[#BFDBF7]">
            Blood<span className="text-[#BFDBF7]">Link</span>
          </span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-[#BFDBF7]/40 hover:text-[#BFDBF7] hover:bg-[#1F7A8C]/15 transition-colors"
          aria-label="Close sidebar"
        >
          <X size={16} />
        </button>
      </div>

      {/* User Mini Card */}
      {user && (
        <div className="px-4 py-4 mx-3 mt-4 rounded-2xl bg-[#1F7A8C]/10 border border-[#1F7A8C]/15">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1F7A8C] flex items-center justify-center text-sm font-bold text-[#BFDBF7] flex-shrink-0">
              {user.name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#BFDBF7] truncate">{user.name}</p>
              <p className="text-xs text-[#BFDBF7]">{user.blood_group} · {user.city}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${user.available ? 'bg-[#E1E5F2]' : 'bg-[#1F7A8C]/50'}`} />
            <span className="text-xs text-[#BFDBF7]/50">{user.available ? 'Available to donate' : 'Unavailable'}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-5 space-y-1 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-semibold text-[#BFDBF7]/30 uppercase tracking-wider">Navigation</p>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-[#1F7A8C]/25 text-[#BFDBF7] border border-[#1F7A8C]/30'
                  : 'text-[#BFDBF7]/50 hover:text-[#BFDBF7] hover:bg-[#1F7A8C]/10'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={17} className={isActive ? 'text-[#BFDBF7]' : 'text-[#1F7A8C]/60 group-hover:text-[#1F7A8C]'} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight size={14} className="text-[#1F7A8C]/50" />}
              </>
            )}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <>
            <p className="px-3 mt-5 mb-2 text-xs font-semibold text-[#BFDBF7]/30 uppercase tracking-wider">Admin</p>
            {adminItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-[#BFDBF7]/15 text-[#BFDBF7] border border-[#BFDBF7]/20'
                      : 'text-[#BFDBF7]/50 hover:text-[#BFDBF7] hover:bg-[#BFDBF7]/10'
                  }`
                }
              >
                <item.icon size={17} />
                {item.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-[#1F7A8C]/15 space-y-1">
        <NavLink
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#BFDBF7]/40 hover:text-[#BFDBF7]/70 hover:bg-[#1F7A8C]/08 transition-colors"
        >
          <Settings size={16} />
          Settings
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#BFDBF7]/30 hover:text-[#BFDBF7]/60 hover:bg-[#1F7A8C]/05 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#022B3A] border-r border-[#1F7A8C]/12 h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-[#022B3A] border-r border-[#1F7A8C]/15 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
