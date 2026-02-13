/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Lilita One"', "cursive"],
        handwriting: ['"Caveat"', "cursive"],
        body: ['"Fredoka"', "sans-serif"],
      },
      colors: {
        "val-pink-start": "#E84393",
        "val-pink-mid": "#F472B6",
        "val-pink-end": "#F9A8D4",
        "val-pink": "#FF9EAA",
        "val-pink-dark": "#D63384",
        "val-blue": "#7DD3FC",
        "val-yellow": "#FFD54F",
        "val-coral": "#FF6B6B",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
          "50%": { transform: "scale(0.8) rotate(15deg)", opacity: "0.7" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        twinkle: "twinkle 3s infinite ease-in-out",
        float: "float 4s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
