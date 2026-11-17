export const colors = {
  primary: '#2563eb',
  primaryLight: '#eaf2ff',
  danger: '#dc2626',
  success: '#22c55e',
  warning: '#f59e0b',

  black: '#111',
  dark: '#222',
  gray700: '#333',
  gray600: '#555',
  gray500: '#666',
  gray400: '#777',
  gray300: '#888',
  gray200: '#999',
  gray100: '#ccc',
  border: '#e5e5e5',
  separator: '#eee',
  background: '#f5f5f5',
  card: '#fff',
  white: '#fff',
};

export const statusColors: Record<string, string> = {
  online: colors.success,
  away: colors.warning,
  busy: colors.danger,
  offline: colors.gray200,
};

export const statusLabels: Record<string, string> = {
  online: 'Online',
  away: 'Ausente',
  busy: 'Ocupado',
  offline: 'Offline',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 16,
  xl: 20,
  full: 999,
};

export const fontSize = {
  xs: 11,
  sm: 12,
  md: 13,
  base: 14,
  lg: 15,
  xl: 16,
  '2xl': 18,
  '3xl': 24,
  '4xl': 28,
  '5xl': 30,
  '6xl': 48,
};
