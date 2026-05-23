/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Refined professional navy palette
        primary: {
          50: '#f0f4fa',
          100: '#dde6f3',
          200: '#bccfe7',
          300: '#8eaad4',
          400: '#5e82bd',
          500: '#3d62a5',
          600: '#2e4d8a',
          700: '#263f70',
          800: '#1f3257',
          900: '#152340',
          950: '#0c162b',
        },
        accent: {
          50: '#fdf8f3',
          100: '#f9ecdc',
          200: '#f1d4ae',
          300: '#e6b478',
          400: '#d99a4f',
          500: '#c98135',
          600: '#b06a29',
          700: '#8d5224',
        },
        dark: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      boxShadow: {
        'soft': '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)',
        'card': '0 1px 3px 0 rgb(15 23 42 / 0.05), 0 4px 14px -2px rgb(15 23 42 / 0.06)',
        'elevated': '0 4px 6px -2px rgb(15 23 42 / 0.05), 0 12px 28px -6px rgb(15 23 42 / 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        'float': 'float 7s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
    },
  },
  plugins: [],
};
