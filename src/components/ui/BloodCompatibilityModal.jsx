import { Info, Droplets } from 'lucide-react';
import Modal from './Modal';

const COMPATIBILITY_DATA = [
  { type: 'O-', canDonateTo: ['All'], canReceiveFrom: ['O-'] },
  { type: 'O+', canDonateTo: ['O+', 'A+', 'B+', 'AB+'], canReceiveFrom: ['O+', 'O-'] },
  { type: 'A-', canDonateTo: ['A+', 'A-', 'AB+', 'AB-'], canReceiveFrom: ['A-', 'O-'] },
  { type: 'A+', canDonateTo: ['A+', 'AB+'], canReceiveFrom: ['A+', 'A-', 'O+', 'O-'] },
  { type: 'B-', canDonateTo: ['B+', 'B-', 'AB+', 'AB-'], canReceiveFrom: ['B-', 'O-'] },
  { type: 'B+', canDonateTo: ['B+', 'AB+'], canReceiveFrom: ['B+', 'B-', 'O+', 'O-'] },
  { type: 'AB-', canDonateTo: ['AB+', 'AB-'], canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'] },
  { type: 'AB+', canDonateTo: ['AB+'], canReceiveFrom: ['All'] },
];

export default function BloodCompatibilityModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Blood Compatibility Chart">
      <div className="space-y-5">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#BFDBF7]/10 border border-[#BFDBF7]/20">
          <Info size={20} className="text-[#BFDBF7] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-[#BFDBF7]/70 leading-relaxed">
            <p className="font-semibold text-[#BFDBF7] mb-1">Did you know?</p>
            <p><strong>O-</strong> is the universal donor, meaning anyone can receive O- blood.</p>
            <p><strong>AB+</strong> is the universal recipient, meaning they can receive any blood type.</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#1F7A8C]/20">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-[#BFDBF7]/60 uppercase bg-[#1F7A8C]/10">
              <tr>
                <th className="px-4 py-3 font-semibold">Blood Type</th>
                <th className="px-4 py-3 font-semibold">Can Donate To</th>
                <th className="px-4 py-3 font-semibold">Can Receive From</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F7A8C]/10 bg-[#033A4E]/40">
              {COMPATIBILITY_DATA.map((row) => (
                <tr key={row.type} className="hover:bg-[#1F7A8C]/10 transition-colors">
                  <td className="px-4 py-3 font-bold text-[#BFDBF7] flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#1F7A8C]/20 flex items-center justify-center border border-[#1F7A8C]/30">
                      <Droplets size={12} className="text-[#1F7A8C]" />
                    </div>
                    {row.type}
                  </td>
                  <td className="px-4 py-3 text-[#E1E5F2]">
                    {row.canDonateTo.join(', ')}
                  </td>
                  <td className="px-4 py-3 text-[#BFDBF7]">
                    {row.canReceiveFrom.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
