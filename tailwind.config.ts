import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        'safe': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      minHeight: {
        'screen-safe': '100svh',
      },
      maxHeight: {
        'screen-safe': '100svh',
      },
      height: {
        'screen-safe': '100svh',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        // BTDemo Design System - PRIMARY THEME
        btdemo: {
          canvas: '#000000',
          primary: '#D1FD0A',  // Lime - Main color
          secondary: '#00FF88', // Greenish - Accents only
          card: 'rgba(8, 8, 9, 0.6)',
          'card-solid': '#080809',
          border: '#3B3B3B',
          text: '#FFFFFF',
          'text-muted': 'rgba(255, 255, 255, 0.6)',
          'text-dim': 'rgba(255, 255, 255, 0.4)',
          error: '#FF0040',
          warning: '#FFD700',
          info: '#0088FF',
        },

        // ICM Motion Color Palette 2025
        primary: {
          cyan: '#00FFFF',
          green: '#00FF88',
          yellow: '#FFD700',
        },
        accent: {
          red: '#FF0040',
          orange: '#FF8800',
          blue: '#0088FF',
          purple: '#8800FF',
        },

        // Base colors
        base: {
          black: '#0a0a0c',
          darker: '#0f0f12',
          dark: '#18181b',
          card: '#1a1a1f',
        },

        // Legacy (keeping for compatibility)
        'launchos-fuchsia': '#E700FF',
        'launchos-violet': '#5A00FF',
        'launchos-cyan': '#00F0FF',

        'design': {
          violet: {
            400: '#a78bfa',
            500: '#8b5cf6',
            600: '#7c3aed',
          },
          fuchsia: {
            400: '#e879f9',
            500: '#d946ef',
            600: '#c026d3',
          },
          cyan: {
            400: '#22d3ee',
            500: '#06b6d4',
            600: '#0891b2',
          },
          zinc: {
            700: '#3f3f46',
            800: '#27272a',
            900: '#18181b',
          }
        }
      },
      backdropBlur: {
        xs: '2px',
        sm: '3.5px',
        md: '8px',
        lg: '12.5px',
        xl: '20px',
        '2xl': '40px',
        '3xl': '325px',
      },
      fontFamily: {
        display: ['Helvetica Now Display', 'Helvetica Neue', 'Inter', 'sans-serif'],
        body: ['Inter Tight', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        // ICM Motion Gradients
        'gradient-cyan-green': 'linear-gradient(135deg, #00FFFF, #00FF88)',
        'gradient-green-yellow': 'linear-gradient(135deg, #00FF88, #FFD700)',
        'gradient-cyan-yellow': 'linear-gradient(135deg, #00FFFF, #FFD700)',
        'gradient-red-orange': 'linear-gradient(135deg, #FF0040, #FF8800)',
        'gradient-orange-yellow': 'linear-gradient(135deg, #FF8800, #FFD700)',
        'gradient-blue-cyan': 'linear-gradient(135deg, #0088FF, #00FFFF)',
        'gradient-purple-blue': 'linear-gradient(135deg, #8800FF, #0088FF)',
        'gradient-purple-pink': 'linear-gradient(135deg, #8800FF, #FF0040)',
        'gradient-rainbow': 'linear-gradient(135deg, #00FFFF, #00FF88, #FFD700, #FF8800, #FF0040)',
        'gradient-premium': 'linear-gradient(135deg, #00FFFF, #8800FF)',

        // Legacy (keeping for compatibility)
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
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'border-shine': 'border-shine 3s linear infinite',
        'border-glow': 'border-glow 3s ease-in-out infinite',
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
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'border-shine': {
          '0%': {
            backgroundPosition: '0% 50%',
            opacity: '0.3',
          },
          '50%': {
            backgroundPosition: '100% 50%',
            opacity: '0.7',
          },
          '100%': {
            backgroundPosition: '200% 50%',
            opacity: '0.3',
          },
        },
        'border-glow': {
          '0%, 100%': {
            boxShadow: '0 0 0 2px rgba(209, 253, 10, 0.2), 0 0 15px rgba(209, 253, 10, 0.1), inset 0 0 20px rgba(0, 0, 0, 0.5)',
          },
          '50%': {
            boxShadow: '0 0 0 2px rgba(209, 253, 10, 0.5), 0 0 30px rgba(209, 253, 10, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
