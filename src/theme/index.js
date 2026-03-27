export const Colors = {
  // Brand
  primary: '#FF6B35',
  primaryLight: '#FF8C5A',
  primaryDark: '#E55520',

  // Secondary
  navy: '#2D3561',
  navyLight: '#3D4780',

  // Accent
  teal: '#4ECDC4',
  tealLight: '#A8DADC',

  // Status
  success: '#52B788',
  successLight: '#D8F3DC',
  warning: '#FFB347',
  warningLight: '#FFF3E0',
  danger: '#E63946',
  dangerLight: '#FFE5E7',

  // Backgrounds
  background: '#FFF9F5',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F0FF',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textWhite: '#FFFFFF',

  // Borders
  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  // Member profile colors
  profileColors: [
    '#FF6B6B', // coral
    '#4A90D9', // blue
    '#9B59B6', // purple
    '#27AE60', // green
    '#E67E22', // orange
    '#1ABC9C', // teal
    '#E91E8C', // pink
    '#F39C12', // yellow
  ],
};

export const Typography = {
  // Font sizes — normal mode
  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 22,
  xl: 26,
  xxl: 32,
  xxxl: 40,

  // Font sizes — large text mode (1.3x)
  xsLarge: 16,
  smLarge: 18,
  baseLarge: 21,
  mdLarge: 23,
  lgLarge: 28,
  xlLarge: 34,
  xxlLarge: 42,
  xxxlLarge: 52,

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Returns font size based on large text preference
export const fontSize = (size, largeText = false) => {
  if (!largeText) return size;
  return Math.round(size * 1.3);
};

export const CategoryColors = {
  appointment: '#4A90D9',
  medication: '#9B59B6',
  errand: '#E67E22',
  call: '#1ABC9C',
  chore: '#27AE60',
  other: '#6B7280',
};

export const CategoryIcons = {
  appointment: 'calendar',
  medication: 'medical-bag',
  errand: 'shopping',
  call: 'phone',
  chore: 'home',
  other: 'dots-horizontal',
};
