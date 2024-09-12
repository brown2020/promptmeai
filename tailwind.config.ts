import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "composer-surface": "hsla(0,0%,94%,.9)",
        "text-primary": "#0d0d0d",
        "text-secondary": "#7d7d7d",
        "text-tertiary": "#b4b4b4",
        "text-quaternary": "#cdcdcd",
        "tag-blue": "#08f",
        "tag-blue-light": "#0af",
        "text-error": "#f93a37",
        "text-placeholder": "rgba(0, 0, 0, .7)",
        "surface-error": "rgb(249, 58, 55)",
        "border-light": "rgba(0, 0, 0, .1)",
        "border-medium": "rgba(0, 0, 0, .15)",
        "border-heavy": "rgba(0, 0, 0, .2)",
        "border-xheavy": "rgba(0, 0, 0, .25)",
        "hint-text": "#08f",
        "hint-bg": "#b3dbff",
        "border-sharp": "rgba(0, 0, 0, .05)",
        "main-surface-primary": "#fff",
        "main-surface-secondary": "#f9f9f9",
        "main-surface-tertiary": "#ececec",
        "sidebar-surface-primary": "#f9f9f9",
        "sidebar-surface-secondary": "#ececec",
        "sidebar-surface-tertiary": "#e3e3e3",
        link: "#2964aa",
        "link-hover": "#749ac8",
        selection: "#007aff",
      },
    },
  },
  plugins: [],
};
export default config;
