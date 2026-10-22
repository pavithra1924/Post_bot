import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Bright, Comfortable & Elegant Surface Palette
        studio: {
          950: "#F8FAFC", // Soft slate-porcelain page background
          900: "#FFFFFF", // Crisp pure white card surface
          850: "#F1F5F9", // Soft elevated pill background
          800: "#E2E8F0", // Elegant subtle border
          700: "#CBD5E1", // Medium border
          600: "#94A3B8", // Subtle text / icon
        },
        // Positive, Uplifting Theme Accents
        positive: {
          gold: "#F59E0B",
          amber: "#D97706",
          rose: "#F43F5E",
          coral: "#FB7185",
          violet: "#8B5CF6",
          indigo: "#6366F1",
          emerald: "#10B981",
        },
      },
      backgroundImage: {
        // Uplifting Radiant Positive Gradient (Golden Amber -> Rose Coral -> Indigo Violet)
        'positive-gradient': 'linear-gradient(135deg, #F59E0B 0%, #F43F5E 50%, #8B5CF6 100%)',
        'positive-gradient-subtle': 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(244, 63, 94, 0.08), rgba(139, 92, 246, 0.08))',
        'warm-sun-gradient': 'linear-gradient(135deg, #F59E0B 0%, #FB923C 50%, #F43F5E 100%)',
      },
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        'elegant': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
        'elegant-lg': '0 12px 35px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03)',
        'positive-glow': '0 10px 30px -5px rgba(244, 63, 94, 0.25)',
      },
    },
  },
  plugins: [],
} satisfies Config;
