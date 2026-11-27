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
        // Primary display face — PP Acma Black (names, headings, key moments)
        display: ["var(--font-acma)", "Abril Fatface", "DM Serif Display", "serif"],
        // Core body copy — Barlow
        body: ["var(--font-barlow)", "Lato", "system-ui", "sans-serif"],
        // Supporting / space-constrained text — Barlow Condensed
        condensed: ["var(--font-barlow-condensed)", "Oswald", "system-ui", "sans-serif"],
      },
      colors: {
        // Exact palette from the brand guidelines (Rachel Doran, May 2026)
        wedding: {
          red: "#BF1326", // primary
          purple: "#631853", // primary
          aubergine: "#47153C", // base — text on light, outlines, backgrounds
          cream: "#FBF2E7", // base — text on dark, accents, space
          orange: "#EF733A", // secondary
          pink: "#E38296", // secondary
          lilac: "#E3C5FF", // tertiary
          yellow: "#FCD59F", // tertiary
          pastelPink: "#FFDFE1", // tertiary — light background option
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
