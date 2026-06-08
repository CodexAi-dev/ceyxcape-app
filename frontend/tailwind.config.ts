import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#d4af37',
          light:   '#f4d03f',
          dark:    '#c9a961',
        },
        navy: {
          DEFAULT: '#2b4b7e',
          dark:    '#0f172a',
        },
        cream: {
          DEFAULT: '#fff9f0',
          2:       '#fef3e7',
          3:       '#f0e6d8',
        },
        primary: '#d4af37',
      },
      fontFamily: {
        outfit:   ['Outfit', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
        raleway:  ['Raleway', 'sans-serif'],
      },
      fontSize: {
        'hero':  ['clamp(2.5rem,6vw,5rem)', { lineHeight: '1.1' }],
        'brand': ['clamp(3rem,8vw,7rem)',   { lineHeight: '1.0' }],
        'section': ['clamp(1.8rem,4vw,2.5rem)', { lineHeight: '1.2' }],
      },
      backgroundImage: {
        'gold-gradient':  'linear-gradient(135deg, #d4af37 0%, #c9a961 100%)',
        'navy-gradient':  'linear-gradient(135deg, #2b4b7e 0%, #0f172a 100%)',
        'dark-gradient':  'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        'hero-overlay':   'linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 100%)',
      },
      boxShadow: {
        'gold-sm': '0 4px 12px rgba(212,175,55,0.25)',
        'gold':    '0 8px 24px rgba(212,175,55,0.35)',
        'gold-lg': '0 16px 48px rgba(212,175,55,0.4)',
        'card':    '0 4px 20px rgba(0,0,0,0.08)',
        'card-lg': '0 12px 40px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        'xl2': '20px',
        'xl3': '24px',
      },
      animation: {
        'fade-up':    'fadeUp 0.7s cubic-bezier(0.4,0,0.2,1) forwards',
        'float':      'float 3s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s infinite',
        'shimmer':    'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        'pulse-gold': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(212,175,55,0.4)' },
          '50%':     { boxShadow: '0 0 0 12px rgba(212,175,55,0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
