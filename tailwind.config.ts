import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef9ff",
          100: "#d6f1ff",
          200: "#b3e6ff",
          300: "#7bd6ff",
          400: "#39bfff",
          500: "#0ca7ff",
          600: "#0086db",
          700: "#036cb0",
          800: "#0a5a90",
          900: "#0e4c78"
        }
      }
    }
  },
  plugins: []
};

export default config;
