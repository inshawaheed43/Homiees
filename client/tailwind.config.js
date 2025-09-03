


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        raleway: ["Raleway", 'sans-serif']
      },
      colors: {
        primary: "#1E3A8A",
        secondary: "#FBBF24",
        accent: "#EF4444",
        background: "#F3F4F6",
        text: "#111827",
      },
      boxShadow: {
        custom: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
}