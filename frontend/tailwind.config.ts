import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1a1a2e",
        gold: "#e8d5a3",
        paper: "#f7f7f2",
        mint: "#2f9e75",
        signal: "#ef4444"
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        mono: ["DM Mono", "monospace"]
      },
      boxShadow: {
        panel: "0 16px 45px rgba(26, 26, 46, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
