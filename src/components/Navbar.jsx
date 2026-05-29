import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Menu, X, Bell, User, LogOut, ChevronDown,
  LayoutDashboard, Droplets, Users, Settings, Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRelativeTime } from '../utils/helpers';

export default function Navbar() {
  const { user, isAuthenticated, logout, unreadCount, notifications, markNotificationRead } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      // Check if click was outside profile dropdown
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      // Check if click was outside notification dropdown
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    
    // Use 'click' for better cross-device compatibility
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, []);

  const navLinks = [
    { to: '/find-donors', label: 'Find Donors' },
    { to: '/request-blood', label: 'Emergency Request' },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled ? 'bg-[#022B3A]/95 backdrop-blur-xl border-b border-[#1F7A8C]/15 shadow-lg shadow-black/30' : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="BloodLink Home">
            <div className="relative">
              <div className="w-8 h-8 bg-[#1F7A8C] rounded-xl flex items-center justify-center shadow-lg shadow-[#1F7A8C50] group-hover:shadow-[#1F7A8C80] transition-shadow">
                <Heart size={16} className="text-[#BFDBF7] fill-[#BFDBF7] animate-pulse" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#BFDBF7] rounded-full border-2 border-[#022B3A] float-anim" />
            </div>
            <span className="text-lg font-bold font-display text-[#BFDBF7]">
              Blood<span className="text-[#BFDBF7]">Link</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-[#BFDBF7] bg-[#1F7A8C]/20'
                      : 'text-[#BFDBF7]/60 hover:text-[#BFDBF7] hover:bg-[#1F7A8C]/10'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive ? 'text-[#BFDBF7] bg-[#BFDBF7]/10' : 'text-[#BFDBF7]/60 hover:text-[#BFDBF7] hover:bg-[#BFDBF7]/10'
                  }`
                }
              >
                <Shield size={14} /> Admin
              </NavLink>
            )}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
                    aria-label="Notifications"
                    className="relative p-2.5 rounded-xl text-[#BFDBF7]/60 hover:text-[#BFDBF7] hover:bg-[#1F7A8C]/15 transition-all"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1F7A8C] rounded-full" />
                    )}
                  </button>
                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        className="absolute right-0 top-full mt-2 w-80 bg-[#033A4E] border border-[#1F7A8C]/20 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-[#1F7A8C]/15 flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#BFDBF7]">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="text-xs text-[#1F7A8C] font-medium">{unreadCount} new</span>
                          )}
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                          {notifications.map(n => (
                            <button
                              key={n.id}
                              onClick={() => markNotificationRead(n.id)}
                              className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-[#1F7A8C]/08 transition-colors border-b border-[#1F7A8C]/05 ${!n.is_read ? 'bg-[#1F7A8C]/05' : ''}`}
                            >
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                n.type === 'request' ? 'bg-[#1F7A8C]' :
                                n.type === 'match' ? 'bg-[#BFDBF7]' : 'bg-[#E1E5F2]'
                              } ${!n.is_read ? 'opacity-100' : 'opacity-0'}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-[#BFDBF7]/80 leading-relaxed">{n.message}</p>
                                <p className="text-xs text-[#BFDBF7]/30 mt-1">{formatRelativeTime(n.created_at)}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                        <div className="px-4 py-2.5 border-t border-[#1F7A8C]/15">
                          <Link to="/dashboard" className="text-xs text-[#BFDBF7] hover:text-[#E1E5F2] transition-colors">
                            View all notifications →
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#1F7A8C]/15 transition-all group"
                    aria-label="User menu"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#1F7A8C] flex items-center justify-center text-xs font-bold text-[#BFDBF7]">
                      {user?.name?.charAt(0) ?? 'U'}
                    </div>
                    <span className="text-sm font-medium text-[#BFDBF7]/80 group-hover:text-[#BFDBF7]">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} className={`text-[#BFDBF7]/40 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-[#033A4E] border border-[#1F7A8C]/20 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden py-1.5"
                      >
                        {[
                          { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                          { to: '/profile', icon: User, label: 'My Profile' },
                          { to: '/find-donors', icon: Users, label: 'Find Donors' },
                          { to: '/request-blood', icon: Droplets, label: 'Request Blood' },
                        ].map(item => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#BFDBF7]/70 hover:text-[#BFDBF7] hover:bg-[#1F7A8C]/10 transition-colors"
                          >
                            <item.icon size={15} className="text-[#1F7A8C]" />
                            {item.label}
                          </Link>
                        ))}
                        <div className="my-1.5 mx-3 border-t border-[#1F7A8C]/15" />
                        <button
                          onClick={() => { logout(); navigate('/'); setProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#BFDBF7]/50 hover:text-[#BFDBF7] hover:bg-[#1F7A8C]/10 transition-colors"
                        >
                          <LogOut size={15} className="text-[#1F7A8C]" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[#BFDBF7]/70 hover:text-[#BFDBF7] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-[#1F7A8C] hover:bg-[#155E70] text-[#BFDBF7] text-sm font-semibold rounded-xl transition-all shadow-lg shadow-[#1F7A8C40] hover:shadow-[#1F7A8C60]"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2.5 rounded-xl text-[#BFDBF7]/70 hover:text-[#BFDBF7] hover:bg-[#1F7A8C]/15 transition-all"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#022B3A]/98 backdrop-blur-xl border-b border-[#1F7A8C]/15 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'text-[#BFDBF7] bg-[#1F7A8C]/20' : 'text-[#BFDBF7]/60 hover:text-[#BFDBF7] hover:bg-[#1F7A8C]/10'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {isAuthenticated ? (
                <>
                  <NavLink to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-[#BFDBF7]/60 hover:text-[#BFDBF7] hover:bg-[#1F7A8C]/10">Dashboard</NavLink>
                  <NavLink to="/profile" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-[#BFDBF7]/60 hover:text-[#BFDBF7] hover:bg-[#1F7A8C]/10">Profile</NavLink>
                  <button onClick={() => { logout(); navigate('/'); setMobileOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-[#BFDBF7]/60 hover:text-[#BFDBF7] hover:bg-[#1F7A8C]/10">Sign Out</button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 py-2.5 text-center text-sm font-medium text-[#BFDBF7]/70 border border-[#1F7A8C]/30 rounded-xl hover:border-[#1F7A8C] hover:text-[#BFDBF7] transition-colors">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 py-2.5 text-center text-sm font-semibold bg-[#1F7A8C] text-[#BFDBF7] rounded-xl hover:bg-[#155E70] transition-colors">Join Now</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
