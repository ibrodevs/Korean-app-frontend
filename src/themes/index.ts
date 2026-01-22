export const COLORS = {
  primary: '#F8E9A1',
  error: '#F76C6C',
  secondary: '#A8D0E6',
  heading: '#374785',
  background: '#24305E',
  
  // Дополнительные цвета
  white: '#FFFFFF',
  black: '#000000',
  gray: '#6B7280',
  lightGray: '#E5E7EB',
};

export const lightTheme = {
  ...COLORS,
  text: '#1F2937',
  textSecondary: '#6B7280',
  card: '#FFFFFF',
  border: '#E5E7EB',
  background: '#F9FAFB',
  navBackground: '#24305E',
};

export const darkTheme = {
  ...COLORS,
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  card: '#1F2937',
  border: '#374151',
  background: '#111827',
  navBackground: '#1E1B4B',
};

export type ThemeType = typeof lightTheme;
export type ColorKey = keyof typeof COLORS;