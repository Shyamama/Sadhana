import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#161412",
        paper: "#fbf8f3",
        accent: "#7b4f2a",
        saffron: "#f0b429"
      }
    }
  },
  plugins: []
};

export default config;
