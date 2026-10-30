/**
 * Lifeline 360 Driver App design tokens.
 * Teal + white for standard screens; high-contrast Dark Navy (#0B1B2B) for
 * incoming emergency alerts, night driving mode, and active trip navigation.
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

  // Alert & status colors
  green: '#12B76A',
  greenSoft: '#E5F7EE',
  greenText: '#136B45',

  amber: '#F79009',
  amberSoft: '#FFF6DA',
  amberText: '#7A5A00',

  red: '#D92D20',
  redSoft: '#FDECEC',
  redText: '#A3212A',

  sky: '#0BA5EC',
  skySoft: '#E3EFFB',
  skyText: '#11568A',

  white: '#FFFFFF',

  // Driver Night / Active Trip theme
  navy: '#0B1B2B',
  navyCard: '#13263A',
  navySurface: '#182E46',
  navyLine: '#1E3B59',
  navyMuted: '#8E9CAE',
  navyText: '#EBF1F7',
};

export const service = {
  ambulance: { bg: '#FDECEC', fg: '#D13238', text: '#A3212A', label: 'Ambulance' },
  als: { bg: '#FDECEC', fg: '#D92D20', text: '#A3212A', label: 'Advanced Life Support (ALS)' },
  bls: { bg: '#E3EFFB', fg: '#0BA5EC', text: '#11568A', label: 'Basic Life Support (BLS)' },
  icu: { bg: '#FDE8EF', fg: '#C62E57', text: '#9B1C47', label: 'ICU on Wheels' },
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
  card: {
    shadowColor: '#1C2340',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  raised: {
    shadowColor: '#1C2340',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  sheet: {
    shadowColor: '#1C2340',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

