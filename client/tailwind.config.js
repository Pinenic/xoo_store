/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pine-bg': '#f5f5f5',        // Off-white background
        'pine-primary': '#2E2B28',   // Deep black-brown text
        'pine-accent': '#D1A73C',    // Pineapple gold accent
        'pine-brown': '#8B5E3C',     // Earthy brown for buttons or hovers
        'pine-highlight': '#A6A58A', // Soft green-gray for subtle highlights
      },
    },
  },
  plugins: [],
}

