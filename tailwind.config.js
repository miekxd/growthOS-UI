/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sidebar-bg': '#2a2a2a',
        'main-bg': '#4a5568',
        'card-bg': '#5a6478',
        'accent': '#6366f1',
      },
    },
  },
  plugins: [],
}