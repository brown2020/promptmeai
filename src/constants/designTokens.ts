/**
 * Design tokens for consistent styling across the application.
 * These are the single source of truth for all colors, spacing, and typography.
 *
 * Usage:
 * - Import specific tokens: import { colors, spacing } from '@/constants/designTokens';
 * - Or import all: import * as tokens from '@/constants/designTokens';
 */

export const colors = {
  // Brand colors
  brand: {
    primary: "#1A8F70",
    primaryHover: "#158060",
    primaryLight: "rgba(26, 143, 112, 0.3)",
    secondary: "#24C69E",
    secondaryHover: "#1DB88F",
  },

  // Light mode colors
  light: {
    bg: {
      primary: "#FFFFFF",
      secondary: "#F5F5F5",
      tertiary: "#F9F9F9",
    },
    text: {
      primary: "#1E1F22",
      secondary: "#3B3B3B",
      muted: "#909090",
    },
    border: "#E5E5E5",
  },

  // Dark mode colors
  dark: {
    bg: {
      primary: "#272A2E",
      secondary: "#1E1F21",
      tertiary: "#1E1F22",
      input: "#4B4F5B",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(238, 238, 238, 0.9)",
      muted: "rgba(238, 238, 238, 0.7)",
    },
    border: "#3F424A",
  },

  // Neutral grays
  gray: {
    50: "#F9F9F9",
    100: "#F1F1F1",
    200: "#E8E8E8",
    300: "#D6D6D6",
    400: "#ABABAB",
    500: "#9CA3AF",
    600: "#6B7280",
    700: "#575B65",
    800: "#4B4F5B",
    900: "#3F424A",
  },

  // Semantic colors
  semantic: {
    success: "#22C55E",
    error: "#EF4444",
    warning: "#F59E0B",
    info: "#3B82F6",
  },

  // Model colors (for AI model identification)
  models: {
    gpt: "#14A27F",
    claude: "#F39C12",
    gemini: "#FF6F61",
    mistral: "#3498DB",
    llama: "#8E44AD",
  },
} as const;

export const spacing = {
  0: "0",
  0.5: "2px",
  1: "4px",
  1.5: "6px",
  2: "8px",
  2.5: "10px",
  3: "12px",
  3.5: "14px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  9: "36px",
  10: "40px",
  12: "48px",
  14: "56px",
  16: "64px",
  20: "80px",
} as const;

export const typography = {
  fontSize: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px",
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.625",
  },
} as const;

export const borderRadius = {
  none: "0",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  full: "9999px",
} as const;

export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
} as const;

export const transitions = {
  fast: "150ms ease",
  normal: "200ms ease",
  slow: "300ms ease",
} as const;

// CSS variable names for use in globals.css
export const cssVars = {
  brandPrimary: "--color-brand-primary",
  brandPrimaryHover: "--color-brand-primary-hover",
  brandPrimaryLight: "--color-brand-primary-light",
  brandSecondary: "--color-brand-secondary",
} as const;
