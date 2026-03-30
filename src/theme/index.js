export const Colors = {
  // Brand
  primary: '#7C3AED',       // electric purple
  primaryLight: '#A855F7',
  primaryDark: '#5B21B6',

  // Accent
  accent: '#06B6D4',        // cyan
  accentLight: '#67E8F9',

  // Teal (kept for compatibility)
  teal: '#06B6D4',
  tealLight: '#67E8F9',

  // Navy (kept for compatibility)
  navy: '#0F0F1A',
  navyLight: '#1A1A2E',

  // Status
  success: '#10B981',
  successLight: '#064E3B',
  warning: '#F59E0B',
  warningLight: '#451A03',
  danger: '#EF4444',
  dangerLight: '#450A0A',

  // Backgrounds — dark
  background: '#0A0A14',
  surface: '#13131F',
  surfaceAlt: '#1C1C2E',
  surfaceElevated: '#222236',

  // Text
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textLight: '#475569',
  textWhite: '#FFFFFF',

  // Borders
  border: '#1E293B',
  borderLight: '#0F172A',

  // Member profile colors
  profileColors: [
    '#EF4444',
    '#3B82F6',
    '#8B5CF6',
    '#10B981',
    '#F59E0B',
    '#06B6D4',
    '#EC4899',
    '#F97316',
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
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
};

export const fontSize = (size, largeText = false) => {
  if (!largeText) return size;
  return Math.round(size * 1.3);
};

export const CategoryColors = {
  appointment: '#3B82F6',
  medication: '#8B5CF6',
  errand: '#F97316',
  call: '#06B6D4',
  chore: '#10B981',
  other: '#475569',
};

export const CategoryIcons = {
  appointment: 'calendar',
  medication: 'medical-bag',
  errand: 'shopping',
  call: 'phone',
  chore: 'home',
  other: 'dots-horizontal',
};
