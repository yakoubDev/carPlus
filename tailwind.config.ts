/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container:{
      padding: '15px',
      center: true
    },
    screens:{
      sm: '640px',
      md: '768px',
      lg: '960px',
      xl: '1200px',
    },
    extend: {
      colors: {
        primary: '#1c1c22',
        accent:{
          DEFAULT: "#00ff99",
          hover: "#00e187"
        }
      },
      fontFamily: {
        primary: "var(--font-jetbrainsMono)"
      }
    },
  },
  plugins: [],
};
