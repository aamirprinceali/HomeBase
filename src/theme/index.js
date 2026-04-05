export const Colors = {
  // Brand
  primary: '#7D8FEF',
  primaryLight: '#A9B5FF',
  primaryDark: '#5E73DD',

  // Accent
  accent: '#BFD7FF',
  accentLight: '#DDE9FF',

  // Teal (kept for compatibility)
  teal: '#8BCBC4',
  tealLight: '#CDEBE6',

  // Navy (kept for compatibility)
  navy: '#6E84A3',
  navyLight: '#A5B4CC',

  // Status
  success: '#64B99F',
  successLight: '#E6F5EF',
  warning: '#E7B77A',
  warningLight: '#FFF3E4',
  danger: '#D9818B',
  dangerLight: '#FBECEF',

  // Backgrounds — light
  background: '#F7F5F2',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F1FB',
  surfaceElevated: '#EEF3FB',

  // Text
  textPrimary: '#22324D',
  textSecondary: '#6F7E96',
  textLight: '#9EACC0',
  textWhite: '#FFFFFF',

  // Borders
  border: '#E2E8F2',
  borderLight: '#EEF2F7',

  // Member profile colors
  profileColors: [
    '#7D8FEF',
    '#8BCBC4',
    '#DDAE79',
    '#D9818B',
    '#9DB4D3',
    '#9B86D8',
    '#7AA6F8',
    '#F0B9A8',
  ],
};

export const Typography = {
  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 22,
  xl: 26,
  xxl: 32,
  xxxl: 42,

  xsLarge: 16,
  smLarge: 18,
  baseLarge: 21,
  mdLarge: 23,
  lgLarge: 28,
  xlLarge: 34,
  xxlLarge: 42,
  xxxlLarge: 54,

  fontFamily: {
    regular: 'Outfit_400Regular',
    medium: 'Outfit_500Medium',
    semibold: 'Outfit_600SemiBold',
    bold: 'Outfit_700Bold',
    extrabold: 'Outfit_800ExtraBold',
  },

  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#A5B4CC',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 2,
  },
  md: {
    shadowColor: '#9AA9C2',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  lg: {
    shadowColor: '#97A8C5',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 12,
  },
};

export const fontSize = (size, largeText = false) => {
  if (!largeText) return size;
  return Math.round(size * 1.3);
};

export const CategoryColors = {
  appointment: '#7AA6F8',
  medication: '#A38CE0',
  errand: '#E7B77A',
  call: '#8BCBC4',
  chore: '#64B99F',
  other: '#9EACC0',
};

export const CategoryIcons = {
  appointment: 'calendar',
  medication: 'medical-bag',
  errand: 'shopping',
  call: 'phone',
  chore: 'home',
  other: 'dots-horizontal',
};
