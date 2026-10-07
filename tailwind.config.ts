import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { navy: "#0e1d4c", teal: "#159aaf", indigo: "#5959eb", body: "#7c7c7c" },
      fontFamily: { title: ["var(--title-font)"], body: ["var(--body-font)"] }
    }
  },
  plugins: []
};
export default config;
