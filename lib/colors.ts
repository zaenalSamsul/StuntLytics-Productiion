// Blue Mint Clinical Premium design tokens used by data visualizations.
export const COLORS = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#60A5FA',
  secondary: '#14B8A6',
  secondaryDark: '#0F766E',
  secondaryLight: '#5EEAD4',
  tertiary: '#64748B',
  tertiaryDark: '#475569',
  tertiaryLight: '#94A3B8',
  accent: '#D97706',
  accentDark: '#B45309',
  accentLight: '#F59E0B',
  danger: '#DC2626',
  dangerDark: '#B91C1C',
  dangerLight: '#EF4444',
  riskVeryLow: '#16A34A',
  riskLow: '#0284C7',
  riskModerate: '#D97706',
  riskHigh: '#EA580C',
  riskCritical: '#DC2626',
  riskNoData: '#94A3B8',
  bgApp: '#F7FAFC',
  bgSidebar: '#FFFFFF',
  bgSurface: '#FFFFFF',
  bgElevated: '#F5F9FF',
  bgSubtle: '#F1F7FA',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textInverse: '#FFFFFF',
  borderDefault: '#E2E8F0',
  borderSubtle: '#EDF2F7',
  borderFocus: '#BFDBFE',
} as const

export const getRiskColor = (prevalence: number): string => {
  if (prevalence < 10) return COLORS.riskVeryLow
  if (prevalence < 40) return COLORS.riskLow
  if (prevalence < 70) return COLORS.riskModerate
  if (prevalence < 85) return COLORS.riskHigh
  return COLORS.riskCritical
}

export const getRiskLabel = (prevalence: number): string => {
  if (prevalence < 10) return 'Very Low Risk'
  if (prevalence < 40) return 'Low Risk'
  if (prevalence < 70) return 'Moderate Risk'
  if (prevalence < 85) return 'High Risk'
  return 'Critical Risk'
}
