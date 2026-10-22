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
        // Authentic Instagram Dark Palette
        ig: {
          bg: "#000000",
          card: "#121212",
          elevated: "#1c1c1e",
          border: "#262626",
          blue: "#0095F6",
          blueHover: "#1877F2",
          red: "#ED4956",
          text: "#FAFAFA",
          secondary: "#A8A8A8",
          muted: "#737373",
        },
        // Studio mapping to Instagram colors so all existing studio-* classes automatically inherit Instagram theme
        studio: {
          950: "#000000",
          900: "#121212",
          850: "#181818",
          800: "#1e1e1e",
          700: "#262626",
          600: "#363636",
        }
      },
      backgroundImage: {
        'ig-gradient': 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
        'ig-gradient-subtle': 'linear-gradient(135deg, rgba(240, 148, 51, 0.15), rgba(220, 39, 67, 0.15), rgba(188, 24, 136, 0.15))',
      },
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
