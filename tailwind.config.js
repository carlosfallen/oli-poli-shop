/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      colors: {
        'oli-black': '#111111',
        'oli-white': '#F4F4F0',
        'oli-orange': '#FF5500',
        'oli-gray': '#888888',
      },
      backgroundImage: {
        'noise': "url('https://grainy-gradients.vercel.app/noise.svg')",
      }
    },
  },
  plugins: [],
}
