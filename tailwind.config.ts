const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        serif: ['Bodoni MT', 'Didot', ...defaultTheme.fontFamily.serif],
        playfair: ['Playfair Display', ...defaultTheme.fontFamily.serif],
        cormorant: ['Cormorant Garamond', 'serif'],
        greatVibes: ['Great Vibes', 'cursive'], // Added Great Vibes font
      },
      colors: {
        primary: {
          DEFAULT: '#432874',
          dark: '#372160',
          light: '#5A3A8E',
          foreground: 'hsl(var(--primary-foreground))',
          '10': 'rgba(67, 40, 116, 0.1)', // Added for icon backgrounds
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        gradient: 'gradient 15s ease infinite',
        'shadow-pulse': 'shadowPulse 2s infinite', // Added for card hover effects
        'fade-down': 'fade-down 0.3s ease-out',
        'slide-up': 'slide-up 0.5s ease-out forwards',
      },
      keyframes: {
        shadowPulse: {
          '0%, 100%': {
            boxShadow: '0 10px 25px -5px rgba(67, 40, 116, 0.1)',
          },
          '50%': {
            boxShadow: '0 15px 30px -5px rgba(67, 40, 116, 0.2)',
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      backgroundSize: {
        '200%': '200% 200%',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': '1rem', // Added for card corners
      },
      boxShadow: {
        'purple-xs': '0 0 0 1px rgba(67, 40, 116, 0.05)',
        'purple-sm': '0 1px 2px 0 rgba(67, 40, 116, 0.05)',
        'purple-md': '0 4px 6px -1px rgba(67, 40, 116, 0.1)',
        'purple-lg': '0 10px 15px -3px rgba(67, 40, 116, 0.1)',
        'purple-xl': '0 20px 25px -5px rgba(67, 40, 116, 0.1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
