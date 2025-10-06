import type { Config } from "tailwindcss";

const config: Config = {
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
        // LaunchOS Design System v2.0
        base: {
          black: '#0a0a0c',
          darker: '#0f0f12',
          dark: '#18181b',
          card: '#1a1a1f',
        },
        // Legacy brand colors (keeping for compatibility)
        'launchos-fuchsia': '#E700FF',
        'launchos-violet': '#5A00FF',
        'launchos-cyan': '#00F0FF',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'], // Using Inter as display until Clash Display is added
        body: ['Inter Tight', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #E700FF 0%, #5A00FF 100%)',
        'gradient-accent': 'linear-gradient(135deg, #5A00FF 0%, #00F0FF 100%)',
        'gradient-full': 'linear-gradient(135deg, #E700FF 0%, #5A00FF 50%, #00F0FF 100%)',
      },
      boxShadow: {
        'neon-fuchsia': '0 0 20px rgba(231, 0, 255, 0.5), 0 0 40px rgba(231, 0, 255, 0.3)',
        'neon-violet': '0 0 20px rgba(90, 0, 255, 0.5), 0 0 40px rgba(90, 0, 255, 0.3)',
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.5), 0 0 40px rgba(0, 240, 255, 0.3)',
      },
      animation: {
        'ticker': 'ticker 60s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'belief-pulse': 'belief-pulse 1.5s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(231, 0, 255, 0.3)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(231, 0, 255, 0.6)' },
        },
        'belief-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(16, 185, 129, 0.25)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
