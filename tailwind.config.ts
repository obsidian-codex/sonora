import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0D0D0F',
          surface: '#141417',
          elevated: '#1C1C21',
          overlay: '#22222A',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.04)',
          medium: 'rgba(255, 255, 255, 0.07)',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        accent: {
          DEFAULT: '#C9A96E',
          dim: '#A07B4A',
          subtle: 'rgba(201, 169, 110, 0.12)',
          text: '#E8C98C',
        },
        content: {
          primary: '#F0EDE8',
          secondary: '#A8A4A0',
          muted: '#6B6764',
          inverse: '#0D0D0F',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.06)',
          default: 'rgba(255, 255, 255, 0.10)',
          strong: 'rgba(255, 255, 255, 0.18)',
          accent: 'rgba(201, 169, 110, 0.40)',
        },
        semantic: {
          success: '#6EAF7C',
          warning: '#C9956E',
          error: '#C96E6E',
          info: '#6E9AC9',
        },
        score: {
          1: '#C96E6E',
          2: '#C9956E',
          3: '#C9BA6E',
          4: '#A0B97A',
          5: '#6EAF7C',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"DM Mono"', '"Fira Code"', 'monospace'],
      },
      fontSize: {
        hero: ['4rem', { lineHeight: '1.05', fontWeight: '700' }],
        display: ['3rem', { lineHeight: '1.1', fontWeight: '600' }],
        'title-lg': ['1.875rem', { lineHeight: '1.2', fontWeight: '600' }],
        title: ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'title-sm': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        body: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        'content-narrow': '480px',
        'content-medium': '720px',
        'content-wide': '1024px',
        'content-full': '1280px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
      },
      transitionDuration: {
        instant: '75ms',
        fast: '150ms',
        normal: '250ms',
        slow: '400ms',
        reveal: '600ms',
      },
      transitionTimingFunction: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'toast-enter': {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        'fade-in': 'fade-in 250ms ease-out',
        'slide-up': 'slide-up 250ms ease-out',
        'toast-enter': 'toast-enter 250ms ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;

