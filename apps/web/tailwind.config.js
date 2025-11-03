/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "fly-in-from-top": {
          "0%": { transform: "translateY(-200%) rotate(-180deg)", opacity: "0" },
          "60%": { transform: "translateY(0) rotate(20deg)", opacity: "1" },
          "100%": { transform: "translateY(0) rotate(0)", opacity: "1" },
        },
        "fly-in-from-bottom": {
          "0%": { transform: "translateY(200%) rotate(180deg)", opacity: "0" },
          "60%": { transform: "translateY(0) rotate(-20deg)", opacity: "1" },
          "100%": { transform: "translateY(0) rotate(0)", opacity: "1" },
        },
        "fly-in-from-left": {
          "0%": { transform: "translateX(-200%) rotate(-180deg)", opacity: "0" },
          "60%": { transform: "translateX(0) rotate(20deg)", opacity: "1" },
          "100%": { transform: "translateX(0) rotate(0)", opacity: "1" },
        },
        "fly-in-from-right": {
          "0%": { transform: "translateX(200%) rotate(180deg)", opacity: "0" },
          "60%": { transform: "translateX(0) rotate(-20deg)", opacity: "1" },
          "100%": { transform: "translateX(0) rotate(0)", opacity: "1" },
        },
      },
      animation: {
        "fly-in-from-top": "fly-in-from-top 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
        "fly-in-from-bottom": "fly-in-from-bottom 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
        "fly-in-from-left": "fly-in-from-left 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
        "fly-in-from-right": "fly-in-from-right 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
      },
    },
  },
  plugins: [],
};
