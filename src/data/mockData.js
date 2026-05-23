/**
 * mockData.js
 *
 * Static form constants are kept here (blood groups, cities, urgency levels).
 * All actual records (donors, requests, history, stats) come from FastAPI.
 *
 * API shape references:
 *   Donor:           { id, name, bloodGroup, city, phone, email, available, donationCount, lastDonation, rating, verified }
 *   BloodRequest:    { id, patientName, bloodGroup, hospital, city, units, urgency, status, createdAt, contactPhone }
 *   DonationHistory: { id, date, hospital, units, bloodGroup, recipient }
 *   Notification:    { id, type, message, time, read }
 *   Stats:           { totalDonors, livesSaved, citiesCovered, avgResponseTime }
 */

// ── Static Constants (used by forms / dropdowns) ──────────────────────────

export const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export const URGENCY_LEVELS = [
  { value: 'critical', label: 'Critical — Needed within 1 hour' },
  { value: 'urgent',   label: 'Urgent — Needed within 6 hours' },
  { value: 'moderate', label: 'Moderate — Needed within 24 hours' },
  { value: 'routine',  label: 'Routine — Scheduled donation' },
];

export const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Surat', 'Kanpur', 'Nagpur', 'Visakhapatnam', 'Indore',
  'Thane', 'Bhopal', 'Patna', 'Vadodara', 'Ghaziabad',
  'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut',
  'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad',
  'Amritsar', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore',
  'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota',
  'Chandigarh', 'Guwahati', 'Solapur', 'Hubballi', 'Tiruchirappalli',
  'Bareilly', 'Aligarh', 'Moradabad', 'Mysuru', 'Gurgaon',
];

// ── Empty data arrays — all replaced by FastAPI responses ─────────────────

export const donors = [];
export const bloodRequests = [];
export const donationHistory = [];
export const notifications = [];
export const testimonials = [];

export const features = [
  { title: 'Instant Emergency Matching', description: 'AI-powered matching connects critical patients with compatible donors in under 5 minutes across your city.', icon: 'Zap' },
  { title: 'Real-Time Availability', description: 'Donors update their availability in real-time, ensuring requests always reach ready volunteers.', icon: 'Clock' },
  { title: 'Verified Donor Network', description: 'Every donor undergoes digital verification. Trust in every match, safety in every donation.', icon: 'ShieldCheck' },
  { title: 'Multi-City Coverage', description: 'Active networks across 48+ Indian cities with local coordinators ensuring rapid response.', icon: 'MapPin' },
  { title: 'Health Tracking', description: 'Donors maintain health records and receive reminders for eligible donation windows.', icon: 'Heart' },
  { title: 'Emergency Alerts', description: 'Instant SMS and push notifications alert nearby donors the moment a critical request is posted.', icon: 'Bell' },
];

export const stats = {
  totalDonors: 0,
  livesSaved: 0,
  citiesCovered: 0,
  avgResponseTime: '--',
};
