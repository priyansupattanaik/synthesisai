import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#030305",
        "deep-space": "#0a0b0f",
        slime: "#39ff14",
        cyan: "#00f5d4",
        amber: "#ffbe0b",
        rose: "#ff006e",
        amethyst: "#8338ec",
        azure: "#3a86ff",
        ash: "#1a1b1f",
        "ash-hover": "#2a2b2f",
        "off-white": "#e8e8e8",
      },
      fontFamily: {
        sans: ["var(--font-space)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "breathe": "breathe 4s ease-in-out infinite",
        "pulse-fast": "pulse-fast 0.5s ease-in-out infinite",
        "jitter": "jitter 0.1s linear infinite",
        "spore-drift": "spore-drift 3s ease-out forwards",
        "wilt": "wilt 0.5s ease-out forwards",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
        "pulse-fast": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        jitter: {
          "0%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(1px, 1px)" },
          "50%": { transform: "translate(-1px, -1px)" },
          "75%": { transform: "translate(-1px, 1px)" },
          "100%": { transform: "translate(1px, -1px)" },
        },
        "spore-drift": {
          "0%": { transform: "translate(0, 0) scale(1)", opacity: "1" },
          "100%": { transform: "translate(var(--tx), var(--ty)) scale(0)", opacity: "0" },
        },
        wilt: {
          "0%": { filter: "grayscale(0)", transform: "scale(1)" },
          "100%": { filter: "grayscale(1)", transform: "scale(0.8)" },
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;