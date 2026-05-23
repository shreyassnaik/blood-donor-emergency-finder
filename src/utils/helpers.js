import { clsx } from 'clsx';

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  return `${Math.floor(months / 12)} year${Math.floor(months / 12) > 1 ? 's' : ''} ago`;
}

export function getUrgencyConfig(urgency) {
  const configs = {
    critical: {
      label: 'Critical',
      bg: 'bg-[#1F7A8C]/20',
      text: 'text-[#BFDBF7]',
      border: 'border-[#1F7A8C]',
      dot: 'bg-[#1F7A8C]',
    },
    urgent: {
      label: 'Urgent',
      bg: 'bg-[#22909F]/20',
      text: 'text-[#22909F]',
      border: 'border-[#22909F]',
      dot: 'bg-[#22909F]',
    },
    moderate: {
      label: 'Moderate',
      bg: 'bg-[#BFDBF7]/20',
      text: 'text-[#BFDBF7]',
      border: 'border-[#BFDBF7]',
      dot: 'bg-[#BFDBF7]',
    },
    routine: {
      label: 'Routine',
      bg: 'bg-[#E1E5F2]/20',
      text: 'text-[#E1E5F2]',
      border: 'border-[#E1E5F2]',
      dot: 'bg-[#E1E5F2]',
    },
  };
  return configs[urgency] || configs.routine;
}

export function getBloodGroupColor(group) {
  const colors = {
    'O+':  '#1F7A8C',
    'O-':  '#155E70',
    'A+':  '#BFDBF7',
    'A-':  '#22909F',
    'B+':  '#E1E5F2',
    'B-':  '#BFDBF7',
    'AB+': '#E1E5F2',
    'AB-': '#22909F',
  };
  return colors[group] || '#1F7A8C';
}

export function generateInitials(name) {
  if (!name) return '??';
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export function daysSinceDonation(dateString) {
  if (!dateString) return null;
  const diff = new Date() - new Date(dateString);
  return Math.floor(diff / 86400000);
}

export function canDonateAgain(lastDonation) {
  const days = daysSinceDonation(lastDonation);
  return days === null || days >= 90;
}
