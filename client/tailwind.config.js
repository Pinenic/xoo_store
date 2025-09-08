import flowbiteReact from "flowbite-react/plugin/tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ".flowbite-react/class-list.json",
  ],
  theme: {
    extend: {
      colors: {
        "pine-bg": "#f5f5f5", // Off-white background
        "pine-primary": "#2E2B28", // Deep black-brown text
        "pine-accent": "#D1A73C", // Pineapple gold accent
        "pine-brown": "#8B5E3C", // Earthy brown for buttons or hovers
        "pine-highlight": "#A6A58A", // Soft green-gray for subtle highlights
        "cerulean-blue": {
          50: "#eff7ff",
          100: "#daecff",
          200: "#bedeff",
          300: "#91caff",
          400: "#5eadfc",
          500: "#388af9",
          600: "#226cee",
          700: "#1a56db",
          800: "#1c46b1",
          900: "#1c3e8c",
          950: "#162755",
        },
      },
    },
  },
  plugins: [flowbiteReact],
};
