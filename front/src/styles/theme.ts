// Design tokens centralizados.

export const colors = {
  primary: "#2563eb", // azul principal
  primaryHover: "#1d4ed8",
  primaryActive: "#1e40af",
  secondary: "#475569",
  secondaryHover: "#334155",
  danger: "#dc2626",
  dangerHover: "#b91c1c",
  success: "#16a34a",
  warning: "#d97706",

  bgPage: "#f8fafc", 
  surface: "#ffffff",
  surfaceAlt: "#f1f5f9", 
  surfaceHover: "rgba(15, 23, 42, 0.03)",

  border: "#e2e8f0", 
  borderStrong: "#cbd5e1", 

  text: "#0f172a", 
  textMuted: "#64748b", 
  textOnPrimary: "#ffffff",

  errorBg: "#fee2e2",
  errorBorder: "#fecaca",
  errorText: "#991b1b",
} as const;

export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
} as const;

export const radius = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  full: "9999px",
} as const;

export const shadow = {
  sm: "0 1px 2px rgba(15, 23, 42, 0.05)",
  md: "0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06)",
  lg: "0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.05)",
} as const;

export const fontSize = {
  xs: "0.75rem",
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
} as const;

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const transition = {
  fast: "120ms ease",
  base: "180ms ease",
} as const;
