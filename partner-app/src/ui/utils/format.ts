/**
 * Formats a number to Indian Rupee notation (e.g. ₹1,250 or − ₹500).
 */
export const rupees = (n: number | null | undefined): string =>
  n == null ? '—' : (n < 0 ? '− ₹' : '₹') + Math.round(Math.abs(n)).toLocaleString('en-IN');

/**
 * Returns contextual greeting string.
 */
export function greeting(d = new Date()): string {
  const h = d.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Converts a millisecond timestamp to human-readable relative time string.
 */
export function timeAgo(at: number | Date | string): string {
  const timeMs = typeof at === 'number' ? at : new Date(at).getTime();
  const m = Math.round((Date.now() - timeMs) / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
}

/**
 * Extracts first name from a full name string, with a fallback.
 */
export const firstName = (name?: string, fallback = 'there'): string =>
  (name || '').trim().split(' ')[0] || fallback;

/**
 * Formats and masks phone number for privacy (+91 98••• ••210).
 */
export const maskPhone = (p: string): string =>
  p.length >= 10 ? `+91 ${p.slice(0, 2)}••• ••${p.slice(-3)}` : p;

/**
 * Formats seconds into mm:ss format.
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_MS = 86400000;

export const startOfDay = (at: number): number => {
  const d = new Date(at);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

/** 8:05 AM */
export function formatTime(at: number): string {
  const d = new Date(at);
  const h = d.getHours();
  const m = d.getMinutes();
  return `${h % 12 || 12}:${m < 10 ? '0' : ''}${m} ${h < 12 ? 'AM' : 'PM'}`;
}

/** Today / Tomorrow / Yesterday / Mon, 2 Nov */
export function formatDay(at: number, now = Date.now()): string {
  const diff = Math.round((startOfDay(at) - startOfDay(now)) / DAY_MS);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  const d = new Date(at);
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export const formatDayTime = (at: number, now = Date.now()): string => `${formatDay(at, now)}, ${formatTime(at)}`;

/** 2 Nov 2026 */
export function formatDate(at: number): string {
  const d = new Date(at);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** YYYY-MM-DD in local time, used for leave days. */
export function isoDate(at: number): string {
  const d = new Date(at);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${d.getFullYear()}-${m < 10 ? '0' : ''}${m}-${day < 10 ? '0' : ''}${day}`;
}

export const weekdayShort = (at: number): string => WEEKDAYS[new Date(at).getDay()];

/** 1h 05m · 12m 30s */
export function formatElapsed(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m < 10 ? '0' : ''}${m}m`;
  const sec = s % 60;
  return `${m}m ${sec < 10 ? '0' : ''}${sec}s`;
}
