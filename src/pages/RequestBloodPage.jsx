import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Droplets, AlertTriangle, FileText, Building2, Hash, Send, CheckCircle, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import FormInput, { FormSelect, FormTextarea } from '../components/ui/FormInput';
import Button from '../components/ui/Button';
import { BLOOD_GROUPS, CITIES, URGENCY_LEVELS } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function RequestBloodPage() {
  const { user } = useApp();
  const [form, setForm] = useState({
    patientName: '', bloodGroup: '', hospital: '', units: '1',
    urgency: '', city: '', notes: '', contactPhone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.patientName.trim()) errs.patientName = 'Patient name required';
    if (!form.bloodGroup) errs.bloodGroup = 'Blood group required';
    if (!form.hospital.trim()) errs.hospital = 'Hospital name required';
    if (!form.units || isNaN(form.units) || +form.units < 1) errs.units = 'Enter valid units (min 1)';
    if (!form.urgency) errs.urgency = 'Select urgency level';
    if (!form.city) errs.city = 'City required';
    if (!form.contactPhone.trim()) errs.contactPhone = 'Contact phone required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    if (!user) {
      toast.error('You must be logged in to post a request');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          patient_name: form.patientName,
          blood_group: form.bloodGroup,
          hospital: form.hospital,
          city: form.city,
          units: parseInt(form.units),
          urgency: form.urgency,
          contact_phone: form.contactPhone,
          requester_id: user.id || user.user_id
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success('Emergency request posted! Notifying nearby donors...', {
          duration: 5000,
          style: { background: '#033A4E', color: '#BFDBF7', border: '1px solid #1F7A8C' }
        });
      } else {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to post request');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedUrgency = URGENCY_LEVELS.find(u => u.value === form.urgency);

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-24 h-24 bg-[#E1E5F2]/15 border-2 border-[#E1E5F2]/40 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle size={44} className="text-[#E1E5F2]" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-3xl font-bold font-display text-[#BFDBF7] mb-4">Request Submitted!</h2>
          <p className="text-[#BFDBF7]/60 mb-4">
            Your emergency request for <span className="text-[#BFDBF7] font-semibold">{form.bloodGroup}</span> blood has been posted.
          </p>
          <p className="text-sm text-[#BFDBF7]/40 mb-8">
            We are notifying {form.city} donors right now. You will receive SMS alerts as donors respond.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => setSubmitted(false)} variant="primary">Post Another Request</Button>
            <Button variant="ghost" onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#1F7A8C] rounded-xl flex items-center justify-center shadow-lg shadow-[#1F7A8C40]">
            <AlertTriangle size={20} className="text-[#BFDBF7]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-[#BFDBF7]">Emergency Blood Request</h1>
            <p className="text-xs text-[#BFDBF7]/40">Fill all details to notify nearby verified donors instantly</p>
          </div>
        </div>

        {/* Urgency Banner */}
        {selectedUrgency && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 rounded-2xl border flex items-center gap-3"
            style={{ background: `${selectedUrgency.color}12`, borderColor: `${selectedUrgency.color}30` }}
          >
            <div className="w-3 h-3 rounded-full flex-shrink-0 animate-pulse" style={{ background: selectedUrgency.color }} />
            <p className="text-sm font-medium" style={{ color: selectedUrgency.color }}>
              {selectedUrgency.label}
            </p>
          </motion.div>
        )}
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        noValidate
      >
        <div className="bg-[#033A4E]/60 border border-[#1F7A8C]/15 rounded-2xl p-6 space-y-6">
          {/* Patient Info */}
          <div>
            <h2 className="text-sm font-semibold text-[#BFDBF7]/60 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User size={14} className="text-[#1F7A8C]" /> Patient Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <FormInput
                label="Patient Name"
                id="patient-name"
                placeholder="e.g. Rajesh Kumar"
                icon={User}
                value={form.patientName}
                onChange={e => set('patientName', e.target.value)}
                error={errors.patientName}
                required
              />
              <div>
                <p className="text-sm font-medium text-[#BFDBF7]/80 mb-1.5">
                  Blood Group Required <span className="text-[#E1E5F2]">*</span>
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => set('bloodGroup', g)}
                      className={`py-2.5 rounded-xl border-2 font-bold text-xs transition-all ${
                        form.bloodGroup === g
                          ? 'border-[#1F7A8C] bg-[#1F7A8C] text-[#BFDBF7] shadow-lg shadow-[#1F7A8C40]'
                          : 'border-[#1F7A8C]/20 text-[#BFDBF7]/55 hover:border-[#1F7A8C]/50 bg-[#022B3A]/60'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                {errors.bloodGroup && <p className="text-xs text-[#BFDBF7]/60 mt-1.5"><span className="text-[#1F7A8C]">⚠</span> {errors.bloodGroup}</p>}
              </div>
            </div>
          </div>

          <div className="h-px bg-[#1F7A8C]/10" />

          {/* Hospital Info */}
          <div>
            <h2 className="text-sm font-semibold text-[#BFDBF7]/60 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Building2 size={14} className="text-[#1F7A8C]" /> Hospital Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <FormInput
                label="Hospital Name"
                id="hospital"
                placeholder="e.g. Apollo Hospital, Mumbai"
                icon={Building2}
                value={form.hospital}
                onChange={e => set('hospital', e.target.value)}
                error={errors.hospital}
                required
              />
              <FormInput
                label="Contact Phone Number"
                id="contact-phone"
                placeholder="e.g. +91 98765 43210"
                icon={Phone}
                value={form.contactPhone}
                onChange={e => set('contactPhone', e.target.value)}
                error={errors.contactPhone}
                required
              />
              <FormSelect
                label="City"
                id="req-city"
                icon={MapPin}
                options={[{ value: '', label: 'Select city' }, ...CITIES.map(c => ({ value: c, label: c }))]}
                value={form.city}
                onChange={e => set('city', e.target.value)}
                error={errors.city}
                required
              />
            </div>
          </div>

          <div className="h-px bg-[#1F7A8C]/10" />

          {/* Request Details */}
          <div>
            <h2 className="text-sm font-semibold text-[#BFDBF7]/60 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Droplets size={14} className="text-[#1F7A8C]" /> Request Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <FormInput
                label="Units Required"
                id="units"
                type="number"
                placeholder="e.g. 2"
                icon={Hash}
                min="1"
                max="20"
                value={form.units}
                onChange={e => set('units', e.target.value)}
                error={errors.units}
                hint="Each unit = 450 ml"
                required
              />
              <div>
                <p className="text-sm font-medium text-[#BFDBF7]/80 mb-1.5">
                  Urgency Level <span className="text-[#E1E5F2]">*</span>
                </p>
                <div className="space-y-2">
                  {URGENCY_LEVELS.map(u => (
                    <button
                      key={u.value}
                      type="button"
                      onClick={() => set('urgency', u.value)}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                        form.urgency === u.value
                          ? 'border-opacity-100 bg-opacity-15'
                          : 'border-[#1F7A8C]/15 bg-transparent hover:border-[#1F7A8C]/30'
                      }`}
                      style={form.urgency === u.value ? {
                        borderColor: u.color,
                        background: `${u.color}12`,
                      } : {}}
                    >
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: u.color }} />
                      <span className="text-sm font-medium text-[#BFDBF7]/80">{u.label}</span>
                    </button>
                  ))}
                </div>
                {errors.urgency && <p className="text-xs text-[#BFDBF7]/60 mt-1.5"><span className="text-[#1F7A8C]">⚠</span> {errors.urgency}</p>}
              </div>
            </div>
          </div>

          <div className="h-px bg-[#1F7A8C]/10" />

          {/* Notes */}
          <div>
            <h2 className="text-sm font-semibold text-[#BFDBF7]/60 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText size={14} className="text-[#1F7A8C]" /> Additional Notes
            </h2>
            <FormTextarea
              label="Medical Notes (Optional)"
              id="notes"
              placeholder="e.g. Patient is undergoing surgery at 3 PM. Doctor contact: +91 XXXXX XXXXX"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              rows={4}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <p className="text-xs text-[#BFDBF7]/30 text-center sm:text-left">
            Your request will be visible to verified donors in {form.city || 'your city'} instantly.
          </p>
          <Button
            type="submit"
            size="lg"
            loading={loading}
            icon={Send}
            iconPosition="right"
            className="w-full sm:w-auto min-w-48"
          >
            {loading ? 'Posting Request...' : 'Post Emergency Request'}
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
