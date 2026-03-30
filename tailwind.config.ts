import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#EDEDE9",
        foreground: "#D5BDAF",
        card: {
          DEFAULT: "#F5EBE0",
          foreground: "#D5BDAF",
        },
        primary: {
          DEFAULT: "#E3D5CA",
          foreground: "#D5BDAF",
        },
        secondary: {
          DEFAULT: "#D6CCC2",
          foreground: "#D5BDAF",
        },
        muted: {
          DEFAULT: "#D6CCC2",
          foreground: "#D5BDAF",
        },
        accent: {
          DEFAULT: "#E3D5CA",
          foreground: "#D5BDAF",
        },
        border: "#D5BDAF",
        input: "#D5BDAF",
        ring: "#D5BDAF",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
