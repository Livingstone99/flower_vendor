import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: "#009640", // Main green - nature, growth, freshness
        "primary-dark": "#007530", // Darker green for hover states
        "primary-light": "#00B854", // Lighter green for backgrounds
        
        // Secondary colors
        accent: "#7d2fd0", // Purple for CTAs and highlights
        "accent-light": "#9D5FE8", // Lighter purple
        
        // Neutral palette
        "background-light": "#F5F5F0", // Soft cream instead of pure white
        "background-dark": "#102212", // Dark mode background
        "surface": "#FFFFFF", // Pure white for cards/surfaces
        
        // Text colors
        "text-primary": "#1A1A1A", // Main text - softer than pure black
        "text-secondary": "#618965", // Secondary text (muted green)
        "text-muted": "#6B7280", // Muted gray text
        
        // Semantic colors
        success: "#10B981", // Success states
        warning: "#F59E0B", // Warnings (limited stock, etc.)
        error: "#EF4444", // Errors
        info: "#3B82F6", // Info messages
        
        // Green variations for nature theme
        "green-secondary": "#618965",
        "green-light": "#E8F5E9", // Very light green backgrounds
        "green-dark": "#2D8659", // Darker green accents
      },
      fontFamily: {
        display: ["Work Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      boxShadow: {
        "soft": "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        "primary": "0 4px 14px 0 rgba(0, 150, 64, 0.15)",
      },
    },
  },
  plugins: [],
} satisfies Config;
