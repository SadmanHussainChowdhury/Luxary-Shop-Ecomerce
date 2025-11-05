import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        ocean: {
          blue: '#1e3a8a',
          deep: '#0f172a',
          light: '#3b82f6',
          bright: '#60a5fa',
          lighter: '#dbeafe',
          lightest: '#f0f9ff',
          gray: '#64748b',
          darkGray: '#1e293b',
          border: '#cbd5e1',
          bg: '#FFFFFF',
        },
        premium: {
          gold: '#d97706',
          amber: '#fbbf24',
          darkBlue: '#0f172a',
          royalBlue: '#1e3a8a',
          electricBlue: '#3b82f6',
          navy: '#1e293b',
          platinum: '#e5e7eb',
          ivory: '#fefcf9',
        },
      },
      boxShadow: {
        premium: '0 10px 30px -10px rgba(0,0,0,0.25)'
      },
      borderRadius: {
        xl: '1rem',
      }
    },
  },
  plugins: [],
}

export default config


