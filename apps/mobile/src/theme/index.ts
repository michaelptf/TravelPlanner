export const colors = {
  // Warm sunset-inspired palette
  coral: '#FF6B6B',
  peach: '#FFA566',
  lightPeach: '#FFD4A3',
  warmCream: '#FFF5E6',
  softShadow: '#F5E6D3',
  darkText: '#2C2C2C',
  mutedText: '#7A7A7A',
  accentGold: '#FFB347',
  lightBg: '#FFFAF5',
  cardBg: '#FFFFFF',
  borderLight: '#FFE0CC',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700', color: colors.darkText },
  h2: { fontSize: 22, fontWeight: '600', color: colors.darkText },
  body: { fontSize: 16, fontWeight: '400', color: colors.darkText },
  caption: { fontSize: 14, fontWeight: '400', color: colors.mutedText },
  small: { fontSize: 12, fontWeight: '400', color: colors.mutedText },
};

export const shadows = {
  soft: { shadowColor: colors.coral, shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 },
  medium: { shadowColor: colors.peach, shadowOpacity: 0.2, shadowRadius: 12, elevation: 5 },
};

export default { colors, spacing, typography, shadows };
