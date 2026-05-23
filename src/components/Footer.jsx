import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Heart, Mail, Phone, MapPin, GitFork, Share2, Link2 } from 'lucide-react';
import BloodCompatibilityModal from './ui/BloodCompatibilityModal';

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const year = new Date().getFullYear();

  const links = {
    Platform: [
      { to: '/find-donors', label: 'Find Donors' },
      { to: '/request-blood', label: 'Request Blood' },
      { to: '/register', label: 'Become a Donor' },
      { to: '/dashboard', label: 'Dashboard' },
    ],
    Resources: [
      { onClick: () => setIsModalOpen(true), label: 'Blood Compatibility Guide' },
      { to: '#', label: 'Donation Guidelines' },
      { to: '#', label: 'FAQ' },
      { to: '#', label: 'Emergency Hotline' },
    ],
    Company: [
      { to: '#', label: 'About Us' },
      { to: '#', label: 'Mission & Vision' },
      { to: '#', label: 'Privacy Policy' },
      { to: '#', label: 'Terms of Service' },
    ],
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <footer className="bg-[#011E28] border-t border-[#1F7A8C]/12 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-[#1F7A8C] rounded-xl flex items-center justify-center shadow-lg shadow-[#1F7A8C40]">
                <Heart size={18} className="text-[#BFDBF7] fill-[#BFDBF7]" />
              </div>
              <span className="text-xl font-bold font-display text-[#BFDBF7]">
                Blood<span className="text-[#BFDBF7]">Link</span>
              </span>
            </Link>
            <p className="text-sm text-[#BFDBF7]/50 leading-relaxed max-w-xs mb-6">
              Connecting life-saving donors with patients in critical need. Every drop counts — join 12,000+ verified donors across India.
            </p>

            {/* Contact */}
            <div className="space-y-2.5">
              {[
                { icon: Phone, text: '1800-BLOOD-HELP (Emergency)' },
                { icon: Mail, text: 'emergency@bloodlink.in' },
                { icon: MapPin, text: 'Available across 48+ Indian cities' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-[#BFDBF7]/40">
                  <Icon size={14} className="text-[#1F7A8C] flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-[#BFDBF7] mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item.label}>
                    {item.onClick ? (
                      <button
                        onClick={item.onClick}
                        className="text-sm text-[#BFDBF7]/45 hover:text-[#BFDBF7] transition-colors text-left w-full"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        to={item.to}
                        className="text-sm text-[#BFDBF7]/45 hover:text-[#BFDBF7] transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Blood Groups Strip */}
        <div className="border-t border-b border-[#1F7A8C]/10 py-6 mb-8">
          <p className="text-xs text-[#BFDBF7]/30 text-center mb-4 uppercase tracking-wider">We match all blood groups</p>
          <div className="flex flex-wrap justify-center gap-3">
            {bloodGroups.map(group => (
              <div
                key={group}
                className="w-10 h-10 rounded-xl bg-[#1F7A8C]/15 border border-[#1F7A8C]/25 flex items-center justify-center text-xs font-bold text-[#BFDBF7]/70 hover:bg-[#1F7A8C]/30 hover:text-[#BFDBF7] transition-all cursor-default"
              >
                {group}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#BFDBF7]/30">
            © {year} BloodLink. Built with ❤️ to save lives. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[GitFork, Share2, Link2].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="p-2 rounded-lg text-[#BFDBF7]/30 hover:text-[#1F7A8C] hover:bg-[#1F7A8C]/10 transition-all"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <BloodCompatibilityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </footer>
  );
}
