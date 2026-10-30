import { FontWeight, ServiceInfo, ServiceKey } from './types';

export * from './types';

/**
 * Lifeline 360 Design Tokens.
 * - Teal + White lead as primary brand palette.
 * - Service pastel tokens: Medicine (#E2F5EA mint) and Nursing (#ECE9FB lavender)
 * - Navy palette for high-contrast driver/partner alert sheets and dark widgets.
 * - Red is strictly reserved for emergency actions and cancellations.
 */
export const colors = {
  // Brand Teals
  teal: '#128078',
  tealDark: '#0F6B66',
  tealDeep: '#0B3B3A',
  tealSoft: '#DDF1EC',
  tealTint: '#E6F5F2',
  tealLine: '#9CCFC8',

  // Ink / Typography
  ink: '#1C2340',
  ink2: '#4A5170',
  muted: '#646A88',
  faint: '#9AA0B4',

  // Backgrounds & Surfaces
  bg: '#F4F6F5',
  surface: '#FFFFFF',
  surface2: '#F2F4F3',
  line: '#E6E9E8',
  lineStrong: '#D4D8D7',

  // Alerts & Status Accents
  green: '#1A8A57',
  greenSoft: '#E5F7EE',
  greenText: '#136B45',

  amber: '#C99A12',
  amberSoft: '#FFF6DA',
  amberText: '#7A5A00',

  red: '#D13238',
  redSoft: '#FDECEC',
  redText: '#A3212A',

  sky: '#1D6FAE',
  skySoft: '#E3EFFB',
  skyText: '#11568A',

  white: '#FFFFFF',

  // Driver & Partner Dark / Night Palette
  navy: '#0B1B2B',
  navyCard: '#13263A',
  navySurface: '#182E46',
  navyLine: '#1E3B59',
  navyMuted: '#8E9CAE',
  navyText: '#EBF1F7',
};

/**
 * One Service, One Colour dictionary.
 * Maps service categories to accessible background, accent foreground, and text colors.
 */
export const service: Record<ServiceKey, ServiceInfo> = {
  doctor: { bg: '#DDF1EC', fg: '#128078', text: '#0B3B3A', label: 'Doctor' },
  medicine: { bg: '#E2F5EA', fg: '#1A8A57', text: '#0E4A31', label: 'Medicine' },
  nursing: { bg: '#ECE9FB', fg: '#6F5BC9', text: '#3A2E86', label: 'Nursing' },
  ambulance: { bg: '#FDECEC', fg: '#D13238', text: '#A3212A', label: 'Ambulance' },
  lab: { bg: '#E3EFFB', fg: '#1D6FAE', text: '#0E3F66', label: 'Lab test' },
  blood: { bg: '#FDE8EF', fg: '#C62E57', text: '#9B1C47', label: 'Blood bank' },
  membership: { bg: '#FFF6DA', fg: '#C99A12', text: '#7A5A00', label: 'Membership' },
  als: { bg: '#FDECEC', fg: '#D92D20', text: '#A3212A', label: 'Advanced Life Support (ALS)' },
  bls: { bg: '#E3EFFB', fg: '#0BA5EC', text: '#11568A', label: 'Basic Life Support (BLS)' },
  icu: { bg: '#FDE8EF', fg: '#C62E57', text: '#9B1C47', label: 'ICU on Wheels' },
};

export const font: Record<FontWeight, string> = {
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semibold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
  extrabold: 'PlusJakartaSans-ExtraBold',
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const shadow = {
  card: {
    boxShadow: '0px 1px 3px rgba(28, 35, 64, 0.08)',
    elevation: 2,
  },
  raised: {
    boxShadow: '0px 4px 14px rgba(28, 35, 64, 0.12)',
    elevation: 4,
  },
  sheet: {
    boxShadow: '0px -4px 20px rgba(28, 35, 64, 0.12)',
    elevation: 8,
  },
};
