import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563EB",
          light: "#3B82F6",
          dark: "#1E40AF"
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
