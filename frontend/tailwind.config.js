export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'vp-primary': '#4f46e5',
        'vp-secondary': '#10b981',
        'vp-background': '#0f172a',
        'vp-card': '#1e293b',
        'vp-text-light': '#f8fafc',
        'vp-accent': '#f97316'
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards'
      }
    }
  },
  plugins: []
};
