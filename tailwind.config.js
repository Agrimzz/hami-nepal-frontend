/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./modules/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#CC343B",
        white: "#FFFFFF",
        black: "#020B0A",
        gray: "#303135",
        lightgray: "#ABACB0",
        background: "#151720",
      },
      fontFamily: {
        // pextralight: ["BricolageGrotesque-ExtraLight", "sans-serif"],
        // plight: ["BricolageGrotesque-Light", "sans-serif"],
        // pregular: ["BricolageGrotesque-Regular", "sans-serif"],
        // pmedium: ["BricolageGrotesque-Medium", "sans-serif"],
        // psemibold: ["BricolageGrotesque-SemiBold", "sans-serif"],
        // pbold: ["BricolageGrotesque-Bold", "sans-serif"],
        // pextrabold: ["BricolageGrotesque-ExtraBold", "sans-serif"],
        pextralight: ["Urbanist-ExtraLight", "sans-serif"],
        plight: ["Urbanist-Light", "sans-serif"],
        pregular: ["Urbanist-Regular", "sans-serif"],
        pmedium: ["Urbanist-Medium", "sans-serif"],
        psemibold: ["Urbanist-SemiBold", "sans-serif"],
        pbold: ["Urbanist-Bold", "sans-serif"],
        pextrabold: ["Urbanist-ExtraBold", "sans-serif"],
        pblack: ["Urbanist-Black", "sans-serif"],
      },
      borderRadius: {
        "2xl": "20px",
        "3xl": "30px",
      },
    },
  },
  plugins: [],
};
