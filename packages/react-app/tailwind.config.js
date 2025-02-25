/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'site-black': '#0E0E0E',
        'site-dim': '#1A1A1A',
        'site-dim2': '#2A2A2A',
        'site-pink': '#FF007A',
        'dim-white': 'rgba(255, 255, 255, 0.7)',
      },
      boxShadow: {
        card: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      gradientColorStops: {
        pink: '#FF007A',
        purple: '#7928CA',
      },
    },
  },
  plugins: [],
};
