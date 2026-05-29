import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  Menu, Bell, ChevronRight, User, LayoutDashboard, 
  Droplets, Users, LogOut 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useApp } from '../context/AppContext';

const BREADCRUMB_MAP = {
  '/dashboard': [{ label: 'Dashboard' }],
  '/admin':     [{ label: 'Admin Panel' }],
  '/profile':   [{ label: 'Profile' }],
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, unreadCount, logout } = useApp();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const crumbs = BREADCRUMB_MAP[pathname] || [{ label: 'Page' }];

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#022B3A] flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#022B3A]/95 backdrop-blur-xl border-b border-[#1F7A8C]/12 px-4 sm:px-6 h-14 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="lg:hidden p-2 rounded-xl text-[#BFDBF7]/50 hover:text-[#BFDBF7] hover:bg-[#1F7A8C]/15 transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
              <Link to="/" className="text-[#BFDBF7]/30 hover:text-[#BFDBF7]/60 transition-colors hidden sm:block">
                BloodLink
              </Link>
              <ChevronRight size={12} className="text-[#1F7A8C]/30 hidden sm:block" />
              {crumbs.map((crumb, i) => (
                <span
                  key={i}
                  className={i === crumbs.length - 1 ? 'text-[#BFDBF7]/80 font-medium' : 'text-[#BFDBF7]/40'}
                >
                  {crumb.label}
                </span>
              ))}
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/request-blood"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#1F7A8C] hover:bg-[#155E70] text-[#BFDBF7] text-xs font-semibold rounded-xl transition-all shadow-lg shadow-[#1F7A8C40]"
            >
              🩸 Emergency Request
            </Link>
            <Link
              to="/dashboard"
              aria-label="Notifications"
              className="relative p-2.5 rounded-xl text-[#BFDBF7]/50 hover:text-[#BFDBF7] hover:bg-[#1F7A8C]/15 transition-all"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1F7A8C] rounded-full animate-pulse" />
              )}
            </Link>
            
            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="User menu"
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1F7A8C] to-[#155E70] flex items-center justify-center text-sm font-bold text-[#BFDBF7] cursor-pointer shadow-md shadow-[#1F7A8C40] hover:scale-105 transition-transform"
              >
                {user?.name?.charAt(0) ?? 'U'}
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-[#033A4E] border border-[#1F7A8C]/20 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden py-1.5 z-50"
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
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#BFDBF7]/50 hover:text-[#BFDBF7] hover:bg-[#1F7A8C]/10 transition-colors text-left"
                    >
                      <LogOut size={15} className="text-[#1F7A8C]" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <motion.main
          key={pathname}
          className="flex-1 p-4 sm:p-6 overflow-x-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
