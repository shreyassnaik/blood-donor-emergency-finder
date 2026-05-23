import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EmergencyBanner from '../components/EmergencyBanner';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#022B3A]">
      <EmergencyBanner />
      <Navbar />
      <motion.main
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
}
