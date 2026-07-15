/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0a12',
          card: 'rgba(20, 20, 35, 0.6)',
          border: 'rgba(0, 242, 254, 0.2)',
          neonBlue: '#00f2fe',
          neonPink: '#4facfe',
          green: '#39ff14'
        }
      }
    },
  },
  plugins: [],
}
