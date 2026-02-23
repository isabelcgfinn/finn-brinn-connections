import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["var(--font-encode-sans)"],
        heading: ["var(--font-gloock)"],
      },
      colors: {
        wedding: {
          red: "#B11226",
          plum: "#5F174E",
          orange: "#EF733A",
          aubergine: "#2D1127",
          rose: "#DE7F93",
          redDeep: "#7E170F",
          blush: "#F8D4D4",
          gold: "#F5C473"
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        "horizontal-shake": {
          "0%, 50%, 100%": {
            transform: "translateX(0)",
          },
          "25%": {
            transform: "translateX(-5px)",
          },
          "75%": {
            transform: "translateX(5px)",
          },
        },
      },
      animation: {
        "horizontal-shake": "horizontal-shake 0.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
