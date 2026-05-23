import { Outlet, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Menu, Bell, ChevronRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useApp } from '../context/AppContext';

const BREADCRUMB_MAP = {
  '/dashboard': [{ label: 'Dashboard' }],
  '/admin':     [{ label: 'Admin Panel' }],
  '/profile':   [{ label: 'Profile' }],
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, unreadCount } = useApp();
  const { pathname } = useLocation();

  const crumbs = BREADCRUMB_MAP[pathname] || [{ label: 'Page' }];

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
            <button
              aria-label="Notifications"
              className="relative p-2.5 rounded-xl text-[#BFDBF7]/50 hover:text-[#BFDBF7] hover:bg-[#1F7A8C]/15 transition-all"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1F7A8C] rounded-full animate-pulse" />
              )}
            </button>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1F7A8C] to-[#155E70] flex items-center justify-center text-sm font-bold text-[#BFDBF7] cursor-pointer shadow-md shadow-[#1F7A8C40]">
              {user?.name?.charAt(0)}
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
