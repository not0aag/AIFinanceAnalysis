import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-elevated": "var(--color-surface-elevated)",
        border: "var(--color-border)",
        "border-subtle": "var(--color-border-subtle)",
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
        },
        blue: {
          DEFAULT: "var(--color-blue)",
          dark: "var(--color-blue-dark)",
        },
        green: {
          DEFAULT: "var(--color-green)",
          dark: "var(--color-green-dark)",
        },
        red: "var(--color-red)",
        purple: "var(--color-purple)",
        orange: "var(--color-orange)",
        pink: "var(--color-pink)",
        teal: "var(--color-teal)",
      },
      borderRadius: {
        sm: "var(--radius-small)",
        md: "var(--radius-medium)",
        lg: "var(--radius-large)",
        xl: "var(--radius-extra-large)",
      },
      fontFamily: {
        sans: [
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: ["SF Mono", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
