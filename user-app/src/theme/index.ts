/**
 * Lifeline 360 design tokens, taken from the approved design canvas.
 * Teal + white lead; the pastels come from the logo petals and give every
 * service one colour across the app. Red is reserved for emergencies.
 */
export const colors = {
  teal: '#128078',
  tealDark: '#0F6B66',
  tealDeep: '#0B3B3A',
  tealSoft: '#DDF1EC',
  tealTint: '#E6F5F2',
  tealLine: '#9CCFC8',

  ink: '#1C2340',
  ink2: '#4A5170',
  muted: '#646A88',
  faint: '#9AA0B4',

  bg: '#F4F6F5',
  surface: '#FFFFFF',
  surface2: '#F2F4F3',
  line: '#E6E9E8',
  lineStrong: '#D4D8D7',

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
};

export type ServiceKey =
  | 'doctor'
  | 'medicine'
  | 'nursing'
  | 'ambulance'
  | 'lab'
  | 'blood'
  | 'membership';

/** One service, one colour: tint background, accent and readable text. */
export const service: Record<ServiceKey, { bg: string; fg: string; text: string; label: string }> = {
  doctor: { bg: '#DDF1EC', fg: '#128078', text: '#0B3B3A', label: 'Doctor' },
  medicine: { bg: '#E2F5EA', fg: '#1A8A57', text: '#0E4A31', label: 'Medicine' },
  nursing: { bg: '#ECE9FB', fg: '#6F5BC9', text: '#3A2E86', label: 'Nursing' },
  ambulance: { bg: '#FDECEC', fg: '#D13238', text: '#A3212A', label: 'Ambulance' },
  lab: { bg: '#E3EFFB', fg: '#1D6FAE', text: '#0E3F66', label: 'Lab test' },
  blood: { bg: '#FDE8EF', fg: '#C62E57', text: '#9B1C47', label: 'Blood bank' },
  membership: { bg: '#FFF6DA', fg: '#C99A12', text: '#7A5A00', label: 'Membership' },
};

export const font = {
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semibold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
  extrabold: 'PlusJakartaSans-ExtraBold',
};

export type FontWeight = keyof typeof font;

export const radius = { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 };

export const shadow = {
  card: { boxShadow: '0px 1px 3px rgba(28, 35, 64, 0.08)' },
  raised: { boxShadow: '0px 4px 14px rgba(28, 35, 64, 0.12)' },
  sheet: { boxShadow: '0px -4px 20px rgba(28, 35, 64, 0.12)' },
};
