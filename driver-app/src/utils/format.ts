export const rupees = (n: number | null | undefined) =>
  n == null ? '—' : (n < 0 ? '− ₹' : '₹') + Math.round(Math.abs(n)).toLocaleString('en-IN');

export function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function timeAgo(at: number) {
  const m = Math.round((Date.now() - at) / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export const firstName = (name?: string) => (name || '').trim().split(' ')[0] || 'Driver';

export const maskPhone = (p: string) => (p.length >= 10 ? `+91 ${p.slice(0, 2)}••• ••${p.slice(-3)}` : p);

export const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

